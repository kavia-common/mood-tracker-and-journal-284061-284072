import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { summary, streak } from '../controllers/analytics.controller.js';

const router = Router();

router.use(authMiddleware);

/**
 * GET /analytics/summary
 */
router.get('/summary', summary);

/**
 * GET /analytics/streak
 */
router.get('/streak', streak);

export default router;
