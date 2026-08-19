import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import multer from 'multer';
import type { RuntimeConfig } from './config.js';
import {
  createContactRouter,
  type ContactRouteDependencies
} from './routes/contact.js';
import {
  createNewsletterRouter,
  type NewsletterRouteDependencies
} from './routes/newsletter.js';
import {
  createSchedulerRouter,
  type SchedulerRouteDependencies
} from './routes/scheduler.js';
import {
  createMaintenanceRouter,
  type MaintenanceRouteDependencies
} from './routes/maintenance.js';
import { logger } from './services/safeLogger.js';

export interface AppOptions {
  config: RuntimeConfig;
  contact: Omit<ContactRouteDependencies, 'config'>;
  newsletter?: Omit<NewsletterRouteDependencies, 'config'>;
  scheduler?: Omit<SchedulerRouteDependencies, 'config'>;
  maintenance?: Omit<MaintenanceRouteDependencies, 'config'>;
  staticDirectory?: string | false;
}

export function createApp(options: AppOptions) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', options.config.trustProxyHops);
  app.use((request, response, next) => {
    const incoming = request.get('x-request-id');
    const requestId =
      incoming && /^[A-Za-z0-9_-]{8,100}$/.test(incoming)
        ? incoming
        : randomUUID();
    response.locals.requestId = requestId;
    response.set('X-Request-ID', requestId);
    next();
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          imgSrc: ["'self'", 'data:', 'blob:'],
          manifestSrc: ["'self'"],
          mediaSrc: ["'self'"],
          objectSrc: ["'none'"],
          scriptSrc: ["'self'"],
          scriptSrcAttr: ["'none'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com'
          ],
          workerSrc: ["'self'", 'blob:'],
          upgradeInsecureRequests:
            options.config.environment === 'production' ? [] : null
        }
      },
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    })
  );
  app.use((_request, response, next) => {
    response.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
    );
    next();
  });
  app.use('/api', (_request, response, next) => {
    response.set('Cache-Control', 'no-store');
    next();
  });
  if (options.newsletter) {
    app.use(
      '/api/newsletter',
      createNewsletterRouter({
        ...options.newsletter,
        config: options.config
      })
    );
  }
  if (options.scheduler) {
    app.use(
      '/api',
      createSchedulerRouter({
        ...options.scheduler,
        config: options.config
      })
    );
  }
  if (options.maintenance) {
    app.use(
      '/api/internal/maintenance',
      createMaintenanceRouter({
        ...options.maintenance,
        config: options.config
      })
    );
  }

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
  app.get('/api/ready', async (_request, response) => {
    try {
      await options.contact.repository.ping();
      response.json({ status: 'ready' });
    } catch {
      response.status(503).json({ status: 'unavailable' });
    }
  });
  app.use(
    '/api/contact',
    createContactRouter({
      ...options.contact,
      config: options.config
    })
  );

  const staticDirectory =
    options.staticDirectory === undefined
      ? join(process.cwd(), 'dist')
      : options.staticDirectory;
  if (staticDirectory) {
    app.use(express.static(staticDirectory, { index: 'index.html' }));
    app.use((request, response, next) => {
      if (!request.accepts('html')) {
        next();
        return;
      }
      const notFoundPage = join(staticDirectory, 'html', 'pagenotfound.html');
      if (existsSync(notFoundPage)) {
        response.status(404).sendFile(notFoundPage);
        return;
      }
      next();
    });
  }

  app.use((_request, response) => {
    response.status(404).json({ message: 'Not found.' });
  });

  const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
    void _next;
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === 'LIMIT_FILE_SIZE';
      response.status(tooLarge ? 413 : 400).json({
        errors: {
          referenceFile: tooLarge
            ? 'The reference file must be 5 MB or smaller.'
            : 'The reference file could not be accepted.'
        }
      });
      return;
    }
    if (
      error instanceof SyntaxError &&
      'status' in error &&
      error.status === 400
    ) {
      response.status(400).json({ message: 'Send a valid JSON request.' });
      return;
    }
    logger.error(
      'request_failed',
      {
        requestId: String(response.locals.requestId ?? 'unknown'),
        method: request.method,
        path: request.path
      },
      error
    );
    response.status(500).json({
      message: 'The request could not be accepted. Please try again.'
    });
  };
  app.use(errorHandler);

  return app;
}
