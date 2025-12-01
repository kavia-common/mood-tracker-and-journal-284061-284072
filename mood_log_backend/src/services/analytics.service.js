import { getDb } from '../db/pool.js';

/**
 * PUBLIC_INTERFACE
 * getSummary: Returns counts per mood_type, total, and trends (last 7 and 30 days).
 */
export async function getSummary(userId) {
  const db = getDb();

  const countsPromise = db.query(
    `SELECT mood_type, COUNT(*)::int AS count
     FROM moods
     WHERE user_id = $1
     GROUP BY mood_type`,
    [userId]
  );

  const totalPromise = db.query(
    `SELECT COUNT(*)::int AS total
     FROM moods
     WHERE user_id = $1`,
    [userId]
  );

  const last7Promise = db.query(
    `SELECT date, COUNT(*)::int AS count
     FROM moods
     WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '6 days'
     GROUP BY date
     ORDER BY date ASC`,
    [userId]
  );

  const last30Promise = db.query(
    `SELECT date, COUNT(*)::int AS count
     FROM moods
     WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '29 days'
     GROUP BY date
     ORDER BY date ASC`,
    [userId]
  );

  const [countsRes, totalRes, last7Res, last30Res] = await Promise.all([
    countsPromise,
    totalPromise,
    last7Promise,
    last30Promise
  ]);

  const byType = {};
  for (const row of countsRes.rows) {
    byType[row.mood_type] = row.count;
  }

  return {
    total: totalRes.rows[0]?.total || 0,
    byType,
    trend7: last7Res.rows.map((r) => ({ date: r.date, count: r.count })),
    trend30: last30Res.rows.map((r) => ({ date: r.date, count: r.count }))
  };
}

/**
 * PUBLIC_INTERFACE
 * getCurrentStreak: Calculates current consecutive-day streak with entries.
 */
export async function getCurrentStreak(userId) {
  const db = getDb();
  // Get all dates with entries up to today ordered desc
  const { rows } = await db.query(
    `SELECT date
     FROM moods
     WHERE user_id = $1 AND date <= CURRENT_DATE
     GROUP BY date
     ORDER BY date DESC`,
    [userId]
  );

  // Compute streak starting from today; if no entry today, streak could be 0
  let streak = 0;
  let expected = new Date();
  expected.setHours(0, 0, 0, 0);

  for (const row of rows) {
    const d = new Date(row.date);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === expected.getTime()) {
      streak += 1;
      // move to previous day
      expected.setDate(expected.getDate() - 1);
    } else if (d.getTime() === expected.getTime() - 24 * 60 * 60 * 1000) {
      // If first day is yesterday (no entry today), allow streak to start yesterday
      if (streak === 0) {
        expected = new Date(d);
        streak += 1;
        expected.setDate(expected.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return { streak };
}
