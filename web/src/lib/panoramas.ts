import { PanoramaConfig, PanoramaMetadata, PanoramaAsset } from '../types/panorama'

// Default panorama configuration
const DEFAULT_PANORAMAS: PanoramaMetadata[] = [
  {
    id: 'panorama-1',
    title: 'Mountain Vista',
    description: 'A beautiful panoramic view of mountain landscape',
    imageUrl: '/panoramas/mountain.jpg',
    thumbnail: '/panoramas/mountain-thumb.jpg',
    width: 8192,
    height: 4096,
    fov: 75,
  },
  {
    id: 'panorama-2',
    title: 'Urban Skyline',
    description: 'City skyline at sunset',
    imageUrl: '/panoramas/city.jpg',
    thumbnail: '/panoramas/city-thumb.jpg',
    width: 8192,
    height: 4096,
    fov: 75,
  },
  {
    id: 'panorama-3',
    title: 'Ocean Horizon',
    description: 'Serene ocean view',
    imageUrl: '/panoramas/ocean.jpg',
    thumbnail: '/panoramas/ocean-thumb.jpg',
    width: 8192,
    height: 4096,
    fov: 75,
  },
]

export function getPanoramaConfig(): PanoramaConfig {
  return {
    panoramas: DEFAULT_PANORAMAS,
  }
}

export function getPanoramaById(
  id: string,
  config?: PanoramaConfig
): PanoramaMetadata | undefined {
  const fullConfig = config || getPanoramaConfig()
  return fullConfig.panoramas.find(p => p.id === id)
}

export function getAllPanoramas(config?: PanoramaConfig): PanoramaMetadata[] {
  const fullConfig = config || getPanoramaConfig()
  return fullConfig.panoramas
}

export async function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}

export async function preloadPanorama(
  panorama: PanoramaMetadata
): Promise<PanoramaAsset> {
  try {
    const image = await preloadImage(panorama.imageUrl)
    return {
      id: panorama.id,
      image,
      isLoaded: true,
    }
  } catch (error) {
    return {
      id: panorama.id,
      image: new Image(),
      isLoaded: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function preloadMultiplePanoramas(
  panoramas: PanoramaMetadata[]
): Promise<PanoramaAsset[]> {
  return Promise.all(panoramas.map(preloadPanorama))
}

export function getDefaultFOV(panorama?: PanoramaMetadata): number {
  return panorama?.fov || 75
}

export function clampZoom(zoom: number, min: number = 1, max: number = 5): number {
  return Math.max(min, Math.min(max, zoom))
}

export function normalizeRotation(rotation: number): number {
  let normalized = rotation % (Math.PI * 2)
  if (normalized < 0) {
    normalized += Math.PI * 2
  }
  return normalized
}
