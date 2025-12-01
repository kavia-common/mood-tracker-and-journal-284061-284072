#!/usr/bin/env sh
# Preview start script for MoodLog Backend (Node.js + Express)
# Ensures dependencies are installed in CI-friendly mode and starts the server.
# This script explicitly avoids ANY Python venv/uvicorn startup. Do NOT modify to use uvicorn or FastAPI.

set -eu

# Ensure we're in the backend directory (if called from parent)
if [ -f "./package.json" ] && [ -d "./src" ]; then
  : # already in correct dir
elif [ -f "mood_log_backend/package.json" ]; then
  cd mood_log_backend
fi

# Install dependencies (prefer clean, reproducible install).
if [ -f package.json ]; then
  if [ -f package-lock.json ]; then
    echo "Installing npm dependencies with npm ci..."
    npm ci --no-audit --no-fund || {
      echo "npm ci failed; falling back to npm install..."
      npm install --no-audit --no-fund
    }
  else
    echo "package-lock.json not found; running npm install..."
    npm install --no-audit --no-fund
  fi
fi

# Default port for preview unless overridden
export PORT="${PORT:-3001}"

echo "Starting Node.js server on PORT=${PORT} ..."
npm start
