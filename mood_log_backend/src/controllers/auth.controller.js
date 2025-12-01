import { createUser, getUserByEmail, verifyPassword, signToken } from '../services/auth.service.js';
import { signupSchema, loginSchema } from '../validation/auth.validation.js';

/**
 * PUBLIC_INTERFACE
 * signup: Register a new user and return user + token.
 */
export async function signup(req, res, next) {
  try {
    const { error, value } = signupSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const user = await createUser(value);
    const token = signToken(user);
    return res.status(201).json({ user, token });
  } catch (e) {
    return next(e);
  }
}

/**
 * PUBLIC_INTERFACE
 * login: Authenticate a user and return token + user.
 */
export async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const existing = await getUserByEmail(value.email);
    if (!existing) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await verifyPassword(value.password, existing.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = { id: existing.id, name: existing.name, email: existing.email, created_at: existing.created_at };
    const token = signToken(user);
    return res.json({ user, token });
  } catch (e) {
    return next(e);
  }
}
