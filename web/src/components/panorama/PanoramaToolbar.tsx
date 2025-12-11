import React, { useState } from 'react'
import { PanoramaMetadata } from '../../types/panorama'
import styles from './PanoramaToolbar.module.css'

interface PanoramaToolbarProps {
  panoramas: PanoramaMetadata[]
  selectedId?: string
  zoom: number
  isVRMode: boolean
  onPanoramaSelect: (id: string) => void
  onZoomChange: (zoom: number) => void
  onVRToggle: (isVR: boolean) => void
  isLoading?: boolean
  error?: string | null
}

export const PanoramaToolbar: React.FC<PanoramaToolbarProps> = ({
  panoramas,
  selectedId,
  zoom,
  isVRMode,
  onPanoramaSelect,
  onZoomChange,
  onVRToggle,
  isLoading = false,
  error = null,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const selectedPanorama = panoramas.find(p => p.id === selectedId)

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onZoomChange(parseFloat(e.target.value))
  }

  const handlePanoramaSelect = (id: string) => {
    onPanoramaSelect(id)
    setShowDropdown(false)
  }

  const handleVRToggle = () => {
    onVRToggle(!isVRMode)
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.container}>
        {/* Panorama Selector */}
        <div className={styles.selector}>
          <button
            className={styles.selectButton}
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isLoading}
            aria-label="Select panorama"
          >
            <span className={styles.selectLabel}>
              {selectedPanorama?.title || 'Select Panorama'}
            </span>
            <span className={styles.selectIcon}>▼</span>
          </button>

          {showDropdown && (
            <div className={styles.dropdown}>
              {panoramas.map(panorama => (
                <button
                  key={panorama.id}
                  className={`${styles.dropdownItem} ${
                    panorama.id === selectedId ? styles.active : ''
                  }`}
                  onClick={() => handlePanoramaSelect(panorama.id)}
                >
                  {panorama.thumbnail && (
                    <img
                      src={panorama.thumbnail}
                      alt={panorama.title}
                      className={styles.thumbnail}
                    />
                  )}
                  <span>{panorama.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom Control */}
        <div className={styles.zoomControl}>
          <label htmlFor="zoom-slider" className={styles.zoomLabel}>
            Zoom: {zoom.toFixed(1)}x
          </label>
          <input
            id="zoom-slider"
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
            className={styles.zoomSlider}
            disabled={isLoading}
            aria-label="Zoom level"
          />
        </div>

        {/* VR Toggle */}
        <button
          className={`${styles.vrButton} ${isVRMode ? styles.active : ''}`}
          onClick={handleVRToggle}
          disabled={isLoading}
          aria-label="Toggle VR mode"
          title="Toggle VR Mode"
        >
          <span className={styles.vrIcon}>🥽</span>
          <span className={styles.vrText}>{isVRMode ? 'VR On' : 'VR Off'}</span>
        </button>
      </div>

      {/* Status Messages */}
      {isLoading && (
        <div className={styles.status}>
          <span className={styles.loading}>Loading panorama...</span>
        </div>
      )}

      {error && (
        <div className={`${styles.status} ${styles.error}`}>
          <span className={styles.errorText}>{error}</span>
        </div>
      )}
    </div>
  )
}
