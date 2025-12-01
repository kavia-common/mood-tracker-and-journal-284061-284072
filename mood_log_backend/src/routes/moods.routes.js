import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { list, getOne, create, update, remove } from '../controllers/moods.controller.js';

const router = Router();

router.use(authMiddleware);

/**
 * GET /moods
 */
router.get('/', list);

/**
 * GET /moods/:id
 */
router.get('/:id', getOne);

/**
 * POST /moods
 */
router.post('/', create);

/**
 * PUT /moods/:id
 */
router.put('/:id', update);

/**
 * DELETE /moods/:id
 */
router.delete('/:id', remove);

export default router;
