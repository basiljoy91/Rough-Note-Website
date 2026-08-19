export interface AvailabilitySlotDto {
  startAt: string;
  endAt: string;
}

export interface AvailabilityResponse {
  date: string;
  timezone: string;
  durationMinutes: number;
  slots: AvailabilitySlotDto[];
}

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  startAt: string;
  timezone: string;
  mode: 'online' | 'office';
  source: 'rough-note-scheduler';
  websiteAddress2: string;
}

export interface BookingResponse {
  status: 'confirmed';
  bookingId: string;
  startAt: string;
  endAt: string;
  timezone: string;
  meetingUrl: string | null;
  manageUrl: string;
}

export interface SchedulerApi {
  getAvailability(date: string): Promise<AvailabilityResponse>;
  createBooking(
    request: BookingRequest,
    idempotencyKey: string
  ): Promise<BookingResponse>;
}

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      message?: string;
      errors?: Record<string, string>;
    };
    return (
      body.message ??
      Object.values(body.errors ?? {})[0] ??
      'The server could not accept this request.'
    );
  } catch {
    return 'The server could not accept this request.';
  }
}

export const defaultSchedulerApi: SchedulerApi = {
  async getAvailability(date) {
    const response = await fetch(
      `/api/availability?date=${encodeURIComponent(date)}`,
      {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10_000)
      }
    );
    if (!response.ok) throw new Error(await responseError(response));
    const body = (await response.json()) as Partial<AvailabilityResponse>;
    if (!Array.isArray(body.slots) || typeof body.timezone !== 'string') {
      throw new Error('The availability response was incomplete.');
    }
    return body as AvailabilityResponse;
  },

  async createBooking(request, idempotencyKey) {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(12_000)
    });
    if (!response.ok) throw new Error(await responseError(response));
    const body = (await response.json()) as Partial<BookingResponse>;
    if (
      body.status !== 'confirmed' ||
      typeof body.bookingId !== 'string' ||
      !body.bookingId ||
      typeof body.startAt !== 'string' ||
      typeof body.endAt !== 'string'
    ) {
      throw new Error('The booking response was incomplete.');
    }
    return body as BookingResponse;
  }
};
