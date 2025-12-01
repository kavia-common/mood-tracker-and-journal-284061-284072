import { createMood, deleteMood, getMoodById, listMoods, updateMood } from '../services/moods.service.js';
import { createMoodSchema, updateMoodSchema } from '../validation/moods.validation.js';

/**
 * PUBLIC_INTERFACE
 * list: List moods for authenticated user.
 */
export async function list(req, res, next) {
  try {
    const items = await listMoods(req.user.id);
    return res.json(items);
  } catch (e) {
    return next(e);
  }
}

/**
 * PUBLIC_INTERFACE
 * getOne: Get a single mood by id for user.
 */
export async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const item = await getMoodById(req.user.id, id);
    if (!item) {
      return res.status(404).json({ error: 'Not Found' });
    }
    return res.json(item);
  } catch (e) {
    return next(e);
  }
}

/**
 * PUBLIC_INTERFACE
 * create: Create a mood entry; 409 if date already exists.
 */
export async function create(req, res, next) {
  try {
    const { error, value } = createMoodSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const item = await createMood(req.user.id, value);
    return res.status(201).json(item);
  } catch (e) {
    return next(e);
  }
}

/**
 * PUBLIC_INTERFACE
 * update: Update a mood entry by id.
 */
export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const { error, value } = updateMoodSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const updated = await updateMood(req.user.id, id, value);
    if (!updated) {
      return res.status(404).json({ error: 'Not Found' });
    }
    return res.json(updated);
  } catch (e) {
    return next(e);
  }
}

/**
 * PUBLIC_INTERFACE
 * remove: Delete a mood entry by id.
 */
export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const ok = await deleteMood(req.user.id, id);
    if (!ok) {
      return res.status(404).json({ error: 'Not Found' });
    }
    return res.status(204).send();
  } catch (e) {
    return next(e);
  }
}
