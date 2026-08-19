import mysql from 'mysql2/promise';
import process from 'node:process';

const required = [
  'RESTORE_DB_HOST',
  'RESTORE_DB_NAME',
  'RESTORE_DB_USER',
  'RESTORE_DB_PASSWORD'
];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  throw new Error(`Missing restore-test settings: ${missing.join(', ')}`);
}

const restoreName = process.env.RESTORE_DB_NAME;
if (!/restore|recovery/i.test(restoreName)) {
  throw new Error('RESTORE_DB_NAME must contain "restore" or "recovery".');
}
if (process.env.DB_NAME && restoreName === process.env.DB_NAME) {
  throw new Error('Refusing to verify the configured production database.');
}

const connection = await mysql.createConnection({
  host: process.env.RESTORE_DB_HOST,
  port: Number(process.env.RESTORE_DB_PORT || 3306),
  database: restoreName,
  user: process.env.RESTORE_DB_USER,
  password: process.env.RESTORE_DB_PASSWORD,
  ssl: process.env.RESTORE_DB_SSL === 'true' ? {} : undefined,
  timezone: 'Z'
});

try {
  const requiredTables = [
    'bookings',
    'contact_attachments',
    'contact_rate_limits',
    'contact_submissions',
    'email_outbox',
    'maintenance_runs',
    'newsletter_subscribers',
    'schema_migrations'
  ];
  const [tableRows] = await connection.query('SHOW TABLES');
  const present = new Set(tableRows.map((row) => String(Object.values(row)[0])));
  const missingTables = requiredTables.filter((table) => !present.has(table));
  if (missingTables.length) {
    throw new Error(`Restore is missing tables: ${missingTables.join(', ')}`);
  }

  const [migrationRows] = await connection.execute(
    'SELECT migration_name FROM schema_migrations ORDER BY migration_name'
  );
  const migrations = new Set(migrationRows.map((row) => row.migration_name));
  if (!migrations.has('004_security_operations.sql')) {
    throw new Error('Restore predates the Phase 6 schema migration.');
  }

  const counts = {};
  for (const table of [
    'contact_submissions',
    'newsletter_subscribers',
    'bookings',
    'email_outbox'
  ]) {
    const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
    counts[table] = Number(rows[0].count);
  }
  process.stdout.write(
    `Restore verification passed for ${restoreName}: ${JSON.stringify(counts)}\n`
  );
} finally {
  await connection.end();
}
