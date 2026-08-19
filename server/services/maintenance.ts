import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { RuntimeConfig } from '../config.js';
import type {
  EmailOutbox,
  MaintenanceResult,
  MaintenanceRunner
} from '../types.js';
import { logger } from './safeLogger.js';

function daysBefore(now: Date, days: number): Date {
  return new Date(now.getTime() - days * 86_400_000);
}

function operationalErrorCode(error: unknown): string {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return 'MAINTENANCE_FAILED';
  }
  const code = String(error.code);
  return /^[A-Z0-9_-]{2,80}$/i.test(code) ? code : 'MAINTENANCE_FAILED';
}

export class MySqlMaintenanceRunner implements MaintenanceRunner {
  constructor(
    private readonly pool: Pool,
    private readonly outbox: EmailOutbox,
    private readonly config: RuntimeConfig['operations']
  ) {}

  async run(now: Date): Promise<MaintenanceResult> {
    const connection = await this.pool.getConnection();
    let lockAcquired = false;
    let runId = 0;
    try {
      const [lockRows] = await connection.query<RowDataPacket[]>(
        "SELECT GET_LOCK('rough_note_maintenance', 0) AS acquired"
      );
      lockAcquired = Number(lockRows[0]?.acquired) === 1;
      if (!lockAcquired) {
        throw Object.assign(new Error('A maintenance run is already active.'), {
          code: 'MAINTENANCE_LOCKED'
        });
      }

      const [run] = await connection.execute<ResultSetHeader>(
        `INSERT INTO maintenance_runs (run_status, started_at)
         VALUES ('running', ?)`,
        [now]
      );
      runId = run.insertId;

      const outbox = await this.outbox.retryDue(now);
      const rateLimitsDeleted = await this.delete(
        connection,
        'DELETE FROM contact_rate_limits WHERE updated_at < ?',
        [daysBefore(now, this.config.rateLimitRetentionDays)]
      );
      const attachmentsDeleted = await this.delete(
        connection,
        'DELETE FROM contact_attachments WHERE created_at < ?',
        [daysBefore(now, this.config.attachmentRetentionDays)]
      );

      let outboxDeleted = 0;
      outboxDeleted += await this.delete(
        connection,
        `DELETE FROM email_outbox WHERE
          (delivery_status = 'sent' AND updated_at < ?)
          OR (delivery_status = 'dead' AND updated_at < ?)`,
        [
          daysBefore(now, this.config.outboxSentRetentionDays),
          daysBefore(now, this.config.outboxDeadRetentionDays)
        ]
      );

      const contactCutoff = daysBefore(now, this.config.contactRetentionDays);
      outboxDeleted += await this.delete(
        connection,
        `DELETE o FROM email_outbox AS o
         JOIN contact_submissions AS c ON o.aggregate_id = c.submission_id
         WHERE o.message_kind = 'contact_notification' AND c.received_at < ?`,
        [contactCutoff]
      );
      const contactsDeleted = await this.delete(
        connection,
        'DELETE FROM contact_submissions WHERE received_at < ?',
        [contactCutoff]
      );

      const bookingCutoff = daysBefore(now, this.config.bookingRetentionDays);
      outboxDeleted += await this.delete(
        connection,
        `DELETE o FROM email_outbox AS o
         JOIN bookings AS b ON o.aggregate_id = b.booking_id
         WHERE o.message_kind = 'booking_confirmation' AND b.ends_at < ?
         AND b.booking_status IN ('confirmed', 'cancelled')`,
        [bookingCutoff]
      );
      const bookingsDeleted = await this.delete(
        connection,
        `DELETE FROM bookings WHERE ends_at < ?
         AND booking_status IN ('confirmed', 'cancelled')`,
        [bookingCutoff]
      );

      const pendingCutoff = daysBefore(
        now,
        this.config.newsletterPendingRetentionDays
      );
      const unsubscribedCutoff = daysBefore(
        now,
        this.config.newsletterUnsubscribedRetentionDays
      );
      outboxDeleted += await this.delete(
        connection,
        `DELETE o FROM email_outbox AS o
         JOIN newsletter_subscribers AS s ON o.aggregate_id = s.subscriber_id
         WHERE o.message_kind = 'newsletter_verification' AND
         ((s.subscription_status = 'pending' AND s.updated_at < ?)
          OR (s.subscription_status = 'unsubscribed' AND s.unsubscribed_at < ?))`,
        [pendingCutoff, unsubscribedCutoff]
      );
      const subscribersDeleted = await this.delete(
        connection,
        `DELETE FROM newsletter_subscribers WHERE
         (subscription_status = 'pending' AND updated_at < ?)
         OR (subscription_status = 'unsubscribed' AND unsubscribed_at < ?)`,
        [pendingCutoff, unsubscribedCutoff]
      );

      await this.delete(
        connection,
        'DELETE FROM maintenance_runs WHERE started_at < ? AND maintenance_run_id <> ?',
        [daysBefore(now, this.config.maintenanceRunRetentionDays), runId]
      );

      await connection.execute(
        `UPDATE maintenance_runs SET run_status = 'completed',
         rate_limits_deleted = ?, attachments_deleted = ?, contacts_deleted = ?,
         bookings_deleted = ?, subscribers_deleted = ?, outbox_deleted = ?,
         outbox_sent = ?, outbox_failed = ?, finished_at = ?
         WHERE maintenance_run_id = ?`,
        [
          rateLimitsDeleted,
          attachmentsDeleted,
          contactsDeleted,
          bookingsDeleted,
          subscribersDeleted,
          outboxDeleted,
          outbox.sent,
          outbox.failed,
          new Date(),
          runId
        ]
      );

      return {
        runId,
        rateLimitsDeleted,
        attachmentsDeleted,
        contactsDeleted,
        bookingsDeleted,
        subscribersDeleted,
        outboxDeleted,
        outbox
      };
    } catch (error) {
      if (runId) {
        try {
          await connection.execute(
            `UPDATE maintenance_runs SET run_status = 'failed', error_code = ?,
             finished_at = ? WHERE maintenance_run_id = ?`,
            [operationalErrorCode(error), new Date(), runId]
          );
        } catch (statusError) {
          logger.error('maintenance_status_update_failed', {}, statusError);
        }
      }
      throw error;
    } finally {
      if (lockAcquired) {
        await connection.query("SELECT RELEASE_LOCK('rough_note_maintenance')");
      }
      connection.release();
    }
  }

  private async delete(
    connection: Awaited<ReturnType<Pool['getConnection']>>,
    sql: string,
    values: Array<string | number | Date>
  ): Promise<number> {
    const [result] = await connection.execute<ResultSetHeader>(sql, values);
    return result.affectedRows;
  }
}
