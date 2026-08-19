import mysql, { type Pool } from 'mysql2/promise';
import type { RuntimeConfig } from '../config.js';

export function createDatabasePool(config: RuntimeConfig['database']): Pool {
  return mysql.createPool({
    host: config.host,
    port: config.port,
    database: config.name,
    user: config.user,
    password: config.password,
    connectionLimit: config.connectionLimit,
    charset: 'utf8mb4',
    timezone: 'Z',
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: config.ssl ? {} : undefined
  });
}
