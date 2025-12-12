.PHONY: help dev up down clean build test lint logs setup install

help:
	@echo "Available commands:"
	@echo "  make setup          - Initial setup (copy .env, install dependencies)"
	@echo "  make dev            - Start all services in development mode"
	@echo "  make up             - Start all Docker services"
	@echo "  make down           - Stop all Docker services"
	@echo "  make build          - Build all Docker images"
	@echo "  make clean          - Clean all Docker resources and build artifacts"
	@echo "  make logs           - View logs from all services"
	@echo "  make test           - Run tests for all services"
	@echo "  make lint           - Run linters for all services"
	@echo "  make install        - Install dependencies for all services"
	@echo ""
	@echo "Backend commands:"
	@echo "  make backend-dev    - Run backend in development mode"
	@echo "  make backend-test   - Run backend tests"
	@echo "  make backend-lint   - Run backend linter"
	@echo ""
	@echo "Web commands:"
	@echo "  make web-dev        - Run web in development mode"
	@echo "  make web-test       - Run web tests"
	@echo "  make web-lint       - Run web linter"
	@echo ""
	@echo "Mobile commands:"
	@echo "  make mobile-run     - Run mobile app"
	@echo "  make mobile-test    - Run mobile tests"
	@echo "  make mobile-lint    - Run mobile linter"
	@echo ""
	@echo "3D Website commands:"
	@echo "  make 3d-install     - Install 3d-website dependencies"
	@echo "  make 3d-dev         - Run 3d-website in development mode"
	@echo "  make 3d-test        - Run 3d-website tests"
	@echo "  make 3d-lint        - Run 3d-website linter"
	@echo "  make 3d-build       - Build 3d-website for production"

setup:
	@echo "Setting up the project..."
	@if [ ! -f .env ]; then \
        cp .env.example .env; \
        echo "Created .env file from .env.example"; \
	else \
        echo ".env file already exists"; \
	fi
	@echo "Setup complete! Run 'make install' to install dependencies."

install:
	@echo "Installing dependencies..."
	@cd backend && go mod download || echo "Go not installed, skipping backend deps"
	@cd web && (yarn install || npm install) || echo "Node not installed, skipping web deps"
	@cd mobile && flutter pub get || echo "Flutter not installed, skipping mobile deps"
	@cd 3d-website && npm install --legacy-peer-deps || echo "Node not installed, skipping 3d-website deps"
	@echo "Dependencies installed!"

dev:
	@echo "Starting all services in development mode..."
	@if [ ! -f .env ]; then \
        echo "Error: .env file not found. Run 'make setup' first."; \
        exit 1; \
	fi
	@docker-compose up -d postgres adminer
	@echo "Waiting for database to be ready..."
	@sleep 5
	@docker-compose up backend web
	@echo ""
	@echo "Services running:"
	@echo "  - Backend API:  http://localhost:8080"
	@echo "  - Web App:      http://localhost:3000"
	@echo "  - Adminer:      http://localhost:8081"
	@echo "  - PostgreSQL:   localhost:5432"

up:
	@echo "Starting all Docker services..."
	@docker-compose up -d
	@echo "Services started!"
	@docker-compose ps

down:
	@echo "Stopping all Docker services..."
	@docker-compose down
	@echo "Services stopped!"

build:
	@echo "Building all Docker images..."
	@docker-compose build
	@echo "Build complete!"

clean:
	@echo "Cleaning up..."
	@docker-compose down -v --remove-orphans
	@rm -rf backend/bin backend/tmp backend/coverage.out backend/coverage.html
	@rm -rf web/node_modules web/dist web/.eslintcache web/coverage
	@rm -rf mobile/.dart_tool mobile/build
	@rm -rf 3d-website/node_modules 3d-website/.next 3d-website/out 3d-website/coverage
	@echo "Cleanup complete!"

logs:
	@docker-compose logs -f

logs-backend:
	@docker-compose logs -f backend

logs-web:
	@docker-compose logs -f web

logs-db:
	@docker-compose logs -f postgres

backend-dev:
	@echo "Running backend in development mode..."
	@cd backend && make dev

backend-test:
	@echo "Running backend tests..."
	@cd backend && make test

backend-lint:
	@echo "Running backend linter..."
	@cd backend && make lint

backend-build:
	@echo "Building backend..."
	@cd backend && make build

web-dev:
	@echo "Running web in development mode..."
	@cd web && (yarn dev || npm run dev)

web-test:
	@echo "Running web tests..."
	@cd web && (yarn test || npm run test)

web-lint:
	@echo "Running web linter..."
	@cd web && (yarn lint || npm run lint)

web-build:
	@echo "Building web..."
	@cd web && (yarn build || npm run build)

mobile-run:
	@echo "Running mobile app..."
	@cd mobile && flutter run

mobile-test:
	@echo "Running mobile tests..."
	@cd mobile && flutter test

mobile-lint:
	@echo "Running mobile linter..."
	@cd mobile && flutter analyze

mobile-build-android:
	@echo "Building Android APK..."
	@cd mobile && flutter build apk

mobile-build-ios:
	@echo "Building iOS app..."
	@cd mobile && flutter build ios

3d-install:
	@echo "Installing 3d-website dependencies..."
	@cd 3d-website && npm install --legacy-peer-deps

3d-dev:
	@echo "Running 3d-website in development mode..."
	@cd 3d-website && npm run dev

3d-test:
	@echo "Running 3d-website tests..."
	@cd 3d-website && npm run test:run

3d-lint:
	@echo "Running 3d-website linter..."
	@cd 3d-website && npm run lint

3d-build:
	@echo "Building 3d-website..."
	@cd 3d-website && npm run build

test: backend-test web-test mobile-test 3d-test

lint: backend-lint web-lint mobile-lint 3d-lint

db-shell:
	@docker-compose exec postgres psql -U postgres -d myapp_dev

db-reset:
	@echo "Resetting database..."
	@docker-compose down postgres
	@docker volume rm myapp_postgres_data || true
	@docker-compose up -d postgres
	@echo "Database reset complete!"
