import { createServer } from 'node:http';
import 'dotenv/config';
import { createApp } from './app.js';
import { loadRuntimeConfig } from './config.js';
import { runMigrations } from './db/migrate.js';
import { createDatabasePool } from './db/pool.js';
import { MySqlContactRepository } from './repositories/mysqlContactRepository.js';
import { MySqlNewsletterRepository } from './repositories/mysqlNewsletterRepository.js';
import { MySqlBookingRepository } from './repositories/mysqlBookingRepository.js';
import { HostingerBookingMailer } from './services/bookingMailer.js';
import { HostingerContactMailer } from './services/contactMailer.js';
import { GoogleCalendarGateway } from './services/googleCalendar.js';
import { HostingerNewsletterMailer } from './services/newsletterMailer.js';
import { MySqlEmailOutbox } from './services/emailOutbox.js';
import { MySqlMaintenanceRunner } from './services/maintenance.js';
import { logger } from './services/safeLogger.js';

async function startServer() {
  const config = loadRuntimeConfig();
  const pool = createDatabasePool(config.database);
  if (config.database.autoMigrate) {
    await runMigrations(pool);
  }

  const repository = new MySqlContactRepository(pool);
  const newsletterRepository = new MySqlNewsletterRepository(pool);
  const bookingRepository = new MySqlBookingRepository(pool);
  await repository.ping();
  const mailer = new HostingerContactMailer(config.mail);
  const newsletterMailer = new HostingerNewsletterMailer(config.mail);
  const bookingMailer = new HostingerBookingMailer(config.mail);
  const calendar = new GoogleCalendarGateway(config.googleCalendar);
  const outbox = new MySqlEmailOutbox(pool, config, {
    contactRepository: repository,
    contactMailer: mailer,
    newsletterRepository,
    newsletterMailer,
    bookingRepository,
    bookingMailer
  });
  const maintenance = new MySqlMaintenanceRunner(
    pool,
    outbox,
    config.operations
  );
  const app = createApp({
    config,
    contact: { repository, mailer, outbox },
    newsletter: {
      repository: newsletterRepository,
      rateLimiter: repository,
      mailer: newsletterMailer,
      outbox
    },
    scheduler: {
      repository: bookingRepository,
      calendar,
      mailer: bookingMailer,
      rateLimiter: repository,
      outbox
    },
    maintenance: { runner: maintenance }
  });
  const server = createServer(app);

  server.listen(config.port, '0.0.0.0', () => {
    logger.info('server_started', { port: config.port });
  });

  const shutdown = () => {
    server.close(() => {
      void pool.end().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

startServer().catch((error) => {
  logger.error('server_start_failed', {}, error);
  process.exit(1);
});
