BINARY_DIR ?= bin
DATABASE_URL ?= postgres://postgres:postgres@localhost:5432/app?sslmode=disable
APP_PORT ?= 8080

.PHONY: build run migrate migrate-down migrate-status migrate-redo docker-up docker-down tidy

build:
	@mkdir -p $(BINARY_DIR)
	GOOS=linux GOARCH=amd64 go build -o $(BINARY_DIR)/server ./cmd/server

run:
	PORT=$(APP_PORT) DATABASE_URL=$(DATABASE_URL) go run ./cmd/server

migrate:
	DATABASE_URL=$(DATABASE_URL) go run ./cmd/migrate up

migrate-down:
	DATABASE_URL=$(DATABASE_URL) go run ./cmd/migrate down --steps=1

migrate-status:
	DATABASE_URL=$(DATABASE_URL) go run ./cmd/migrate status

migrate-redo:
	DATABASE_URL=$(DATABASE_URL) go run ./cmd/migrate redo

docker-up:
	docker compose up --build

docker-down:
	docker compose down -v

tidy:
	go mod tidy
