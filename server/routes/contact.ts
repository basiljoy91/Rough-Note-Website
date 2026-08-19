import { createHmac } from 'node:crypto';
import { Router, type RequestHandler } from 'express';
import multer from 'multer';
import { ulid } from 'ulid';
import { z } from 'zod';
import {
  CONTACT_ROLES,
  CONTACT_SOURCE,
  DEPARTMENTS,
  MAX_REFERENCE_FILE_SIZE,
  SOLUTION_TYPES
} from '../../src/shared/contact-contract.js';
import type { RuntimeConfig } from '../config.js';
import { createOriginGuard } from '../middleware/originGuard.js';
import {
  ReferenceFileError,
  validateReferenceUpload
} from '../services/fileValidation.js';
import { withTimeout } from '../services/promiseTimeout.js';
import { logger, safeErrorSummary } from '../services/safeLogger.js';
import type {
  ContactMailer,
  ContactRepository,
  ContactSubmissionRecord,
  EmailOutbox
} from '../types.js';

const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

const contactBodySchema = z
  .object({
    solutionType: z.enum(SOLUTION_TYPES),
    department: z.enum(DEPARTMENTS),
    challengeText: z
      .string()
      .trim()
      .min(15, 'Tell us a little more about the challenge (at least 15 characters).')
      .max(5000, 'Keep the challenge description under 5,000 characters.'),
    name: z.string().trim().min(1, 'Please tell us your name.').max(120),
    email: z.string().trim().email('Enter a valid email address.').max(254),
    phone: z.string().trim().max(40).optional().default(''),
    website: z
      .string()
      .trim()
      .max(500)
      .optional()
      .default('')
      .refine(
        (value) => !value || WEBSITE_PATTERN.test(value),
        'Enter a valid website address.'
      ),
    role: z.enum(CONTACT_ROLES),
    source: z.literal(CONTACT_SOURCE),
    companyAddress2: z.string().max(500).optional().default('')
  })
  .strict();

export interface ContactRouteDependencies {
  config: Pick<
    RuntimeConfig,
    'allowedOrigins' | 'requireOrigin' | 'rateLimit' | 'mail'
  >;
  repository: ContactRepository;
  mailer: ContactMailer;
  outbox?: EmailOutbox;
  idFactory?: () => string;
  now?: () => Date;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_REFERENCE_FILE_SIZE,
    files: 1,
    fields: 12,
    parts: 13,
    fieldNameSize: 100,
    fieldSize: 10_000
  }
});

function identifierHash(secret: string, scope: string, value: string): Buffer {
  return createHmac('sha256', secret)
    .update(`${scope}:${value.trim().toLowerCase()}`)
    .digest();
}

function clientAddress(request: Parameters<RequestHandler>[0]): string {
  return request.ip || request.socket.remoteAddress || 'unknown';
}

function validationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'submission');
    errors[field] ??= issue.message;
  }
  return errors;
}

export function createContactRouter(
  dependencies: ContactRouteDependencies
): Router {
  const router = Router();
  const idFactory = dependencies.idFactory ?? (() => `rn_${ulid()}`);
  const now = dependencies.now ?? (() => new Date());

  router.post(
    '/',
    createOriginGuard({
      allowedOrigins: dependencies.config.allowedOrigins,
      requireOrigin: dependencies.config.requireOrigin
    }),
    async (request, response, next) => {
      try {
        const limit = await dependencies.repository.consumeRateLimit({
          scope: 'ip',
          keyHash: identifierHash(
            dependencies.config.rateLimit.secret,
            'ip',
            clientAddress(request)
          ),
          limit: dependencies.config.rateLimit.ipLimit,
          windowSeconds: dependencies.config.rateLimit.windowSeconds,
          now: now()
        });
        if (!limit.allowed) {
          response.set('Retry-After', String(limit.retryAfterSeconds));
          response.status(429).json({
            message: 'Too many contact requests. Please try again later.'
          });
          return;
        }
        next();
      } catch (error) {
        next(error);
      }
    },
    upload.single('referenceFile'),
    async (request, response, next) => {
      try {
        const parsed = contactBodySchema.safeParse(request.body);
        if (!parsed.success) {
          response.status(422).json({ errors: validationErrors(parsed.error) });
          return;
        }

        const body = parsed.data;
        if (body.companyAddress2.trim()) {
          response.status(202).json({ submissionId: idFactory() });
          return;
        }

        const emailLimit = await dependencies.repository.consumeRateLimit({
          scope: 'email',
          keyHash: identifierHash(
            dependencies.config.rateLimit.secret,
            'email',
            body.email
          ),
          limit: dependencies.config.rateLimit.emailLimit,
          windowSeconds: dependencies.config.rateLimit.windowSeconds,
          now: now()
        });
        if (!emailLimit.allowed) {
          response.set('Retry-After', String(emailLimit.retryAfterSeconds));
          response.status(429).json({
            message: 'Too many contact requests. Please try again later.'
          });
          return;
        }

        const referenceFile = await validateReferenceUpload(request.file);
        const record: ContactSubmissionRecord = {
          submissionId: idFactory(),
          solutionType: body.solutionType,
          department: body.department,
          challengeText: body.challengeText,
          name: body.name,
          email: body.email,
          emailNormalized: body.email.toLowerCase(),
          phone: body.phone || null,
          website: body.website || null,
          role: body.role,
          source: body.source,
          clientIpHash: identifierHash(
            dependencies.config.rateLimit.secret,
            'stored-ip',
            clientAddress(request)
          ),
          userAgent: request.get('user-agent')?.slice(0, 500) || null,
          referenceFile
        };

        const notificationId = await dependencies.repository.createSubmission(
          record
        );
        const queued = dependencies.outbox
          ? await dependencies.outbox.enqueueContact(notificationId, record, now())
          : null;

        let delivery: { messageId: string | null };
        try {
          delivery = await withTimeout(
            dependencies.mailer.send(record),
            dependencies.config.mail.timeoutMs,
            'Notification'
          );
        } catch (deliveryError) {
          try {
            await dependencies.repository.markNotificationFailed(
              notificationId,
              safeErrorSummary(deliveryError)
            );
          } catch (statusError) {
            logger.error('contact_failure_status_failed', {}, statusError);
          }
          if (queued && dependencies.outbox) {
            try {
              await dependencies.outbox.markFailed(
                queued.outboxId,
                deliveryError,
                now()
              );
            } catch (outboxError) {
              logger.error('contact_outbox_failure_status_failed', {}, outboxError);
            }
          }
          response.status(202).json({ submissionId: record.submissionId });
          return;
        }

        if (queued && dependencies.outbox) {
          try {
            await dependencies.outbox.markSent(
              queued.outboxId,
              delivery.messageId,
              now()
            );
          } catch (outboxError) {
            logger.error('contact_outbox_sent_status_failed', {}, outboxError);
          }
        }
        try {
          await dependencies.repository.markNotificationSent(
            notificationId,
            delivery.messageId
          );
          response.status(201).json({ submissionId: record.submissionId });
        } catch (statusError) {
          logger.error('contact_sent_status_failed', {}, statusError);
          response.status(202).json({ submissionId: record.submissionId });
        }
      } catch (error) {
        if (error instanceof ReferenceFileError) {
          response.status(422).json({
            errors: { referenceFile: error.message }
          });
          return;
        }
        next(error);
      }
    }
  );

  return router;
}
