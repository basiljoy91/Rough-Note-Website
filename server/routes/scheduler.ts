import { createHash, createHmac } from 'node:crypto';
import {
  json,
  Router,
  urlencoded,
  type Request,
  type Response
} from 'express';
import { ulid } from 'ulid';
import { z } from 'zod';
import type { RuntimeConfig } from '../config.js';
import { createOriginGuard } from '../middleware/originGuard.js';
import {
  availableSlotsForDate,
  businessDayRange,
  findConfiguredSlot,
  hasBusyOverlap,
  parseBusinessDate
} from '../services/availability.js';
import { withTimeout } from '../services/promiseTimeout.js';
import { logger, safeErrorSummary } from '../services/safeLogger.js';
import type {
  BookingCalendar,
  BookingMailer,
  BookingRecord,
  BookingRepository,
  BusyPeriod,
  ContactRepository,
  EmailOutbox
} from '../types.js';

const SOURCE = 'rough-note-scheduler' as const;
const IDEMPOTENCY_PATTERN = /^[A-Za-z0-9._:-]{16,128}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

const bookingSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(40).optional().default(''),
    company: z.string().trim().max(120).optional().default(''),
    startAt: z.string().datetime({ offset: true }),
    timezone: z.string().trim().min(1).max(64),
    mode: z.enum(['online', 'office']),
    source: z.literal(SOURCE),
    websiteAddress2: z.string().max(500).optional().default('')
  })
  .strict();

export interface SchedulerRouteDependencies {
  config: Pick<
    RuntimeConfig,
    | 'allowedOrigins'
    | 'requireOrigin'
    | 'rateLimit'
    | 'scheduler'
    | 'mail'
    | 'publicOrigin'
  >;
  repository: BookingRepository;
  calendar: BookingCalendar;
  mailer: BookingMailer;
  rateLimiter?: Pick<ContactRepository, 'consumeRateLimit'>;
  outbox?: EmailOutbox;
  idFactory?: () => string;
  now?: () => Date;
}

function clientAddress(request: Request): string {
  return request.ip || request.socket.remoteAddress || 'unknown';
}

function hmac(secret: string, scope: string, value: string): Buffer {
  return createHmac('sha256', secret).update(`${scope}:${value}`).digest();
}

function sha256(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

function managementToken(secret: string, bookingId: string): string {
  return hmac(secret, 'booking-management', bookingId).toString('base64url');
}

function canonicalRequest(input: z.infer<typeof bookingSchema>): string {
  return JSON.stringify({
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone || null,
    company: input.company || null,
    startAt: new Date(input.startAt).toISOString(),
    timezone: input.timezone,
    mode: input.mode,
    source: input.source
  });
}

function tokenFromRequest(request: Request): string | null {
  const token = request.query.token;
  return typeof token === 'string' && TOKEN_PATTERN.test(token) ? token : null;
}

function tokenHashFromRequest(request: Request): Buffer | null {
  const token = tokenFromRequest(request);
  return token ? sha256(token) : null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function readableDate(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: timezone
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

function sendManagementPage(
  response: Response,
  status: number,
  booking: BookingRecord | null,
  token: string | null,
  schedulerTimezone: string,
  notice = ''
) {
  const title = booking?.status === 'cancelled' ? 'Booking cancelled' : 'Manage booking';
  const actionToken = token ? encodeURIComponent(token) : '';
  const content = !booking || !token
    ? '<h1>This booking link is invalid.</h1><p>No booking was changed.</p>'
    : booking.status === 'cancelled'
      ? '<h1>Your booking is cancelled.</h1><p>The time has been released. You may book a new conversation from the Rough Note website.</p>'
      : `<h1>Manage your booking</h1>
        ${notice ? `<p class="notice">${escapeHtml(notice)}</p>` : ''}
        <p><strong>${escapeHtml(readableDate(booking.startAt, schedulerTimezone))}</strong><br>
        ${booking.meetingUrl ? `<a href="${escapeHtml(booking.meetingUrl)}">Google Meet room</a>` : 'Rough Note studio visit'}</p>
        <h2>Reschedule</h2>
        <p>Choose a Monday–Friday start time during studio hours. The server will verify live availability before changing anything.</p>
        <form method="post" action="/api/bookings/reschedule?token=${actionToken}">
          <label>New date and time (${escapeHtml(schedulerTimezone)})<br>
            <input type="datetime-local" name="localStart" required>
          </label><br><button type="submit">Check and reschedule</button>
        </form>
        <h2>Cancel</h2>
        <form method="post" action="/api/bookings/cancel?token=${actionToken}">
          <button class="danger" type="submit">Cancel this booking</button>
        </form>`;
  response.set({
    'Cache-Control': 'no-store',
    'Content-Security-Policy':
      "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'",
    'Referrer-Policy': 'no-referrer'
  });
  response.status(status).type('html').send(`<!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${title} | Rough Note</title><style>
      body{background:#f3ead9;color:#241f19;font:17px/1.6 system-ui;margin:0;padding:24px}
      main{background:#fffaf0;border:1px solid #d9c8aa;box-shadow:0 18px 50px #37251124;margin:8vh auto;max-width:620px;padding:40px}
      h1,h2{font-family:Georgia,serif}label{font-weight:700}input{font:inherit;margin:10px 0;padding:12px;width:min(340px,90%)}
      button{background:#d86e2f;border:0;color:#fff;cursor:pointer;font-weight:700;margin:12px 0;padding:13px 18px}.danger{background:#a42c24}.notice{background:#fff3be;padding:12px}
    </style></head><body><main>${content}</main></body></html>`);
}

function busyFromDatabase(starts: Date[], durationMinutes: number): BusyPeriod[] {
  return starts.map((startAt) => ({
    startAt,
    endAt: new Date(startAt.getTime() + durationMinutes * 60_000)
  }));
}

function localInputToUtc(value: unknown, utcOffsetMinutes: number): Date | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match || !parseBusinessDate(match[1])) return null;
  const [year, month, day] = match[1].split('-').map(Number);
  const hour = Number(match[2]);
  const minute = Number(match[3]);
  if (hour > 23 || minute > 59) return null;
  return new Date(
    Date.UTC(year, month - 1, day, hour, minute) - utcOffsetMinutes * 60_000
  );
}

export function createSchedulerRouter(
  dependencies: SchedulerRouteDependencies
): Router {
  const router = Router();
  const idFactory = dependencies.idFactory ?? (() => `bk_${ulid()}`);
  const now = dependencies.now ?? (() => new Date());
  const originGuard = createOriginGuard({
    allowedOrigins: dependencies.config.allowedOrigins,
    requireOrigin: dependencies.config.requireOrigin
  });

  router.get('/availability', async (request, response) => {
    const date = typeof request.query.date === 'string' ? request.query.date : '';
    const range = businessDayRange(date, dependencies.config.scheduler);
    if (!range) {
      response.status(422).json({ message: 'Use a valid date in YYYY-MM-DD format.' });
      return;
    }
    try {
      const [databaseStarts, calendarBusy] = await Promise.all([
        dependencies.repository.listBookedStartTimes(range.startAt, range.endAt),
        dependencies.calendar.listBusyPeriods(range.startAt, range.endAt)
      ]);
      const busy = [
        ...calendarBusy,
        ...busyFromDatabase(
          databaseStarts,
          dependencies.config.scheduler.slotMinutes
        )
      ];
      const slots = availableSlotsForDate(
        date,
        dependencies.config.scheduler,
        now(),
        busy
      );
      response.set('Cache-Control', 'no-store');
      response.json({
        date,
        timezone: dependencies.config.scheduler.timezone,
        durationMinutes: dependencies.config.scheduler.slotMinutes,
        slots: slots.map((slot) => ({
          startAt: slot.startAt.toISOString(),
          endAt: slot.endAt.toISOString()
        }))
      });
    } catch (error) {
      logger.error('availability_lookup_failed', {}, error);
      response.status(503).json({
        message: 'Live availability is temporarily unavailable. Please retry.'
      });
    }
  });

  router.post(
    '/bookings',
    originGuard,
    json({ limit: '8kb', strict: true }),
    async (request, response, next) => {
      try {
        if (dependencies.rateLimiter) {
          const ipLimit = await dependencies.rateLimiter.consumeRateLimit({
            scope: 'ip',
            keyHash: hmac(
              dependencies.config.rateLimit.secret,
              'booking-ip',
              clientAddress(request)
            ),
            limit: 10,
            windowSeconds: dependencies.config.rateLimit.windowSeconds,
            now: now()
          });
          if (!ipLimit.allowed) {
            response.set('Retry-After', String(ipLimit.retryAfterSeconds));
            response.status(429).json({
              message: 'Too many booking requests. Please try again later.'
            });
            return;
          }
        }

        const key = request.get('idempotency-key') ?? '';
        if (!IDEMPOTENCY_PATTERN.test(key)) {
          response.status(400).json({
            message: 'Send a valid Idempotency-Key header.'
          });
          return;
        }
        const parsed = bookingSchema.safeParse(request.body);
        if (!parsed.success || parsed.data.websiteAddress2.trim()) {
          response.status(422).json({
            message: 'Check the booking details and try again.'
          });
          return;
        }
        const requestTime = now();
        const requestedStart = new Date(parsed.data.startAt);
        const slot = findConfiguredSlot(
          requestedStart,
          dependencies.config.scheduler,
          requestTime
        );
        if (!slot) {
          response.status(409).json({
            message: 'That time is past or outside the available schedule.'
          });
          return;
        }

        const idempotencyKeyHash = hmac(
          dependencies.config.rateLimit.secret,
          'booking-idempotency',
          key
        );
        const requestHash = sha256(canonicalRequest(parsed.data));
        let booking = await dependencies.repository.findByIdempotencyKeyHash(
          idempotencyKeyHash
        );
        let outcome: 'created' | 'idempotent' = 'idempotent';
        if (booking && !booking.requestHash.equals(requestHash)) {
          response.status(409).json({
            message: 'That idempotency key was already used for another request.'
          });
          return;
        }
        if (!booking) {
          let calendarBusy: BusyPeriod[];
          try {
            calendarBusy = await dependencies.calendar.listBusyPeriods(
              slot.startAt,
              slot.endAt
            );
          } catch (error) {
            logger.error('booking_freebusy_failed', {}, error);
            response.status(503).json({
              message: 'Live availability is temporarily unavailable. Please retry.'
            });
            return;
          }
          if (hasBusyOverlap(slot, calendarBusy)) {
            response.status(409).json({ message: 'That time is no longer available.' });
            return;
          }
          const bookingId = idFactory();
          const manageToken = managementToken(
            dependencies.config.rateLimit.secret,
            bookingId
          );
          const candidate: BookingRecord = {
            bookingId,
            idempotencyKeyHash,
            requestHash,
            startAt: slot.startAt,
            endAt: slot.endAt,
            timezone: parsed.data.timezone,
            name: parsed.data.name,
            email: parsed.data.email,
            emailNormalized: parsed.data.email.toLowerCase(),
            phone: parsed.data.phone || null,
            company: parsed.data.company || null,
            mode: parsed.data.mode,
            source: parsed.data.source,
            clientIpHash: hmac(
              dependencies.config.rateLimit.secret,
              'booking-stored-ip',
              clientAddress(request)
            ),
            managementTokenHash: sha256(manageToken),
            status: 'pending_calendar',
            googleEventId: null,
            meetingUrl: null,
            confirmationDeliveryStatus: 'pending',
            pendingStartAt: null,
            pendingEndAt: null,
            createdAt: requestTime
          };
          const creation = await dependencies.repository.createBooking(candidate);
          if (creation.outcome === 'slot-conflict') {
            response.status(409).json({ message: 'That time is no longer available.' });
            return;
          }
          if (creation.outcome === 'key-mismatch') {
            response.status(409).json({
              message: 'That idempotency key was already used for another request.'
            });
            return;
          }
          booking = creation.booking;
          outcome = creation.outcome;
        }
        if (booking.status === 'cancelled') {
          response.status(409).json({ message: 'This booking was already cancelled.' });
          return;
        }
        if (booking.status === 'reschedule_pending') {
          response.status(409).json({
            message: 'This booking is currently being rescheduled from its management link.'
          });
          return;
        }

        let calendarEvent;
        try {
          calendarEvent = await dependencies.calendar.ensureEvent(booking);
        } catch (error) {
          logger.error('calendar_event_provision_failed', {}, error);
          response.status(503).json({
            message:
              'The slot is safely held, but Google Calendar is still completing the booking. Retry with the same Idempotency-Key.'
          });
          return;
        }
        if (!calendarEvent.meetingUrl) {
          response.status(503).json({
            message:
              'Google Calendar has not finished creating the Meet room. Retry with the same Idempotency-Key.'
          });
          return;
        }
        booking = await dependencies.repository.saveCalendarDetails(
          booking.bookingId,
          calendarEvent.eventId,
          calendarEvent.meetingUrl,
          now()
        );
        const manageToken = managementToken(
          dependencies.config.rateLimit.secret,
          booking.bookingId
        );
        const manageUrl = new URL('/api/bookings/manage', dependencies.config.publicOrigin);
        manageUrl.searchParams.set('token', manageToken);

        let confirmationDelivery: 'sent' | 'queued' = 'sent';
        if (booking.confirmationDeliveryStatus !== 'sent') {
          const confirmationMessage = {
            booking,
            manageUrl: manageUrl.toString()
          };
          const queued = dependencies.outbox
            ? await dependencies.outbox.enqueueBooking(confirmationMessage, now())
            : null;
          let delivery: { messageId: string | null } | null = null;
          try {
            delivery = await withTimeout(
              dependencies.mailer.sendConfirmation(confirmationMessage),
              dependencies.config.mail.timeoutMs,
              'Booking confirmation email'
            );
          } catch (error) {
            try {
              await dependencies.repository.markConfirmationFailed(
                booking.bookingId,
                safeErrorSummary(error),
                now()
              );
            } catch (statusError) {
              logger.error('booking_failure_status_failed', {}, statusError);
            }
            if (queued && dependencies.outbox) {
              try {
                await dependencies.outbox.markFailed(queued.outboxId, error, now());
              } catch (outboxError) {
                logger.error('booking_outbox_failure_status_failed', {}, outboxError);
              }
              confirmationDelivery = 'queued';
            } else {
              response.status(503).json({
                message:
                  'Your calendar booking was saved, but its confirmation email could not be sent. Retry this request safely.'
              });
              return;
            }
          }
          if (delivery) {
            if (queued && dependencies.outbox) {
              try {
                await dependencies.outbox.markSent(
                  queued.outboxId,
                  delivery.messageId,
                  now()
                );
              } catch (outboxError) {
                logger.error('booking_outbox_sent_status_failed', {}, outboxError);
              }
            }
            try {
              await dependencies.repository.markConfirmationSent(
                booking.bookingId,
                delivery.messageId,
                now()
              );
            } catch (statusError) {
              logger.error('booking_sent_status_failed', {}, statusError);
            }
          }
        }

        response.status(outcome === 'created' ? 201 : 200).json({
          status: 'confirmed',
          bookingId: booking.bookingId,
          startAt: booking.startAt.toISOString(),
          endAt: booking.endAt.toISOString(),
          timezone: dependencies.config.scheduler.timezone,
          meetingUrl: booking.meetingUrl,
          manageUrl: manageUrl.toString(),
          confirmationDelivery
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.get('/bookings/manage', async (request, response, next) => {
    const token = tokenFromRequest(request);
    const hash = tokenHashFromRequest(request);
    if (!token || !hash) {
      sendManagementPage(
        response,
        400,
        null,
        null,
        dependencies.config.scheduler.timezone
      );
      return;
    }
    try {
      const booking = await dependencies.repository.findByManagementTokenHash(hash);
      sendManagementPage(
        response,
        booking ? 200 : 400,
        booking,
        token,
        dependencies.config.scheduler.timezone
      );
    } catch (error) {
      next(error);
    }
  });

  router.post(
    '/bookings/cancel',
    originGuard,
    async (request, response, next) => {
      const token = tokenFromRequest(request);
      const hash = tokenHashFromRequest(request);
      if (!token || !hash) {
        sendManagementPage(
          response,
          400,
          null,
          null,
          dependencies.config.scheduler.timezone
        );
        return;
      }
      try {
        let booking = await dependencies.repository.findByManagementTokenHash(hash);
        if (!booking) {
          sendManagementPage(
            response,
            400,
            null,
            null,
            dependencies.config.scheduler.timezone
          );
          return;
        }
        if (booking.status !== 'cancelled') {
          if (booking.googleEventId) {
            try {
              await dependencies.calendar.deleteEvent(booking.googleEventId);
            } catch (error) {
              logger.error('calendar_cancellation_failed', {}, error);
              sendManagementPage(
                response,
                503,
                booking,
                token,
                dependencies.config.scheduler.timezone,
                'Google Calendar could not complete the cancellation. Nothing was released; please retry.'
              );
              return;
            }
          }
          booking = await dependencies.repository.markCancelled(
            booking.bookingId,
            now()
          );
        }
        sendManagementPage(
          response,
          200,
          booking,
          token,
          dependencies.config.scheduler.timezone
        );
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/bookings/reschedule',
    originGuard,
    urlencoded({ extended: false, limit: '4kb' }),
    async (request, response, next) => {
      const token = tokenFromRequest(request);
      const hash = tokenHashFromRequest(request);
      if (!token || !hash) {
        sendManagementPage(
          response,
          400,
          null,
          null,
          dependencies.config.scheduler.timezone
        );
        return;
      }
      try {
        let booking = await dependencies.repository.findByManagementTokenHash(hash);
        if (!booking || booking.status === 'cancelled') {
          sendManagementPage(
            response,
            400,
            booking,
            token,
            dependencies.config.scheduler.timezone
          );
          return;
        }
        const requestedStart = localInputToUtc(
          request.body.localStart,
          dependencies.config.scheduler.utcOffsetMinutes
        );
        const slot = requestedStart
          ? findConfiguredSlot(requestedStart, dependencies.config.scheduler, now())
          : null;
        if (!slot || slot.startAt.getTime() === booking.startAt.getTime()) {
          sendManagementPage(
            response,
            409,
            booking,
            token,
            dependencies.config.scheduler.timezone,
            'That time is past, unchanged, or outside the available schedule.'
          );
          return;
        }
        const alreadyReserved =
          booking.status === 'reschedule_pending' &&
          booking.pendingStartAt?.getTime() === slot.startAt.getTime();
        if (!alreadyReserved) {
          let busy: BusyPeriod[];
          try {
            busy = await dependencies.calendar.listBusyPeriods(
              slot.startAt,
              slot.endAt
            );
          } catch (error) {
            logger.error('reschedule_freebusy_failed', {}, error);
            sendManagementPage(
              response,
              503,
              booking,
              token,
              dependencies.config.scheduler.timezone,
              'Live availability could not be checked. Your current booking is unchanged; please retry.'
            );
            return;
          }
          if (hasBusyOverlap(slot, busy)) {
            sendManagementPage(
              response,
              409,
              booking,
              token,
              dependencies.config.scheduler.timezone,
              'That time is no longer available.'
            );
            return;
          }
          const reservation = await dependencies.repository.reserveReschedule(
            booking.bookingId,
            slot.startAt,
            slot.endAt,
            now()
          );
          if (reservation !== 'reserved') {
            sendManagementPage(
              response,
              409,
              booking,
              token,
              dependencies.config.scheduler.timezone,
              'That time is no longer available.'
            );
            return;
          }
        }
        let calendarUpdated = false;
        try {
          await dependencies.calendar.updateEvent(booking, slot.startAt, slot.endAt);
          calendarUpdated = true;
          booking = await dependencies.repository.finalizeReschedule(
            booking.bookingId,
            now()
          );
        } catch (error) {
          if (!calendarUpdated) {
            await dependencies.repository.abortReschedule(booking.bookingId, now());
          }
          logger.error('calendar_reschedule_failed', {}, error);
          sendManagementPage(
            response,
            503,
            booking,
            token,
            dependencies.config.scheduler.timezone,
            'The calendar update could not be completed. Your protected booking state is safe; please retry.'
          );
          return;
        }
        sendManagementPage(
          response,
          200,
          booking,
          token,
          dependencies.config.scheduler.timezone,
          'Your booking has been rescheduled. Google Calendar sent the attendee update.'
        );
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
