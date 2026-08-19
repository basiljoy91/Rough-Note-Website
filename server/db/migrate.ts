import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Pool, RowDataPacket } from 'mysql2/promise';

const migrationsDirectory = join(
  dirname(fileURLToPath(import.meta.url)),
  'migrations'
);

interface MigrationRow extends RowDataPacket {
  migration_name: string;
}

export async function runMigrations(pool: Pool): Promise<void> {
  const connection = await pool.getConnection();
  let lockAcquired = false;

  try {
    const [lockRows] = await connection.query<RowDataPacket[]>(
      "SELECT GET_LOCK('rough_note_schema_migrations', 30) AS acquired"
    );
    lockAcquired = Number(lockRows[0]?.acquired) === 1;
    if (!lockAcquired) {
      throw new Error('Could not acquire the database migration lock.');
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        migration_name VARCHAR(190) NOT NULL PRIMARY KEY,
        applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const [appliedRows] = await connection.query<MigrationRow[]>(
      'SELECT migration_name FROM schema_migrations'
    );
    const applied = new Set(appliedRows.map((row) => row.migration_name));
    const migrationFiles = (await readdir(migrationsDirectory))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const migrationFile of migrationFiles) {
      if (applied.has(migrationFile)) continue;
      const sql = await readFile(join(migrationsDirectory, migrationFile), 'utf8');
      const statements = sql
        .split('-- statement-breakpoint')
        .map((statement) => statement.trim())
        .filter(Boolean);

      for (const statement of statements) {
        await connection.query(statement);
      }
      await connection.execute(
        'INSERT INTO schema_migrations (migration_name) VALUES (?)',
        [migrationFile]
      );
    }
  } finally {
    if (lockAcquired) {
      await connection.query("SELECT RELEASE_LOCK('rough_note_schema_migrations')");
    }
    connection.release();
  }
}

