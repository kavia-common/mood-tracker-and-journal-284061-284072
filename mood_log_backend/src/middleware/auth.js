import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * PUBLIC_INTERFACE
 * authMiddleware: Verifies Bearer JWT, attaches user to request.
 */
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
