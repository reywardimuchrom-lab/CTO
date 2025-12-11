import { useState, useEffect, useCallback } from 'react'
import { PanoramaViewer } from '../components/panorama/PanoramaViewer'
import { PanoramaToolbar } from '../components/panorama/PanoramaToolbar'
import { usePanoramaStore } from '../stores/panoramaStore'
import { getPanoramaConfig, preloadPanorama } from '../lib/panoramas'
import { PanoramaMetadata } from '../types/panorama'
import styles from './PanoramaPage.module.css'

export default function PanoramaPage() {
  const store = usePanoramaStore()
  const [panoramas, setPanoramas] = useState<PanoramaMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedPanorama = panoramas.find(p => p.id === store.selectedPanoramaId)

  // Load panoramas configuration
  useEffect(() => {
    try {
      const config = getPanoramaConfig()
      setPanoramas(config.panoramas)

      // Set first panorama as default if none selected
      if (!store.selectedPanoramaId && config.panoramas.length > 0) {
        store.setSelectedPanoramaId(config.panoramas[0].id)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load panoramas'
      setError(errorMessage)
    }
  }, [store])

  // Preload selected panorama
  useEffect(() => {
    if (!selectedPanorama) return

    const loadPanorama = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const asset = await preloadPanorama(selectedPanorama)
        if (!asset.isLoaded) {
          setError(asset.error || 'Failed to load panorama')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load panorama'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadPanorama()
  }, [selectedPanorama])

  const handlePanoramaSelect = useCallback(
    (id: string) => {
      store.setSelectedPanoramaId(id)
    },
    [store]
  )

  const handleZoomChange = useCallback(
    (zoom: number) => {
      store.setZoom(zoom)
    },
    [store]
  )

  const handleVRToggle = useCallback(
    (isVR: boolean) => {
      store.setVRMode(isVR)
    },
    [store]
  )

  const handleRotationChange = useCallback(
    (rotation: { x: number; y: number }) => {
      store.setRotation(rotation)
    },
    [store]
  )

  if (!selectedPanorama) {
    return (
      <div className={styles.container}>
        <div className={styles.noContent}>
          <p>No panoramas available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <PanoramaToolbar
        panoramas={panoramas}
        selectedId={store.selectedPanoramaId || undefined}
        zoom={store.zoom}
        isVRMode={store.isVRMode}
        onPanoramaSelect={handlePanoramaSelect}
        onZoomChange={handleZoomChange}
        onVRToggle={handleVRToggle}
        isLoading={isLoading}
        error={error}
      />

      <PanoramaViewer
        panorama={selectedPanorama}
        zoom={store.zoom}
        rotation={store.rotation}
        isVRMode={store.isVRMode}
        onRotationChange={handleRotationChange}
        onZoomChange={handleZoomChange}
        onError={setError}
        onLoadingChange={setIsLoading}
      />
    </div>
  )
}
