import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/pool.js';
import { env } from '../config/env.js';

/**
 * Map DB user row to public shape.
 */
function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    created_at: row.created_at
  };
}

/**
 * PUBLIC_INTERFACE
 * createUser: Creates a new user with hashed password. Throws on email conflict.
 */
export async function createUser({ name, email, password }) {
  const db = getDb();
  const client = await db.connect();
  try {
    const hash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
    const result = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email.toLowerCase(), hash]
    );
    return mapUser(result.rows[0]);
  } catch (e) {
    // unique violation code for Postgres
    if (e.code === '23505') {
      const err = new Error('Email already registered');
      err.status = 409;
      throw err;
    }
    throw e;
  } finally {
    client.release();
  }
}

/**
 * PUBLIC_INTERFACE
 * getUserByEmail: Retrieves a user row by email including password_hash.
 */
export async function getUserByEmail(email) {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT id, name, email, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

/**
 * PUBLIC_INTERFACE
 * verifyPassword: Compares plain password with stored hash.
 */
export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * PUBLIC_INTERFACE
 * signToken: Signs a JWT with user id as sub and email in payload.
 */
export function signToken(user) {
  const payload = { sub: user.id, email: user.email };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}
