package migrations

import (
	"context"
	"database/sql"
	"embed"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
	"github.com/pressly/goose/v3"
)

//go:embed sql/*.sql
var embeddedMigrations embed.FS

func init() {
	goose.SetBaseFS(embeddedMigrations)
	goose.SetLogger(log.New(os.Stdout, "[goose] ", log.LstdFlags))
}

// Up applies all available migrations.
func Up(ctx context.Context, databaseURL string) error {
	return withDatabase(ctx, databaseURL, func(db *sql.DB) error {
		return goose.Up(db, ".")
	})
}

// Down rolls back the specified number of migrations (at least 1).
func Down(ctx context.Context, databaseURL string, steps int) error {
	if steps < 1 {
		steps = 1
	}

	return withDatabase(ctx, databaseURL, func(db *sql.DB) error {
		for i := 0; i < steps; i++ {
			if err := goose.Down(db, "."); err != nil {
				if errors.Is(err, goose.ErrNoNextVersion) || errors.Is(err, goose.ErrNoCurrentVersion) {
					return nil
				}
				return err
			}
		}
		return nil
	})
}

// Status prints the status of all migrations.
func Status(ctx context.Context, databaseURL string) error {
	return withDatabase(ctx, databaseURL, func(db *sql.DB) error {
		return goose.Status(db, ".")
	})
}

// Redo rolls back the most recent migration and reapplies it.
func Redo(ctx context.Context, databaseURL string) error {
	return withDatabase(ctx, databaseURL, func(db *sql.DB) error {
		if err := goose.Down(db, "."); err != nil {
			if errors.Is(err, goose.ErrNoNextVersion) || errors.Is(err, goose.ErrNoCurrentVersion) {
				return nil
			}
			return err
		}
		return goose.Up(db, ".")
	})
}

func withDatabase(ctx context.Context, databaseURL string, fn func(*sql.DB) error) error {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return fmt.Errorf("open database: %w", err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return fmt.Errorf("ping database: %w", err)
	}

	if err := fn(db); err != nil {
		return fmt.Errorf("execute migration: %w", err)
	}

	return nil
}
