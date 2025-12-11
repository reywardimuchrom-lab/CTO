/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { PanoramaMetadata } from '../../types/panorama'
import { usePanoramaControls } from '../../hooks/usePanoramaControls'
import { clampZoom } from '../../lib/panoramas'
import styles from './PanoramaViewer.module.css'

interface PanoramaViewerProps {
  panorama: PanoramaMetadata
  zoom: number
  rotation: { x: number; y: number }
  isVRMode: boolean
  onRotationChange: (rotation: { x: number; y: number }) => void
  onZoomChange: (zoom: number) => void
  onError?: (error: string) => void
  onLoadingChange?: (loading: boolean) => void
}

interface PanoramaSphereProps {
  panorama: PanoramaMetadata
  zoom: number
  rotation: { x: number; y: number }
  onError?: (error: string) => void
  onLoadingChange?: (loading: boolean) => void
}

function PanoramaSphere({
  panorama,
  zoom,
  rotation,
  onError,
  onLoadingChange,
}: PanoramaSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const textureRef = useRef<THREE.Texture | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const textureLoader = useMemo(() => new THREE.TextureLoader(), [])

  useEffect(() => {
    if (!onLoadingChange) return

    onLoadingChange(!isLoaded)
  }, [isLoaded, onLoadingChange])

  useEffect(() => {
    const loadTexture = async () => {
      setIsLoaded(false)

      try {
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            panorama.imageUrl,
            (texture: THREE.Texture) => {
              texture.mapping = THREE.EquirectangularReflectionMapping
              resolve(texture)
            },
            undefined,
            (error: unknown) => {
              reject(error)
            }
          )
        })

        textureRef.current = texture
        setIsLoaded(true)

        if (meshRef.current && meshRef.current.material instanceof THREE.MeshBasicMaterial) {
          meshRef.current.material.map = texture
          meshRef.current.material.needsUpdate = true
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load panorama image'
        onError?.(errorMessage)
        setIsLoaded(false)
      }
    }

    loadTexture()

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose()
      }
    }
  }, [panorama.imageUrl, textureLoader, onError])

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation.x
      meshRef.current.rotation.y = rotation.y
    }
  }, [rotation])

  // Calculate fov based on zoom
  const fov = (panorama.fov || 75) / zoom

  return (
    <>
      <PerspectiveCamera fov={fov} position={[0, 0, 0.1]} />
      <mesh ref={meshRef} scale={-1}>
        <sphereGeometry args={[500, 64, 32]} />
        <meshBasicMaterial color={0x000000} map={textureRef.current} />
      </mesh>
    </>
  )
}

interface PerspectiveCameraProps {
  fov: number
  position: [number, number, number]
}

function PerspectiveCamera({ fov, position }: PerspectiveCameraProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = fov
      cameraRef.current.updateProjectionMatrix()
    }
  }, [fov])

  return (
    <>
      <perspectiveCamera
        ref={cameraRef}
        args={[fov, window.innerWidth / window.innerHeight, 0.1, 10000]}
        position={position}
      />
    </>
  )
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({
  panorama,
  zoom,
  rotation,
  isVRMode,
  onRotationChange,
  onZoomChange,
  onError,
  onLoadingChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [clampedZoom, setClampedZoom] = useState(zoom)
  const [localRotation, setLocalRotation] = useState(rotation)

  // Use controls hook
  usePanoramaControls(containerRef, {
    onRotationChange: (deltaX, deltaY) => {
      setLocalRotation(prev => ({
        x: prev.x + deltaY,
        y: prev.y + deltaX,
      }))
      onRotationChange({
        x: localRotation.x + deltaY,
        y: localRotation.y + deltaX,
      })
    },
    onZoomChange: (delta) => {
      const newZoom = clampZoom(clampedZoom + delta, 1, 5)
      setClampedZoom(newZoom)
      onZoomChange(newZoom)
    },
    sensitivity: 0.01,
    minZoom: 1,
    maxZoom: 5,
  })

  // Update local state when external rotation changes
  useEffect(() => {
    setLocalRotation(rotation)
  }, [rotation])

  // Update clamped zoom when external zoom changes
  useEffect(() => {
    setClampedZoom(zoom)
  }, [zoom])

  const canvasStyle: React.CSSProperties = {
    display: 'block',
    cursor: isVRMode ? 'grab' : 'grab',
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.viewer} ${isVRMode ? styles.vrMode : ''}`}
    >
      <Canvas
        style={canvasStyle}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
        }}
      >
        <PanoramaSphere
          panorama={panorama}
          zoom={clampedZoom}
          rotation={localRotation}
          onError={onError}
          onLoadingChange={onLoadingChange}
        />
      </Canvas>
    </div>
  )
}
