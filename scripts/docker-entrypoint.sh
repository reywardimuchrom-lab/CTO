#!/usr/bin/env sh
set -euo

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL env var must be provided" >&2
  exit 1
fi

echo "Running database migrations..."
/app/migrator up

exec "$@"
