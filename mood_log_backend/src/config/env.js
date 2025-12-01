import dotenv from 'dotenv';

dotenv.config();

/**
 * PUBLIC_INTERFACE
 * env: Exposes required environment variables to the application.
 */
export const env = {
  /** Express server port (default 3001) */
  PORT: process.env.PORT ? Number(process.env.PORT) : 3001,
  /** PostgreSQL connection string */
  DATABASE_URL: process.env.DATABASE_URL || '',
  /** JWT secret key */
  JWT_SECRET: process.env.JWT_SECRET || 'changeme',
  /** JWT expiration e.g. '7d' */
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  /** Bcrypt salt rounds (number) */
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS
    ? Number(process.env.BCRYPT_SALT_ROUNDS)
    : 10,
  /** Allowed CORS origin (frontend) */
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
