import type { RequestListener } from 'node:http';
import inject from 'light-my-request';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../server/app.js';
import type { RuntimeConfig } from '../../server/config.js';
import type {
  BookingCalendar,
  BookingCreationResult,
  BookingMailer,
  BookingRecord,
  BookingRepository,
  BusyPeriod,
  CalendarEventResult,
  ContactRepository,
  RateLimitResult
} from '../../server/types.js';

const now = new Date('2026-08-19T00:00:00.000Z');
const firstSlot = '2026-08-20T04:30:00.000Z';
const secondSlot = '2026-08-20T05:00:00.000Z';

const config: RuntimeConfig = {
  environment: 'test',
  port: 3000,
  publicOrigin: 'https://roughnote.test',
  allowedOrigins: new Set(['https://roughnote.test']),
  requireOrigin: true,
  trustProxyHops: 1,
  rateLimit: {
    secret: 'test-rate-limit-secret-that-is-long-enough',
    ipLimit: 5,
    emailLimit: 3,
    windowSeconds: 3600
  },
  newsletter: {
    ipLimit: 10,
    emailLimit: 3,
    rateWindowSeconds: 3600,
    verificationTokenHours: 48,
    resendCooldownSeconds: 900
  },
  scheduler: {
    timezone: 'Asia/Kolkata',
    utcOffsetMinutes: 330,
    weekdays: new Set([1, 2, 3, 4, 5]),
    startHour: 10,
    endHour: 17,
    slotMinutes: 30,
    leadMinutes: 60,
    horizonDays: 60
  },
  googleCalendar: {
    calendarId: 'calendar@example.test',
    clientId: 'client',
    clientSecret: 'secret',
    refreshToken: 'refresh',
    timeoutMs: 1000,
    officeAddress: 'Rough Note Studio'
  },
  database: {
    host: 'localhost',
    port: 3306,
    name: 'test',
    user: 'test',
    password: 'test',
    connectionLimit: 1,
    ssl: false,
    autoMigrate: false
  },
  mail: {
    host: 'smtp.example.test',
    port: 465,
    secure: true,
    user: 'test@example.test',
    password: 'test',
    from: 'test@example.test',
    to: 'studio@example.test',
    timeoutMs: 20
  },
  operations: {
    maintenanceSecret: 'test-maintenance-secret-that-is-long-enough',
    outboxEncryptionKey: '00'.repeat(32),
    outboxBatchSize: 25,
    outboxMaxAttempts: 6,
    outboxRetryBaseSeconds: 300,
    outboxLockTimeoutSeconds: 900,
    rateLimitRetentionDays: 2,
    attachmentRetentionDays: 30,
    contactRetentionDays: 365,
    bookingRetentionDays: 365,
    newsletterPendingRetentionDays: 7,
    newsletterUnsubscribedRetentionDays: 90,
    outboxSentRetentionDays: 30,
    outboxDeadRetentionDays: 90,
    maintenanceRunRetentionDays: 180
  }
};

class ContactStub implements ContactRepository {
  async ping() {}
  async consumeRateLimit(): Promise<RateLimitResult> {
    return { allowed: true, retryAfterSeconds: 1 };
  }
  async createSubmission() { return 1; }
  async markNotificationSent() {}
  async markNotificationFailed() {}
}

class MemoryBookingRepository implements BookingRepository {
  bookings: BookingRecord[] = [];
  locks = new Map<string, { bookingId: string; kind: string }>();

  async listBookedStartTimes(rangeStart: Date, rangeEnd: Date) {
    return [...this.locks.keys()]
      .map((value) => new Date(value))
      .filter((value) => value >= rangeStart && value < rangeEnd);
  }
  async findByIdempotencyKeyHash(hash: Buffer) {
    return (
      this.bookings.find((booking) => booking.idempotencyKeyHash.equals(hash)) ??
      null
    );
  }
  async createBooking(record: BookingRecord): Promise<BookingCreationResult> {
    const sameKey = await this.findByIdempotencyKeyHash(record.idempotencyKeyHash);
    if (sameKey) {
      return sameKey.requestHash.equals(record.requestHash)
        ? { outcome: 'idempotent', booking: sameKey }
        : { outcome: 'key-mismatch' };
    }
    if (this.locks.has(record.startAt.toISOString())) {
      return { outcome: 'slot-conflict' };
    }
    this.bookings.push(record);
    this.locks.set(record.startAt.toISOString(), {
      bookingId: record.bookingId,
      kind: 'current'
    });
    return { outcome: 'created', booking: record };
  }
  async saveCalendarDetails(
    bookingId: string,
    googleEventId: string,
    meetingUrl: string | null
  ) {
    const booking = this.require(bookingId);
    booking.status = 'confirmed';
    booking.googleEventId = googleEventId;
    booking.meetingUrl = meetingUrl;
    return booking;
  }
  async markConfirmationSent(bookingId: string) {
    this.require(bookingId).confirmationDeliveryStatus = 'sent';
  }
  async markConfirmationFailed(bookingId: string) {
    this.require(bookingId).confirmationDeliveryStatus = 'failed';
  }
  async findByManagementTokenHash(hash: Buffer) {
    return (
      this.bookings.find((booking) => booking.managementTokenHash.equals(hash)) ??
      null
    );
  }
  async markCancelled(bookingId: string) {
    const booking = this.require(bookingId);
    booking.status = 'cancelled';
    for (const [start, lock] of this.locks) {
      if (lock.bookingId === bookingId) this.locks.delete(start);
    }
    return booking;
  }
  async reserveReschedule(
    bookingId: string,
    newStartAt: Date,
    newEndAt: Date
  ) {
    const booking = this.require(bookingId);
    const key = newStartAt.toISOString();
    if (booking.status !== 'confirmed') return 'invalid-state' as const;
    if (this.locks.has(key)) return 'slot-conflict' as const;
    this.locks.set(key, { bookingId, kind: 'pending' });
    booking.status = 'reschedule_pending';
    booking.pendingStartAt = newStartAt;
    booking.pendingEndAt = newEndAt;
    return 'reserved' as const;
  }
  async finalizeReschedule(bookingId: string) {
    const booking = this.require(bookingId);
    if (!booking.pendingStartAt || !booking.pendingEndAt) throw new Error('missing');
    for (const [start, lock] of this.locks) {
      if (lock.bookingId === bookingId && start !== booking.pendingStartAt.toISOString()) {
        this.locks.delete(start);
      }
    }
    const pendingKey = booking.pendingStartAt.toISOString();
    this.locks.set(pendingKey, { bookingId, kind: 'current' });
    booking.startAt = booking.pendingStartAt;
    booking.endAt = booking.pendingEndAt;
    booking.pendingStartAt = null;
    booking.pendingEndAt = null;
    booking.status = 'confirmed';
    return booking;
  }
  async abortReschedule(bookingId: string) {
    const booking = this.require(bookingId);
    for (const [start, lock] of this.locks) {
      if (lock.bookingId === bookingId && lock.kind === 'pending') {
        this.locks.delete(start);
      }
    }
    booking.pendingStartAt = null;
    booking.pendingEndAt = null;
    booking.status = 'confirmed';
  }
  private require(bookingId: string) {
    const booking = this.bookings.find((candidate) => candidate.bookingId === bookingId);
    if (!booking) throw new Error('missing booking');
    return booking;
  }
}

class MemoryCalendar implements BookingCalendar {
  busy: BusyPeriod[] = [];
  includeCreatedEventsInBusy = true;
  events = new Map<
    string,
    { bookingId: string; startAt: Date; endAt: Date; meetingUrl: string }
  >();
  insertions = 0;
  updates = 0;
  deletions = 0;
  failEnsureOnce = false;

  async listBusyPeriods(rangeStart: Date, rangeEnd: Date) {
    const periods = [...this.busy];
    if (this.includeCreatedEventsInBusy) {
      periods.push(
        ...[...this.events.values()].map((event) => ({
          startAt: event.startAt,
          endAt: event.endAt
        }))
      );
    }
    return periods.filter(
      (period) => period.startAt < rangeEnd && period.endAt > rangeStart
    );
  }
  async ensureEvent(booking: BookingRecord): Promise<CalendarEventResult> {
    if (this.failEnsureOnce) {
      this.failEnsureOnce = false;
      throw new Error('temporary Google Calendar timeout');
    }
    const eventId = `google-${booking.bookingId}`;
    if (!this.events.has(eventId)) {
      this.insertions += 1;
      this.events.set(eventId, {
        bookingId: booking.bookingId,
        startAt: booking.startAt,
        endAt: booking.endAt,
        meetingUrl: `https://meet.google.com/${booking.bookingId.slice(-10)}`
      });
    }
    const event = this.events.get(eventId)!;
    return { eventId, meetingUrl: event.meetingUrl };
  }
  async updateEvent(booking: BookingRecord, startAt: Date, endAt: Date) {
    if (!booking.googleEventId) throw new Error('no event');
    const event = this.events.get(booking.googleEventId);
    if (!event) throw new Error('missing event');
    this.updates += 1;
    event.startAt = startAt;
    event.endAt = endAt;
    return { eventId: booking.googleEventId, meetingUrl: event.meetingUrl };
  }
  async deleteEvent(eventId: string) {
    if (this.events.delete(eventId)) this.deletions += 1;
  }
}

class MemoryBookingMailer implements BookingMailer {
  messages: BookingRecord[] = [];
  async sendConfirmation({ booking }: { booking: BookingRecord }) {
    this.messages.push(booking);
    return { messageId: 'booking-confirmation' };
  }
}

function makeApp(
  repository: MemoryBookingRepository,
  calendar: MemoryCalendar,
  mailer: MemoryBookingMailer
) {
  const contact = new ContactStub();
  let id = 0;
  return createApp({
    config,
    contact: {
      repository: contact,
      mailer: { async send() { return { messageId: null }; } }
    },
    scheduler: {
      repository,
      calendar,
      mailer,
      idFactory: () => `bk_01SCHEDULETEST${String(++id).padStart(11, '0')}`,
      now: () => new Date(now)
    },
    staticDirectory: false
  });
}

function postBooking(
  app: ReturnType<typeof createApp>,
  options: { key?: string; startAt?: string } = {}
) {
  return inject(app as RequestListener, {
    method: 'POST',
    url: '/api/bookings',
    headers: {
      origin: 'https://roughnote.test',
      'content-type': 'application/json',
      'idempotency-key': options.key ?? 'booking-attempt-00000001'
    },
    payload: JSON.stringify({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '',
      company: 'Analytical Engines',
      startAt: options.startAt ?? firstSlot,
      timezone: 'Asia/Kolkata',
      mode: 'online',
      source: 'rough-note-scheduler',
      websiteAddress2: ''
    })
  });
}

describe('scheduler API', () => {
  let repository: MemoryBookingRepository;
  let calendar: MemoryCalendar;
  let mailer: MemoryBookingMailer;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repository = new MemoryBookingRepository();
    calendar = new MemoryCalendar();
    mailer = new MemoryBookingMailer();
    app = makeApp(repository, calendar, mailer);
  });

  it('returns only configured slots that are free in Google Calendar and MySQL', async () => {
    calendar.busy.push({
      startAt: new Date(firstSlot),
      endAt: new Date(secondSlot)
    });
    repository.locks.set(secondSlot, { bookingId: 'other', kind: 'current' });
    const response = await inject(app as RequestListener, {
      method: 'GET',
      url: '/api/availability?date=2026-08-20'
    });
    const starts = response.json().slots.map((slot: { startAt: string }) => slot.startAt);
    expect(response.statusCode).toBe(200);
    expect(starts).not.toContain(firstSlot);
    expect(starts).not.toContain(secondSlot);
    expect(starts).toContain('2026-08-20T05:30:00.000Z');
  });

  it('creates exactly one row, event, Meet room, invitation workflow and email', async () => {
    const response = await postBooking(app);
    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body.status).toBe('confirmed');
    expect(body.bookingId).toMatch(/^bk_/);
    expect(body.meetingUrl).toMatch(/^https:\/\/meet\.google\.com\//);
    expect(repository.bookings).toHaveLength(1);
    expect(repository.bookings[0]?.status).toBe('confirmed');
    expect(repository.bookings[0]?.googleEventId).toBeTruthy();
    expect(calendar.insertions).toBe(1);
    expect(calendar.events.size).toBe(1);
    expect(mailer.messages).toHaveLength(1);
  });

  it('makes retries idempotent without another row, event or email', async () => {
    expect((await postBooking(app)).statusCode).toBe(201);
    expect((await postBooking(app)).statusCode).toBe(200);
    expect(repository.bookings).toHaveLength(1);
    expect(calendar.insertions).toBe(1);
    expect(mailer.messages).toHaveLength(1);
  });

  it('resumes the same held row after a calendar timeout', async () => {
    calendar.failEnsureOnce = true;
    expect((await postBooking(app)).statusCode).toBe(503);
    expect(repository.bookings).toHaveLength(1);
    expect(repository.bookings[0]?.status).toBe('pending_calendar');
    expect(calendar.events.size).toBe(0);

    const retried = await postBooking(app);
    expect(retried.statusCode).toBe(200);
    expect(retried.json().status).toBe('confirmed');
    expect(repository.bookings).toHaveLength(1);
    expect(calendar.insertions).toBe(1);
  });

  it('rejects past and duplicate slots even if Google free/busy is stale', async () => {
    expect(
      (await postBooking(app, { key: 'past-attempt-0000000001', startAt: '2026-08-18T04:30:00.000Z' }))
        .statusCode
    ).toBe(409);

    calendar.includeCreatedEventsInBusy = false;
    expect((await postBooking(app)).statusCode).toBe(201);
    const duplicate = await postBooking(app, {
      key: 'different-attempt-000002'
    });
    expect(duplicate.statusCode).toBe(409);
    expect(repository.bookings).toHaveLength(1);
    expect(calendar.insertions).toBe(1);
  });

  it('supports token-based cancellation without login and releases the slot', async () => {
    const created = await postBooking(app);
    const manageUrl = new URL(created.json().manageUrl);
    const token = manageUrl.searchParams.get('token');
    expect(token).toHaveLength(43);

    const preview = await inject(app as RequestListener, {
      method: 'GET',
      url: `${manageUrl.pathname}${manageUrl.search}`
    });
    expect(preview.statusCode).toBe(200);
    expect(preview.payload).toContain('Manage your booking');

    const cancelled = await inject(app as RequestListener, {
      method: 'POST',
      url: `/api/bookings/cancel?token=${token}`,
      headers: { origin: 'https://roughnote.test' }
    });
    expect(cancelled.statusCode).toBe(200);
    expect(repository.bookings).toHaveLength(1);
    expect(repository.bookings[0]?.status).toBe('cancelled');
    expect(repository.locks.size).toBe(0);
    expect(calendar.deletions).toBe(1);
  });

  it('reschedules the same row while protecting the replacement slot', async () => {
    const created = await postBooking(app);
    const token = new URL(created.json().manageUrl).searchParams.get('token');
    const response = await inject(app as RequestListener, {
      method: 'POST',
      url: `/api/bookings/reschedule?token=${token}`,
      headers: {
        origin: 'https://roughnote.test',
        'content-type': 'application/x-www-form-urlencoded'
      },
      payload: 'localStart=2026-08-20T11%3A00'
    });

    expect(response.statusCode).toBe(200);
    expect(repository.bookings).toHaveLength(1);
    expect(repository.bookings[0]?.startAt.toISOString()).toBe(
      '2026-08-20T05:30:00.000Z'
    );
    expect(repository.bookings[0]?.status).toBe('confirmed');
    expect(calendar.updates).toBe(1);
    expect(repository.locks.has(firstSlot)).toBe(false);
    expect(repository.locks.has('2026-08-20T05:30:00.000Z')).toBe(true);
  });
});
