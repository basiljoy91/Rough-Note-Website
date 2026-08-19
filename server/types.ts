export interface ValidatedReferenceFile {
  originalFileName: string;
  extension: string;
  detectedMime: string;
  byteSize: number;
  sha256: Buffer;
  content: Buffer;
}

export interface ContactSubmissionRecord {
  submissionId: string;
  solutionType: string;
  department: string;
  challengeText: string;
  name: string;
  email: string;
  emailNormalized: string;
  phone: string | null;
  website: string | null;
  role: string;
  source: string;
  clientIpHash: Buffer;
  userAgent: string | null;
  referenceFile: ValidatedReferenceFile | null;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export type RateLimitScope =
  | 'ip'
  | 'email'
  | 'newsletter-ip'
  | 'newsletter-email';

export interface ContactRepository {
  ping(): Promise<void>;
  consumeRateLimit(input: {
    scope: RateLimitScope;
    keyHash: Buffer;
    limit: number;
    windowSeconds: number;
    now: Date;
  }): Promise<RateLimitResult>;
  createSubmission(record: ContactSubmissionRecord): Promise<number>;
  markNotificationSent(
    notificationId: number,
    providerMessageId: string | null
  ): Promise<void>;
  markNotificationFailed(
    notificationId: number,
    errorMessage: string
  ): Promise<void>;
}

export interface ContactMailer {
  send(record: ContactSubmissionRecord): Promise<{ messageId: string | null }>;
}

export interface NewsletterSubscriptionCandidate {
  subscriberId: string;
  email: string;
  emailNormalized: string;
  source: string;
  verificationTokenHash: Buffer;
  verificationExpiresAt: Date;
  unsubscribeTokenHash: Buffer;
  clientIpHash: Buffer;
  now: Date;
  resendCooldownSeconds: number;
}

export interface NewsletterSubscriptionDecision {
  subscriberId: string;
  email: string;
  shouldSendVerification: boolean;
  notificationId: number | null;
}

export type NewsletterVerificationResult =
  | 'confirmed'
  | 'already-confirmed'
  | 'expired'
  | 'unsubscribed'
  | 'invalid';

export type NewsletterUnsubscribeResult =
  | 'unsubscribed'
  | 'already-unsubscribed'
  | 'invalid';

export interface NewsletterRepository {
  beginSubscription(
    candidate: NewsletterSubscriptionCandidate
  ): Promise<NewsletterSubscriptionDecision>;
  markVerificationSent(
    notificationId: number,
    subscriberId: string,
    providerMessageId: string | null,
    sentAt: Date
  ): Promise<void>;
  markVerificationFailed(
    notificationId: number,
    subscriberId: string,
    errorMessage: string,
    attemptedAt: Date
  ): Promise<void>;
  verifyByTokenHash(
    tokenHash: Buffer,
    confirmedAt: Date
  ): Promise<NewsletterVerificationResult>;
  unsubscribeByTokenHash(
    tokenHash: Buffer,
    unsubscribedAt: Date
  ): Promise<NewsletterUnsubscribeResult>;
}

export interface NewsletterVerificationMessage {
  email: string;
  verificationUrl: string;
  unsubscribeUrl: string;
}

export interface NewsletterMailer {
  sendVerification(
    message: NewsletterVerificationMessage
  ): Promise<{ messageId: string | null }>;
}

export type BookingMode = 'online' | 'office';

export interface BookingRecord {
  bookingId: string;
  idempotencyKeyHash: Buffer;
  requestHash: Buffer;
  startAt: Date;
  endAt: Date;
  timezone: string;
  name: string;
  email: string;
  emailNormalized: string;
  phone: string | null;
  company: string | null;
  mode: BookingMode;
  source: string;
  clientIpHash: Buffer;
  createdAt: Date;
  status: 'pending_calendar' | 'confirmed' | 'reschedule_pending' | 'cancelled';
  googleEventId: string | null;
  meetingUrl: string | null;
  managementTokenHash: Buffer;
  confirmationDeliveryStatus: 'pending' | 'sent' | 'failed';
  pendingStartAt: Date | null;
  pendingEndAt: Date | null;
}

export type BookingCreationResult =
  | { outcome: 'created' | 'idempotent'; booking: BookingRecord }
  | { outcome: 'slot-conflict' }
  | { outcome: 'key-mismatch' };

export interface BookingRepository {
  listBookedStartTimes(rangeStart: Date, rangeEnd: Date): Promise<Date[]>;
  findByIdempotencyKeyHash(hash: Buffer): Promise<BookingRecord | null>;
  createBooking(record: BookingRecord): Promise<BookingCreationResult>;
  saveCalendarDetails(
    bookingId: string,
    googleEventId: string,
    meetingUrl: string | null,
    updatedAt: Date
  ): Promise<BookingRecord>;
  markConfirmationSent(
    bookingId: string,
    providerMessageId: string | null,
    sentAt: Date
  ): Promise<void>;
  markConfirmationFailed(
    bookingId: string,
    errorMessage: string,
    attemptedAt: Date
  ): Promise<void>;
  findByManagementTokenHash(tokenHash: Buffer): Promise<BookingRecord | null>;
  markCancelled(bookingId: string, cancelledAt: Date): Promise<BookingRecord>;
  reserveReschedule(
    bookingId: string,
    newStartAt: Date,
    newEndAt: Date,
    requestedAt: Date
  ): Promise<'reserved' | 'slot-conflict' | 'invalid-state'>;
  finalizeReschedule(bookingId: string, completedAt: Date): Promise<BookingRecord>;
  abortReschedule(bookingId: string, abortedAt: Date): Promise<void>;
}

export interface BusyPeriod {
  startAt: Date;
  endAt: Date;
}

export interface CalendarEventResult {
  eventId: string;
  meetingUrl: string | null;
}

export interface BookingCalendar {
  listBusyPeriods(rangeStart: Date, rangeEnd: Date): Promise<BusyPeriod[]>;
  ensureEvent(booking: BookingRecord): Promise<CalendarEventResult>;
  updateEvent(
    booking: BookingRecord,
    startAt: Date,
    endAt: Date
  ): Promise<CalendarEventResult>;
  deleteEvent(eventId: string): Promise<void>;
}

export interface BookingConfirmationMessage {
  booking: BookingRecord;
  manageUrl: string;
}

export interface BookingMailer {
  sendConfirmation(
    message: BookingConfirmationMessage
  ): Promise<{ messageId: string | null }>;
}

export interface EmailOutboxReference {
  outboxId: number;
}

export interface EmailOutboxRetryResult {
  claimed: number;
  sent: number;
  failed: number;
  dead: number;
}

export interface EmailOutbox {
  enqueueContact(
    notificationId: number,
    record: ContactSubmissionRecord,
    now: Date
  ): Promise<EmailOutboxReference>;
  enqueueNewsletter(
    notificationId: number,
    subscriberId: string,
    message: NewsletterVerificationMessage,
    now: Date
  ): Promise<EmailOutboxReference>;
  enqueueBooking(
    message: BookingConfirmationMessage,
    now: Date
  ): Promise<EmailOutboxReference>;
  markSent(
    outboxId: number,
    providerMessageId: string | null,
    sentAt: Date
  ): Promise<void>;
  markFailed(outboxId: number, error: unknown, attemptedAt: Date): Promise<void>;
  retryDue(now: Date): Promise<EmailOutboxRetryResult>;
}

export interface MaintenanceResult {
  runId: number;
  rateLimitsDeleted: number;
  attachmentsDeleted: number;
  contactsDeleted: number;
  bookingsDeleted: number;
  subscribersDeleted: number;
  outboxDeleted: number;
  outbox: EmailOutboxRetryResult;
}

export interface MaintenanceRunner {
  run(now: Date): Promise<MaintenanceResult>;
}
