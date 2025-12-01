#!/usr/bin/env sh
# Root startup shim for preview systems. Forces Node.js backend startup.
# This script is intentionally simple and CI-friendly. It avoids any Python/uvicorn.
# It installs dependencies if needed and runs `npm start` listening on PORT (default 3001).

set -eu

# Navigate to backend directory
cd "$(dirname "$0")/mood_log_backend"

# Install dependencies (prefer clean install when lockfile exists)
if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund || npm install --no-audit --no-fund
else
  npm install --no-audit --no-fund
fi

# Default port is 3001 unless overridden by environment
export PORT="${PORT:-3001}"

echo "Starting MoodLog Node.js backend on PORT=${PORT} ..."
npm start
