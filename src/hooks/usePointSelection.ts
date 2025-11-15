import { useState, useCallback } from 'react'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'

/**
 * Return type for usePointSelection hook
 */
export interface UsePointSelectionReturn {
  selectedPoint: ElectrophysiologyPoint | null
  hoveredPoint: ElectrophysiologyPoint | null
  pinnedPoints: ElectrophysiologyPoint[]

  handleSelectPoint: (point: ElectrophysiologyPoint) => void
  handleHoverPoint: (point: ElectrophysiologyPoint | null) => void
  handlePinPoint: () => void
  handleDeselectPoint: () => void
  handleUnpinPoint: (point: ElectrophysiologyPoint) => void

  isPointPinned: (point: ElectrophysiologyPoint) => boolean
  canPinPoint: () => boolean
  clearAllPinnedPoints: () => void
}

/**
 * Custom hook to manage point selection, hover, and pinning states
 *
 * Encapsulates all business logic related to point states:
 * - Hovered: Temporarily frozen point on mouse hover
 * - Selected: Persistent selection until deselection or new selection
 * - Pinned: Permanently pinned points with visual indicators
 *
 * @returns {UsePointSelectionReturn} Object containing states and handlers
 *
 * @example
 */
export function usePointSelection(): UsePointSelectionReturn {
  const [selectedPoint, setSelectedPoint] = useState<ElectrophysiologyPoint | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<ElectrophysiologyPoint | null>(null)
  const [pinnedPoints, setPinnedPoints] = useState<ElectrophysiologyPoint[]>([])

  /**
   * Check if a point is already pinned
   * Uses both id and timestamp to uniquely identify a point
   */
  const isPointPinned = useCallback(
    (point: ElectrophysiologyPoint): boolean => {
      return pinnedPoints.some((p) => p.id === point.id && p.timestamp === point.timestamp)
    },
    [pinnedPoints]
  )

  /**
   * Check if the current selected point can be pinned
   * Returns false if no point is selected or if it's already pinned
   */
  const canPinPoint = useCallback((): boolean => {
    if (!selectedPoint) return false
    return !isPointPinned(selectedPoint)
  }, [selectedPoint, isPointPinned])

  /**
   * Select a point (replaces any previously selected point)
   * The selected point is frozen and displayed with enhanced visuals
   */
  const handleSelectPoint = useCallback((point: ElectrophysiologyPoint) => {
    setSelectedPoint(point)
  }, [])

  /**
   * Set or clear the hovered point
   * Hovered points are temporarily frozen on mouse hover
   * Pass null to clear the hover state
   */
  const handleHoverPoint = useCallback((point: ElectrophysiologyPoint | null) => {
    setHoveredPoint(point)
  }, [])

  /**
   * Pin the currently selected point
   * Only works if a point is selected and not already pinned
   * Automatically deselects the point after pinning
   */
  const handlePinPoint = useCallback(() => {
    if (selectedPoint && !isPointPinned(selectedPoint)) {
      setPinnedPoints((prev) => [...prev, selectedPoint])
      setSelectedPoint(null) // Deselect after pinning
    }
  }, [selectedPoint, isPointPinned])

  /**
   * Deselect the currently selected point
   */
  const handleDeselectPoint = useCallback(() => {
    setSelectedPoint(null)
  }, [])

  /**
   * Remove a point from the pinned points list
   * Uses both id and timestamp to uniquely identify the point to remove
   */
  const handleUnpinPoint = useCallback((point: ElectrophysiologyPoint) => {
    setPinnedPoints((prev) => prev.filter((p) => p.id !== point.id || p.timestamp !== point.timestamp))
  }, [])

  /**
   * Clear all pinned points at once
   * Useful for reset functionality
   */
  const clearAllPinnedPoints = useCallback(() => {
    setPinnedPoints([])
  }, [])

  return {
    selectedPoint,
    hoveredPoint,
    pinnedPoints,
    handleSelectPoint,
    handleHoverPoint,
    handlePinPoint,
    handleDeselectPoint,
    handleUnpinPoint,
    isPointPinned,
    canPinPoint,
    clearAllPinnedPoints,
  }
}
