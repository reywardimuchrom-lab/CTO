# Backend API (Go)

This is the backend API service built with Go and the Gin framework.

## Tech Stack

- **Go 1.21+**
- **Gin** - HTTP web framework
- **GORM** - ORM library
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Docker** - Containerization

## Project Structure

```
backend/
├── cmd/
│   └── api/          # Application entry point
├── internal/
│   ├── config/       # Configuration management
│   ├── handlers/     # HTTP request handlers
│   ├── middleware/   # HTTP middleware
│   ├── models/       # Database models
│   └── services/     # Business logic
├── pkg/              # Public libraries
├── Dockerfile        # Docker configuration
├── Makefile          # Build and run commands
└── go.mod            # Go modules file
```

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 15+ (or use Docker Compose)
- Make (optional but recommended)

## Setup

1. Copy the environment file:
```bash
cp ../.env.example ../.env
```

2. Install dependencies:
```bash
make deps
```

## Running Locally

### With Make:
```bash
make run
```

### Without Make:
```bash
go run ./cmd/api/main.go
```

### With hot reload (requires Air):
```bash
# Install Air
go install github.com/cosmtrek/air@latest

# Run with hot reload
make dev
```

## Building

```bash
make build
```

The binary will be created in `bin/api`.

## Testing

Run all tests:
```bash
make test
```

This will generate a coverage report in `coverage.html`.

## Linting

```bash
make lint
```

## Docker

Build Docker image:
```bash
make docker-build
```

Run Docker container:
```bash
make docker-run
```

## API Endpoints

### Health Check
- `GET /api/v1/health` - Health check endpoint
- `GET /api/v1/ping` - Ping endpoint

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Protected Routes
- `GET /api/v1/profile` - Get user profile (requires authentication)

## Environment Variables

See `../.env.example` for all available environment variables.

## Development Guidelines

- Follow Go best practices and idioms
- Keep handlers thin, move business logic to services
- Write tests for all new features
- Use meaningful commit messages
