import { z } from 'zod';

const booleanValue = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

const integerValue = (fallback: number, minimum = 1) =>
  z.coerce.number().int().min(minimum).default(fallback);

const rangedInteger = (fallback: number, minimum: number, maximum: number) =>
  z.coerce.number().int().min(minimum).max(maximum).default(fallback);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: integerValue(3000),
  APP_ORIGIN: z.string().url(),
  ALLOWED_ORIGINS: z.string().optional(),
  CONTACT_REQUIRE_ORIGIN: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  TRUST_PROXY_HOPS: integerValue(1, 0),
  RATE_LIMIT_SECRET: z.string().min(32),
  CONTACT_IP_LIMIT: integerValue(5),
  CONTACT_EMAIL_LIMIT: integerValue(3),
  CONTACT_RATE_WINDOW_SECONDS: integerValue(3600),
  NEWSLETTER_IP_LIMIT: integerValue(10),
  NEWSLETTER_EMAIL_LIMIT: integerValue(3),
  NEWSLETTER_RATE_WINDOW_SECONDS: integerValue(3600),
  NEWSLETTER_VERIFY_TOKEN_HOURS: integerValue(48),
  NEWSLETTER_RESEND_COOLDOWN_SECONDS: integerValue(900),
  SCHEDULER_TIMEZONE: z.string().min(1).default('Asia/Kolkata'),
  SCHEDULER_UTC_OFFSET_MINUTES: rangedInteger(330, -720, 840),
  SCHEDULER_WEEKDAYS: z
    .string()
    .regex(/^[0-6](,[0-6])*$/)
    .default('1,2,3,4,5'),
  SCHEDULER_START_HOUR: rangedInteger(10, 0, 23),
  SCHEDULER_END_HOUR: rangedInteger(17, 1, 24),
  SCHEDULER_SLOT_MINUTES: rangedInteger(30, 15, 240),
  SCHEDULER_LEAD_MINUTES: rangedInteger(60, 0, 10080),
  SCHEDULER_HORIZON_DAYS: rangedInteger(60, 1, 365),
  GOOGLE_CALENDAR_ID: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REFRESH_TOKEN: z.string().min(1),
  GOOGLE_API_TIMEOUT_MS: integerValue(8000, 1000),
  STUDIO_OFFICE_ADDRESS: z.string().min(1).default('Rough Note Studio'),
  DB_HOST: z.string().min(1),
  DB_PORT: integerValue(3306),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string(),
  DB_CONNECTION_LIMIT: integerValue(5, 2),
  DB_SSL: booleanValue,
  DB_AUTO_MIGRATE: booleanValue,
  SMTP_HOST: z.string().min(1).default('smtp.hostinger.com'),
  SMTP_PORT: integerValue(465),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  MAIL_FROM: z.string().min(3),
  CONTACT_TO_EMAIL: z.string().email(),
  MAIL_TIMEOUT_MS: integerValue(8000, 1000),
  MAINTENANCE_SECRET: z.string().min(32),
  OUTBOX_ENCRYPTION_KEY: z.string().regex(/^[a-fA-F0-9]{64}$/),
  OUTBOX_BATCH_SIZE: rangedInteger(25, 1, 100),
  OUTBOX_MAX_ATTEMPTS: rangedInteger(6, 1, 20),
  OUTBOX_RETRY_BASE_SECONDS: rangedInteger(300, 30, 86400),
  OUTBOX_LOCK_TIMEOUT_SECONDS: rangedInteger(900, 60, 86400),
  RATE_LIMIT_RETENTION_DAYS: rangedInteger(2, 1, 30),
  ATTACHMENT_RETENTION_DAYS: rangedInteger(30, 1, 365),
  CONTACT_RETENTION_DAYS: rangedInteger(365, 30, 3650),
  BOOKING_RETENTION_DAYS: rangedInteger(365, 30, 3650),
  NEWSLETTER_PENDING_RETENTION_DAYS: rangedInteger(7, 2, 365),
  NEWSLETTER_UNSUBSCRIBED_RETENTION_DAYS: rangedInteger(90, 7, 3650),
  OUTBOX_SENT_RETENTION_DAYS: rangedInteger(30, 1, 365),
  OUTBOX_DEAD_RETENTION_DAYS: rangedInteger(90, 7, 3650),
  MAINTENANCE_RUN_RETENTION_DAYS: rangedInteger(180, 30, 3650)
});

export interface RuntimeConfig {
  environment: 'development' | 'test' | 'production';
  port: number;
  publicOrigin: string;
  allowedOrigins: ReadonlySet<string>;
  requireOrigin: boolean;
  trustProxyHops: number;
  rateLimit: {
    secret: string;
    ipLimit: number;
    emailLimit: number;
    windowSeconds: number;
  };
  newsletter: {
    ipLimit: number;
    emailLimit: number;
    rateWindowSeconds: number;
    verificationTokenHours: number;
    resendCooldownSeconds: number;
  };
  scheduler: {
    timezone: string;
    utcOffsetMinutes: number;
    weekdays: ReadonlySet<number>;
    startHour: number;
    endHour: number;
    slotMinutes: number;
    leadMinutes: number;
    horizonDays: number;
  };
  googleCalendar: {
    calendarId: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    timeoutMs: number;
    officeAddress: string;
  };
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    connectionLimit: number;
    ssl: boolean;
    autoMigrate: boolean;
  };
  mail: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
    to: string;
    timeoutMs: number;
  };
  operations: {
    maintenanceSecret: string;
    outboxEncryptionKey: string;
    outboxBatchSize: number;
    outboxMaxAttempts: number;
    outboxRetryBaseSeconds: number;
    outboxLockTimeoutSeconds: number;
    rateLimitRetentionDays: number;
    attachmentRetentionDays: number;
    contactRetentionDays: number;
    bookingRetentionDays: number;
    newsletterPendingRetentionDays: number;
    newsletterUnsubscribedRetentionDays: number;
    outboxSentRetentionDays: number;
    outboxDeadRetentionDays: number;
    maintenanceRunRetentionDays: number;
  };
}

function asOrigin(value: string): string {
  return new URL(value).origin;
}

export function loadRuntimeConfig(
  environment: NodeJS.ProcessEnv = process.env
): RuntimeConfig {
  const parsed = envSchema.safeParse(environment);
  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid server configuration: ${missing}`);
  }

  const env = parsed.data;
  if (env.SCHEDULER_END_HOUR <= env.SCHEDULER_START_HOUR) {
    throw new Error(
      'Invalid server configuration: SCHEDULER_END_HOUR must be later than SCHEDULER_START_HOUR.'
    );
  }
  const configuredOrigins = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(asOrigin);

  return {
    environment: env.NODE_ENV,
    port: env.PORT,
    publicOrigin: asOrigin(env.APP_ORIGIN),
    allowedOrigins: new Set([asOrigin(env.APP_ORIGIN), ...configuredOrigins]),
    requireOrigin: env.CONTACT_REQUIRE_ORIGIN,
    trustProxyHops: env.TRUST_PROXY_HOPS,
    rateLimit: {
      secret: env.RATE_LIMIT_SECRET,
      ipLimit: env.CONTACT_IP_LIMIT,
      emailLimit: env.CONTACT_EMAIL_LIMIT,
      windowSeconds: env.CONTACT_RATE_WINDOW_SECONDS
    },
    newsletter: {
      ipLimit: env.NEWSLETTER_IP_LIMIT,
      emailLimit: env.NEWSLETTER_EMAIL_LIMIT,
      rateWindowSeconds: env.NEWSLETTER_RATE_WINDOW_SECONDS,
      verificationTokenHours: env.NEWSLETTER_VERIFY_TOKEN_HOURS,
      resendCooldownSeconds: env.NEWSLETTER_RESEND_COOLDOWN_SECONDS
    },
    scheduler: {
      timezone: env.SCHEDULER_TIMEZONE,
      utcOffsetMinutes: env.SCHEDULER_UTC_OFFSET_MINUTES,
      weekdays: new Set(env.SCHEDULER_WEEKDAYS.split(',').map(Number)),
      startHour: env.SCHEDULER_START_HOUR,
      endHour: env.SCHEDULER_END_HOUR,
      slotMinutes: env.SCHEDULER_SLOT_MINUTES,
      leadMinutes: env.SCHEDULER_LEAD_MINUTES,
      horizonDays: env.SCHEDULER_HORIZON_DAYS
    },
    googleCalendar: {
      calendarId: env.GOOGLE_CALENDAR_ID,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      refreshToken: env.GOOGLE_REFRESH_TOKEN,
      timeoutMs: env.GOOGLE_API_TIMEOUT_MS,
      officeAddress: env.STUDIO_OFFICE_ADDRESS
    },
    database: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      name: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      connectionLimit: env.DB_CONNECTION_LIMIT,
      ssl: env.DB_SSL,
      autoMigrate: env.DB_AUTO_MIGRATE
    },
    mail: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      user: env.SMTP_USER,
      password: env.SMTP_PASSWORD,
      from: env.MAIL_FROM,
      to: env.CONTACT_TO_EMAIL,
      timeoutMs: env.MAIL_TIMEOUT_MS
    },
    operations: {
      maintenanceSecret: env.MAINTENANCE_SECRET,
      outboxEncryptionKey: env.OUTBOX_ENCRYPTION_KEY,
      outboxBatchSize: env.OUTBOX_BATCH_SIZE,
      outboxMaxAttempts: env.OUTBOX_MAX_ATTEMPTS,
      outboxRetryBaseSeconds: env.OUTBOX_RETRY_BASE_SECONDS,
      outboxLockTimeoutSeconds: env.OUTBOX_LOCK_TIMEOUT_SECONDS,
      rateLimitRetentionDays: env.RATE_LIMIT_RETENTION_DAYS,
      attachmentRetentionDays: env.ATTACHMENT_RETENTION_DAYS,
      contactRetentionDays: env.CONTACT_RETENTION_DAYS,
      bookingRetentionDays: env.BOOKING_RETENTION_DAYS,
      newsletterPendingRetentionDays: env.NEWSLETTER_PENDING_RETENTION_DAYS,
      newsletterUnsubscribedRetentionDays:
        env.NEWSLETTER_UNSUBSCRIBED_RETENTION_DAYS,
      outboxSentRetentionDays: env.OUTBOX_SENT_RETENTION_DAYS,
      outboxDeadRetentionDays: env.OUTBOX_DEAD_RETENTION_DAYS,
      maintenanceRunRetentionDays: env.MAINTENANCE_RUN_RETENTION_DAYS
    }
  };
}
