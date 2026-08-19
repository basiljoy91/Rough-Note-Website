import { createHash } from 'node:crypto';
import type { RuntimeConfig } from '../config.js';
import type {
  BookingCalendar,
  BookingRecord,
  BusyPeriod,
  CalendarEventResult
} from '../types.js';

interface GoogleEvent {
  id?: string;
  hangoutLink?: string;
  conferenceData?: {
    createRequest?: { status?: { statusCode?: string } };
    entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
  };
}

interface FreeBusyResponse {
  calendars?: Record<
    string,
    {
      errors?: Array<{ reason?: string }>;
      busy?: Array<{ start?: string; end?: string }>;
    }
  >;
}

class GoogleApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

function deterministicEventId(bookingId: string): string {
  // Hex is valid base32hex input for Google event IDs and remains stable on retry.
  return createHash('sha256')
    .update(`rough-note-calendar:${bookingId}`)
    .digest('hex')
    .slice(0, 32);
}

function meetingUrl(event: GoogleEvent): string | null {
  return (
    event.hangoutLink ??
    event.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === 'video'
    )?.uri ??
    null
  );
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class GoogleCalendarGateway implements BookingCalendar {
  private accessToken: { value: string; expiresAt: number } | null = null;
  private tokenRequest: Promise<string> | null = null;

  constructor(private readonly config: RuntimeConfig['googleCalendar']) {}

  async listBusyPeriods(rangeStart: Date, rangeEnd: Date): Promise<BusyPeriod[]> {
    const response = await this.request<FreeBusyResponse>('/freeBusy', {
      method: 'POST',
      body: JSON.stringify({
        timeMin: rangeStart.toISOString(),
        timeMax: rangeEnd.toISOString(),
        timeZone: 'UTC',
        items: [{ id: this.config.calendarId }]
      })
    });
    const calendar = response.calendars?.[this.config.calendarId];
    if (!calendar || calendar.errors?.length) {
      throw new Error('Google Calendar free/busy data was unavailable.');
    }
    return (calendar.busy ?? []).flatMap((period) => {
      if (!period.start || !period.end) return [];
      const startAt = new Date(period.start);
      const endAt = new Date(period.end);
      return Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())
        ? []
        : [{ startAt, endAt }];
    });
  }

  async ensureEvent(booking: BookingRecord): Promise<CalendarEventResult> {
    const eventId = booking.googleEventId ?? deterministicEventId(booking.bookingId);
    let event: GoogleEvent;
    if (booking.googleEventId) {
      event = await this.getEvent(eventId);
    } else {
      try {
        event = await this.request<GoogleEvent>(
          `/calendars/${encodeURIComponent(this.config.calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
          {
            method: 'POST',
            body: JSON.stringify(this.eventBody(booking, eventId))
          }
        );
      } catch (error) {
        if (!(error instanceof GoogleApiError) || error.status !== 409) throw error;
        event = await this.getEvent(eventId);
      }
    }
    event = await this.waitForMeeting(eventId, event, true);
    return { eventId, meetingUrl: meetingUrl(event) };
  }

  async updateEvent(
    booking: BookingRecord,
    startAt: Date,
    endAt: Date
  ): Promise<CalendarEventResult> {
    if (!booking.googleEventId) {
      throw new Error('The booking has no Google Calendar event.');
    }
    let event = await this.request<GoogleEvent>(
      `/calendars/${encodeURIComponent(this.config.calendarId)}/events/${encodeURIComponent(booking.googleEventId)}?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          start: { dateTime: startAt.toISOString(), timeZone: 'UTC' },
          end: { dateTime: endAt.toISOString(), timeZone: 'UTC' }
        })
      }
    );
    event = await this.waitForMeeting(
      booking.googleEventId,
      event,
      true
    );
    return {
      eventId: booking.googleEventId,
      meetingUrl: meetingUrl(event)
    };
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await this.request<void>(
        `/calendars/${encodeURIComponent(this.config.calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
        { method: 'DELETE' }
      );
    } catch (error) {
      if (
        error instanceof GoogleApiError &&
        (error.status === 404 || error.status === 410)
      ) {
        return;
      }
      throw error;
    }
  }

  private eventBody(booking: BookingRecord, eventId: string) {
    return {
      id: eventId,
      summary: 'Rough Note — Free Strategy Consultation',
      description:
        'A 30-minute conversation with Rough Note about your goals, challenges, and product strategy.',
      location:
        booking.mode === 'office' ? this.config.officeAddress : undefined,
      start: { dateTime: booking.startAt.toISOString(), timeZone: 'UTC' },
      end: { dateTime: booking.endAt.toISOString(), timeZone: 'UTC' },
      attendees: [{ email: booking.email, displayName: booking.name }],
      reminders: { useDefault: true },
      extendedProperties: { private: { roughNoteBookingId: booking.bookingId } },
      conferenceData: {
        createRequest: {
          requestId: eventId,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };
  }

  private async waitForMeeting(
    eventId: string,
    initial: GoogleEvent,
    required: boolean
  ): Promise<GoogleEvent> {
    if (!required || meetingUrl(initial)) return initial;
    let event = initial;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      if (event.conferenceData?.createRequest?.status?.statusCode === 'failure') {
        throw new Error('Google Meet room creation failed.');
      }
      await delay(250);
      event = await this.getEvent(eventId);
      if (meetingUrl(event)) return event;
    }
    throw new Error('Google Meet room creation is still pending. Please retry.');
  }

  private getEvent(eventId: string): Promise<GoogleEvent> {
    return this.request<GoogleEvent>(
      `/calendars/${encodeURIComponent(this.config.calendarId)}/events/${encodeURIComponent(eventId)}?conferenceDataVersion=1`
    );
  }

  private async request<T>(
    path: string,
    init: { method?: string; body?: string } = {}
  ): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
      method: init.method ?? 'GET',
      body: init.body,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init.body ? { 'Content-Type': 'application/json' } : {})
      },
      signal: AbortSignal.timeout(this.config.timeoutMs)
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 1000);
      throw new GoogleApiError(
        response.status,
        `Google Calendar returned ${response.status}: ${detail}`
      );
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.accessToken.expiresAt > Date.now() + 60_000) {
      return this.accessToken.value;
    }
    if (this.tokenRequest) return this.tokenRequest;
    this.tokenRequest = this.refreshAccessToken();
    try {
      return await this.tokenRequest;
    } finally {
      this.tokenRequest = null;
    }
  }

  private async refreshAccessToken(): Promise<string> {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: this.config.refreshToken,
      grant_type: 'refresh_token'
    });
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(this.config.timeoutMs)
    });
    if (!response.ok) {
      throw new Error(`Google OAuth token refresh failed with ${response.status}.`);
    }
    const result = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
    };
    if (!result.access_token) throw new Error('Google OAuth returned no access token.');
    this.accessToken = {
      value: result.access_token,
      expiresAt: Date.now() + (result.expires_in ?? 3600) * 1000
    };
    return result.access_token;
  }
}
