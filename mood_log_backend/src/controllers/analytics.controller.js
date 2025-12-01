import { getSummary, getCurrentStreak } from '../services/analytics.service.js';

/**
 * PUBLIC_INTERFACE
 * summary: Returns analytics summary for user.
 */
export async function summary(req, res, next) {
  try {
    const data = await getSummary(req.user.id);
    return res.json(data);
  } catch (e) {
    return next(e);
  }
}

/**
 * PUBLIC_INTERFACE
 * streak: Returns current consecutive-day streak for user.
 */
export async function streak(req, res, next) {
  try {
    const data = await getCurrentStreak(req.user.id);
    return res.json(data);
  } catch (e) {
    return next(e);
  }
}
