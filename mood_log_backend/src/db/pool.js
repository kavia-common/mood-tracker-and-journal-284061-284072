import pkg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pkg;

/**
 * Create a singleton pg Pool.
 * Uses DATABASE_URL from environment.
 */
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // You can tune SSL settings if needed for production.
  // ssl: env.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected PG pool error', err);
});

/**
 * PUBLIC_INTERFACE
 * getDb: Returns the pg Pool instance for running queries.
 */
export function getDb() {
  return pool;
}
