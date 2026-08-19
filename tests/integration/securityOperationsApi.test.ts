import type { RequestListener } from 'node:http';
import inject from 'light-my-request';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../server/app.js';
import type { RuntimeConfig } from '../../server/config.js';
import type {
  ContactRepository,
  MaintenanceResult,
  MaintenanceRunner,
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

class ContactStub implements ContactRepository {
  async ping() {}
  async consumeRateLimit(): Promise<RateLimitResult> {
    return { allowed: true, retryAfterSeconds: 1 };
  }
  async createSubmission() { return 1; }
  async markNotificationSent() {}
  async markNotificationFailed() {}
}

class MaintenanceStub implements MaintenanceRunner {
  calls = 0;
  async run(): Promise<MaintenanceResult> {
    this.calls += 1;
    return {
      runId: 7,
      rateLimitsDeleted: 2,
      attachmentsDeleted: 1,
      contactsDeleted: 0,
      bookingsDeleted: 0,
      subscribersDeleted: 0,
      outboxDeleted: 3,
      outbox: { claimed: 1, sent: 1, failed: 0, dead: 0 }
    };
  }
}

function appWith(runner: MaintenanceRunner) {
  return createApp({
    config,
    contact: {
      repository: new ContactStub(),
      mailer: { async send() { return { messageId: null }; } }
    },
    maintenance: { runner },
    staticDirectory: false
  });
}

describe('security and operations API', () => {
  it('sends a CSP compatible with current fonts and blocks inline scripts', async () => {
    const response = await inject(appWith(new MaintenanceStub()) as RequestListener, {
      method: 'GET',
      url: '/api/health'
    });
    const csp = String(response.headers['content-security-policy']);

    expect(response.statusCode).toBe(200);
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).toContain('https://fonts.googleapis.com');
    expect(csp).toContain('https://fonts.gstatic.com');
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(response.headers['permissions-policy']).toContain('camera=()');
    expect(response.headers['x-request-id']).toBeTruthy();
    expect(response.headers['cache-control']).toBe('no-store');
  });

  it('keeps maintenance POST-only and rejects missing or incorrect secrets', async () => {
    const runner = new MaintenanceStub();
    const app = appWith(runner);
    const missing = await inject(app as RequestListener, {
      method: 'POST',
      url: '/api/internal/maintenance'
    });
    const wrong = await inject(app as RequestListener, {
      method: 'POST',
      url: '/api/internal/maintenance',
      headers: { authorization: 'Bearer definitely-not-the-secret' }
    });
    const get = await inject(app as RequestListener, {
      method: 'GET',
      url: '/api/internal/maintenance'
    });

    expect(missing.statusCode).toBe(401);
    expect(wrong.statusCode).toBe(401);
    expect(get.statusCode).toBe(404);
    expect(runner.calls).toBe(0);
  });

  it('runs maintenance with the bearer secret and returns non-PII counters', async () => {
    const runner = new MaintenanceStub();
    const response = await inject(appWith(runner) as RequestListener, {
      method: 'POST',
      url: '/api/internal/maintenance',
      headers: {
        authorization: `Bearer ${config.operations.maintenanceSecret}`
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: 'completed',
      runId: 7,
      rateLimitsDeleted: 2,
      attachmentsDeleted: 1,
      outbox: { sent: 1 }
    });
    expect(runner.calls).toBe(1);
    expect(response.body).not.toContain(config.operations.maintenanceSecret);
  });
});
