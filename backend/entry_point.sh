#!/bin/sh
set -e

echo "[entry] Checking Chromium..."
if ! command -v chromium >/dev/null 2>&1; then
    echo "[entry] Installing Chromium (first start only)..."
    apt-get update
    apt-get install -y --no-install-recommends chromium fonts-liberation
    rm -rf /var/lib/apt/lists/*
else
    echo "[entry] Chromium already installed."
fi

echo "[entry] Installing Python dependencies..."
pip install -r /app/requirements.txt

echo "[entry] Starting: $*"
exec "$@"
