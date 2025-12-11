package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/reywardimuchrom-lab/CTO/internal/migrations"
)

func main() {
	if len(os.Args) < 2 {
		usage()
		os.Exit(1)
	}

	action := os.Args[1]
	fs := flag.NewFlagSet(action, flag.ExitOnError)
	steps := fs.Int("steps", 1, "number of steps to migrate when using down")

	if err := fs.Parse(os.Args[2:]); err != nil {
		log.Fatalf("parse flags: %v", err)
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	var err error

	switch action {
	case "up":
		err = migrations.Up(ctx, databaseURL)
	case "down":
		err = migrations.Down(ctx, databaseURL, *steps)
	case "redo":
		err = migrations.Redo(ctx, databaseURL)
	case "status":
		err = migrations.Status(ctx, databaseURL)
	default:
		usage()
		os.Exit(1)
	}

	if err != nil {
		log.Fatalf("migrations %s failed: %v", action, err)
	}
}

func usage() {
	fmt.Println("Usage: migrate <up|down|redo|status> [--steps=N]")
}
