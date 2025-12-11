# MyApp Monorepo

A full-stack application built with a modern monorepo architecture, featuring a Go backend, React frontend, and Flutter mobile app.

## 🏗️ Architecture Overview

This monorepo contains multiple projects organized in a single repository:

```
.
├── backend/          # Go API server (Gin framework)
├── web/              # React + TypeScript web application (Vite)
├── mobile/           # Flutter mobile application
├── infra/            # Infrastructure and Docker configurations
├── docs/             # Additional documentation
├── .env.example      # Environment variables template
├── docker-compose.yml # Docker orchestration
└── Makefile          # Build and development commands
```

## 🚀 Tech Stack

### Backend
- **Language:** Go 1.21+
- **Framework:** Gin (HTTP web framework)
- **Database:** PostgreSQL 15+
- **ORM:** GORM
- **Authentication:** JWT
- **Configuration:** 12-factor app principles

### Web
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **HTTP Client:** Axios
- **State Management:** Zustand
- **Styling:** CSS Modules / Styled Components

### Mobile
- **Framework:** Flutter 3.16+
- **Language:** Dart
- **State Management:** Provider
- **HTTP Client:** Dio
- **Local Storage:** SharedPreferences

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL
- **Database Admin:** Adminer
- **Reverse Proxy:** Nginx (production)

## 📋 Prerequisites

Ensure you have the following tools installed:

- **Docker** and **Docker Compose**
- **Make** (for running commands)
- **Go** 1.21+ (for backend development)
- **Node.js** 20+ (for web development)
- **Flutter** 3.16+ (for mobile development)

You can use version managers to install specific versions:
- **asdf** - Use `.tool-versions` file
- **nvm** - Use `.nvmrc` file for Node.js

## 🛠️ Quick Start

### 1. Initial Setup

Clone the repository and run the setup command:

```bash
git clone <repository-url>
cd myapp-monorepo
make setup
```

This will create a `.env` file from `.env.example`. Review and update the environment variables as needed.

### 2. Start Development Environment

Start all services with a single command:

```bash
make dev
```

This will:
- Start PostgreSQL database
- Start Adminer (database management UI)
- Start the backend API server
- Start the web application

### 3. Access the Services

Once running, you can access:

- **Web Application:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **API Health Check:** http://localhost:8080/api/v1/health
- **Adminer (DB Admin):** http://localhost:8081
- **PostgreSQL:** localhost:5432

Default database credentials (from `.env`):
- User: `postgres`
- Password: `postgres`
- Database: `myapp_dev`

## 📦 Available Commands

### Root Level Commands

```bash
make help           # Show all available commands
make setup          # Initial project setup
make dev            # Start all services in development mode
make up             # Start all Docker services
make down           # Stop all Docker services
make build          # Build all Docker images
make clean          # Clean all build artifacts and Docker volumes
make logs           # View logs from all services
make test           # Run tests for all services
make lint           # Run linters for all services
make install        # Install dependencies for all services
```

### Backend Commands

```bash
make backend-dev    # Run backend in development mode
make backend-test   # Run backend tests
make backend-lint   # Run backend linter
make backend-build  # Build backend binary

cd backend
make run            # Run the API server
make test           # Run tests with coverage
make lint           # Run linter
```

### Web Commands

```bash
make web-dev        # Run web in development mode
make web-test       # Run web tests
make web-lint       # Run web linter
make web-build      # Build web for production

cd web
yarn dev            # Start development server
yarn build          # Build for production
yarn test           # Run tests
yarn lint           # Run linter
```

### Mobile Commands

```bash
make mobile-run     # Run mobile app
make mobile-test    # Run mobile tests
make mobile-lint    # Run mobile linter

cd mobile
flutter run         # Run on connected device/emulator
flutter test        # Run tests
flutter analyze     # Analyze code
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

**Database:**
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=myapp_dev
```

**JWT Authentication:**
```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h
```

**SMTP (Email):**
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
```

**SMS Configuration:**
```env
SMS_PROVIDER=twilio
SMS_ACCOUNT_SID=your-twilio-account-sid
SMS_AUTH_TOKEN=your-twilio-auth-token
```

**QRIS Payment:**
```env
QRIS_MERCHANT_ID=your-merchant-id
QRIS_API_KEY=your-qris-api-key
QRIS_ENVIRONMENT=sandbox
```

See `.env.example` for all available configuration options.

## 🧪 Testing

### Run All Tests

```bash
make test
```

### Run Tests by Service

```bash
make backend-test   # Backend tests with coverage
make web-test       # Web tests with Vitest
make mobile-test    # Mobile tests with Flutter
```

## 🎨 Code Quality

### Run All Linters

```bash
make lint
```

### Run Linters by Service

```bash
make backend-lint   # golangci-lint for Go
make web-lint       # ESLint for TypeScript/React
make mobile-lint    # Flutter analyzer for Dart
```

## 🐳 Docker Commands

### Start Services

```bash
make up             # Start all services in background
make dev            # Start with logs attached
```

### Stop Services

```bash
make down           # Stop all services
```

### View Logs

```bash
make logs           # All services
make logs-backend   # Backend only
make logs-web       # Web only
make logs-db        # Database only
```

### Rebuild Images

```bash
make build          # Rebuild all images
docker-compose build --no-cache  # Force rebuild
```

## 📚 API Documentation

### Health Check

```bash
curl http://localhost:8080/api/v1/health
```

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Protected Endpoints

- `GET /api/v1/profile` - Get user profile (requires authentication)

Example with authentication:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/v1/profile
```

## 🗄️ Database Management

### Access Database Shell

```bash
make db-shell
```

### Reset Database

```bash
make db-reset
```

### Use Adminer

Navigate to http://localhost:8081 and enter:
- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: postgres
- Database: myapp_dev

## 📱 Mobile Development

### Run on Android

```bash
cd mobile
flutter devices
flutter run -d <android-device-id>
```

### Run on iOS

```bash
cd mobile
flutter run -d <ios-device-id>
```

### Build APK

```bash
make mobile-build-android
```

## 🚀 Deployment

### Backend

1. Build the Docker image:
```bash
cd backend
docker build -t myapp-backend:latest .
```

2. Run the container:
```bash
docker run -p 8080:8080 --env-file .env myapp-backend:latest
```

### Web

1. Build the Docker image:
```bash
cd web
docker build -t myapp-web:latest .
```

2. Run the container:
```bash
docker run -p 80:80 myapp-web:latest
```

### Mobile

Follow platform-specific deployment guides:
- Android: [Flutter Android Deployment](https://docs.flutter.dev/deployment/android)
- iOS: [Flutter iOS Deployment](https://docs.flutter.dev/deployment/ios)

## 📖 Additional Documentation

- [Backend Documentation](./backend/README.md)
- [Web Documentation](./web/README.md)
- [Mobile Documentation](./mobile/README.md)
- [Architecture Documentation](./docs/architecture.md)

## 🤝 Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes in the appropriate service directory

3. Run tests and linters:
```bash
make test
make lint
```

4. Commit your changes following conventional commits

5. Push and create a pull request

## 🔍 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
make logs-db

# Reset database
make db-reset
```

### Port Already in Use

If ports are already in use, you can modify them in `docker-compose.yml`:
- Backend: Change `8080:8080`
- Web: Change `3000:80`
- PostgreSQL: Change `5432:5432`

### Docker Build Issues

```bash
# Clean all Docker resources
make clean

# Rebuild from scratch
make build
make dev
```

## 📝 License

[Add your license here]

## 👥 Contributors

[Add contributors here]

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`
