import { useEffect, useMemo, useState, useRef } from 'react'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import { generateElectrophysiologyPoint } from '../utils/dataGenerator'
import DataPoint from './DataPoint'

/**
 * Props for DataPointCloud component
 */
interface DataPointCloudProps {
  onSelectPoint?: (point: ElectrophysiologyPoint) => void
  selectedPoint?: ElectrophysiologyPoint | null
  pinnedPoints?: ElectrophysiologyPoint[]
}

/**
 * DataPointCloud Component
 * Manages the data stream and renders all active data points
 * Optimized with memoization for better performance
 *
 * Automatically starts streaming on mount
 */
function DataPointCloud({ onSelectPoint, selectedPoint = null, pinnedPoints = [] }: DataPointCloudProps) {
  const [livePoints, setLivePoints] = useState<ElectrophysiologyPoint[]>([])
  const frameCountRef = useRef<number>(0)

  // Generate 10 points that update positions every second
  useEffect(() => {
    // Initial generation of 10 points
    const initialPoints = Array.from({ length: 10 }, (_, i) =>
      generateElectrophysiologyPoint(i)
    )
    setLivePoints(initialPoints)

    // Update all points every second
    const interval = setInterval(() => {
      frameCountRef.current += 1
      const updatedPoints = Array.from({ length: 10 }, (_, i) =>
        generateElectrophysiologyPoint(frameCountRef.current * 10 + i)
      )
      setLivePoints(updatedPoints)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Filter out selected and pinned points from live stream
  // Selected points are "frozen" and don't update with the stream
  const filteredLivePoints = useMemo(() => {
    return livePoints.filter((point) => {
      // Exclude selected point
      if (selectedPoint && point.id === selectedPoint.id) {
        return false
      }
      // Exclude pinned points
      return !pinnedPoints.some((pinned) => pinned.id === point.id)
    })
  }, [livePoints, selectedPoint, pinnedPoints])

  // Memoize rendered live points to avoid unnecessary recalculations
  const renderedPoints = useMemo(() => {
    return filteredLivePoints.map((point) => (
      <DataPoint
        key={`${point.id}-${point.timestamp}`}
        point={point}
        scale={0.08}
        opacity={0.8}
        onSelect={onSelectPoint}
      />
    ))
  }, [filteredLivePoints, onSelectPoint])

  // Render selected point separately (frozen at clicked position)
  const renderedSelectedPoint = useMemo(() => {
    if (!selectedPoint) return null
    return (
      <DataPoint
        key={`selected-${selectedPoint.id}-${selectedPoint.timestamp}`}
        point={selectedPoint}
        scale={0.09}
        opacity={1.0}
        onSelect={onSelectPoint}
      />
    )
  }, [selectedPoint, onSelectPoint])

  // Render pinned points with different visual style
  const renderedPinnedPoints = useMemo(() => {
    return pinnedPoints.map((point) => (
      <DataPoint
        key={`pinned-${point.id}-${point.timestamp}`}
        point={point}
        scale={0.1}
        opacity={1.0}
        onSelect={onSelectPoint}
      />
    ))
  }, [pinnedPoints, onSelectPoint])

  return (
    <group>
      {renderedPoints}
      {renderedSelectedPoint}
      {renderedPinnedPoints}
    </group>
  )
}

export default DataPointCloud
