# mood-tracker-and-journal-284061-284072

Preview/Run notes:
- Backend container uses Node.js + Express (not FastAPI).
- Hosted preview MUST use the top-level `preview.yaml`, which runs `bash preview_start.sh` in `mood_log_backend` (installs deps and starts `npm start`).
- Alternatively, from `mood_log_backend`: `npm run preview` to execute the same script locally.
- IMPORTANT: There are no Python/FastAPI components in this backend. Do not invoke `uvicorn`, `source venv/bin/activate`, or `src.api.main`. The Express server boots via `node src/server.js` and listens on `PORT=3001` by default, serving health at `GET /` -> `{ "message": "Healthy" }`.