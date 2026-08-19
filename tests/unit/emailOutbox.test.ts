import type { Pool } from 'mysql2/promise';
import { describe, expect, it, vi } from 'vitest';
import type { RuntimeConfig } from '../../server/config.js';
import { MySqlEmailOutbox } from '../../server/services/emailOutbox.js';

const config: Pick<RuntimeConfig, 'operations' | 'mail'> = {
  mail: {
    host: 'smtp.example.test',
    port: 465,
    secure: true,
    user: 'website@example.test',
    password: 'mail-password',
    from: 'website@example.test',
    to: 'studio@example.test',
    timeoutMs: 1000
  },
  operations: {
    maintenanceSecret: 'test-maintenance-secret-that-is-long-enough',
    outboxEncryptionKey: 'ab'.repeat(32),
    outboxBatchSize: 25,
    outboxMaxAttempts: 6,
    outboxRetryBaseSeconds: 300,
    outboxLockTimeoutSeconds: 900,
    rateLimitRetentionDays: 2,
    attachmentRetentionDays: 30,
    contactRetentionDays: 365,
    bookingRetentionDays: 365,
    newsletterPendingRetentionDays: 7,
    newsletterUnsubscribedRetentionDays: 90,
    outboxSentRetentionDays: 30,
    outboxDeadRetentionDays: 90,
    maintenanceRunRetentionDays: 180
  }
};

function outboxWith(pool: Pool) {
  return new MySqlEmailOutbox(
    pool,
    config,
    {} as ConstructorParameters<typeof MySqlEmailOutbox>[2]
  );
}

describe('encrypted email outbox', () => {
  it('persists newsletter addresses and tokens only as AES-GCM ciphertext', async () => {
    const execute = vi.fn().mockResolvedValue([{ insertId: 17 }, []]);
    const outbox = outboxWith({ execute } as unknown as Pool);
    const now = new Date('2026-08-19T00:00:00.000Z');
    const verificationUrl =
      'https://roughnote.test/api/newsletter/verify?token=verification-secret';

    const result = await outbox.enqueueNewsletter(
      9,
      'rn_01TESTSUBSCRIBER0000000000',
      {
        email: 'person@example.com',
        verificationUrl,
        unsubscribeUrl:
          'https://roughnote.test/api/newsletter/unsubscribe?token=unsubscribe-secret'
      },
      now
    );

    expect(result).toEqual({ outboxId: 17 });
    const values = execute.mock.calls[0]?.[1] as unknown[];
    const iv = values[3] as Buffer;
    const authTag = values[4] as Buffer;
    const ciphertext = values[5] as Buffer;
    expect(iv).toHaveLength(12);
    expect(authTag).toHaveLength(16);
    expect(ciphertext.toString('utf8')).not.toContain('person@example.com');
    expect(ciphertext.toString('utf8')).not.toContain('verification-secret');
    expect(values).not.toContain(verificationUrl);
  });

  it('redacts delivery errors and schedules bounded exponential retry', async () => {
    const execute = vi
      .fn()
      .mockResolvedValueOnce([[{ attempt_count: 0, max_attempts: 6 }], []])
      .mockResolvedValueOnce([{ affectedRows: 1 }, []]);
    const outbox = outboxWith({ execute } as unknown as Pool);
    const attemptedAt = new Date('2026-08-19T00:00:00.000Z');

    await outbox.markFailed(
      17,
      Object.assign(
        new Error('SMTP rejected person@example.com password=mail-secret'),
        { code: 'EAUTH' }
      ),
      attemptedAt
    );

    const values = execute.mock.calls[1]?.[1] as unknown[];
    expect(values[0]).toBe('pending');
    expect(values[1]).toBe(1);
    expect((values[2] as Date).toISOString()).toBe('2026-08-19T00:05:00.000Z');
    expect(values[3]).toBe('EAUTH');
    expect(String(values[4])).not.toContain('person@example.com');
    expect(String(values[4])).not.toContain('mail-secret');
  });
});
