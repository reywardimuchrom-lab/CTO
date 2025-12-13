export interface PanoramaMetadata {
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

export interface PanoramaConfig {
  panoramas: PanoramaMetadata[]
}

export interface PanoramaState {
  selectedPanoramaId: string | null
  isVRMode: boolean
  zoom: number
  rotation: { x: number; y: number }
}

export interface ControlState {
  isDragging: boolean
  lastMousePos: { x: number; y: number }
  velocity: { x: number; y: number }
}

export interface PanoramaAsset {
  id: string
  image: HTMLImageElement
  isLoaded: boolean
  error?: string
}
