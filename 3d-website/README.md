# 3D Website - Next.js 14 + Three.js + WebXR

A modern 3D and VR web application built with Next.js 14, Three.js, React Three Fiber, and WebXR APIs.

## 🚀 Features

- **Next.js 14** with App Router and TypeScript
- **Three.js** integration via React Three Fiber
- **WebXR** support for immersive VR experiences
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Vitest** for testing
- **ESLint & Prettier** for code quality

## 📁 Project Structure

```
3d-website/
├── app/              # Next.js app router pages
│   ├── panorama/     # 360° panorama viewer
│   ├── model/        # 3D model viewer
│   ├── vr/           # VR experience page
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
│   ├── Layout.tsx    # Main layout wrapper
│   └── SceneCard.tsx # Scene preview cards
├── hooks/            # Custom React hooks
│   └── useVRSupport.ts
├── lib/              # Utility functions and stores
│   ├── store.ts      # Zustand store
│   ├── vr-utils.ts   # VR detection utilities
│   └── sample-scenes.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── public/           # Static assets
│   ├── panoramas/    # 360° panorama images
│   └── models/       # 3D model files (GLB/GLTF)
└── styles/           # Additional styles
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Or with legacy peer deps (recommended for Three.js packages)
npm install --legacy-peer-deps
```

## 🏃 Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

## 🔨 Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 📦 Key Dependencies

### Production
- `next` (14.x) - React framework
- `react` (18.x) - UI library
- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for R3F
- `@react-three/xr` - WebXR support for R3F
- `webxr-polyfill` - WebXR API polyfill
- `zustand` - State management
- `tailwindcss` - Utility-first CSS

### Development
- `typescript` - Type safety
- `vitest` - Testing framework
- `@testing-library/react` - React testing utilities
- `eslint` - Code linting
- `prettier` - Code formatting

## 🎨 Adding 3D Assets

### Panoramas
Place 360° equirectangular images in `public/panoramas/`:
- Format: JPG or PNG
- Recommended resolution: 4096x2048 or higher
- Aspect ratio: 2:1

### 3D Models
Place GLB/GLTF files in `public/models/`:
- Format: GLB (preferred) or GLTF
- Optimized for web delivery
- Include textures embedded in GLB

## 🔧 Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Vitest test configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc.json` - Prettier formatting rules

## 🌐 WebXR / VR Support

This app includes WebXR support for compatible VR headsets:

- Meta Quest 2/3/Pro
- HTC Vive / Valve Index
- Windows Mixed Reality
- Any WebXR-compatible device

To test VR features, you need:
1. A WebXR-compatible browser (Chrome/Edge on desktop, or browser on VR headset)
2. HTTPS connection (required for WebXR APIs)
3. A VR headset connected to your system

## 📚 State Management

The app uses Zustand for state management. The main store (`lib/store.ts`) manages:

- **Scenes**: List of available 3D scenes
- **Current Scene**: Currently active scene
- **VR State**: VR support and session status
- **Loading State**: UI loading indicators

Example usage:
```tsx
import { useAppStore } from '@/lib/store';

function MyComponent() {
  const { currentScene, setCurrentScene } = useAppStore();
  // ...
}
```

## 🧩 Custom Hooks

### useVRSupport
Detects VR support and initializes WebXR polyfill:
```tsx
import { useVRSupport } from '@/hooks/useVRSupport';

function MyComponent() {
  const vrState = useVRSupport();
  // vrState.isVRSupported
  // vrState.isVRActive
}
```

## 🎯 Upcoming Features

The following viewer components are planned:

- [ ] Panorama Viewer (360° image viewer)
- [ ] 3D Model Viewer (GLB/GLTF viewer with controls)
- [ ] VR Experience (Immersive VR mode)
- [ ] Hotspot annotations
- [ ] Multi-scene navigation
- [ ] AR mode support

## 🐛 Troubleshooting

### Three.js peer dependency warnings
If you see peer dependency warnings, install with `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

### VR not working
- Ensure you're using HTTPS (required for WebXR)
- Check browser compatibility
- Verify VR headset is properly connected
- Check browser console for errors

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

## 📄 License

This project is part of the monorepo. See root LICENSE file.

## 🤝 Contributing

See CONTRIBUTING.md in the root of the repository.
