# Web Frontend (React + TypeScript)

This is the web frontend built with React, TypeScript, and Vite.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Axios** - HTTP client
- **Zustand** - State management (optional)
- **ESLint** - Linting
- **Prettier** - Code formatting

## Project Structure

```
web/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API services
│   ├── store/        # State management
│   ├── types/        # TypeScript types
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Root component
│   └── main.tsx      # Entry point
├── Dockerfile        # Docker configuration
├── nginx.conf        # Nginx configuration for production
└── package.json      # Dependencies and scripts
```

## Prerequisites

- Node.js 20+ (see `.nvmrc`)
- Yarn or npm

## Setup

1. Install dependencies:
```bash
yarn install
# or
npm install
```

2. Create environment file:
```bash
# Create .env.local for local development
echo "VITE_API_URL=http://localhost:8080/api/v1" > .env.local
```

## Running Locally

### Development server:
```bash
yarn dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`

### Production build:
```bash
yarn build
# or
npm run build
```

### Preview production build:
```bash
yarn preview
# or
npm run preview
```

## Development Commands

### Linting:
```bash
yarn lint
yarn lint:fix
```

### Type checking:
```bash
yarn type-check
```

### Formatting:
```bash
yarn format
```

### Testing:
```bash
yarn test
yarn test:ui
yarn test:coverage
```

## Docker

Build Docker image:
```bash
docker build -t myapp-web:latest .
```

Run Docker container:
```bash
docker run -p 80:80 myapp-web:latest
```

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:8080/api/v1)

See `.env.example` in the root for more configuration options.

## Development Guidelines

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety
- Follow the existing code style
- Write tests for new features
- Use meaningful component and variable names
