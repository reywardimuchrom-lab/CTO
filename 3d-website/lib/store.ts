import { create } from 'zustand';
import { AppState } from '@/types';

export const useAppStore = create<AppState>(set => ({
  scenes: [],
  currentScene: null,
  vrState: {
    isVRSupported: false,
    isVRActive: false,
    isXRSessionActive: false,
    error: null,
  },
  isLoading: false,

  setCurrentScene: scene => set({ currentScene: scene }),

  setVRSupported: supported =>
    set(state => ({
      vrState: { ...state.vrState, isVRSupported: supported },
    })),

  setVRActive: active =>
    set(state => ({
      vrState: { ...state.vrState, isVRActive: active },
    })),

  setXRSessionActive: active =>
    set(state => ({
      vrState: { ...state.vrState, isXRSessionActive: active },
    })),

  setError: error =>
    set(state => ({
      vrState: { ...state.vrState, error },
    })),

  setLoading: loading => set({ isLoading: loading }),

  addScene: scene =>
    set(state => ({
      scenes: [...state.scenes, scene],
    })),
}));
