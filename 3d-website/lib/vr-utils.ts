export const checkVRSupport = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  if ('xr' in navigator) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isSupported = await (navigator as any).xr?.isSessionSupported('immersive-vr');
      return isSupported || false;
    } catch (error) {
      console.error('Error checking VR support:', error);
      return false;
    }
  }
  return false;
};

export const initWebXRPolyfill = async () => {
  if (typeof window !== 'undefined' && !('xr' in navigator)) {
    const WebXRPolyfill = (await import('webxr-polyfill')).default;
    new WebXRPolyfill();
  }
};
