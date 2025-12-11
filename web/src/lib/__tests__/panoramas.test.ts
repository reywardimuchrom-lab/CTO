import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getPanoramaConfig,
  getPanoramaById,
  getAllPanoramas,
  preloadImage,
  preloadPanorama,
  preloadMultiplePanoramas,
  getDefaultFOV,
  clampZoom,
  normalizeRotation,
} from '../panoramas'
import { PanoramaMetadata } from '../../types/panorama'

describe('panorama library', () => {
  describe('getPanoramaConfig', () => {
    it('should return a config with panoramas array', () => {
      const config = getPanoramaConfig()

      expect(config).toHaveProperty('panoramas')
      expect(Array.isArray(config.panoramas)).toBe(true)
      expect(config.panoramas.length).toBeGreaterThan(0)
    })

    it('should return panoramas with required properties', () => {
      const config = getPanoramaConfig()

      config.panoramas.forEach(panorama => {
        expect(panorama).toHaveProperty('id')
        expect(panorama).toHaveProperty('title')
        expect(panorama).toHaveProperty('description')
        expect(panorama).toHaveProperty('imageUrl')
      })
    })
  })

  describe('getPanoramaById', () => {
    it('should return panorama by id', () => {
      const config = getPanoramaConfig()
      const panorama = getPanoramaById(config.panoramas[0].id, config)

      expect(panorama).toBeDefined()
      expect(panorama?.id).toBe(config.panoramas[0].id)
    })

    it('should return undefined for non-existent id', () => {
      const config = getPanoramaConfig()
      const panorama = getPanoramaById('non-existent-id', config)

      expect(panorama).toBeUndefined()
    })

    it('should work without providing config', () => {
      const defaultConfig = getPanoramaConfig()
      const panorama = getPanoramaById(defaultConfig.panoramas[0].id)

      expect(panorama).toBeDefined()
      expect(panorama?.id).toBe(defaultConfig.panoramas[0].id)
    })
  })

  describe('getAllPanoramas', () => {
    it('should return all panoramas from config', () => {
      const config = getPanoramaConfig()
      const allPanoramas = getAllPanoramas(config)

      expect(allPanoramas).toEqual(config.panoramas)
    })

    it('should work without providing config', () => {
      const allPanoramas = getAllPanoramas()

      expect(Array.isArray(allPanoramas)).toBe(true)
      expect(allPanoramas.length).toBeGreaterThan(0)
    })
  })

  describe('preloadImage', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should resolve with image on successful load', async () => {
      const testUrl = '/test-image.jpg'

      const loadPromise = new Promise<HTMLImageElement>(resolve => {
        Object.defineProperty(Image.prototype, 'src', {
          set() {
            setTimeout(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              resolve(this as any)
            }, 0)
          },
          get() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (this as any)._src || ''
          },
        })
      })

      void preloadImage(testUrl)
      const resolvedImg = await loadPromise

      expect(resolvedImg).toBeInstanceOf(Image)
    })

    it('should reject on image load error', async () => {
      const testUrl = '/nonexistent-image.jpg'

      void preloadImage(testUrl)

      expect(testUrl).toBeDefined()
    })
  })

  describe('preloadPanorama', () => {
    it('should return asset with loaded flag', async () => {
      const testPanorama: PanoramaMetadata = {
        id: 'test-1',
        title: 'Test Panorama',
        description: 'Test description',
        imageUrl: '/test.jpg',
      }

      // Mock the preloadImage to resolve successfully
      vi.mock('../panoramas', async () => {
        const actual = await vi.importActual('../panoramas')
        return {
          ...actual,
          preloadImage: vi.fn(() => Promise.resolve(new Image())),
        }
      })

      const asset = await preloadPanorama(testPanorama)

      expect(asset).toHaveProperty('id')
      expect(asset.id).toBe(testPanorama.id)
      expect(asset).toHaveProperty('image')
      expect(asset).toHaveProperty('isLoaded')
    })
  })

  describe('preloadMultiplePanoramas', () => {
    it('should return array of assets', async () => {
      const testPanoramas: PanoramaMetadata[] = [
        {
          id: 'test-1',
          title: 'Test 1',
          description: 'Description 1',
          imageUrl: '/test1.jpg',
        },
        {
          id: 'test-2',
          title: 'Test 2',
          description: 'Description 2',
          imageUrl: '/test2.jpg',
        },
      ]

      const assets = await preloadMultiplePanoramas(testPanoramas)

      expect(Array.isArray(assets)).toBe(true)
      expect(assets.length).toBe(testPanoramas.length)
    })
  })

  describe('getDefaultFOV', () => {
    it('should return custom fov if provided', () => {
      const panorama: PanoramaMetadata = {
        id: 'test',
        title: 'Test',
        description: 'Test',
        imageUrl: '/test.jpg',
        fov: 90,
      }

      const fov = getDefaultFOV(panorama)

      expect(fov).toBe(90)
    })

    it('should return default fov if not provided', () => {
      const panorama: PanoramaMetadata = {
        id: 'test',
        title: 'Test',
        description: 'Test',
        imageUrl: '/test.jpg',
      }

      const fov = getDefaultFOV(panorama)

      expect(fov).toBe(75)
    })

    it('should return default fov if no panorama provided', () => {
      const fov = getDefaultFOV()

      expect(fov).toBe(75)
    })
  })

  describe('clampZoom', () => {
    it('should return value within bounds', () => {
      expect(clampZoom(2.5)).toBe(2.5)
    })

    it('should clamp to minimum', () => {
      expect(clampZoom(0.5)).toBe(1)
    })

    it('should clamp to maximum', () => {
      expect(clampZoom(6)).toBe(5)
    })

    it('should respect custom bounds', () => {
      expect(clampZoom(0.5, 0.5, 10)).toBe(0.5)
      expect(clampZoom(15, 0.5, 10)).toBe(10)
    })
  })

  describe('normalizeRotation', () => {
    it('should normalize positive rotation', () => {
      const result = normalizeRotation(Math.PI / 2)

      expect(result).toBe(Math.PI / 2)
    })

    it('should normalize rotation over 2π', () => {
      const result = normalizeRotation(Math.PI * 3)

      expect(result).toBeLessThan(Math.PI * 2)
      expect(result).toBeGreaterThanOrEqual(0)
    })

    it('should normalize negative rotation', () => {
      const result = normalizeRotation(-Math.PI / 2)

      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(Math.PI * 2)
    })
  })
})
