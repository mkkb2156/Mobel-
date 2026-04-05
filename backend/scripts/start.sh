#!/usr/bin/env bash
set -euo pipefail

# Graceful shutdown handler
shutdown() {
    echo "SIGTERM received, shutting down gracefully..."
    kill -TERM "$UVICORN_PID" 2>/dev/null
    wait "$UVICORN_PID"
    exit 0
}

trap shutdown SIGTERM SIGINT

# Ensure Playwright Chromium is installed (no-op if already present)
echo "Ensuring Playwright Chromium is installed..."
playwright install chromium 2>/dev/null || echo "Playwright browser already installed or install skipped"

# Start uvicorn
PORT="${PORT:-8000}"
echo "Starting uvicorn on port ${PORT}..."
uvicorn main:app --host 0.0.0.0 --port "${PORT}" &
UVICORN_PID=$!

# Wait for the uvicorn process
wait "$UVICORN_PID"
