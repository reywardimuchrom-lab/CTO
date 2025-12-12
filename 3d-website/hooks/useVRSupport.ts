import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { checkVRSupport, initWebXRPolyfill } from '@/lib/vr-utils';

export function useVRSupport() {
  const { vrState, setVRSupported, setError } = useAppStore();

  useEffect(() => {
    const initVR = async () => {
      try {
        await initWebXRPolyfill();
        const isSupported = await checkVRSupport();
        setVRSupported(isSupported);
      } catch (error) {
        console.error('VR initialization error:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize VR');
      }
    };

    initVR();
  }, [setVRSupported, setError]);

  return vrState;
}
