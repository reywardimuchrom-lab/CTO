# 3D Website Documentation

## Overview

The 3D Website is a Next.js 14 application that provides immersive 3D and VR experiences using Three.js, React Three Fiber, and WebXR APIs. It's designed to showcase 360° panoramas, 3D models, and virtual reality content.

## Quick Start

```bash
# Navigate to the 3d-website directory
cd 3d-website

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

Or from the root of the monorepo:

```bash
# Install dependencies
make 3d-install

# Start development server
make 3d-dev

# Run tests
make 3d-test

# Run linter
make 3d-lint

# Build for production
make 3d-build
```

## Architecture

### Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **3D Graphics**: Three.js
- **React 3D Integration**: React Three Fiber (@react-three/fiber)
- **3D Helpers**: React Three Drei (@react-three/drei)
- **VR/XR Support**: React Three XR (@react-three/xr)
- **XR Polyfill**: webxr-polyfill
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier

### Directory Structure

```
3d-website/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   ├── panorama/           # 360° panorama viewer
│   ├── model/              # 3D model viewer
│   └── vr/                 # VR experience
├── components/             # Reusable React components
│   ├── Layout.tsx          # Main layout wrapper with navigation
│   └── SceneCard.tsx       # Scene preview cards
├── hooks/                  # Custom React hooks
│   └── useVRSupport.ts     # VR detection hook
├── lib/                    # Utilities and business logic
│   ├── store.ts            # Zustand global state store
│   ├── vr-utils.ts         # VR detection and initialization
│   └── sample-scenes.ts    # Sample scene data
├── types/                  # TypeScript type definitions
│   └── index.ts            # Core types for scenes, VR state, etc.
├── public/                 # Static assets
│   ├── panoramas/          # 360° panorama images
│   └── models/             # 3D model files (GLB/GLTF)
└── styles/                 # Additional CSS modules
```

## State Management

### Zustand Store

The application uses Zustand for lightweight, performant state management. The main store (`lib/store.ts`) manages:

#### State Structure

```typescript
interface AppState {
  // Scene management
  scenes: Scene[];              // List of available scenes
  currentScene: Scene | null;   // Currently selected scene
  
  // VR state
  vrState: {
    isVRSupported: boolean;     // Device VR capability
    isVRActive: boolean;        // VR mode active
    isXRSessionActive: boolean; // WebXR session running
    error: string | null;       // VR errors
  };
  
  // UI state
  isLoading: boolean;
  
  // Actions
  setCurrentScene: (scene: Scene | null) => void;
  setVRSupported: (supported: boolean) => void;
  setVRActive: (active: boolean) => void;
  setXRSessionActive: (active: boolean) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  addScene: (scene: Scene) => void;
}
```

#### Usage Example

```tsx
import { useAppStore } from '@/lib/store';

function MyComponent() {
  const { 
    scenes, 
    currentScene, 
    setCurrentScene,
    vrState 
  } = useAppStore();
  
  // Use state and actions...
}
```

## Type System

### Core Types

#### Scene
Represents a 3D scene or experience:

```typescript
interface Scene {
  id: string;
  name: string;
  description: string;
  type: 'panorama' | 'model' | 'mixed';
  assetPath: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
}
```

#### VRState
VR/XR session information:

```typescript
interface VRState {
  isVRSupported: boolean;
  isVRActive: boolean;
  isXRSessionActive: boolean;
  error: string | null;
}
```

## Custom Hooks

### useVRSupport

Detects VR support and initializes WebXR polyfill:

```tsx
import { useVRSupport } from '@/hooks/useVRSupport';

function VRComponent() {
  const vrState = useVRSupport();
  
  if (vrState.isVRSupported) {
    // Show VR button
  }
}
```

**Features:**
- Automatically initializes WebXR polyfill for older browsers
- Checks for WebXR API support
- Detects immersive-vr session capability
- Updates Zustand store with VR state

## Components

### Layout
Main layout wrapper with navigation header and footer.

**Props:** None (uses children)

**Features:**
- Responsive navigation
- Links to all viewer pages
- Consistent header/footer across pages

### SceneCard
Displays a preview card for a scene.

**Props:**
```typescript
interface SceneCardProps {
  scene: Scene;
}
```

**Features:**
- Scene type icon
- Scene name and description
- Link to appropriate viewer
- Hover effects

## Routes

### Home Page (`/`)
- Overview of the application
- VR support detection
- List of available scenes
- Technology stack showcase

### Panorama Viewer (`/panorama`)
- 360° panorama viewer (under construction)
- Mouse/touch navigation
- VR mode support

### Model Viewer (`/model`)
- Interactive 3D model viewer (under construction)
- Orbit controls
- Model loading and rendering

### VR Experience (`/vr`)
- Immersive VR content (under construction)
- WebXR session management
- VR controller support

## 3D Assets

### Panoramas

**Location:** `public/panoramas/`

**Format Requirements:**
- Equirectangular projection
- 2:1 aspect ratio
- JPG or PNG format
- Recommended resolution: 4096x2048 or higher

**Example:**
```
public/
└── panoramas/
    ├── sample-panorama.jpg
    └── sample-panorama-thumb.jpg
```

### 3D Models

**Location:** `public/models/`

**Format Requirements:**
- GLB (preferred) or GLTF format
- Embedded textures (for GLB)
- Web-optimized (compressed, low poly)
- UV-mapped for textures

**Example:**
```
public/
└── models/
    ├── sample-model.glb
    └── sample-model-thumb.jpg
```

## WebXR / VR Support

### Browser Compatibility

**Desktop:**
- Chrome 79+ (with VR headset)
- Edge 79+
- Firefox 98+ (behind flag)

**VR Headsets:**
- Meta Quest 2/3/Pro (native browser)
- HTC Vive / Valve Index (with SteamVR)
- Windows Mixed Reality

### Requirements

1. **HTTPS**: WebXR APIs require secure context
2. **User Gesture**: VR session must be triggered by user action
3. **Permissions**: Browser may request VR access permissions

### WebXR Polyfill

The app automatically loads `webxr-polyfill` for browsers without native WebXR support. This enables:
- Magic Window mode on mobile
- Cardboard VR mode
- Fallback for older browsers

## Testing

### Running Tests

```bash
# Watch mode (development)
npm test

# Single run (CI)
npm run test:run

# With UI
npm run test:ui
```

### Test Structure

Tests use Vitest and Testing Library:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    expect(screen.getByText(/Welcome/i)).toBeDefined();
  });
});
```

### Test Coverage

The smoke test verifies:
- Home page renders without errors
- Main heading is displayed
- Scene cards appear when data is loaded
- VR support detection works

## Development Workflow

### Local Development

1. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   App available at http://localhost:3000

2. **Auto-reload:** Next.js Fast Refresh updates changes instantly

3. **Type Checking:** TypeScript checks types on save

4. **Linting:** ESLint highlights issues in IDE

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format
```

### Building for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

## Configuration Files

### next.config.mjs
Next.js configuration (currently default).

### tailwind.config.ts
Tailwind CSS configuration with custom theme.

### tsconfig.json
TypeScript compiler options.

### vitest.config.ts
Vitest test runner configuration:
- jsdom environment
- React plugin
- Path aliases
- Setup files

### .eslintrc.json
ESLint rules:
- Next.js recommended
- TypeScript support
- Prettier integration

### .prettierrc.json
Code formatting rules:
- 2 space indentation
- Single quotes
- Semicolons
- 100 character line width

## Troubleshooting

### Peer Dependency Warnings

Three.js packages may have peer dependency conflicts. Always install with:
```bash
npm install --legacy-peer-deps
```

### VR Not Working

**Check:**
1. HTTPS connection (required for WebXR)
2. Browser compatibility
3. VR headset connected and powered on
4. Browser permissions granted
5. Console for error messages

### Build Errors

**Solutions:**
```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Type check
npx tsc --noEmit
```

### Hot Reload Not Working

**Solutions:**
- Save the file again
- Restart dev server
- Clear browser cache
- Check for syntax errors

## Performance Optimization

### 3D Asset Optimization

1. **Panoramas:**
   - Use progressive JPEG
   - Compress images (80-90% quality)
   - Generate multiple resolutions
   - Lazy load high-res versions

2. **3D Models:**
   - Use Draco compression for GLB
   - Optimize polygon count
   - Use texture atlases
   - Enable frustum culling

### Code Splitting

Next.js automatically code-splits by route. For 3D components:

```tsx
import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>
});
```

## Future Enhancements

### Planned Features

- [ ] Complete Panorama Viewer implementation
- [ ] Complete Model Viewer implementation
- [ ] Complete VR Experience implementation
- [ ] Hotspot annotations in panoramas
- [ ] Multi-scene navigation/linking
- [ ] AR mode with model-viewer
- [ ] Performance monitoring
- [ ] Analytics integration
- [ ] Social sharing
- [ ] Scene editor interface

### Integration Opportunities

- Backend API for scene management
- User authentication for saved scenes
- Cloud storage for 3D assets
- Real-time collaboration features
- Mobile app companion (Flutter)

## Contributing

When contributing to the 3D website:

1. Follow the existing code style
2. Add tests for new features
3. Update TypeScript types as needed
4. Document new components/hooks
5. Test VR functionality when possible
6. Run linter before committing

## Resources

### Documentation

- [Next.js 14 Docs](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [React Three Drei](https://github.com/pmndrs/drei)
- [React Three XR](https://github.com/pmndrs/react-xr)
- [Three.js Docs](https://threejs.org/docs/)
- [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [Zustand Docs](https://docs.pmnd.rs/zustand)

### Learning Resources

- [Three.js Fundamentals](https://threejs.org/manual/)
- [WebXR Samples](https://immersive-web.github.io/webxr-samples/)
- [React Three Fiber Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)
