#!/usr/bin/env sh
# Start script for MoodLog Backend (Node.js + Express)
# Ensures dependencies are installed in CI-friendly mode and starts the server.
# This intentionally avoids any Python venv/uvicorn startup.

set -eu

# Install dependencies (clean, reproducible)
if [ -f package.json ]; then
  echo "Installing npm dependencies (ci)..."
  npm ci --no-audit --no-fund
fi

# Export default port if not provided
export PORT="${PORT:-3001}"

echo "Starting Node.js server on PORT=${PORT} ..."
npm start
