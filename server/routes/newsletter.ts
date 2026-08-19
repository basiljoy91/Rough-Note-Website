import { createHash, createHmac, randomBytes } from 'node:crypto';
import { json, Router, type Request, type Response } from 'express';
import { ulid } from 'ulid';
import { z } from 'zod';
import type { RuntimeConfig } from '../config.js';
import { createOriginGuard } from '../middleware/originGuard.js';
import { withTimeout } from '../services/promiseTimeout.js';
import { logger, safeErrorSummary } from '../services/safeLogger.js';
import type {
  ContactRepository,
  EmailOutbox,
  NewsletterMailer,
  NewsletterRepository
} from '../types.js';

const NEWSLETTER_SOURCE = 'rough-note-footer' as const;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43,128}$/;

const subscribeSchema = z
  .object({
    email: z.string().trim().email('Enter a valid email address.').max(254),
    source: z.literal(NEWSLETTER_SOURCE),
    websiteAddress2: z.string().max(500).optional().default('')
  })
  .strict();

export interface NewsletterRouteDependencies {
  config: Pick<
    RuntimeConfig,
    | 'allowedOrigins'
    | 'requireOrigin'
    | 'rateLimit'
    | 'newsletter'
    | 'mail'
    | 'publicOrigin'
  >;
  repository: NewsletterRepository;
  rateLimiter: Pick<ContactRepository, 'consumeRateLimit'>;
  mailer: NewsletterMailer;
  outbox?: EmailOutbox;
  idFactory?: () => string;
  tokenFactory?: () => string;
  now?: () => Date;
}

function clientAddress(request: Request): string {
  return request.ip || request.socket.remoteAddress || 'unknown';
}

function identifierHash(secret: string, scope: string, value: string): Buffer {
  return createHmac('sha256', secret)
    .update(`${scope}:${value.trim().toLowerCase()}`)
    .digest();
}

function tokenHash(token: string): Buffer {
  return createHash('sha256').update(token).digest();
}

function tokenFromRequest(request: Request): string | null {
  const token = request.query.token;
  return typeof token === 'string' && TOKEN_PATTERN.test(token) ? token : null;
}

function pageShell(title: string, content: string): string {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title} | Rough Note</title>
      <style>
        :root { color-scheme: light; font-family: Georgia, serif; }
        body { align-items: center; background: #f3ead9; color: #241f19;
          display: flex; justify-content: center; margin: 0; min-height: 100vh;
          padding: 24px; }
        main { background: #fffaf0; border: 1px solid #d9c8aa; box-shadow:
          0 18px 50px rgb(55 37 17 / 14%); max-width: 560px; padding: 42px;
          transform: rotate(-0.2deg); }
        h1 { font-size: clamp(30px, 7vw, 48px); margin-top: 0; }
        p { font-family: system-ui, sans-serif; line-height: 1.65; }
        button { background: #d87b2b; border: 0; color: white; cursor: pointer;
          font: 700 18px system-ui, sans-serif; padding: 14px 22px; }
        a { color: #88420b; }
      </style>
    </head>
    <body><main>${content}</main></body>
  </html>`;
}

function sendHtmlPage(
  response: Response,
  status: number,
  title: string,
  content: string
) {
  response.set({
    'Cache-Control': 'no-store',
    'Content-Security-Policy':
      "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'",
    'Referrer-Policy': 'no-referrer'
  });
  response.status(status).type('html').send(pageShell(title, content));
}

export function createNewsletterRouter(
  dependencies: NewsletterRouteDependencies
): Router {
  const router = Router();
  const idFactory = dependencies.idFactory ?? (() => `rn_${ulid()}`);
  const tokenFactory =
    dependencies.tokenFactory ?? (() => randomBytes(32).toString('base64url'));
  const now = dependencies.now ?? (() => new Date());

  router.post(
    '/subscribe',
    createOriginGuard({
      allowedOrigins: dependencies.config.allowedOrigins,
      requireOrigin: dependencies.config.requireOrigin
    }),
    json({ limit: '4kb', strict: true }),
    async (request, response, next) => {
      try {
        const requestTime = now();
        const ipLimit = await dependencies.rateLimiter.consumeRateLimit({
          scope: 'newsletter-ip',
          keyHash: identifierHash(
            dependencies.config.rateLimit.secret,
            'newsletter-ip',
            clientAddress(request)
          ),
          limit: dependencies.config.newsletter.ipLimit,
          windowSeconds: dependencies.config.newsletter.rateWindowSeconds,
          now: requestTime
        });
        if (!ipLimit.allowed) {
          response.set('Retry-After', String(ipLimit.retryAfterSeconds));
          response.status(429).json({
            message: 'Too many subscription attempts. Please try again later.'
          });
          return;
        }

        const parsed = subscribeSchema.safeParse(request.body);
        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0];
          const field = String(firstIssue?.path[0] ?? 'email');
          response.status(422).json({
            errors: { [field]: firstIssue?.message ?? 'Check your email address.' }
          });
          return;
        }
        if (parsed.data.websiteAddress2.trim()) {
          response.status(202).json({ status: 'accepted' });
          return;
        }

        const emailNormalized = parsed.data.email.toLowerCase();
        const emailLimit = await dependencies.rateLimiter.consumeRateLimit({
          scope: 'newsletter-email',
          keyHash: identifierHash(
            dependencies.config.rateLimit.secret,
            'newsletter-email',
            emailNormalized
          ),
          limit: dependencies.config.newsletter.emailLimit,
          windowSeconds: dependencies.config.newsletter.rateWindowSeconds,
          now: requestTime
        });
        if (!emailLimit.allowed) {
          response.set('Retry-After', String(emailLimit.retryAfterSeconds));
          response.status(429).json({
            message: 'Too many subscription attempts. Please try again later.'
          });
          return;
        }

        const verificationToken = tokenFactory();
        const unsubscribeToken = tokenFactory();
        const decision = await dependencies.repository.beginSubscription({
          subscriberId: idFactory(),
          email: parsed.data.email,
          emailNormalized,
          source: parsed.data.source,
          verificationTokenHash: tokenHash(verificationToken),
          verificationExpiresAt: new Date(
            requestTime.getTime() +
              dependencies.config.newsletter.verificationTokenHours * 3600_000
          ),
          unsubscribeTokenHash: tokenHash(unsubscribeToken),
          clientIpHash: identifierHash(
            dependencies.config.rateLimit.secret,
            'newsletter-stored-ip',
            clientAddress(request)
          ),
          now: requestTime,
          resendCooldownSeconds:
            dependencies.config.newsletter.resendCooldownSeconds
        });

        if (!decision.shouldSendVerification) {
          response.status(202).json({ status: 'accepted' });
          return;
        }
        if (decision.notificationId === null) {
          throw new Error('The verification notification was not created.');
        }

        const verificationUrl = new URL(
          '/api/newsletter/verify',
          dependencies.config.publicOrigin
        );
        verificationUrl.searchParams.set('token', verificationToken);
        const unsubscribeUrl = new URL(
          '/api/newsletter/unsubscribe',
          dependencies.config.publicOrigin
        );
        unsubscribeUrl.searchParams.set('token', unsubscribeToken);
        const message = {
          email: decision.email,
          verificationUrl: verificationUrl.toString(),
          unsubscribeUrl: unsubscribeUrl.toString()
        };
        const queued = dependencies.outbox
          ? await dependencies.outbox.enqueueNewsletter(
              decision.notificationId,
              decision.subscriberId,
              message,
              now()
            )
          : null;

        try {
          const delivery = await withTimeout(
            dependencies.mailer.sendVerification(message),
            dependencies.config.mail.timeoutMs,
            'Newsletter verification email'
          );
          if (queued && dependencies.outbox) {
            try {
              await dependencies.outbox.markSent(
                queued.outboxId,
                delivery.messageId,
                now()
              );
            } catch (outboxError) {
              logger.error('newsletter_outbox_sent_status_failed', {}, outboxError);
            }
          }
          try {
            await dependencies.repository.markVerificationSent(
              decision.notificationId,
              decision.subscriberId,
              delivery.messageId,
              now()
            );
          } catch (statusError) {
            logger.error('newsletter_sent_status_failed', {}, statusError);
          }
        } catch (deliveryError) {
          try {
            await dependencies.repository.markVerificationFailed(
              decision.notificationId,
              decision.subscriberId,
              safeErrorSummary(deliveryError),
              now()
            );
          } catch (statusError) {
            logger.error('newsletter_failure_status_failed', {}, statusError);
          }
          if (queued && dependencies.outbox) {
            try {
              await dependencies.outbox.markFailed(
                queued.outboxId,
                deliveryError,
                now()
              );
            } catch (outboxError) {
              logger.error('newsletter_outbox_failure_status_failed', {}, outboxError);
            }
            response.status(202).json({ status: 'accepted', delivery: 'queued' });
            return;
          }
          response.status(503).json({
            message:
              'We saved your request but could not send the confirmation email. Please retry.'
          });
          return;
        }

        response.status(202).json({ status: 'accepted' });
      } catch (error) {
        next(error);
      }
    }
  );

  router.get('/verify', async (request, response, next) => {
    const token = tokenFromRequest(request);
    if (!token) {
      sendHtmlPage(
        response,
        400,
        'Invalid confirmation link',
        '<h1>This confirmation link is invalid.</h1><p>Return to the Rough Note website and subscribe again.</p>'
      );
      return;
    }
    try {
      const result = await dependencies.repository.verifyByTokenHash(
        tokenHash(token),
        now()
      );
      if (result === 'expired') {
        sendHtmlPage(
          response,
          410,
          'Confirmation link expired',
          '<h1>This link has expired.</h1><p>Return to the Rough Note website and request a fresh confirmation email.</p>'
        );
        return;
      }
      if (result === 'invalid') {
        sendHtmlPage(
          response,
          400,
          'Invalid confirmation link',
          '<h1>This confirmation link is invalid.</h1><p>Return to the Rough Note website and subscribe again.</p>'
        );
        return;
      }
      if (result === 'unsubscribed') {
        sendHtmlPage(
          response,
          200,
          'Already unsubscribed',
          '<h1>You are unsubscribed.</h1><p>Submit your email in the footer again if you would like to rejoin.</p>'
        );
        return;
      }
      sendHtmlPage(
        response,
        200,
        'Subscription confirmed',
        '<h1>Your subscription is confirmed.</h1><p>Welcome to Rough Note. You can close this page now.</p>'
      );
    } catch (error) {
      next(error);
    }
  });

  router.get('/unsubscribe', (request, response) => {
    const token = tokenFromRequest(request);
    if (!token) {
      sendHtmlPage(
        response,
        400,
        'Invalid unsubscribe link',
        '<h1>This unsubscribe link is invalid.</h1><p>No subscription was changed.</p>'
      );
      return;
    }
    const action = `/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
    sendHtmlPage(
      response,
      200,
      'Unsubscribe',
      `<h1>Leave the newsletter?</h1><p>No login is required. Confirm below and we will stop sending newsletter email.</p><form method="post" action="${action}"><button type="submit">Unsubscribe</button></form>`
    );
  });

  router.post('/unsubscribe', async (request, response, next) => {
    const token = tokenFromRequest(request);
    if (!token) {
      sendHtmlPage(
        response,
        400,
        'Invalid unsubscribe link',
        '<h1>This unsubscribe link is invalid.</h1><p>No subscription was changed.</p>'
      );
      return;
    }
    try {
      const result = await dependencies.repository.unsubscribeByTokenHash(
        tokenHash(token),
        now()
      );
      if (result === 'invalid') {
        sendHtmlPage(
          response,
          400,
          'Invalid unsubscribe link',
          '<h1>This unsubscribe link is invalid.</h1><p>No subscription was changed.</p>'
        );
        return;
      }
      sendHtmlPage(
        response,
        200,
        'Unsubscribed',
        '<h1>You are unsubscribed.</h1><p>No login was required, and this address will not receive newsletter email.</p>'
      );
    } catch (error) {
      next(error);
    }
  });

  return router;
}
