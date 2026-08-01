#!/bin/sh
set -e
cd /app

echo "[entry] Installing npm dependencies..."
if [ ! -d node_modules ]; then
    npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
else
    echo "[entry] node_modules already present."
fi

echo "[entry] Building Next.js app..."
if [ ! -d .next ]; then
    npm run build
else
    echo "[entry] .next build already present."
fi

echo "[entry] Starting: $*"
exec "$@"
