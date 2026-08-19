import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SchedulerFlowPage } from '../../src/pages/schedule/SchedulerFlowPage';
import type {
  BookingResponse,
  SchedulerApi
} from '../../src/pages/schedule/schedulerApi';

vi.mock('../../src/app/layouts/SiteLayout', () => ({
  SiteLayout: ({ children }: { children: ReactNode }) => <>{children}</>
}));

const slot = {
  startAt: '2026-08-20T04:30:00.000Z',
  endAt: '2026-08-20T05:00:00.000Z'
};

const confirmed: BookingResponse = {
  status: 'confirmed',
  bookingId: 'bk_01CONFIRMED00000000000000',
  startAt: slot.startAt,
  endAt: slot.endAt,
  timezone: 'Asia/Kolkata',
  meetingUrl: 'https://meet.google.com/abc-defg-hij',
  manageUrl: 'https://roughnote.test/api/bookings/manage?token=opaque'
};

async function reachConfirmation(api: SchedulerApi) {
  const user = userEvent.setup();
  render(<SchedulerFlowPage api={api} />);
  await user.type(screen.getByLabelText('Full name'), 'Ada Lovelace');
  await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
  await user.click(screen.getByRole('button', { name: 'Continue to date' }));
  await user.type(screen.getByLabelText('Date'), '2026-08-20');
  await screen.findByText(/1 time available/);
  await user.click(screen.getByRole('button', { name: 'Continue to time' }));
  await user.click(screen.getByRole('radio', { name: /10:00/i }));
  await user.click(screen.getByRole('button', { name: 'Review booking' }));
  return user;
}

describe('SchedulerFlowPage', () => {
  it('strips legacy personal query data and starts at details', async () => {
    window.history.replaceState(
      {},
      '',
      '/html/schedule-success.html?name=Ada&email=ada%40example.com'
    );
    const api: SchedulerApi = {
      getAvailability: vi.fn(),
      createBooking: vi.fn()
    };
    render(<SchedulerFlowPage api={api} />);
    await waitFor(() => expect(window.location.search).toBe(''));
    expect(screen.getByRole('heading', { name: '1. Your details' })).toBeVisible();
    expect(screen.queryByText('Your meeting is booked.')).not.toBeInTheDocument();
  });

  it('shows success only after a real confirmed server response', async () => {
    let resolveBooking!: (value: BookingResponse) => void;
    const pending = new Promise<BookingResponse>((resolve) => {
      resolveBooking = resolve;
    });
    const api: SchedulerApi = {
      getAvailability: vi.fn().mockResolvedValue({
        date: '2026-08-20',
        timezone: 'Asia/Kolkata',
        durationMinutes: 30,
        slots: [slot]
      }),
      createBooking: vi.fn().mockReturnValue(pending)
    };
    const user = await reachConfirmation(api);
    await user.click(screen.getByRole('button', { name: 'Confirm my meeting' }));

    expect(screen.queryByText('Your meeting is booked.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Booking securely…' })).toBeDisabled();

    resolveBooking(confirmed);
    expect(await screen.findByText('Your meeting is booked.')).toBeVisible();
    expect(screen.getByText(/bk_01CONFIRMED/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Open Google Meet' })).toHaveAttribute(
      'href',
      confirmed.meetingUrl
    );
  });

  it('reuses its idempotency key when a failed confirmation is retried', async () => {
    const createBooking = vi
      .fn()
      .mockRejectedValueOnce(new Error('Temporary calendar failure'))
      .mockResolvedValueOnce(confirmed);
    const api: SchedulerApi = {
      getAvailability: vi.fn().mockResolvedValue({
        date: '2026-08-20',
        timezone: 'Asia/Kolkata',
        durationMinutes: 30,
        slots: [slot]
      }),
      createBooking
    };
    const user = await reachConfirmation(api);
    await user.click(screen.getByRole('button', { name: 'Confirm my meeting' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Temporary calendar failure'
    );
    await user.click(screen.getByRole('button', { name: 'Confirm my meeting' }));
    expect(await screen.findByText('Your meeting is booked.')).toBeVisible();
    expect(createBooking).toHaveBeenCalledTimes(2);
    expect(createBooking.mock.calls[0]?.[1]).toBe(createBooking.mock.calls[1]?.[1]);
  });
});
