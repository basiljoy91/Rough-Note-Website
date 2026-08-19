import 'dotenv/config';
import { loadRuntimeConfig } from '../config.js';
import { runMigrations } from './migrate.js';
import { createDatabasePool } from './pool.js';

const config = loadRuntimeConfig();
const pool = createDatabasePool(config.database);

try {
  await runMigrations(pool);
  process.stdout.write('Database migrations completed.\n');
} finally {
  await pool.end();
}
