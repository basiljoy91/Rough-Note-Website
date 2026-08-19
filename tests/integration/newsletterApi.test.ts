import { createHash } from 'node:crypto';
import type { RequestListener } from 'node:http';
import inject from 'light-my-request';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../server/app.js';
import type { RuntimeConfig } from '../../server/config.js';
import type {
  ContactRepository,
  NewsletterMailer,
  NewsletterRepository,
  NewsletterSubscriptionCandidate,
  NewsletterSubscriptionDecision,
  NewsletterUnsubscribeResult,
  NewsletterVerificationMessage,
  NewsletterVerificationResult,
  RateLimitResult
} from '../../server/types.js';

const config: RuntimeConfig = {
  environment: 'test',
  port: 3000,
  publicOrigin: 'https://roughnote.test',
  allowedOrigins: new Set(['https://roughnote.test']),
  requireOrigin: true,
  trustProxyHops: 1,
  rateLimit: {
    secret: 'test-rate-limit-secret-that-is-long-enough',
    ipLimit: 5,
    emailLimit: 3,
    windowSeconds: 3600
  },
  newsletter: {
    ipLimit: 10,
    emailLimit: 3,
    rateWindowSeconds: 3600,
    verificationTokenHours: 48,
    resendCooldownSeconds: 900
  },
  scheduler: {
    timezone: 'Asia/Kolkata',
    utcOffsetMinutes: 330,
    weekdays: new Set([1, 2, 3, 4, 5]),
    startHour: 10,
    endHour: 17,
    slotMinutes: 30,
    leadMinutes: 60,
    horizonDays: 60
  },
  googleCalendar: {
    calendarId: 'calendar@example.test',
    clientId: 'client',
    clientSecret: 'secret',
    refreshToken: 'refresh',
    timeoutMs: 1000,
    officeAddress: 'Rough Note Studio'
  },
  database: {
    host: 'localhost',
    port: 3306,
    name: 'test',
    user: 'test',
    password: 'test',
    connectionLimit: 1,
    ssl: false,
    autoMigrate: false
  },
  mail: {
    host: 'smtp.example.test',
    port: 465,
    secure: true,
    user: 'test@example.test',
    password: 'test',
    from: 'test@example.test',
    to: 'studio@example.test',
    timeoutMs: 20
  },
  operations: {
    maintenanceSecret: 'test-maintenance-secret-that-is-long-enough',
    outboxEncryptionKey: '00'.repeat(32),
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

class RateLimiter implements ContactRepository {
  blockedScope = '';
  async ping() {}
  async consumeRateLimit(input: { scope: string }): Promise<RateLimitResult> {
    return { allowed: input.scope !== this.blockedScope, retryAfterSeconds: 60 };
  }
  async createSubmission() { return 1; }
  async markNotificationSent() {}
  async markNotificationFailed() {}
}

class MemoryNewsletterRepository implements NewsletterRepository {
  candidate: NewsletterSubscriptionCandidate | null = null;
  status: 'pending' | 'active' | 'unsubscribed' | null = null;
  sent = 0;
  failed = 0;

  async beginSubscription(
    candidate: NewsletterSubscriptionCandidate
  ): Promise<NewsletterSubscriptionDecision> {
    if (this.candidate && this.status !== 'unsubscribed') {
      return {
        subscriberId: this.candidate.subscriberId,
        email: this.candidate.email,
        shouldSendVerification: false,
        notificationId: null
      };
    }
    this.candidate = candidate;
    this.status = 'pending';
    return {
      subscriberId: candidate.subscriberId,
      email: candidate.email,
      shouldSendVerification: true,
      notificationId: 1
    };
  }
  async markVerificationSent() { this.sent += 1; }
  async markVerificationFailed() { this.failed += 1; }
  async verifyByTokenHash(hash: Buffer): Promise<NewsletterVerificationResult> {
    if (!this.candidate || !hash.equals(this.candidate.verificationTokenHash)) {
      return 'invalid';
    }
    if (this.status === 'active') return 'already-confirmed';
    if (this.status === 'unsubscribed') return 'unsubscribed';
    this.status = 'active';
    return 'confirmed';
  }
  async unsubscribeByTokenHash(hash: Buffer): Promise<NewsletterUnsubscribeResult> {
    if (!this.candidate || !hash.equals(this.candidate.unsubscribeTokenHash)) {
      return 'invalid';
    }
    if (this.status === 'unsubscribed') return 'already-unsubscribed';
    this.status = 'unsubscribed';
    return 'unsubscribed';
  }
}

class MemoryNewsletterMailer implements NewsletterMailer {
  messages: NewsletterVerificationMessage[] = [];
  fail = false;
  async sendVerification(message: NewsletterVerificationMessage) {
    this.messages.push(message);
    if (this.fail) throw new Error('SMTP failed');
    return { messageId: 'newsletter-message' };
  }
}

const verificationToken = 'a'.repeat(43);
const unsubscribeToken = 'b'.repeat(43);

function makeApp(
  repository: MemoryNewsletterRepository,
  mailer: MemoryNewsletterMailer,
  rateLimiter = new RateLimiter()
) {
  let tokenIndex = 0;
  return createApp({
    config,
    contact: {
      repository: rateLimiter,
      mailer: { async send() { return { messageId: null }; } }
    },
    newsletter: {
      repository,
      rateLimiter,
      mailer,
      idFactory: () => 'rn_01NEWSLETTER0000000000000',
      tokenFactory: () => [verificationToken, unsubscribeToken][tokenIndex++] ?? 'c'.repeat(43),
      now: () => new Date('2026-08-19T06:00:00.000Z')
    },
    staticDirectory: false
  });
}

function subscribe(app: ReturnType<typeof createApp>, email = 'reader@example.com') {
  return inject(app as RequestListener, {
    method: 'POST',
    url: '/api/newsletter/subscribe',
    headers: {
      origin: 'https://roughnote.test',
      'content-type': 'application/json'
    },
    payload: JSON.stringify({
      email,
      source: 'rough-note-footer',
      websiteAddress2: ''
    })
  });
}

describe('newsletter double opt-in API', () => {
  let repository: MemoryNewsletterRepository;
  let mailer: MemoryNewsletterMailer;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repository = new MemoryNewsletterRepository();
    mailer = new MemoryNewsletterMailer();
    app = makeApp(repository, mailer);
  });

  it('persists pending consent before accepting and sends opaque links', async () => {
    const response = await subscribe(app);

    expect(response.statusCode).toBe(202);
    expect(response.json()).toEqual({ status: 'accepted' });
    expect(repository.status).toBe('pending');
    expect(repository.candidate?.source).toBe('rough-note-footer');
    expect(repository.candidate?.now.toISOString()).toBe('2026-08-19T06:00:00.000Z');
    expect(repository.sent).toBe(1);
    expect(mailer.messages[0]?.verificationUrl).toContain(verificationToken);
    expect(mailer.messages[0]?.unsubscribeUrl).toContain(unsubscribeToken);
    expect(mailer.messages[0]?.verificationUrl).not.toContain('reader%40');
  });

  it('keeps duplicate subscriptions idempotent', async () => {
    expect((await subscribe(app)).statusCode).toBe(202);
    expect((await subscribe(app, 'READER@example.com')).statusCode).toBe(202);
    expect(mailer.messages).toHaveLength(1);
    expect(repository.sent).toBe(1);
  });

  it('confirms, then unsubscribes without login and stays idempotent', async () => {
    await subscribe(app);
    const verified = await inject(app as RequestListener, {
      method: 'GET',
      url: `/api/newsletter/verify?token=${verificationToken}`
    });
    expect(verified.statusCode).toBe(200);
    expect(repository.status).toBe('active');

    const preview = await inject(app as RequestListener, {
      method: 'GET',
      url: `/api/newsletter/unsubscribe?token=${unsubscribeToken}`
    });
    expect(preview.statusCode).toBe(200);
    expect(repository.status).toBe('active');

    const first = await inject(app as RequestListener, {
      method: 'POST',
      url: `/api/newsletter/unsubscribe?token=${unsubscribeToken}`
    });
    const second = await inject(app as RequestListener, {
      method: 'POST',
      url: `/api/newsletter/unsubscribe?token=${unsubscribeToken}`
    });
    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);
    expect(repository.status).toBe('unsubscribed');
  });

  it('does not report acceptance when the confirmation email fails', async () => {
    mailer.fail = true;
    const response = await subscribe(app);
    expect(response.statusCode).toBe(503);
    expect(repository.failed).toBe(1);
    expect(repository.status).toBe('pending');
  });

  it('stores token hashes rather than raw tokens', async () => {
    await subscribe(app);
    expect(repository.candidate?.verificationTokenHash).toEqual(
      createHash('sha256').update(verificationToken).digest()
    );
    expect(repository.candidate?.unsubscribeTokenHash).toEqual(
      createHash('sha256').update(unsubscribeToken).digest()
    );
  });
});
