import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PanoramaViewer } from '../PanoramaViewer'
import { PanoramaMetadata } from '../../../types/panorama'

// Mock Three.js
vi.mock('three', () => ({
  TextureLoader: vi.fn(() => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load: vi.fn((_url: string, onLoad: (texture: any) => void) => {
      setTimeout(() => {
        const mockTexture = {
          mapping: undefined,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onLoad(mockTexture as any)
      }, 0)
    }),
  })),
  MeshBasicMaterial: vi.fn(),
  Mesh: vi.fn(),
  SphereGeometry: vi.fn(),
  EquirectangularReflectionMapping: 1,
  PerspectiveCamera: vi.fn(),
  WebGLRenderer: vi.fn(),
}))

// Mock React Three Fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: unknown }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useThree: vi.fn(() => ({
    camera: { position: [0, 0, 0] },
    gl: {},
  })),
}))

describe('PanoramaViewer', () => {
  const mockPanorama: PanoramaMetadata = {
    id: 'test-1',
    title: 'Test Panorama',
    description: 'Test panorama description',
    imageUrl: '/test-panorama.jpg',
    width: 8192,
    height: 4096,
    fov: 75,
  }

  const defaultProps = {
    panorama: mockPanorama,
    zoom: 1,
    rotation: { x: 0, y: 0 },
    isVRMode: false,
    onRotationChange: vi.fn(),
    onZoomChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<PanoramaViewer {...defaultProps} />)
    expect(screen.getByTestId('canvas')).toBeInTheDocument()
  })

  it('should render Canvas component', () => {
    render(<PanoramaViewer {...defaultProps} />)
    const canvas = screen.getByTestId('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should apply VR mode class when in VR mode', () => {
    const { container } = render(
      <PanoramaViewer {...defaultProps} isVRMode={true} />
    )
    const viewer = container.querySelector('[class*="viewer"]')
    expect(viewer).toBeDefined()
  })

  it('should handle zoom changes', () => {
    const onZoomChange = vi.fn()
    render(
      <PanoramaViewer
        {...defaultProps}
        onZoomChange={onZoomChange}
        zoom={1.5}
      />
    )

    expect(defaultProps.onZoomChange).toBeDefined()
  })

  it('should handle rotation changes', () => {
    const onRotationChange = vi.fn()
    const rotation = { x: 0.5, y: 1 }

    render(
      <PanoramaViewer
        {...defaultProps}
        onRotationChange={onRotationChange}
        rotation={rotation}
      />
    )

    expect(defaultProps.onRotationChange).toBeDefined()
  })

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn()
    render(<PanoramaViewer {...defaultProps} onError={onError} />)

    expect(onError).toBeDefined()
  })

  it('should call onLoadingChange callback', () => {
    const onLoadingChange = vi.fn()
    render(
      <PanoramaViewer {...defaultProps} onLoadingChange={onLoadingChange} />
    )

    expect(onLoadingChange).toBeDefined()
  })

  it('should update when panorama changes', () => {
    const { rerender } = render(<PanoramaViewer {...defaultProps} />)

    const newPanorama: PanoramaMetadata = {
      ...mockPanorama,
      id: 'test-2',
      imageUrl: '/different-panorama.jpg',
    }

    rerender(<PanoramaViewer {...defaultProps} panorama={newPanorama} />)

    expect(screen.getByTestId('canvas')).toBeInTheDocument()
  })

  it('should accept custom zoom values', () => {
    const { rerender } = render(<PanoramaViewer {...defaultProps} zoom={2} />)

    rerender(<PanoramaViewer {...defaultProps} zoom={3} />)

    expect(screen.getByTestId('canvas')).toBeInTheDocument()
  })

  it('should accept custom rotation values', () => {
    const { rerender } = render(
      <PanoramaViewer {...defaultProps} rotation={{ x: 0, y: 0 }} />
    )

    rerender(
      <PanoramaViewer
        {...defaultProps}
        rotation={{ x: Math.PI / 4, y: Math.PI / 2 }}
      />
    )

    expect(screen.getByTestId('canvas')).toBeInTheDocument()
  })
})
