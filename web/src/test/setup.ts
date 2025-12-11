import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock Canvas rendering context
HTMLCanvasElement.prototype.getContext = () => null

// Mock requestAnimationFrame
if (typeof globalThis !== 'undefined') {
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(callback, 0) as unknown as number
  }

  globalThis.cancelAnimationFrame = (id: number) => {
    clearTimeout(id)
  }
}
