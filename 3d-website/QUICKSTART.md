# 3D Website - Quick Start Guide

## Installation

### From the 3d-website directory:
```bash
cd 3d-website
npm install --legacy-peer-deps
```

### From the root directory:
```bash
make 3d-install
```

**Note:** Always use `--legacy-peer-deps` due to Three.js peer dependency requirements.

## Development

### Start the dev server:
```bash
npm run dev
```
App will be available at: http://localhost:3000

### Or from root:
```bash
make 3d-dev
```

## Testing

```bash
# Watch mode
npm test

# Single run
npm run test:run

# From root
make 3d-test
```

## Code Quality

```bash
# Linting
npm run lint
# or
make 3d-lint

# Formatting
npm run format
```

## Build

```bash
# Production build
npm run build

# Start production server
npm start

# Or from root
make 3d-build
```

## Available Routes

- **/** - Home page with scene gallery
- **/panorama** - 360° panorama viewer (placeholder)
- **/model** - 3D model viewer (placeholder)
- **/vr** - VR experience (placeholder)

## Project Structure

```
3d-website/
├── app/          # Next.js pages
├── components/   # React components
├── hooks/        # Custom hooks
├── lib/          # Utilities & state
├── types/        # TypeScript types
├── public/       # Static assets
│   ├── panoramas/
│   └── models/
└── styles/       # Additional styles
```

## Key Features

✅ Next.js 14 with App Router
✅ TypeScript
✅ Three.js + React Three Fiber
✅ WebXR/VR support
✅ Tailwind CSS
✅ Zustand state management
✅ Vitest testing
✅ ESLint + Prettier

## Next Steps

1. Add panorama images to `public/panoramas/`
2. Add 3D models to `public/models/`
3. Implement the panorama viewer
4. Implement the model viewer
5. Implement the VR experience

## Need Help?

See the full documentation:
- Local: `README.md`
- Monorepo: `/docs/3d-website.md`
- Setup summary: `SETUP_COMPLETE.md`
