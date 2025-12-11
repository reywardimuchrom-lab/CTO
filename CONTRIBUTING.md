# Contributing to MyApp

Thank you for your interest in contributing to MyApp! This document provides guidelines and instructions for contributing to this monorepo.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Use welcoming and inclusive language
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other conduct that could reasonably be considered inappropriate

## Getting Started

### Prerequisites

1. Read the [README.md](./README.md)
2. Review the [Architecture Documentation](./docs/architecture.md)
3. Set up your development environment:

```bash
# Clone the repository
git clone <repository-url>
cd myapp-monorepo

# Run setup
make setup

# Install dependencies
make install
```

### Finding Issues to Work On

- Check the issue tracker for `good-first-issue` labels
- Look for `help-wanted` labels
- Review the project roadmap
- Propose your own improvements

## Development Process

### 1. Create an Issue

Before starting work:
1. Check if an issue already exists
2. Create a new issue describing the problem or feature
3. Wait for approval from maintainers
4. Get assigned to the issue

### 2. Fork and Branch

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/myapp-monorepo.git

# Add upstream remote
git remote add upstream <original-repository-url>

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 3. Make Changes

Follow the coding standards and make your changes.

### 4. Test Your Changes

```bash
# Run all tests
make test

# Run linters
make lint

# Test specific service
make backend-test
make web-test
make mobile-test
```

### 5. Commit Your Changes

Follow conventional commits:

```bash
git add .
git commit -m "feat(backend): add user registration endpoint"
```

### 6. Keep Your Branch Updated

```bash
# Fetch upstream changes
git fetch upstream

# Rebase on main
git rebase upstream/main

# Force push to your fork
git push origin feature/your-feature-name --force
```

### 7. Submit a Pull Request

1. Push your changes to your fork
2. Create a pull request from your fork to the main repository
3. Fill out the pull request template
4. Link the related issue
5. Wait for review

## Coding Standards

### General Guidelines

- Write clear, self-documenting code
- Keep functions small and focused
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the DRY (Don't Repeat Yourself) principle
- Write tests for new features

### Backend (Go)

#### Style Guide

Follow the [Effective Go](https://golang.org/doc/effective_go.html) guidelines.

**Formatting:**
```bash
go fmt ./...
```

**Naming Conventions:**
- Use camelCase for variables and functions
- Use PascalCase for exported functions and types
- Use descriptive names

**Example:**
```go
// Good
func GetUserByID(id int) (*User, error) {
    // Implementation
}

// Bad
func get_user(i int) (*User, error) {
    // Implementation
}
```

**Error Handling:**
```go
// Always handle errors explicitly
result, err := someFunction()
if err != nil {
    return nil, fmt.Errorf("failed to do something: %w", err)
}
```

**Project Structure:**
- Handlers: HTTP request handling only
- Services: Business logic
- Models: Data structures
- Middleware: Request/response processing

### Web (React/TypeScript)

#### Style Guide

Follow the [Airbnb React Style Guide](https://airbnb.io/javascript/react/).

**Formatting:**
```bash
yarn format
```

**Component Structure:**
```tsx
// Imports
import React, { useState } from 'react'

// Types
interface Props {
  name: string
  onSubmit: (value: string) => void
}

// Component
export default function MyComponent({ name, onSubmit }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    onSubmit(value)
  }

  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

**Naming Conventions:**
- Components: PascalCase (`MyComponent.tsx`)
- Files: camelCase or kebab-case
- Props: camelCase
- Hooks: camelCase starting with `use`

**Best Practices:**
- Use functional components with hooks
- Use TypeScript for type safety
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use meaningful prop names

### Mobile (Flutter/Dart)

#### Style Guide

Follow the [Flutter Style Guide](https://flutter.dev/docs/development/tools/formatting).

**Formatting:**
```bash
dart format .
```

**Widget Structure:**
```dart
class MyWidget extends StatelessWidget {
  const MyWidget({
    Key? key,
    required this.title,
  }) : super(key: key);

  final String title;

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Text(title),
    );
  }
}
```

**Naming Conventions:**
- Classes: PascalCase
- Variables: camelCase
- Files: snake_case
- Constants: camelCase starting with lowercase

**Best Practices:**
- Use const constructors when possible
- Keep widgets small and focused
- Extract reusable widgets
- Use proper state management
- Handle async operations properly

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Tests pass locally
- [ ] Linters pass without errors
- [ ] Documentation is updated
- [ ] Commits follow conventional commits
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
```

### Review Process

1. Automated checks must pass
2. At least one maintainer approval required
3. No unresolved conversations
4. Branch must be up to date
5. Maintainer will merge

### After Merge

- Delete your branch
- Close related issues
- Update local repository

## Testing Guidelines

### Unit Tests

Test individual functions and components in isolation.

**Backend:**
```go
func TestGetUserByID(t *testing.T) {
    // Setup
    // Execute
    // Assert
}
```

**Web:**
```typescript
describe('MyComponent', () => {
  it('should render correctly', () => {
    // Test implementation
  })
})
```

**Mobile:**
```dart
void main() {
  test('should return correct value', () {
    // Test implementation
  });
}
```

### Integration Tests

Test interactions between components.

### Coverage Requirements

- Minimum coverage: 80%
- Critical paths: 100%
- New features must include tests

## Documentation

### Code Documentation

- Document public functions and methods
- Explain complex algorithms
- Add examples for APIs

**Go:**
```go
// GetUserByID retrieves a user from the database by their ID.
// Returns an error if the user is not found or database query fails.
func GetUserByID(id int) (*User, error) {
    // Implementation
}
```

**TypeScript:**
```typescript
/**
 * Fetches user data from the API
 * @param userId - The user's unique identifier
 * @returns Promise resolving to user data
 * @throws Error if the request fails
 */
async function fetchUser(userId: string): Promise<User> {
  // Implementation
}
```

### API Documentation

Update `docs/api.md` when adding or modifying endpoints.

### README Updates

Update relevant README files when changing structure or setup.

## Commit Message Guidelines

### Format

```
type(scope): subject

body

footer
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```
feat(backend): add user authentication endpoint

Implement JWT-based authentication with login and register endpoints.
Includes password hashing and token generation.

Closes #123
```

```
fix(web): resolve login form validation issue

The email validation was not working correctly. Updated the regex
pattern to properly validate email addresses.

Fixes #456
```

## Getting Help

- Check existing documentation
- Search closed issues
- Ask in discussions
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

Feel free to ask questions by:
- Opening an issue
- Starting a discussion
- Contacting maintainers

Thank you for contributing! 🎉
