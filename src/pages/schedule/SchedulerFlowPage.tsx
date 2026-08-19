import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import {
  defaultSchedulerApi,
  type AvailabilityResponse,
  type BookingResponse,
  type SchedulerApi
} from './schedulerApi';
import './SchedulerFlowPage.css';

interface SchedulerFlowPageProps {
  api?: SchedulerApi;
}

interface Details {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const emptyDetails: Details = { name: '', email: '', phone: '', company: '' };

function dateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function makeIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `rough-note-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function displayTime(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone
  }).format(new Date(iso));
}

function displayDateTime(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone
  }).format(new Date(iso));
}

export function SchedulerFlowPage({
  api = defaultSchedulerApi
}: SchedulerFlowPageProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [date, setDate] = useState('');
  const [availability, setAvailability] =
    useState<AvailabilityResponse | null>(null);
  const [selectedStart, setSelectedStart] = useState('');
  const [mode, setMode] = useState<'online' | 'office'>('online');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const idempotency = useRef({ fingerprint: '', key: '' });

  const today = useMemo(() => new Date(), []);
  const maximum = useMemo(() => {
    const value = new Date(today);
    value.setDate(value.getDate() + 60);
    return value;
  }, [today]);

  useEffect(() => {
    // Old pages carried personal details in the query string. Remove them.
    if (window.location.search || window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!date) return;
    let active = true;
    api
      .getAvailability(date)
      .then((result) => {
        if (active) setAvailability(result);
      })
      .catch((reason: unknown) => {
        if (active) {
          setAvailability(null);
          setError(
            reason instanceof Error
              ? reason.message
              : 'Availability could not be loaded.'
          );
        }
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });
    return () => {
      active = false;
    };
  }, [api, date]);

  const setDetail = (field: keyof Details, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const changeDate = (value: string) => {
    setDate(value);
    setAvailability(null);
    setSelectedStart('');
    setError('');
    setLoadingSlots(Boolean(value));
  };

  const submitDetails = (event: FormEvent) => {
    event.preventDefault();
    if (
      details.name.trim().length < 2 ||
      !/^\S+@\S+\.\S+$/.test(details.email)
    ) {
      setError('Enter your name and a valid email address.');
      return;
    }
    setError('');
    setStep(2);
  };

  const goToSlots = () => {
    if (!date || loadingSlots || !availability?.slots.length) {
      setError('Choose a date with at least one available time.');
      return;
    }
    setError('');
    setStep(3);
  };

  const goToReview = () => {
    if (!selectedStart) {
      setError('Choose one of the live available times.');
      return;
    }
    setError('');
    setStep(4);
  };

  const confirmBooking = async () => {
    if (!availability || !selectedStart) return;
    const payload = {
      ...details,
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      company: details.company.trim(),
      startAt: selectedStart,
      timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      mode,
      source: 'rough-note-scheduler' as const,
      websiteAddress2: ''
    };
    const fingerprint = JSON.stringify(payload);
    if (idempotency.current.fingerprint !== fingerprint) {
      idempotency.current = { fingerprint, key: makeIdempotencyKey() };
    }
    setSubmitting(true);
    setError('');
    try {
      const result = await api.createBooking(payload, idempotency.current.key);
      setBooking(result);
      setStep(5);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'The booking could not be completed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const timezone = availability?.timezone ?? 'Asia/Kolkata';

  return (
    <SiteLayout
      activeItem="contact"
      pageLabel={step === 5 ? 'Confirmed' : `Step ${step}`}
      pageTitle="Schedule a Meeting"
    >
      <main className="schedulerFlow">
        <section className="schedulerPaper" aria-labelledby="scheduler-title">
          <div className="schedulerIntro">
            <p className="schedulerEyebrow">
              ROUGH NOTE / FREE STRATEGY CONSULTATION
            </p>
            <h1 id="scheduler-title">
              {step === 5
                ? 'Your meeting is booked.'
                : 'Let’s put a useful conversation on the calendar.'}
            </h1>
            <p>
              Thirty focused minutes to understand your rough idea and find the
              clearest next move.
            </p>
            {step !== 5 && (
              <div
                className="schedulerProgress"
                aria-label={`Step ${step} of 4`}
              >
                <span style={{ width: `${step * 25}%` }} />
              </div>
            )}
          </div>

          {step === 1 && (
            <form className="schedulerForm" onSubmit={submitDetails}>
              <h2>1. Your details</h2>
              <label>
                Full name
                <input
                  required
                  autoComplete="name"
                  value={details.name}
                  onChange={(event) => setDetail('name', event.target.value)}
                />
              </label>
              <label>
                Email address
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={details.email}
                  onChange={(event) => setDetail('email', event.target.value)}
                />
              </label>
              <label>
                Phone <small>(optional)</small>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={details.phone}
                  onChange={(event) => setDetail('phone', event.target.value)}
                />
              </label>
              <label>
                Company <small>(optional)</small>
                <input
                  autoComplete="organization"
                  value={details.company}
                  onChange={(event) => setDetail('company', event.target.value)}
                />
              </label>
              <button type="submit">Continue to date</button>
            </form>
          )}

          {step === 2 && (
            <div className="schedulerForm">
              <h2>2. Choose a date</h2>
              <label>
                Date
                <input
                  type="date"
                  min={dateValue(today)}
                  max={dateValue(maximum)}
                  value={date}
                  onChange={(event) => changeDate(event.target.value)}
                />
              </label>
              <div className="availabilityNote" aria-live="polite">
                {loadingSlots
                  ? 'Checking Google Calendar and current bookings…'
                  : availability
                    ? `${availability.slots.length} time${availability.slots.length === 1 ? '' : 's'} available in ${availability.timezone}.`
                    : 'Select a date to check live availability.'}
              </div>
              <div className="schedulerActions">
                <button className="secondary" onClick={() => setStep(1)}>
                  Back
                </button>
                <button onClick={goToSlots}>Continue to time</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="schedulerForm">
              <h2>3. Choose a live time</h2>
              <div
                className="slotGrid"
                role="radiogroup"
                aria-label="Available times"
              >
                {availability?.slots.map((slot) => (
                  <button
                    key={slot.startAt}
                    type="button"
                    role="radio"
                    aria-checked={selectedStart === slot.startAt}
                    className={
                      selectedStart === slot.startAt ? 'slot selected' : 'slot'
                    }
                    onClick={() => {
                      setSelectedStart(slot.startAt);
                      setError('');
                    }}
                  >
                    {displayTime(slot.startAt, timezone)}
                  </button>
                ))}
              </div>
              <fieldset>
                <legend>Meeting mode</legend>
                <label className="radio">
                  <input
                    type="radio"
                    checked={mode === 'online'}
                    onChange={() => setMode('online')}
                  />{' '}
                  Google Meet
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    checked={mode === 'office'}
                    onChange={() => setMode('office')}
                  />{' '}
                  Studio visit + Meet backup
                </label>
              </fieldset>
              <div className="schedulerActions">
                <button className="secondary" onClick={() => setStep(2)}>
                  Back
                </button>
                <button onClick={goToReview}>Review booking</button>
              </div>
            </div>
          )}

          {step === 4 && selectedStart && (
            <div className="schedulerForm schedulerReview">
              <h2>4. Confirm the real booking</h2>
              <dl>
                <div><dt>Name</dt><dd>{details.name}</dd></div>
                <div><dt>Email</dt><dd>{details.email}</dd></div>
                <div><dt>When</dt><dd>{displayDateTime(selectedStart, timezone)}</dd></div>
                <div><dt>Mode</dt><dd>{mode === 'online' ? 'Google Meet' : 'Rough Note studio + Meet backup'}</dd></div>
              </dl>
              <p className="serverPromise">
                The server will recheck the time, lock it in MySQL, create one
                Google Calendar event, and send the invitation before showing
                success.
              </p>
              <div className="schedulerActions">
                <button
                  className="secondary"
                  disabled={submitting}
                  onClick={() => setStep(3)}
                >
                  Back
                </button>
                <button disabled={submitting} onClick={confirmBooking}>
                  {submitting ? 'Booking securely…' : 'Confirm my meeting'}
                </button>
              </div>
            </div>
          )}

          {step === 5 && booking && (
            <div className="schedulerSuccess" role="status">
              <div className="successMark" aria-hidden="true">✓</div>
              <h2>See you soon, {details.name.split(' ')[0]}.</h2>
              <p>{displayDateTime(booking.startAt, booking.timezone)}</p>
              <p>Booking reference: <strong>{booking.bookingId}</strong></p>
              {booking.meetingUrl && (
                <a className="schedulerButton" href={booking.meetingUrl}>
                  Open Google Meet
                </a>
              )}
              <a className="manageLink" href={booking.manageUrl}>
                Cancel or reschedule
              </a>
              <p className="emailNote">
                A branded confirmation and Google Calendar invitation have
                been sent to {details.email}.
              </p>
            </div>
          )}

          {error && (
            <p className="schedulerError" role="alert">{error}</p>
          )}
        </section>
      </main>
    </SiteLayout>
  );
}
