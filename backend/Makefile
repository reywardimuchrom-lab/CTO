.PHONY: help build run test lint clean dev

help:
	@echo "Available commands:"
	@echo "  make build     - Build the application"
	@echo "  make run       - Run the application"
	@echo "  make dev       - Run the application with hot reload"
	@echo "  make test      - Run tests"
	@echo "  make lint      - Run linter"
	@echo "  make clean     - Clean build artifacts"

build:
	@echo "Building backend..."
	go build -o bin/api ./cmd/api

run:
	@echo "Running backend..."
	go run ./cmd/api/main.go

dev:
	@echo "Running backend in development mode..."
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "Air not found. Running without hot reload..."; \
		go run ./cmd/api/main.go; \
	fi

test:
	@echo "Running tests..."
	go test -v -race -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

lint:
	@echo "Running linter..."
	@if command -v golangci-lint > /dev/null; then \
		golangci-lint run; \
	else \
		echo "golangci-lint not found. Install it from https://golangci-lint.run/usage/install/"; \
		go fmt ./...; \
		go vet ./...; \
	fi

clean:
	@echo "Cleaning..."
	rm -rf bin/ tmp/ coverage.out coverage.html

deps:
	@echo "Downloading dependencies..."
	go mod download
	go mod tidy

docker-build:
	@echo "Building Docker image..."
	docker build -t myapp-backend:latest .

docker-run:
	@echo "Running Docker container..."
	docker run -p 8080:8080 --env-file ../.env myapp-backend:latest
