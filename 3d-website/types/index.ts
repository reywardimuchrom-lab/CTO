export interface Scene {
  id: string;
  name: string;
  description: string;
  type: 'panorama' | 'model' | 'mixed';
  assetPath: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
}

export interface VRState {
  isVRSupported: boolean;
  isVRActive: boolean;
  isXRSessionActive: boolean;
  error: string | null;
}

export interface AppState {
  scenes: Scene[];
  currentScene: Scene | null;
  vrState: VRState;
  isLoading: boolean;
  setCurrentScene: (scene: Scene | null) => void;
  setVRSupported: (supported: boolean) => void;
  setVRActive: (active: boolean) => void;
  setXRSessionActive: (active: boolean) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  addScene: (scene: Scene) => void;
}

export interface ViewerProps {
  scene: Scene;
  enableVR?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}
