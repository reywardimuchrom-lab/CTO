# 360° Panorama Viewer Feature

## Overview

The panorama viewer feature provides an interactive 360° panoramic image viewer using Three.js and React Three Fiber. Users can navigate panoramic images with intuitive mouse/touch controls, adjust zoom levels, and toggle VR mode.

## Features

- **360° Image Rendering**: Display equirectangular panoramic images on a sphere using Three.js
- **Mouse/Touch Controls**: Drag to rotate, scroll/pinch to zoom with inertia support
- **Zoom Control**: Interactive zoom slider with range 1x to 5x
- **VR Mode Toggle**: Switch between normal and VR viewing modes
- **Image Selection**: Dropdown menu to select from available panoramas
- **Loading States**: Visual feedback during image loading
- **Error Handling**: User-friendly error messages when images fail to load
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **State Persistence**: Selected panorama and view settings are persisted via Zustand store

## Architecture

### Directory Structure

```
src/
├── components/
│   └── panorama/
│       ├── PanoramaViewer.tsx         # Main 3D viewer component
│       ├── PanoramaViewer.module.css  # Viewer styles
│       ├── PanoramaToolbar.tsx        # Control HUD component
│       ├── PanoramaToolbar.module.css # Toolbar styles
│       └── __tests__/
│           ├── PanoramaViewer.test.tsx
│           └── PanoramaToolbar.test.tsx
├── hooks/
│   ├── usePanoramaControls.ts         # Control interactions hook
│   └── __tests__/
│       └── usePanoramaControls.test.ts
├── lib/
│   ├── panoramas.ts                   # Utility functions and metadata
│   └── __tests__/
│       └── panoramas.test.ts
├── pages/
│   ├── PanoramaPage.tsx               # Main page component
│   └── PanoramaPage.module.css        # Page styles
├── stores/
│   ├── panoramaStore.ts               # Zustand state management
│   └── __tests__/
│       └── panoramaStore.test.ts
└── types/
    └── panorama.ts                    # TypeScript type definitions
```

## Usage

### Basic Setup

1. **Navigate to the panorama page**:
   ```
   http://localhost:3000/panorama
   ```

2. **Select a panorama** from the dropdown menu at the top of the page

3. **Interact with the panorama**:
   - **Mouse**: Click and drag to rotate
   - **Scroll**: Use mouse wheel to zoom in/out
   - **Touch**: Single finger drag to rotate, two-finger pinch to zoom

### Programmatic Usage

#### Using the Panorama Page

```tsx
import PanoramaPage from './pages/PanoramaPage'

function App() {
  return <Route path="/panorama" element={<PanoramaPage />} />
}
```

#### Using the Panorama Viewer Component Directly

```tsx
import { PanoramaViewer } from './components/panorama/PanoramaViewer'
import { usePanoramaStore } from './stores/panoramaStore'
import { PanoramaMetadata } from './types/panorama'

function MyComponent() {
  const store = usePanoramaStore()

  const panorama: PanoramaMetadata = {
    id: 'custom-1',
    title: 'Custom Panorama',
    description: 'A custom panoramic view',
    imageUrl: '/panoramas/custom.jpg',
    fov: 75,
  }

  return (
    <PanoramaViewer
      panorama={panorama}
      zoom={store.zoom}
      rotation={store.rotation}
      isVRMode={store.isVRMode}
      onRotationChange={(rotation) => store.setRotation(rotation)}
      onZoomChange={(zoom) => store.setZoom(zoom)}
      onError={(error) => console.error(error)}
    />
  )
}
```

#### Using the Panorama Store

```tsx
import { usePanoramaStore } from './stores/panoramaStore'

function MyComponent() {
  const store = usePanoramaStore()

  return (
    <div>
      <button onClick={() => store.setSelectedPanoramaId('panorama-1')}>
        Load Panorama 1
      </button>
      <button onClick={() => store.setVRMode(!store.isVRMode)}>
        Toggle VR Mode
      </button>
      <p>Current Zoom: {store.zoom}</p>
      <input
        type="range"
        min="1"
        max="5"
        step="0.1"
        value={store.zoom}
        onChange={(e) => store.setZoom(parseFloat(e.target.value))}
      />
    </div>
  )
}
```

## API Reference

### Types

#### `PanoramaMetadata`

```ts
interface PanoramaMetadata {
  id: string
  title: string
  description: string
  imageUrl: string
  thumbnail?: string
  width?: number
  height?: number
  fov?: number
  createdAt?: string
  tags?: string[]
}
```

#### `PanoramaState`

```ts
interface PanoramaState {
  selectedPanoramaId: string | null
  isVRMode: boolean
  zoom: number
  rotation: { x: number; y: number }
}
```

### Library Functions (`lib/panoramas.ts`)

#### `getPanoramaConfig(): PanoramaConfig`

Get the full panorama configuration with all available panoramas.

```ts
const config = getPanoramaConfig()
console.log(config.panoramas.length) // Available panoramas
```

#### `getPanoramaById(id: string, config?: PanoramaConfig): PanoramaMetadata | undefined`

Retrieve a specific panorama by ID.

```ts
const panorama = getPanoramaById('panorama-1')
if (panorama) {
  console.log(panorama.title)
}
```

#### `getAllPanoramas(config?: PanoramaConfig): PanoramaMetadata[]`

Get all available panoramas.

```ts
const all = getAllPanoramas()
all.forEach(p => console.log(p.title))
```

#### `preloadImage(url: string): Promise<HTMLImageElement>`

Preload an image and return the Image element.

```ts
try {
  const img = await preloadImage('/panoramas/test.jpg')
  console.log('Image loaded:', img.width, img.height)
} catch (error) {
  console.error('Failed to load image')
}
```

#### `preloadPanorama(panorama: PanoramaMetadata): Promise<PanoramaAsset>`

Preload a panorama image and return asset metadata.

```ts
const asset = await preloadPanorama(panorama)
if (asset.isLoaded) {
  console.log('Panorama ready')
} else {
  console.error('Error:', asset.error)
}
```

#### `clampZoom(zoom: number, min?: number, max?: number): number`

Clamp a zoom value between min and max bounds (default: 1 to 5).

```ts
const clamped = clampZoom(2.5) // Returns 2.5
const tooSmall = clampZoom(0.5) // Returns 1
const tooLarge = clampZoom(6) // Returns 5
```

#### `normalizeRotation(rotation: number): number`

Normalize rotation angle to be between 0 and 2π.

```ts
const normalized = normalizeRotation(Math.PI * 3) // Normalized to π
```

### Hooks

#### `usePanoramaControls(containerRef, options)`

Hook for handling panorama viewer input controls.

**Options:**
- `onRotationChange`: Callback for rotation changes
- `onZoomChange`: Callback for zoom changes
- `sensitivity`: Mouse movement sensitivity (default: 0.005)
- `inertiaFactor`: Inertia animation factor (default: 0.95)
- `minZoom`: Minimum zoom level (default: 1)
- `maxZoom`: Maximum zoom level (default: 5)

```ts
const containerRef = useRef<HTMLDivElement>(null)

const controls = usePanoramaControls(containerRef, {
  onRotationChange: (deltaX, deltaY) => {
    console.log('Rotated by:', deltaX, deltaY)
  },
  onZoomChange: (delta) => {
    console.log('Zoom delta:', delta)
  },
})

// Clamp zoom value
const clamped = controls.clampZoom(2.5)
```

### Components

#### `<PanoramaViewer />`

Main 3D panorama viewer component.

**Props:**
- `panorama: PanoramaMetadata` - Panorama to display
- `zoom: number` - Current zoom level
- `rotation: { x: number; y: number }` - Current rotation angles
- `isVRMode: boolean` - VR mode enabled flag
- `onRotationChange: (rotation) => void` - Rotation update callback
- `onZoomChange: (zoom) => void` - Zoom update callback
- `onError?: (error: string) => void` - Error callback
- `onLoadingChange?: (loading: boolean) => void` - Loading state callback

#### `<PanoramaToolbar />`

Control HUD component for panorama selection and settings.

**Props:**
- `panoramas: PanoramaMetadata[]` - Available panoramas
- `selectedId?: string` - Currently selected panorama ID
- `zoom: number` - Current zoom level
- `isVRMode: boolean` - VR mode state
- `onPanoramaSelect: (id: string) => void` - Selection callback
- `onZoomChange: (zoom: number) => void` - Zoom update callback
- `onVRToggle: (isVR: boolean) => void` - VR toggle callback
- `isLoading?: boolean` - Loading state (default: false)
- `error?: string | null` - Error message to display

### Store (`usePanoramaStore`)

Zustand state management store for panorama viewer state.

**Methods:**
- `setSelectedPanoramaId(id: string | null)` - Set selected panorama
- `setVRMode(isVR: boolean)` - Set VR mode
- `setZoom(zoom: number)` - Set zoom level
- `setRotation(rotation: { x, y })` - Set rotation
- `updateRotation(deltaX, deltaY)` - Update rotation with delta values
- `reset()` - Reset to initial state

**State:**
- `selectedPanoramaId: string | null`
- `isVRMode: boolean`
- `zoom: number`
- `rotation: { x: number; y: number }`

## Control Interactions

### Mouse Controls

- **Rotate**: Click and drag with left mouse button
- **Zoom In**: Scroll wheel up
- **Zoom Out**: Scroll wheel down
- **Inertia**: Release while dragging to maintain momentum

### Touch Controls

- **Rotate**: Single finger drag
- **Zoom**: Two-finger pinch gesture
- **Inertia**: Release while dragging to maintain momentum

### Toolbar Controls

- **Panorama Selection**: Dropdown menu to switch between available panoramas
- **Zoom Slider**: Adjust zoom level from 1x to 5x
- **VR Toggle**: Enable/disable VR mode

## Configuration

### Adding Custom Panoramas

Edit `lib/panoramas.ts` to add or modify the panoramas in the `DEFAULT_PANORAMAS` array:

```ts
const DEFAULT_PANORAMAS: PanoramaMetadata[] = [
  {
    id: 'custom-panorama',
    title: 'Custom Title',
    description: 'Custom description',
    imageUrl: '/path/to/image.jpg',
    thumbnail: '/path/to/thumbnail.jpg',
    width: 8192,
    height: 4096,
    fov: 75,
  },
  // ... more panoramas
]
```

### Customizing Control Sensitivity

Adjust the sensitivity in `hooks/usePanoramaControls.ts`:

```ts
const ROTATION_SENSITIVITY = 0.005 // Increase for more responsive rotation
const ZOOM_SENSITIVITY = 0.1        // Increase for more responsive zoom
```

### Customizing Inertia

Modify the `INERTIA_FACTOR` in `hooks/usePanoramaControls.ts`:

```ts
const INERTIA_FACTOR = 0.95 // Higher values = longer inertia duration
```

## Testing

Run tests with:

```bash
yarn test
```

Run tests with UI:

```bash
yarn test:ui
```

Generate coverage report:

```bash
yarn test:coverage
```

### Test Files

- `lib/__tests__/panoramas.test.ts` - Library functions and metadata loader tests
- `hooks/__tests__/usePanoramaControls.test.ts` - Control hook tests
- `components/panorama/__tests__/PanoramaViewer.test.tsx` - Viewer component tests
- `components/panorama/__tests__/PanoramaToolbar.test.tsx` - Toolbar component tests
- `stores/__tests__/panoramaStore.test.ts` - State store tests

## Performance Considerations

1. **Image Preloading**: Images are preloaded before display to avoid visual glitches
2. **Texture Mapping**: Uses EquirectangularReflectionMapping for efficient sphere texture mapping
3. **Geometry Resolution**: Sphere geometry uses 64 width and 32 height segments - adjust for performance
4. **Inertia Animation**: Uses requestAnimationFrame for smooth momentum-based rotation
5. **Event Delegation**: Single event listener per type with efficient state updates

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Panorama Image Not Loading

- Verify image URL is correct and accessible
- Check browser console for CORS errors
- Ensure image is in equirectangular format

### Controls Not Responding

- Check that container element has proper dimensions
- Verify mouse/touch events are not being prevented by other handlers
- Check browser console for JavaScript errors

### Performance Issues

- Reduce sphere geometry resolution in `PanoramaViewer.tsx`
- Compress panorama images to smaller file sizes
- Disable VR mode on lower-end devices

### Mobile Display Issues

- Test on actual mobile devices (not just browser dev tools)
- Ensure full viewport height is available
- Check for CSS conflicts with existing styles

## Future Enhancements

- [ ] HMD (Head-Mounted Display) VR support with device motion
- [ ] Hotspot annotations on panoramas
- [ ] Multi-resolution progressive loading
- [ ] Cubemap format support
- [ ] Automatic camera tilt on mobile devices
- [ ] Panorama transition animations
- [ ] Sound/audio integration
- [ ] Metadata overlay display
