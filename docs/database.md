# Database & Migrations

This backend ships with a PostgreSQL 15 database and uses [Goose](https://github.com/pressly/goose) for schema migrations.
All SQL migrations live in [`internal/migrations/sql`](../internal/migrations/sql) and are embedded into the Go binaries so that the
backend as well as the standalone migrator can be run without sharing files.

## Local development database

1. Copy `.env.example` to `.env` (or export the variables manually) and update the values if necessary.
2. Start the dev database (and optional backend) with Docker Compose:
   ```bash
   docker compose up --build
   ```
3. Apply migrations to your local database:
   ```bash
   make migrate
   ```

By default the tooling points to `postgres://postgres:postgres@localhost:5432/app?sslmode=disable`.
Override the `DATABASE_URL` variable if you have different credentials or run the database elsewhere.

## Migration commands

| Command | Description |
| --- | --- |
| `make migrate` | Applies every pending migration (equivalent to `goose up`). |
| `make migrate-down` | Rolls back a single migration step. Use `--steps=N` for more via `go run ./cmd/migrate down --steps=N`. |
| `make migrate-redo` | Replays the last migration (down + up). |
| `make migrate-status` | Prints the status/version table in the database. |

The same behavior is exposed through the `migrator` CLI that is compiled from `cmd/migrate` and shipped with the Docker image.
The backend container entrypoint runs `/app/migrator up` before starting the HTTP server, which guarantees migrations run in Docker.

## Creating new migrations

1. Pick a descriptive name (`add_invoice_table`, `alter_users_add_locale`, ...).
2. Generate a new SQL file using Goose:
   ```bash
   go run github.com/pressly/goose/v3/cmd/goose -dir internal/migrations/sql create add_invoice_table sql
   ```
3. Edit both the `-- +goose Up` and `-- +goose Down` sections.
4. Run `make migrate` (and optionally `make migrate-status`) to validate the change against your database.
5. Include the new SQL file in your pull request.

## Seed data

Migration `202312110002_seed_admin_and_qris.sql` ensures that:
- an admin user (`admin@example.com`) exists with a bcrypt password hash for `Admin#123` (rotate in production);
- a base QRIS configuration placeholder (`mock-provider`/`MERCHANT-001`) exists, so QR code payments can be configured quickly.

These inserts are idempotent through `ON CONFLICT` clauses and are removed automatically if the migration is rolled back.

## Rolling back safely

Use `make migrate-down` for a single step or `go run ./cmd/migrate down --steps=N` for multiple steps.
In an emergency you can drop the schema completely on a dev database by repeatedly running `make migrate-down`
until the status output shows an empty migration set, then re-running `make migrate` to recreate every table.
