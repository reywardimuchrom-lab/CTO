import { create } from 'zustand'
import { PanoramaState } from '../types/panorama'

interface PanoramaStoreState extends PanoramaState {
  setSelectedPanoramaId: (id: string | null) => void
  setVRMode: (isVR: boolean) => void
  setZoom: (zoom: number) => void
  setRotation: (rotation: { x: number; y: number }) => void
  updateRotation: (deltaX: number, deltaY: number) => void
  reset: () => void
}

const initialState: PanoramaState = {
  selectedPanoramaId: null,
  isVRMode: false,
  zoom: 1,
  rotation: { x: 0, y: 0 },
}

export const usePanoramaStore = create<PanoramaStoreState>(set => ({
  ...initialState,

  setSelectedPanoramaId: (id: string | null) =>
    set({ selectedPanoramaId: id }),

  setVRMode: (isVR: boolean) => set({ isVRMode: isVR }),

  setZoom: (zoom: number) => set({ zoom }),

  setRotation: (rotation: { x: number; y: number }) => set({ rotation }),

  updateRotation: (deltaX: number, deltaY: number) =>
    set(state => ({
      rotation: {
        x: state.rotation.x + deltaX,
        y: state.rotation.y + deltaY,
      },
    })),

  reset: () => set(initialState),
}))
