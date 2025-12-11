import { describe, it, expect, beforeEach } from 'vitest'
import { usePanoramaStore } from '../panoramaStore'

describe('usePanoramaStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = usePanoramaStore()
    store.reset()
  })

  it('should have initial state', () => {
    const store = usePanoramaStore()

    expect(store.selectedPanoramaId).toBeNull()
    expect(store.isVRMode).toBe(false)
    expect(store.zoom).toBe(1)
    expect(store.rotation).toEqual({ x: 0, y: 0 })
  })

  it('should set selected panorama id', () => {
    const store = usePanoramaStore()

    store.setSelectedPanoramaId('test-id')

    expect(store.selectedPanoramaId).toBe('test-id')
  })

  it('should clear selected panorama id', () => {
    const store = usePanoramaStore()

    store.setSelectedPanoramaId('test-id')
    store.setSelectedPanoramaId(null)

    expect(store.selectedPanoramaId).toBeNull()
  })

  it('should set VR mode', () => {
    const store = usePanoramaStore()

    store.setVRMode(true)

    expect(store.isVRMode).toBe(true)
  })

  it('should toggle VR mode', () => {
    const store = usePanoramaStore()

    store.setVRMode(true)
    expect(store.isVRMode).toBe(true)

    store.setVRMode(false)
    expect(store.isVRMode).toBe(false)
  })

  it('should set zoom level', () => {
    const store = usePanoramaStore()

    store.setZoom(2.5)

    expect(store.zoom).toBe(2.5)
  })

  it('should set rotation', () => {
    const store = usePanoramaStore()
    const newRotation = { x: Math.PI / 4, y: Math.PI / 2 }

    store.setRotation(newRotation)

    expect(store.rotation).toEqual(newRotation)
  })

  it('should update rotation with delta values', () => {
    const store = usePanoramaStore()

    store.updateRotation(0.1, 0.2)

    expect(store.rotation.x).toBe(0.2)
    expect(store.rotation.y).toBe(0.1)
  })

  it('should accumulate rotation updates', () => {
    const store = usePanoramaStore()

    store.updateRotation(0.1, 0.2)
    store.updateRotation(0.05, 0.1)

    expect(store.rotation.x).toBe(0.3)
    expect(store.rotation.y).toBe(0.15)
  })

  it('should reset to initial state', () => {
    const store = usePanoramaStore()

    store.setSelectedPanoramaId('test-id')
    store.setVRMode(true)
    store.setZoom(3)
    store.setRotation({ x: 1, y: 2 })

    store.reset()

    expect(store.selectedPanoramaId).toBeNull()
    expect(store.isVRMode).toBe(false)
    expect(store.zoom).toBe(1)
    expect(store.rotation).toEqual({ x: 0, y: 0 })
  })

  it('should handle multiple state changes in sequence', () => {
    const store = usePanoramaStore()

    store.setSelectedPanoramaId('panorama-1')
    store.setZoom(1.5)
    store.setVRMode(true)
    store.updateRotation(0.5, 0.5)

    expect(store.selectedPanoramaId).toBe('panorama-1')
    expect(store.zoom).toBe(1.5)
    expect(store.isVRMode).toBe(true)
    expect(store.rotation).toEqual({ x: 0.5, y: 0.5 })
  })

  it('should persist state across multiple store accesses', () => {
    const store1 = usePanoramaStore()
    store1.setSelectedPanoramaId('test-id')
    store1.setZoom(2)

    const store2 = usePanoramaStore()

    expect(store2.selectedPanoramaId).toBe('test-id')
    expect(store2.zoom).toBe(2)
  })
})
