import { getDb } from '../db/pool.js';

/**
 * Map DB mood row to public shape.
 */
function mapMood(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    mood_type: row.mood_type,
    note: row.note,
    date: row.date, // ISO string date (YYYY-MM-DD) stored as date in DB
    created_at: row.created_at
  };
}

/**
 * PUBLIC_INTERFACE
 * listMoods: List all moods for a user ordered by date desc.
 */
export async function listMoods(userId) {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT id, user_id, mood_type, note, date, created_at
     FROM moods
     WHERE user_id = $1
     ORDER BY date DESC, id DESC`,
    [userId]
  );
  return rows.map(mapMood);
}

/**
 * PUBLIC_INTERFACE
 * getMoodById: Get a mood by id for a specific user.
 */
export async function getMoodById(userId, id) {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT id, user_id, mood_type, note, date, created_at
     FROM moods
     WHERE user_id = $1 AND id = $2`,
    [userId, id]
  );
  return rows[0] ? mapMood(rows[0]) : null;
}

/**
 * PUBLIC_INTERFACE
 * createMood: Create a mood entry; enforce unique per-user per-date.
 */
export async function createMood(userId, { mood_type, note, date }) {
  const db = getDb();
  try {
    const { rows } = await db.query(
      `INSERT INTO moods (user_id, mood_type, note, date)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, mood_type, note, date, created_at`,
      [userId, mood_type, note ?? null, date]
    );
    return mapMood(rows[0]);
  } catch (e) {
    // unique violation
    if (e.code === '23505') {
      const err = new Error('Mood entry for this date already exists');
      err.status = 409;
      throw err;
    }
    throw e;
  }
}

/**
 * PUBLIC_INTERFACE
 * updateMood: Update a mood entry by id for a user.
 */
export async function updateMood(userId, id, patch) {
  // Build dynamic query
  const fields = [];
  const values = [];
  let idx = 1;

  if (patch.mood_type !== undefined) {
    fields.push(`mood_type = $${idx++}`);
    values.push(patch.mood_type);
  }
  if (patch.note !== undefined) {
    fields.push(`note = $${idx++}`);
    values.push(patch.note);
  }
  if (patch.date !== undefined) {
    fields.push(`date = $${idx++}`);
    values.push(patch.date);
  }

  if (fields.length === 0) {
    return getMoodById(userId, id);
  }

  const db = getDb();
  try {
    const query = `
      UPDATE moods
      SET ${fields.join(', ')}
      WHERE user_id = $${idx} AND id = $${idx + 1}
      RETURNING id, user_id, mood_type, note, date, created_at
    `;
    values.push(userId, id);
    const { rows } = await db.query(query, values);
    return rows[0] ? mapMood(rows[0]) : null;
  } catch (e) {
    if (e.code === '23505') {
      const err = new Error('Mood entry for this date already exists');
      err.status = 409;
      throw err;
    }
    throw e;
  }
}

/**
 * PUBLIC_INTERFACE
 * deleteMood: Delete a mood entry by id for a user.
 */
export async function deleteMood(userId, id) {
  const db = getDb();
  const { rowCount } = await db.query(
    `DELETE FROM moods WHERE user_id = $1 AND id = $2`,
    [userId, id]
  );
  return rowCount > 0;
}
