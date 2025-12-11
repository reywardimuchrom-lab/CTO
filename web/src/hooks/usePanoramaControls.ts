import { useRef, useEffect, useCallback } from 'react'
import { ControlState } from '../types/panorama'
import { clampZoom } from '../lib/panoramas'

interface UsePanoramaControlsOptions {
  onRotationChange?: (deltaX: number, deltaY: number) => void
  onZoomChange?: (zoom: number) => void
  sensitivity?: number
  inertiaFactor?: number
  minZoom?: number
  maxZoom?: number
}

const INERTIA_FACTOR = 0.95
const ROTATION_SENSITIVITY = 0.005
const ZOOM_SENSITIVITY = 0.1
const MIN_ZOOM = 1
const MAX_ZOOM = 5

export function usePanoramaControls(
  containerRef: React.RefObject<HTMLDivElement>,
  options: UsePanoramaControlsOptions = {}
) {
  const {
    onRotationChange,
    onZoomChange,
    sensitivity = ROTATION_SENSITIVITY,
    inertiaFactor = INERTIA_FACTOR,
    minZoom = MIN_ZOOM,
    maxZoom = MAX_ZOOM,
  } = options

  const controlState = useRef<ControlState>({
    isDragging: false,
    lastMousePos: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  })

  const velocityAnimationRef = useRef<number | null>(null)

  // Apply inertia animation
  const applyInertia = useCallback(() => {
    const state = controlState.current

    if (state.velocity.x === 0 && state.velocity.y === 0) {
      return
    }

    state.velocity.x *= inertiaFactor
    state.velocity.y *= inertiaFactor

    if (Math.abs(state.velocity.x) > 0.0001 || Math.abs(state.velocity.y) > 0.0001) {
      if (onRotationChange) {
        onRotationChange(state.velocity.x, state.velocity.y)
      }
      velocityAnimationRef.current = requestAnimationFrame(applyInertia)
    } else {
      state.velocity = { x: 0, y: 0 }
      velocityAnimationRef.current = null
    }
  }, [inertiaFactor, onRotationChange])

  // Handle mouse down
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (velocityAnimationRef.current !== null) {
      cancelAnimationFrame(velocityAnimationRef.current)
      velocityAnimationRef.current = null
    }

    controlState.current.isDragging = true
    controlState.current.lastMousePos = { x: e.clientX, y: e.clientY }
    controlState.current.velocity = { x: 0, y: 0 }
  }, [])

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const state = controlState.current

      if (!state.isDragging) {
        return
      }

      const deltaX = e.clientX - state.lastMousePos.x
      const deltaY = e.clientY - state.lastMousePos.y

      state.velocity = {
        x: deltaX * sensitivity,
        y: deltaY * sensitivity,
      }

      if (onRotationChange) {
        onRotationChange(state.velocity.x, state.velocity.y)
      }

      state.lastMousePos = { x: e.clientX, y: e.clientY }
    },
    [sensitivity, onRotationChange]
  )

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    controlState.current.isDragging = false

    if (
      Math.abs(controlState.current.velocity.x) > 0.0001 ||
      Math.abs(controlState.current.velocity.y) > 0.0001
    ) {
      velocityAnimationRef.current = requestAnimationFrame(applyInertia)
    }
  }, [applyInertia])

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()

      const zoomDelta = e.deltaY > 0 ? -ZOOM_SENSITIVITY : ZOOM_SENSITIVITY
      if (onZoomChange) {
        onZoomChange(zoomDelta)
      }
    },
    [onZoomChange]
  )

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      controlState.current.isDragging = true
      const touch = e.touches[0]
      controlState.current.lastMousePos = { x: touch.clientX, y: touch.clientY }
      controlState.current.velocity = { x: 0, y: 0 }
    } else if (e.touches.length === 2) {
      controlState.current.isDragging = false
    }
  }, [])

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const state = controlState.current

      if (e.touches.length === 1 && state.isDragging) {
        const touch = e.touches[0]
        const deltaX = touch.clientX - state.lastMousePos.x
        const deltaY = touch.clientY - state.lastMousePos.y

        state.velocity = {
          x: deltaX * sensitivity,
          y: deltaY * sensitivity,
        }

        if (onRotationChange) {
          onRotationChange(state.velocity.x, state.velocity.y)
        }

        state.lastMousePos = { x: touch.clientX, y: touch.clientY }
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )

        if (state.lastMousePos) {
          const prevDistance = state.lastMousePos.x
          const zoomDelta = (currentDistance - prevDistance) * ZOOM_SENSITIVITY * 0.01
          if (onZoomChange) {
            onZoomChange(zoomDelta)
          }
          state.lastMousePos.x = currentDistance
        }
      }
    },
    [sensitivity, onRotationChange, onZoomChange]
  )

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    const state = controlState.current
    state.isDragging = false

    if (
      Math.abs(state.velocity.x) > 0.0001 ||
      Math.abs(state.velocity.y) > 0.0001
    ) {
      velocityAnimationRef.current = requestAnimationFrame(applyInertia)
    }
  }, [applyInertia])

  // Attach event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)

      if (velocityAnimationRef.current !== null) {
        cancelAnimationFrame(velocityAnimationRef.current)
      }
    }
  }, [
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ])

  return {
    setZoom: (zoom: number) => {
      onZoomChange?.(zoom)
    },
    clampZoom: (zoom: number) => clampZoom(zoom, minZoom, maxZoom),
  }
}
