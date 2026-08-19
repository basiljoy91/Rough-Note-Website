import type { RequestListener } from 'node:http';
import FormData from 'form-data';
import { strToU8, zipSync } from 'fflate';
import inject from 'light-my-request';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../server/app.js';
import type { RuntimeConfig } from '../../server/config.js';
import type {
  ContactMailer,
  ContactRepository,
  ContactSubmissionRecord,
  RateLimitScope,
  RateLimitResult
} from '../../server/types.js';

class MemoryContactRepository implements ContactRepository {
  submissions: ContactSubmissionRecord[] = [];
  sent: Array<{ notificationId: number; messageId: string | null }> = [];
  failed: Array<{ notificationId: number; message: string }> = [];
  blockedScope: 'ip' | 'email' | null = null;
  failPersistence = false;
  private notificationId = 0;

  async ping() {}

  async consumeRateLimit(input: {
    scope: RateLimitScope;
  }): Promise<RateLimitResult> {
    return {
      allowed: input.scope !== this.blockedScope,
      retryAfterSeconds: 900
    };
  }

  async createSubmission(record: ContactSubmissionRecord): Promise<number> {
    if (this.failPersistence) throw new Error('database unavailable');
    this.submissions.push(record);
    this.notificationId += 1;
    return this.notificationId;
  }

  async markNotificationSent(
    notificationId: number,
    providerMessageId: string | null
  ) {
    this.sent.push({ notificationId, messageId: providerMessageId });
  }

  async markNotificationFailed(notificationId: number, errorMessage: string) {
    this.failed.push({ notificationId, message: errorMessage });
  }
}

class MemoryMailer implements ContactMailer {
  records: ContactSubmissionRecord[] = [];
  behavior: 'send' | 'fail' | 'hang' = 'send';

  async send(record: ContactSubmissionRecord) {
    this.records.push(record);
    if (this.behavior === 'fail') throw new Error('SMTP is unavailable');
    if (this.behavior === 'hang') {
      return await new Promise<{ messageId: string | null }>(() => {});
    }
    return { messageId: 'smtp-message-1' };
  }
}

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
    clientId: 'client-id',
    clientSecret: 'client-secret',
    refreshToken: 'refresh-token',
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

const validFields = {
  solutionType: 'Website',
  department: 'Marketing',
  challengeText: 'We need a clearer conversion journey for our customers.',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '+91 90000 00000',
  website: 'roughnote.example',
  role: 'Founder / Owner',
  source: 'rough-note-contact-journey',
  companyAddress2: ''
};

const fileSamples = {
  jpg: Buffer.from('ffd8ffe000104a4649460001', 'hex'),
  jpeg: Buffer.from('ffd8ffe000104a4649460001', 'hex'),
  png: Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex'),
  webp: Buffer.from('52494646100000005745425056503820', 'hex'),
  pdf: Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF'),
  doc: Buffer.from('d0cf11e0a1b11ae10000000000000000', 'hex'),
  docx: Buffer.from(
    zipSync({
      '[Content_Types].xml': strToU8(
        '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'
      ),
      '_rels/.rels': strToU8(
        '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>'
      ),
      'word/document.xml': strToU8(
        '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body/></w:document>'
      )
    })
  )
} as const;

function makeApplication(
  repository: MemoryContactRepository,
  mailer: MemoryMailer
) {
  let id = 0;
  return createApp({
    config,
    contact: {
      repository,
      mailer,
      idFactory: () => `rn_01TESTCONTACT${String(++id).padStart(12, '0')}`
    },
    staticDirectory: false
  });
}

async function postContact(
  app: ReturnType<typeof createApp>,
  options: {
    fields?: Record<string, string>;
    file?: { content: Buffer; fileName: string };
    origin?: string;
  } = {}
) {
  const form = new FormData();
  for (const [field, value] of Object.entries(options.fields ?? validFields)) {
    form.append(field, value);
  }
  if (options.file) {
    form.append('referenceFile', options.file.content, {
      filename: options.file.fileName,
      contentType: 'application/octet-stream',
      knownLength: options.file.content.length
    });
  }
  const payload = form.getBuffer();
  return inject(app as RequestListener, {
    method: 'POST',
    url: '/api/contact',
    remoteAddress: '127.0.0.1',
    headers: {
      ...form.getHeaders(),
      'content-length': String(payload.length),
      origin: options.origin ?? 'https://roughnote.test'
    },
    payload
  });
}

describe('POST /api/contact', () => {
  let repository: MemoryContactRepository;
  let mailer: MemoryMailer;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repository = new MemoryContactRepository();
    mailer = new MemoryMailer();
    app = makeApplication(repository, mailer);
  });

  it('persists before returning an identifier and records sent email', async () => {
    const response = await postContact(app);
    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body.submissionId).toMatch(/^rn_/);
    expect(repository.submissions).toHaveLength(1);
    expect(repository.submissions[0]?.submissionId).toBe(body.submissionId);
    expect(mailer.records).toHaveLength(1);
    expect(repository.sent).toEqual([
      { notificationId: 1, messageId: 'smtp-message-1' }
    ]);
  });

  it.each(Object.keys(fileSamples) as Array<keyof typeof fileSamples>)(
    'accepts a genuine .%s upload and stores its verified metadata',
    async (extension) => {
      const response = await postContact(app, {
        file: {
          content: fileSamples[extension],
          fileName: `reference.${extension}`
        }
      });

      expect(response.statusCode).toBe(201);
      expect(response.json().submissionId).toMatch(/^rn_/);
      const storedFile = repository.submissions[0]?.referenceFile;
      expect(storedFile?.extension).toBe(extension);
      expect(storedFile?.byteSize).toBe(fileSamples[extension].length);
      expect(storedFile?.sha256).toHaveLength(32);
    }
  );

  it('rejects a file whose signature and extension disagree', async () => {
    const response = await postContact(app, {
      file: { content: fileSamples.pdf, fileName: 'false-photo.jpg' }
    });

    expect(response.statusCode).toBe(422);
    expect(response.json().errors.referenceFile).toMatch(/contents do not match/);
    expect(repository.submissions).toHaveLength(0);
  });

  it('treats a truncated archive as a validation error, not a server failure', async () => {
    const response = await postContact(app, {
      file: {
        content: Buffer.from('504b030414000000', 'hex'),
        fileName: 'broken.docx'
      }
    });

    expect(response.statusCode).toBe(422);
    expect(response.json().errors.referenceFile).toMatch(/contents do not match/);
    expect(repository.submissions).toHaveLength(0);
  });

  it('rejects an upload larger than 5 MB', async () => {
    const response = await postContact(app, {
      file: {
        content: Buffer.alloc(5 * 1024 * 1024 + 1),
        fileName: 'too-large.pdf'
      }
    });

    expect(response.statusCode).toBe(413);
    expect(response.json().errors.referenceFile).toMatch(/5 MB or smaller/);
    expect(repository.submissions).toHaveLength(0);
  });

  it('repeats browser validation server-side', async () => {
    const response = await postContact(app, {
      fields: {
        ...validFields,
        solutionType: 'Invented solution',
        challengeText: 'too short',
        email: 'not-an-email'
      }
    });
    const errors = response.json().errors;

    expect(response.statusCode).toBe(422);
    expect(errors).toMatchObject({
      solutionType: expect.any(String),
      challengeText: expect.any(String),
      email: 'Enter a valid email address.'
    });
    expect(repository.submissions).toHaveLength(0);
  });

  it('blocks requests from an unapproved origin', async () => {
    const response = await postContact(app, {
      origin: 'https://attacker.example'
    });

    expect(response.statusCode).toBe(403);
    expect(repository.submissions).toHaveLength(0);
  });

  it('silently absorbs honeypot submissions without persistence or email', async () => {
    const response = await postContact(app, {
      fields: { ...validFields, companyAddress2: 'filled by a bot' }
    });

    expect(response.statusCode).toBe(202);
    expect(response.json().submissionId).toMatch(/^rn_/);
    expect(repository.submissions).toHaveLength(0);
    expect(mailer.records).toHaveLength(0);
  });

  it.each(['ip', 'email'] as const)(
    'enforces the MySQL-backed %s rate-limit decision',
    async (scope) => {
      repository.blockedScope = scope;
      const response = await postContact(app);

      expect(response.statusCode).toBe(429);
      expect(response.headers['retry-after']).toBe('900');
      expect(repository.submissions).toHaveLength(0);
    }
  );

  it('does not notify or return an identifier when persistence fails', async () => {
    repository.failPersistence = true;
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await postContact(app);

    expect(response.statusCode).toBe(500);
    expect(response.json().submissionId).toBeUndefined();
    expect(mailer.records).toHaveLength(0);
  });

  it('returns the durable identifier and records a failed email delivery', async () => {
    mailer.behavior = 'fail';
    const response = await postContact(app);

    expect(response.statusCode).toBe(202);
    expect(response.json().submissionId).toMatch(/^rn_/);
    expect(repository.submissions).toHaveLength(1);
    expect(repository.failed[0]?.message).toContain('SMTP is unavailable');
  });

  it('bounds a hanging email attempt and records the timeout', async () => {
    mailer.behavior = 'hang';
    const response = await postContact(app);

    expect(response.statusCode).toBe(202);
    expect(response.json().submissionId).toMatch(/^rn_/);
    expect(repository.failed[0]?.message).toContain('timed out');
  });
});
