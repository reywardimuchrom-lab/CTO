# Development Guide

This guide provides detailed instructions for developers working on the MyApp monorepo.

## Getting Started

### Prerequisites Installation

#### Using asdf (Recommended)

```bash
# Install asdf
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.13.1

# Add to your shell configuration
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc

# Install plugins
asdf plugin add golang
asdf plugin add nodejs
asdf plugin add flutter

# Install versions from .tool-versions
asdf install
```

#### Manual Installation

- Go: https://go.dev/doc/install
- Node.js: https://nodejs.org/ (use version from `.nvmrc`)
- Flutter: https://docs.flutter.dev/get-started/install

### Project Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd myapp-monorepo
```

2. Run setup:
```bash
make setup
```

3. Install dependencies:
```bash
make install
```

4. Start development environment:
```bash
make dev
```

## Development Workflow

### Daily Development

1. Pull latest changes:
```bash
git pull origin main
```

2. Start your services:
```bash
make dev
```

3. Make your changes

4. Run tests:
```bash
make test
```

5. Run linters:
```bash
make lint
```

### Working on Backend

#### Starting Backend Only

```bash
cd backend
make dev
```

#### Adding Dependencies

```bash
cd backend
go get github.com/some/package
go mod tidy
```

#### Running Tests

```bash
cd backend
make test
```

#### Code Structure

- Place HTTP handlers in `internal/handlers/`
- Place business logic in `internal/services/`
- Place database models in `internal/models/`
- Place middleware in `internal/middleware/`
- Keep `cmd/api/main.go` minimal

#### Adding New Endpoints

1. Define handler in `internal/handlers/`:
```go
func NewEndpoint(c *gin.Context) {
    // Implementation
}
```

2. Register route in `cmd/api/main.go`:
```go
v1.GET("/new-endpoint", handlers.NewEndpoint)
```

3. Add tests:
```go
func TestNewEndpoint(t *testing.T) {
    // Test implementation
}
```

### Working on Web

#### Starting Web Only

```bash
cd web
yarn dev
```

#### Adding Dependencies

```bash
cd web
yarn add package-name
# or for dev dependencies
yarn add -D package-name
```

#### Running Tests

```bash
cd web
yarn test
```

#### Code Structure

- Place reusable components in `src/components/`
- Place page components in `src/pages/`
- Place API calls in `src/services/`
- Place hooks in `src/hooks/`
- Place types in `src/types/`

#### Adding New Pages

1. Create page component in `src/pages/`:
```tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

2. Add route in `src/App.tsx`:
```tsx
<Route path="/new-page" element={<NewPage />} />
```

3. Add link in navigation:
```tsx
<Link to="/new-page">New Page</Link>
```

### Working on Mobile

#### Starting Mobile App

```bash
cd mobile
flutter run
```

#### Adding Dependencies

```bash
cd mobile
# Edit pubspec.yaml to add dependencies
flutter pub get
```

#### Running Tests

```bash
cd mobile
flutter test
```

#### Code Structure

- Place screens in `lib/screens/`
- Place reusable widgets in `lib/widgets/`
- Place API services in `lib/services/`
- Place models in `lib/models/`
- Place providers in `lib/providers/`

#### Adding New Screens

1. Create screen in `lib/screens/`:
```dart
class NewScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('New Screen')),
      body: Center(child: Text('New Screen')),
    );
  }
}
```

2. Add route in `lib/main.dart`:
```dart
routes: {
  '/new-screen': (context) => NewScreen(),
}
```

## Testing

### Backend Testing

#### Unit Tests

```bash
cd backend
go test ./internal/services/...
```

#### Integration Tests

```bash
cd backend
go test ./internal/handlers/...
```

#### With Coverage

```bash
cd backend
make test
# View coverage.html in browser
```

### Web Testing

#### Unit Tests

```bash
cd web
yarn test
```

#### Watch Mode

```bash
cd web
yarn test:watch
```

#### Coverage

```bash
cd web
yarn test:coverage
```

### Mobile Testing

#### Unit Tests

```bash
cd mobile
flutter test
```

#### Widget Tests

```bash
cd mobile
flutter test test/widget_test.dart
```

#### Coverage

```bash
cd mobile
flutter test --coverage
```

## Code Quality

### Linting

#### Backend

```bash
cd backend
make lint
```

The backend uses `golangci-lint`. Configure in `.golangci.yml` (to be created).

#### Web

```bash
cd web
yarn lint
yarn lint:fix
```

The web uses ESLint. Configure in `.eslintrc.cjs`.

#### Mobile

```bash
cd mobile
flutter analyze
```

The mobile uses Flutter analyzer. Configure in `analysis_options.yaml`.

### Code Formatting

#### Backend

```bash
cd backend
go fmt ./...
```

#### Web

```bash
cd web
yarn format
```

#### Mobile

```bash
cd mobile
dart format .
```

## Debugging

### Backend Debugging

#### Using Delve

```bash
cd backend
go install github.com/go-delve/delve/cmd/dlv@latest
dlv debug ./cmd/api
```

#### VS Code Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Backend",
      "type": "go",
      "request": "launch",
      "mode": "debug",
      "program": "${workspaceFolder}/backend/cmd/api"
    }
  ]
}
```

### Web Debugging

#### Browser DevTools

- Chrome DevTools
- React DevTools Extension
- Redux DevTools Extension (if using Redux)

#### VS Code Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/web"
    }
  ]
}
```

### Mobile Debugging

#### Flutter DevTools

```bash
cd mobile
flutter run
# Press 'o' to open DevTools
```

#### VS Code

Install Flutter extension and use F5 to debug.

## Database Management

### Migrations (To Be Implemented)

```bash
# Create migration
cd backend
# To be implemented with golang-migrate or similar tool
```

### Seeding Data

Edit `infra/scripts/init-db.sql` to add seed data.

### Resetting Database

```bash
make db-reset
```

### Accessing Database

#### Using Adminer

1. Open http://localhost:8081
2. Enter credentials from `.env`
3. Run queries or view data

#### Using psql

```bash
make db-shell
# or
docker-compose exec postgres psql -U postgres -d myapp_dev
```

## Environment Configuration

### Local Development

Use `.env` file in the root directory.

### Different Environments

Create environment-specific files:
- `.env.development`
- `.env.staging`
- `.env.production`

Load them as needed:
```bash
export $(cat .env.staging | xargs)
```

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Production hotfixes
- `chore/task-description` - Maintenance tasks

### Commit Messages

Follow Conventional Commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(backend): add user registration endpoint
fix(web): resolve login form validation issue
docs: update README with setup instructions
```

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Run tests and linters
4. Commit with conventional commits
5. Push to remote
6. Create pull request
7. Address review comments
8. Merge after approval

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>
```

#### Docker Issues

```bash
# Clean up Docker
make clean
docker system prune -a

# Rebuild
make build
```

#### Module/Package Issues

```bash
# Backend
cd backend
go mod tidy
go mod download

# Web
cd web
rm -rf node_modules
yarn install

# Mobile
cd mobile
flutter clean
flutter pub get
```

#### Database Connection Issues

```bash
# Check if database is running
docker-compose ps postgres

# View database logs
make logs-db

# Reset database
make db-reset
```

## Performance Tips

### Backend

- Use database indexes
- Implement connection pooling
- Add caching where appropriate
- Use goroutines for concurrent operations

### Web

- Use React.memo for expensive components
- Implement code splitting
- Optimize images
- Use production builds

### Mobile

- Use const constructors
- Implement lazy loading
- Optimize images
- Profile with DevTools

## Best Practices

### General

- Write self-documenting code
- Keep functions small and focused
- Use meaningful variable names
- Comment complex logic
- Write tests for new features
- Keep dependencies up to date

### Backend (Go)

- Follow Go idioms
- Handle errors explicitly
- Use context for cancellation
- Keep handlers thin
- Use interfaces for testability

### Web (React/TypeScript)

- Use TypeScript strictly
- Keep components small
- Use hooks over classes
- Avoid prop drilling
- Use proper typing

### Mobile (Flutter)

- Use const constructors
- Follow Flutter style guide
- Keep widgets small
- Use proper state management
- Handle async operations properly

## Resources

### Documentation

- [Go Documentation](https://go.dev/doc/)
- [React Documentation](https://react.dev/)
- [Flutter Documentation](https://docs.flutter.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Tools

- [Postman](https://www.postman.com/) - API testing
- [TablePlus](https://tableplus.com/) - Database client
- [VS Code](https://code.visualstudio.com/) - Code editor
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Getting Help

- Check this documentation
- Review existing code
- Check project issues
- Ask team members
- Search Stack Overflow
