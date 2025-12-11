# Quick Start Guide

Get up and running with MyApp in minutes!

## Prerequisites

Make sure you have these installed:
- Docker and Docker Compose
- Make (usually pre-installed on Mac/Linux)
- Git

## 5-Minute Setup

### 1. Clone and Setup (1 minute)

```bash
git clone <repository-url>
cd myapp-monorepo
make setup
```

This creates your `.env` file from the example.

### 2. Start Everything (2 minutes)

```bash
make dev
```

Wait for services to start. You'll see:
```
Services running:
  - Backend API:  http://localhost:8080
  - Web App:      http://localhost:3000
  - Adminer:      http://localhost:8081
  - PostgreSQL:   localhost:5432
```

### 3. Test It Works (1 minute)

**Test Backend API:**
```bash
curl http://localhost:8080/api/v1/health
# Should return: {"status":"healthy","service":"api"}
```

**Open Web App:**
- Visit: http://localhost:3000
- Click "Login" to see the login page
- Navigate around

**Access Database:**
- Visit: http://localhost:8081 (Adminer)
- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: postgres
- Database: myapp_dev

### 4. Make Your First API Call (1 minute)

**Register a User:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## What's Running?

- **PostgreSQL Database** - Your data store
- **Backend API (Go)** - REST API at port 8080
- **Web App (React)** - Frontend at port 3000
- **Adminer** - Database UI at port 8081

## Common Tasks

### View Logs

```bash
make logs              # All services
make logs-backend      # Backend only
make logs-web          # Web only
make logs-db           # Database only
```

### Stop Everything

```bash
make down
```

Or just press `Ctrl+C` in the terminal running `make dev`, then:
```bash
make down
```

### Clean Up

```bash
make clean  # Remove all containers, volumes, and build artifacts
```

## Development Workflow

### Backend Development

```bash
cd backend
make dev        # Run with hot reload (if Air is installed)
make test       # Run tests
make lint       # Run linter
```

### Web Development

```bash
cd web
yarn install    # Install dependencies first
yarn dev        # Start dev server
yarn test       # Run tests
yarn lint       # Run linter
```

### Mobile Development

```bash
cd mobile
flutter pub get  # Install dependencies first
flutter run      # Run on connected device
flutter test     # Run tests
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find what's using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Docker Issues

```bash
# Clean everything
make clean

# Restart Docker Desktop (if on Mac/Windows)

# Try again
make dev
```

### Database Connection Issues

```bash
# Reset database
make db-reset

# Check if PostgreSQL is running
docker ps | grep postgres
```

### Services Won't Start

```bash
# Check logs
make logs

# Common fix: clean and restart
make clean
make dev
```

## Next Steps

Now that everything is running:

1. **Read the [README.md](./README.md)** for comprehensive documentation
2. **Check [docs/development-guide.md](./docs/development-guide.md)** for detailed development info
3. **Review [docs/architecture.md](./docs/architecture.md)** to understand the system
4. **Explore [docs/api.md](./docs/api.md)** for API documentation
5. **Start building features!**

## Quick Reference

| Task | Command |
|------|---------|
| Start all services | `make dev` |
| Stop all services | `make down` |
| Run tests | `make test` |
| Run linters | `make lint` |
| Clean everything | `make clean` |
| View logs | `make logs` |
| Database shell | `make db-shell` |
| Reset database | `make db-reset` |

## Getting Help

- **Documentation:** Check the `/docs` folder
- **Issues:** Open an issue on GitHub
- **API Reference:** See `docs/api.md`
- **Contributing:** Read `CONTRIBUTING.md`

## Tips

💡 **Use `make help`** to see all available commands

💡 **Check logs first** when something goes wrong: `make logs`

💡 **Keep your `.env` updated** when new variables are added

💡 **Run tests before committing**: `make test && make lint`

💡 **Use Adminer** to inspect your database during development

## Ready to Code? 🚀

You're all set! The development environment is running and ready for you to start building features.

Happy coding! 🎉
