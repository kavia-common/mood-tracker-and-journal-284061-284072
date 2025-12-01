# MoodLog Backend (Node.js + Express)

This is the Node.js + Express backend for the MoodLog MVP. It provides JWT-based authentication, CRUD APIs for daily mood entries, and analytics endpoints.

## Tech stack

- Express
- PostgreSQL (pg)
- JWT (jsonwebtoken)
- bcrypt
- Joi validation
- CORS + morgan
- dotenv

## Environment

Create a `.env` using `.env.example` (do not commit secrets):

```
cp .env.example .env
# Edit values in .env as appropriate
```

Ensure your database has tables:

- users: id (PK), name, email (unique), password_hash, created_at (default now)
- moods: id (PK), user_id (FK users.id), mood_type (Happy|Neutral|Sad|Angry|Excited), note, date (date), created_at (default now)
- Unique index on (user_id, date)

Example DDL:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_type VARCHAR(20) NOT NULL,
  note TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT mood_type_valid CHECK (mood_type IN ('Happy','Neutral','Sad','Angry','Excited'))
);

CREATE UNIQUE INDEX IF NOT EXISTS moods_user_date_unique ON moods(user_id, date);
```

## Install & Run

From this folder:

```
npm install
npm run dev
```

- Development: `npm run dev` (nodemon, auto-restart)
- Production/Container start: `npm start` (runs `node src/server.js`)
- Preview environments: run `npm run preview` or `bash ./preview_start.sh` (installs deps and starts on the configured PORT)
- Procfile is provided to ensure platforms expecting a Procfile use `npm start`.
- Optional: `start.sh` and `preview_start.sh` scripts are available for platforms invoking a shell entrypoint. They install dependencies (`npm ci` if lockfile exists or `npm install` otherwise) and run `npm start`. They do not use or reference any Python venv/uvicorn components.
- Additionally, the repository root has a `run.sh` shim and a `Makefile` with `start` target for preview systems that auto-detect conventional start commands. These ensure Node.js is started (not FastAPI).

Server will run at http://localhost:3001 (configurable via `PORT`).
Health route: `GET /` returns `{ "message": "Healthy" }`.

## API

Base URL: `http://localhost:3001`

- Health: `GET /` -> `{ "message": "Healthy" }`

### Auth

- `POST /auth/signup` body: `{ "name": "...", "email": "...", "password": "..." }`
- `POST /auth/login` body: `{ "email": "...", "password": "..." }`

Both return `{ user, token }`. Use the token with `Authorization: Bearer <token>`.

### Moods (protected)

- `GET /moods` -> list of mood entries (scoped to user)
- `GET /moods/:id` -> single mood
- `POST /moods` body: `{ "mood_type": "Happy|Neutral|Sad|Angry|Excited", "note": "optional", "date": "YYYY-MM-DD" }`
  - Returns 409 if an entry already exists for that date (per user)
- `PUT /moods/:id` body: any of the fields above to update
- `DELETE /moods/:id` -> 204

### Analytics (protected)

- `GET /analytics/summary` -> `{ total, byType: {Happy: n,...}, trend7: [{date,count}], trend30: [...] }`
- `GET /analytics/streak` -> `{ streak }` current consecutive-day streak

## Sample curl

Signup:
```
curl -X POST http://localhost:3001/auth/signup \
 -H 'Content-Type: application/json' \
 -d '{"name":"Test User","email":"test@example.com","password":"Password123!"}'
```

Login:
```
curl -X POST http://localhost:3001/auth/login \
 -H 'Content-Type: application/json' \
 -d '{"email":"test@example.com","password":"Password123!"}'
```

List moods:
```
curl -X GET http://localhost:3001/moods \
 -H 'Authorization: Bearer YOUR_TOKEN'
```

Create mood:
```
curl -X POST http://localhost:3001/moods \
 -H 'Authorization: Bearer YOUR_TOKEN' \
 -H 'Content-Type: application/json' \
 -d '{"mood_type":"Happy","note":"Feeling great!","date":"2025-01-01"}'
```

## Postman

A Postman collection is available at: `postman/MoodLog.postman_collection.json`

Use environment variables:
- `baseUrl` (e.g., http://localhost:3001)
- `token` (captured automatically from Login test script)

## Notes

- All SQL queries are parameterized.
- JWT includes user id as `sub` and `email`.
- Ensure DB connection string is correct for your environment.
- Startup uses Node.js (not FastAPI). Any previous uvicorn/FastAPI references are obsolete and removed. There are no references to `src.api.main` in this codebase. If your platform has a custom start command, ensure it runs `npm start` or executes `start.sh` / `preview_start.sh`—do not run any `uvicorn` or `source venv/bin/activate` commands.
