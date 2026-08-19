import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GoogleCalendarGateway } from '../../server/services/googleCalendar';
import type { BookingRecord } from '../../server/types';

const calendarConfig = {
  calendarId: 'rough-note@group.calendar.google.com',
  clientId: 'client-id',
  clientSecret: 'client-secret',
  refreshToken: 'refresh-token',
  timeoutMs: 1000,
  officeAddress: 'Rough Note Studio'
};

const booking: BookingRecord = {
  bookingId: 'bk_01GOOGLECALENDAR0000000000',
  idempotencyKeyHash: Buffer.alloc(32, 1),
  requestHash: Buffer.alloc(32, 2),
  startAt: new Date('2026-08-20T04:30:00.000Z'),
  endAt: new Date('2026-08-20T05:00:00.000Z'),
  timezone: 'Asia/Kolkata',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  emailNormalized: 'ada@example.com',
  phone: null,
  company: null,
  mode: 'online',
  source: 'rough-note-scheduler',
  clientIpHash: Buffer.alloc(32, 3),
  createdAt: new Date('2026-08-19T00:00:00.000Z'),
  status: 'pending_calendar',
  googleEventId: null,
  meetingUrl: null,
  managementTokenHash: Buffer.alloc(32, 4),
  confirmationDeliveryStatus: 'pending',
  pendingStartAt: null,
  pendingEndAt: null
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('GoogleCalendarGateway', () => {
  it('creates an attendee event with a deterministic ID and one Meet request', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ access_token: 'access', expires_in: 3600 })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'google-event',
          hangoutLink: 'https://meet.google.com/abc-defg-hij'
        })
      );
    vi.stubGlobal('fetch', fetchMock);

    const result = await new GoogleCalendarGateway(calendarConfig).ensureEvent(
      booking
    );
    expect(result.meetingUrl).toBe('https://meet.google.com/abc-defg-hij');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [url, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(url).toContain('conferenceDataVersion=1&sendUpdates=all');
    const body = JSON.parse(String(init.body));
    const expectedId = createHash('sha256')
      .update(`rough-note-calendar:${booking.bookingId}`)
      .digest('hex')
      .slice(0, 32);
    expect(body.id).toBe(expectedId);
    expect(body.attendees).toEqual([
      { email: booking.email, displayName: booking.name }
    ]);
    expect(body.conferenceData.createRequest).toEqual({
      requestId: expectedId,
      conferenceSolutionKey: { type: 'hangoutsMeet' }
    });
  });

  it('recovers an uncertain duplicate insert by reading the same event', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ access_token: 'access', expires_in: 3600 })
      )
      .mockResolvedValueOnce(jsonResponse({ error: 'duplicate' }, 409))
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'same-event',
          hangoutLink: 'https://meet.google.com/same-event'
        })
      );
    vi.stubGlobal('fetch', fetchMock);

    const result = await new GoogleCalendarGateway(calendarConfig).ensureEvent(
      booking
    );
    expect(result.meetingUrl).toBe('https://meet.google.com/same-event');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[2]?.[0])).toContain('/events/');
  });

  it('queries the dedicated calendar free/busy endpoint', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ access_token: 'access', expires_in: 3600 })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          calendars: {
            [calendarConfig.calendarId]: {
              busy: [
                {
                  start: '2026-08-20T04:30:00.000Z',
                  end: '2026-08-20T05:00:00.000Z'
                }
              ]
            }
          }
        })
      );
    vi.stubGlobal('fetch', fetchMock);
    const periods = await new GoogleCalendarGateway(
      calendarConfig
    ).listBusyPeriods(
      new Date('2026-08-20T04:00:00.000Z'),
      new Date('2026-08-20T12:00:00.000Z')
    );
    expect(periods[0]?.startAt.toISOString()).toBe(
      '2026-08-20T04:30:00.000Z'
    );
    const body = JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body));
    expect(body.items).toEqual([{ id: calendarConfig.calendarId }]);
  });
});
