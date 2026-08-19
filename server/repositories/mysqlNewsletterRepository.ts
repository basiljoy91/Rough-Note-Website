import type {
  Pool,
  ResultSetHeader,
  RowDataPacket
} from 'mysql2/promise';
import type {
  NewsletterRepository,
  NewsletterSubscriptionCandidate,
  NewsletterSubscriptionDecision,
  NewsletterUnsubscribeResult,
  NewsletterVerificationResult
} from '../types.js';

interface SubscriberRow extends RowDataPacket {
  subscriber_id: string;
  email: string;
  subscription_status: 'pending' | 'active' | 'unsubscribed';
  source: string;
  verification_expires_at: Date | null;
  verification_dispatch_started_at: Date | null;
  last_verification_sent_at: Date | null;
}

export class MySqlNewsletterRepository implements NewsletterRepository {
  constructor(private readonly pool: Pool) {}

  async beginSubscription(
    candidate: NewsletterSubscriptionCandidate
  ): Promise<NewsletterSubscriptionDecision> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const [insertResult] = await connection.execute<ResultSetHeader>(
        `INSERT IGNORE INTO newsletter_subscribers (
          subscriber_id,
          email,
          email_normalized,
          subscription_status,
          source,
          subscription_requested_at,
          verification_token_hash,
          verification_expires_at,
          unsubscribe_token_hash,
          verification_dispatch_started_at,
          client_ip_hash,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          candidate.subscriberId,
          candidate.email,
          candidate.emailNormalized,
          candidate.source,
          candidate.now,
          candidate.verificationTokenHash,
          candidate.verificationExpiresAt,
          candidate.unsubscribeTokenHash,
          candidate.now,
          candidate.clientIpHash,
          candidate.now,
          candidate.now
        ]
      );

      if (insertResult.affectedRows === 1) {
        await this.insertConsentEvent(
          connection,
          candidate.subscriberId,
          'requested',
          candidate.source,
          candidate.now
        );
        const notificationId = await this.insertPendingNotification(
          connection,
          candidate.subscriberId,
          candidate.now
        );
        await connection.commit();
        return {
          subscriberId: candidate.subscriberId,
          email: candidate.email,
          shouldSendVerification: true,
          notificationId
        };
      }

      const [rows] = await connection.execute<SubscriberRow[]>(
        `SELECT subscriber_id,
                email,
                subscription_status,
                source,
                verification_expires_at,
                verification_dispatch_started_at,
                last_verification_sent_at
         FROM newsletter_subscribers
         WHERE email_normalized = ?
         FOR UPDATE`,
        [candidate.emailNormalized]
      );
      const existing = rows[0];
      if (!existing) {
        throw new Error('The newsletter subscriber could not be created.');
      }

      if (existing.subscription_status === 'active') {
        await connection.commit();
        return {
          subscriberId: existing.subscriber_id,
          email: existing.email,
          shouldSendVerification: false,
          notificationId: null
        };
      }

      const lastDispatch =
        existing.last_verification_sent_at ??
        existing.verification_dispatch_started_at;
      const cooldownBoundary = new Date(
        candidate.now.getTime() - candidate.resendCooldownSeconds * 1000
      );
      if (
        existing.subscription_status === 'pending' &&
        lastDispatch &&
        new Date(lastDispatch).getTime() > cooldownBoundary.getTime()
      ) {
        await connection.commit();
        return {
          subscriberId: existing.subscriber_id,
          email: existing.email,
          shouldSendVerification: false,
          notificationId: null
        };
      }

      await connection.execute(
        `UPDATE newsletter_subscribers
         SET email = ?,
             subscription_status = 'pending',
             source = ?,
             subscription_requested_at = ?,
             consent_confirmed_at = NULL,
             unsubscribed_at = NULL,
             verification_token_hash = ?,
             verification_expires_at = ?,
             unsubscribe_token_hash = ?,
             verification_dispatch_started_at = ?,
             client_ip_hash = ?,
             updated_at = ?
         WHERE subscriber_id = ?`,
        [
          candidate.email,
          candidate.source,
          candidate.now,
          candidate.verificationTokenHash,
          candidate.verificationExpiresAt,
          candidate.unsubscribeTokenHash,
          candidate.now,
          candidate.clientIpHash,
          candidate.now,
          existing.subscriber_id
        ]
      );
      if (existing.subscription_status === 'unsubscribed') {
        await this.insertConsentEvent(
          connection,
          existing.subscriber_id,
          'requested',
          candidate.source,
          candidate.now
        );
      }
      const notificationId = await this.insertPendingNotification(
        connection,
        existing.subscriber_id,
        candidate.now
      );
      await connection.commit();
      return {
        subscriberId: existing.subscriber_id,
        email: candidate.email,
        shouldSendVerification: true,
        notificationId
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async markVerificationSent(
    notificationId: number,
    subscriberId: string,
    providerMessageId: string | null,
    sentAt: Date
  ): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `UPDATE newsletter_notifications
         SET delivery_status = 'sent',
             provider_message_id = ?,
             error_message = NULL,
             last_attempt_at = ?,
             sent_at = ?
         WHERE notification_id = ? AND subscriber_id = ?`,
        [providerMessageId, sentAt, sentAt, notificationId, subscriberId]
      );
      await connection.execute(
        `UPDATE newsletter_subscribers
         SET last_verification_sent_at = ?,
             verification_dispatch_started_at = NULL,
             updated_at = ?
         WHERE subscriber_id = ?`,
        [sentAt, sentAt, subscriberId]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async markVerificationFailed(
    notificationId: number,
    subscriberId: string,
    errorMessage: string,
    attemptedAt: Date
  ): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `UPDATE newsletter_notifications
         SET delivery_status = 'failed',
             error_message = ?,
             last_attempt_at = ?
         WHERE notification_id = ? AND subscriber_id = ?`,
        [errorMessage.slice(0, 1000), attemptedAt, notificationId, subscriberId]
      );
      await connection.execute(
        `UPDATE newsletter_subscribers
         SET verification_dispatch_started_at = NULL,
             updated_at = ?
         WHERE subscriber_id = ?`,
        [attemptedAt, subscriberId]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async verifyByTokenHash(
    tokenHash: Buffer,
    confirmedAt: Date
  ): Promise<NewsletterVerificationResult> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute<SubscriberRow[]>(
        `SELECT subscriber_id,
                email,
                subscription_status,
                source,
                verification_expires_at,
                verification_dispatch_started_at,
                last_verification_sent_at
         FROM newsletter_subscribers
         WHERE verification_token_hash = ?
         FOR UPDATE`,
        [tokenHash]
      );
      const subscriber = rows[0];
      if (!subscriber) {
        await connection.commit();
        return 'invalid';
      }
      if (subscriber.subscription_status === 'active') {
        await connection.commit();
        return 'already-confirmed';
      }
      if (subscriber.subscription_status === 'unsubscribed') {
        await connection.commit();
        return 'unsubscribed';
      }
      if (
        !subscriber.verification_expires_at ||
        new Date(subscriber.verification_expires_at).getTime() <
          confirmedAt.getTime()
      ) {
        await connection.commit();
        return 'expired';
      }

      await connection.execute(
        `UPDATE newsletter_subscribers
         SET subscription_status = 'active',
             consent_confirmed_at = ?,
             verification_dispatch_started_at = NULL,
             updated_at = ?
         WHERE subscriber_id = ?`,
        [confirmedAt, confirmedAt, subscriber.subscriber_id]
      );
      await this.insertConsentEvent(
        connection,
        subscriber.subscriber_id,
        'confirmed',
        subscriber.source,
        confirmedAt
      );
      await connection.commit();
      return 'confirmed';
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async unsubscribeByTokenHash(
    tokenHash: Buffer,
    unsubscribedAt: Date
  ): Promise<NewsletterUnsubscribeResult> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute<SubscriberRow[]>(
        `SELECT subscriber_id,
                email,
                subscription_status,
                source,
                verification_expires_at,
                verification_dispatch_started_at,
                last_verification_sent_at
         FROM newsletter_subscribers
         WHERE unsubscribe_token_hash = ?
         FOR UPDATE`,
        [tokenHash]
      );
      const subscriber = rows[0];
      if (!subscriber) {
        await connection.commit();
        return 'invalid';
      }
      if (subscriber.subscription_status === 'unsubscribed') {
        await connection.commit();
        return 'already-unsubscribed';
      }

      await connection.execute(
        `UPDATE newsletter_subscribers
         SET subscription_status = 'unsubscribed',
             unsubscribed_at = ?,
             verification_token_hash = NULL,
             verification_expires_at = NULL,
             verification_dispatch_started_at = NULL,
             updated_at = ?
         WHERE subscriber_id = ?`,
        [unsubscribedAt, unsubscribedAt, subscriber.subscriber_id]
      );
      await this.insertConsentEvent(
        connection,
        subscriber.subscriber_id,
        'unsubscribed',
        subscriber.source,
        unsubscribedAt
      );
      await connection.commit();
      return 'unsubscribed';
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private async insertPendingNotification(
    connection: Awaited<ReturnType<Pool['getConnection']>>,
    subscriberId: string,
    createdAt: Date
  ): Promise<number> {
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO newsletter_notifications (
        subscriber_id,
        notification_kind,
        delivery_status,
        created_at
      ) VALUES (?, 'verification', 'pending', ?)`,
      [subscriberId, createdAt]
    );
    return result.insertId;
  }

  private async insertConsentEvent(
    connection: Awaited<ReturnType<Pool['getConnection']>>,
    subscriberId: string,
    eventType: 'requested' | 'confirmed' | 'unsubscribed',
    source: string,
    eventAt: Date
  ): Promise<void> {
    await connection.execute(
      `INSERT INTO newsletter_consent_events
        (subscriber_id, event_type, source, event_at)
       VALUES (?, ?, ?, ?)`,
      [subscriberId, eventType, source, eventAt]
    );
  }
}
