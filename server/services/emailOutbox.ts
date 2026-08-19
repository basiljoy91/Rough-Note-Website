import {
  createCipheriv,
  createDecipheriv,
  randomBytes
} from 'node:crypto';
import type {
  Pool,
  ResultSetHeader,
  RowDataPacket
} from 'mysql2/promise';
import type { RuntimeConfig } from '../config.js';
import { logger, safeErrorSummary } from './safeLogger.js';
import { withTimeout } from './promiseTimeout.js';
import type {
  BookingConfirmationMessage,
  BookingMailer,
  BookingRecord,
  BookingRepository,
  ContactMailer,
  ContactRepository,
  ContactSubmissionRecord,
  EmailOutbox,
  EmailOutboxReference,
  EmailOutboxRetryResult,
  NewsletterMailer,
  NewsletterRepository,
  NewsletterVerificationMessage
} from '../types.js';

type MessageKind =
  | 'contact_notification'
  | 'newsletter_verification'
  | 'booking_confirmation';

interface ContactPayload {
  kind: 'contact_notification';
  notificationId: number;
  record: {
    submissionId: string;
    solutionType: string;
    department: string;
    challengeText: string;
    name: string;
    email: string;
    phone: string | null;
    website: string | null;
    role: string;
    source: string;
    referenceFile: {
      originalFileName: string;
      extension: string;
      detectedMime: string;
      byteSize: number;
    } | null;
  };
}

interface NewsletterPayload {
  kind: 'newsletter_verification';
  notificationId: number;
  subscriberId: string;
  message: NewsletterVerificationMessage;
}

interface BookingPayload {
  kind: 'booking_confirmation';
  message: {
    booking: {
      bookingId: string;
      startAt: string;
      endAt: string;
      timezone: string;
      name: string;
      email: string;
      phone: string | null;
      company: string | null;
      mode: BookingRecord['mode'];
      source: string;
      createdAt: string;
      status: BookingRecord['status'];
      googleEventId: string | null;
      meetingUrl: string | null;
      confirmationDeliveryStatus: BookingRecord['confirmationDeliveryStatus'];
      pendingStartAt: string | null;
      pendingEndAt: string | null;
    };
    manageUrl: string;
  };
}

type StoredPayload = ContactPayload | NewsletterPayload | BookingPayload;

interface OutboxRow extends RowDataPacket {
  outbox_id: number;
  dedupe_key: string;
  message_kind: MessageKind;
  aggregate_id: string;
  payload_iv: Buffer;
  payload_auth_tag: Buffer;
  payload_ciphertext: Buffer;
  attempt_count: number;
  max_attempts: number;
}

interface OutboxDependencies {
  contactRepository: ContactRepository;
  contactMailer: ContactMailer;
  newsletterRepository: NewsletterRepository;
  newsletterMailer: NewsletterMailer;
  bookingRepository: BookingRepository;
  bookingMailer: BookingMailer;
}

function errorCode(error: unknown): string {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return 'DELIVERY_FAILED';
  }
  const code = String(error.code);
  return /^[A-Z0-9_-]{2,80}$/i.test(code) ? code : 'DELIVERY_FAILED';
}

function asContactRecord(payload: ContactPayload['record']): ContactSubmissionRecord {
  return {
    ...payload,
    emailNormalized: payload.email.toLowerCase(),
    clientIpHash: Buffer.alloc(0),
    userAgent: null,
    referenceFile: payload.referenceFile
      ? {
          ...payload.referenceFile,
          sha256: Buffer.alloc(0),
          content: Buffer.alloc(0)
        }
      : null
  };
}

function asBookingRecord(payload: BookingPayload['message']['booking']): BookingRecord {
  return {
    ...payload,
    idempotencyKeyHash: Buffer.alloc(0),
    requestHash: Buffer.alloc(0),
    startAt: new Date(payload.startAt),
    endAt: new Date(payload.endAt),
    emailNormalized: payload.email.toLowerCase(),
    clientIpHash: Buffer.alloc(0),
    createdAt: new Date(payload.createdAt),
    managementTokenHash: Buffer.alloc(0),
    pendingStartAt: payload.pendingStartAt ? new Date(payload.pendingStartAt) : null,
    pendingEndAt: payload.pendingEndAt ? new Date(payload.pendingEndAt) : null
  };
}

export class MySqlEmailOutbox implements EmailOutbox {
  private readonly key: Buffer;

  constructor(
    private readonly pool: Pool,
    private readonly config: Pick<RuntimeConfig, 'operations' | 'mail'>,
    private readonly dependencies: OutboxDependencies
  ) {
    this.key = Buffer.from(config.operations.outboxEncryptionKey, 'hex');
  }

  enqueueContact(
    notificationId: number,
    record: ContactSubmissionRecord,
    now: Date
  ): Promise<EmailOutboxReference> {
    return this.enqueue(
      `contact:${notificationId}`,
      'contact_notification',
      record.submissionId,
      {
        kind: 'contact_notification',
        notificationId,
        record: {
          submissionId: record.submissionId,
          solutionType: record.solutionType,
          department: record.department,
          challengeText: record.challengeText,
          name: record.name,
          email: record.email,
          phone: record.phone,
          website: record.website,
          role: record.role,
          source: record.source,
          referenceFile: record.referenceFile
            ? {
                originalFileName: record.referenceFile.originalFileName,
                extension: record.referenceFile.extension,
                detectedMime: record.referenceFile.detectedMime,
                byteSize: record.referenceFile.byteSize
              }
            : null
        }
      },
      now
    );
  }

  enqueueNewsletter(
    notificationId: number,
    subscriberId: string,
    message: NewsletterVerificationMessage,
    now: Date
  ): Promise<EmailOutboxReference> {
    return this.enqueue(
      `newsletter:${notificationId}`,
      'newsletter_verification',
      subscriberId,
      { kind: 'newsletter_verification', notificationId, subscriberId, message },
      now
    );
  }

  enqueueBooking(
    message: BookingConfirmationMessage,
    now: Date
  ): Promise<EmailOutboxReference> {
    const { booking } = message;
    return this.enqueue(
      `booking:${booking.bookingId}`,
      'booking_confirmation',
      booking.bookingId,
      {
        kind: 'booking_confirmation',
        message: {
          manageUrl: message.manageUrl,
          booking: {
            bookingId: booking.bookingId,
            startAt: booking.startAt.toISOString(),
            endAt: booking.endAt.toISOString(),
            timezone: booking.timezone,
            name: booking.name,
            email: booking.email,
            phone: booking.phone,
            company: booking.company,
            mode: booking.mode,
            source: booking.source,
            createdAt: booking.createdAt.toISOString(),
            status: booking.status,
            googleEventId: booking.googleEventId,
            meetingUrl: booking.meetingUrl,
            confirmationDeliveryStatus: booking.confirmationDeliveryStatus,
            pendingStartAt: booking.pendingStartAt?.toISOString() ?? null,
            pendingEndAt: booking.pendingEndAt?.toISOString() ?? null
          }
        }
      },
      now
    );
  }

  async markSent(
    outboxId: number,
    providerMessageId: string | null,
    sentAt: Date
  ): Promise<void> {
    await this.pool.execute(
      `UPDATE email_outbox SET delivery_status = 'sent',
       attempt_count = attempt_count + 1, provider_message_id = ?,
       error_code = NULL, error_summary = NULL, locked_at = NULL,
       sent_at = ?, updated_at = ? WHERE outbox_id = ?`,
      [providerMessageId, sentAt, sentAt, outboxId]
    );
  }

  async markFailed(outboxId: number, error: unknown, attemptedAt: Date): Promise<void> {
    const [rows] = await this.pool.execute<OutboxRow[]>(
      'SELECT attempt_count, max_attempts FROM email_outbox WHERE outbox_id = ?',
      [outboxId]
    );
    const row = rows[0];
    if (!row) return;
    const attempts = row.attempt_count + 1;
    const isDead = attempts >= row.max_attempts;
    const delaySeconds = Math.min(
      this.config.operations.outboxRetryBaseSeconds * 2 ** Math.max(0, attempts - 1),
      86_400
    );
    const nextAttempt = new Date(attemptedAt.getTime() + delaySeconds * 1000);
    await this.pool.execute(
      `UPDATE email_outbox SET delivery_status = ?, attempt_count = ?,
       next_attempt_at = ?, locked_at = NULL, error_code = ?,
       error_summary = ?, updated_at = ? WHERE outbox_id = ?`,
      [
        isDead ? 'dead' : 'pending',
        attempts,
        nextAttempt,
        errorCode(error),
        safeErrorSummary(error),
        attemptedAt,
        outboxId
      ]
    );
  }

  async retryDue(now: Date): Promise<EmailOutboxRetryResult> {
    const rows = await this.claimDue(now);
    const result: EmailOutboxRetryResult = {
      claimed: rows.length,
      sent: 0,
      failed: 0,
      dead: 0
    };
    for (const row of rows) {
      try {
        const payload = this.decrypt(row);
        const delivery = await this.deliver(payload);
        await this.markSent(row.outbox_id, delivery.messageId, now);
        result.sent += 1;
        await this.recordSourceSent(payload, delivery.messageId, now);
      } catch (error) {
        await this.markFailed(row.outbox_id, error, now);
        result.failed += 1;
        if (row.attempt_count + 1 >= row.max_attempts) result.dead += 1;
        try {
          const payload = this.decrypt(row);
          await this.recordSourceFailed(payload, error, now);
        } catch (statusError) {
          logger.error('outbox_source_failure_status_failed', {}, statusError);
        }
      }
    }
    return result;
  }

  private async enqueue(
    dedupeKey: string,
    kind: MessageKind,
    aggregateId: string,
    payload: StoredPayload,
    now: Date
  ): Promise<EmailOutboxReference> {
    const aad = `${kind}:${aggregateId}`;
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    cipher.setAAD(Buffer.from(aad));
    const ciphertext = Buffer.concat([
      cipher.update(JSON.stringify(payload), 'utf8'),
      cipher.final()
    ]);
    const [result] = await this.pool.execute<ResultSetHeader>(
      `INSERT INTO email_outbox (
        dedupe_key, message_kind, aggregate_id, payload_iv, payload_auth_tag,
        payload_ciphertext, delivery_status, attempt_count, max_attempts,
        next_attempt_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE outbox_id = LAST_INSERT_ID(outbox_id)`,
      [
        dedupeKey,
        kind,
        aggregateId,
        iv,
        cipher.getAuthTag(),
        ciphertext,
        this.config.operations.outboxMaxAttempts,
        now,
        now,
        now
      ]
    );
    return { outboxId: result.insertId };
  }

  private async claimDue(now: Date): Promise<OutboxRow[]> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const staleBefore = new Date(
        now.getTime() - this.config.operations.outboxLockTimeoutSeconds * 1000
      );
      await connection.execute(
        `UPDATE email_outbox SET delivery_status = 'pending', locked_at = NULL
         WHERE delivery_status = 'processing' AND locked_at < ?`,
        [staleBefore]
      );
      const [rows] = await connection.execute<OutboxRow[]>(
        `SELECT outbox_id, dedupe_key, message_kind, aggregate_id, payload_iv,
          payload_auth_tag, payload_ciphertext, attempt_count, max_attempts
         FROM email_outbox WHERE delivery_status = 'pending'
         AND next_attempt_at <= ? AND attempt_count < max_attempts
         ORDER BY next_attempt_at, outbox_id LIMIT ? FOR UPDATE`,
        [now, this.config.operations.outboxBatchSize]
      );
      if (rows.length) {
        await connection.query(
          `UPDATE email_outbox SET delivery_status = 'processing', locked_at = ?,
           updated_at = ? WHERE outbox_id IN (${rows.map(() => '?').join(',')})`,
          [now, now, ...rows.map((row) => row.outbox_id)]
        );
      }
      await connection.commit();
      return rows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private decrypt(row: OutboxRow): StoredPayload {
    const decipher = createDecipheriv('aes-256-gcm', this.key, row.payload_iv);
    decipher.setAAD(Buffer.from(`${row.message_kind}:${row.aggregate_id}`));
    decipher.setAuthTag(row.payload_auth_tag);
    const plaintext = Buffer.concat([
      decipher.update(row.payload_ciphertext),
      decipher.final()
    ]).toString('utf8');
    return JSON.parse(plaintext) as StoredPayload;
  }

  private async deliver(payload: StoredPayload): Promise<{ messageId: string | null }> {
    if (payload.kind === 'contact_notification') {
      return withTimeout(
        this.dependencies.contactMailer.send(asContactRecord(payload.record)),
        this.config.mail.timeoutMs,
        'Contact notification retry'
      );
    }
    if (payload.kind === 'newsletter_verification') {
      return withTimeout(
        this.dependencies.newsletterMailer.sendVerification(payload.message),
        this.config.mail.timeoutMs,
        'Newsletter verification retry'
      );
    }
    return withTimeout(
      this.dependencies.bookingMailer.sendConfirmation({
        booking: asBookingRecord(payload.message.booking),
        manageUrl: payload.message.manageUrl
      }),
      this.config.mail.timeoutMs,
      'Booking confirmation retry'
    );
  }

  private async recordSourceSent(
    payload: StoredPayload,
    messageId: string | null,
    now: Date
  ): Promise<void> {
    try {
      if (payload.kind === 'contact_notification') {
        await this.dependencies.contactRepository.markNotificationSent(
          payload.notificationId,
          messageId
        );
      } else if (payload.kind === 'newsletter_verification') {
        await this.dependencies.newsletterRepository.markVerificationSent(
          payload.notificationId,
          payload.subscriberId,
          messageId,
          now
        );
      } else {
        await this.dependencies.bookingRepository.markConfirmationSent(
          payload.message.booking.bookingId,
          messageId,
          now
        );
      }
    } catch (error) {
      logger.error('outbox_source_sent_status_failed', {}, error);
    }
  }

  private async recordSourceFailed(
    payload: StoredPayload,
    error: unknown,
    now: Date
  ): Promise<void> {
    const summary = safeErrorSummary(error);
    if (payload.kind === 'contact_notification') {
      await this.dependencies.contactRepository.markNotificationFailed(
        payload.notificationId,
        summary
      );
    } else if (payload.kind === 'newsletter_verification') {
      await this.dependencies.newsletterRepository.markVerificationFailed(
        payload.notificationId,
        payload.subscriberId,
        summary,
        now
      );
    } else {
      await this.dependencies.bookingRepository.markConfirmationFailed(
        payload.message.booking.bookingId,
        summary,
        now
      );
    }
  }
}
