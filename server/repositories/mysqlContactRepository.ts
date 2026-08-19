import type {
  Pool,
  ResultSetHeader,
  RowDataPacket
} from 'mysql2/promise';
import type {
  ContactRepository,
  ContactSubmissionRecord,
  RateLimitScope,
  RateLimitResult
} from '../types.js';

interface RateLimitRow extends RowDataPacket {
  attempt_count: number;
  window_started_at: Date;
}

export class MySqlContactRepository implements ContactRepository {
  constructor(private readonly pool: Pool) {}

  async ping(): Promise<void> {
    await this.pool.query('SELECT 1');
  }

  async consumeRateLimit(input: {
    scope: RateLimitScope;
    keyHash: Buffer;
    limit: number;
    windowSeconds: number;
    now: Date;
  }): Promise<RateLimitResult> {
    const connection = await this.pool.getConnection();
    const boundary = new Date(
      input.now.getTime() - input.windowSeconds * 1000
    );

    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO contact_rate_limits
          (scope, key_hash, window_started_at, attempt_count, updated_at)
         VALUES (?, ?, ?, 1, ?)
         ON DUPLICATE KEY UPDATE
          attempt_count = IF(window_started_at <= ?, 1, attempt_count + 1),
          window_started_at = IF(window_started_at <= ?, ?, window_started_at),
          updated_at = ?`,
        [
          input.scope,
          input.keyHash,
          input.now,
          input.now,
          boundary,
          boundary,
          input.now,
          input.now
        ]
      );
      const [rows] = await connection.execute<RateLimitRow[]>(
        `SELECT attempt_count, window_started_at
         FROM contact_rate_limits
         WHERE scope = ? AND key_hash = ?
         FOR UPDATE`,
        [input.scope, input.keyHash]
      );
      await connection.commit();

      const row = rows[0];
      if (!row) throw new Error('The rate-limit record was not created.');
      const windowStartedAt = new Date(row.window_started_at).getTime();
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil(
          (windowStartedAt + input.windowSeconds * 1000 - input.now.getTime()) /
            1000
        )
      );
      return {
        allowed: row.attempt_count <= input.limit,
        retryAfterSeconds
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async createSubmission(record: ContactSubmissionRecord): Promise<number> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO contact_submissions (
          submission_id,
          solution_type,
          department,
          challenge_text,
          contact_name,
          email,
          email_normalized,
          phone,
          website,
          contact_role,
          source,
          client_ip_hash,
          user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.submissionId,
          record.solutionType,
          record.department,
          record.challengeText,
          record.name,
          record.email,
          record.emailNormalized,
          record.phone,
          record.website,
          record.role,
          record.source,
          record.clientIpHash,
          record.userAgent
        ]
      );

      if (record.referenceFile) {
        await connection.execute(
          `INSERT INTO contact_attachments (
            submission_id,
            original_file_name,
            file_extension,
            detected_mime,
            byte_size,
            sha256,
            file_content
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            record.submissionId,
            record.referenceFile.originalFileName,
            record.referenceFile.extension,
            record.referenceFile.detectedMime,
            record.referenceFile.byteSize,
            record.referenceFile.sha256,
            record.referenceFile.content
          ]
        );
      }

      const [notificationResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO contact_notifications
          (submission_id, delivery_status, attempt_count)
         VALUES (?, 'pending', 0)`,
        [record.submissionId]
      );
      await connection.commit();
      return notificationResult.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async markNotificationSent(
    notificationId: number,
    providerMessageId: string | null
  ): Promise<void> {
    await this.pool.execute(
      `UPDATE contact_notifications
       SET delivery_status = 'sent',
           attempt_count = attempt_count + 1,
           provider_message_id = ?,
           error_message = NULL,
           last_attempt_at = CURRENT_TIMESTAMP(3),
           sent_at = CURRENT_TIMESTAMP(3)
       WHERE notification_id = ?`,
      [providerMessageId, notificationId]
    );
  }

  async markNotificationFailed(
    notificationId: number,
    errorMessage: string
  ): Promise<void> {
    await this.pool.execute(
      `UPDATE contact_notifications
       SET delivery_status = 'failed',
           attempt_count = attempt_count + 1,
           error_message = ?,
           last_attempt_at = CURRENT_TIMESTAMP(3)
       WHERE notification_id = ?`,
      [errorMessage.slice(0, 1000), notificationId]
    );
  }
}
