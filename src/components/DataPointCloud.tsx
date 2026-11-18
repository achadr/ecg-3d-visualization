import { useEffect, useMemo } from 'react'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import { generateElectrophysiologyPoint, getIndicatorColorFromIndex } from '../utils/dataGenerator'
import useDataStream from '../hooks/useDataStream'
import DataPoint from './DataPoint'
import LivePointsInstanced from './LivePointsInstanced'
import {
  LIVE_POINTS_COUNT,
  DEFAULT_POINT_SCALE,
  LIVE_POINT_OPACITY,
  SELECTED_POINT_SCALE,
  SELECTED_POINT_OPACITY,
  PINNED_POINT_SCALE,
  PINNED_POINT_OPACITY,
  INDICATOR_RING_RADIUS,
  INDICATOR_RING_TUBE_RADIUS,
  INDICATOR_RING_RADIAL_SEGMENTS,
  INDICATOR_RING_TUBULAR_SEGMENTS,
  INDICATOR_RING_ROTATION_X,
  INDICATOR_RING_EMISSIVE_INTENSITY,
  INDICATOR_RING_METALNESS,
  INDICATOR_RING_ROUGHNESS,
} from '../constants/visualization'

/**
 * Props for DataPointCloud component
 */
interface DataPointCloudProps {
  onSelectPoint?: (point: ElectrophysiologyPoint) => void
  onHoverPoint?: (point: ElectrophysiologyPoint | null) => void
  selectedPoint?: ElectrophysiologyPoint | null
  hoveredPoint?: ElectrophysiologyPoint | null
  pinnedPoints?: ElectrophysiologyPoint[]
}

/**
 * DataPointCloud Component
 * Manages the data stream and renders all active data points
 * Live points share one InstancedMesh; hovered, selected and pinned points
 * (a handful at most) keep their own DataPoint mesh
 *
 * Uses useDataStream hook to separate data logic from rendering
 * Automatically starts streaming on mount
 */
function DataPointCloud({ onSelectPoint, onHoverPoint, selectedPoint = null, hoveredPoint = null, pinnedPoints = [] }: DataPointCloudProps) {
  // Use custom hook for data streaming (separates logic from rendering)
  const { data: livePoints, startStream } = useDataStream(generateElectrophysiologyPoint)

  // Start streaming on mount
  useEffect(() => {
    startStream()
  }, [startStream])

  // Filter out selected, hovered, and pinned points from live stream
  // Selected and hovered points are "frozen" and don't update with the stream
  const filteredLivePoints = useMemo(() => {
    return livePoints.filter((point) => {
      // Exclude selected point
      if (selectedPoint && point.id === selectedPoint.id) {
        return false
      }
      // Exclude hovered point
      if (hoveredPoint && point.id === hoveredPoint.id) {
        return false
      }
      // Exclude pinned points
      return !pinnedPoints.some((pinned) => pinned.id === point.id)
    })
  }, [livePoints, selectedPoint, hoveredPoint, pinnedPoints])

  // Render hovered point separately (frozen while hovering)
  const renderedHoveredPoint = useMemo(() => {
    if (!hoveredPoint || (selectedPoint && hoveredPoint.id === selectedPoint.id)) return null
    return (
      <DataPoint
        key={`hovered-${hoveredPoint.id}-${hoveredPoint.timestamp}`}
        point={hoveredPoint}
        scale={DEFAULT_POINT_SCALE}
        opacity={LIVE_POINT_OPACITY}
        onSelect={onSelectPoint}
        onHover={onHoverPoint}
      />
    )
  }, [hoveredPoint, selectedPoint, onSelectPoint, onHoverPoint])

  // Render selected point separately (frozen at clicked position)
  const renderedSelectedPoint = useMemo(() => {
    if (!selectedPoint) return null
    return (
      <DataPoint
        key={`selected-${selectedPoint.id}-${selectedPoint.timestamp}`}
        point={selectedPoint}
        scale={SELECTED_POINT_SCALE}
        opacity={SELECTED_POINT_OPACITY}
        onSelect={onSelectPoint}
      />
    )
  }, [selectedPoint, onSelectPoint])

  // Render pinned points with different visual style and indicator rings
  const renderedPinnedPoints = useMemo(() => {
    return pinnedPoints.map((point, index) => {
      const indicatorColor = getIndicatorColorFromIndex(index)
      return (
        <group key={`pinned-group-${point.id}-${point.timestamp}`}>
          {/* Indicator ring around pinned point */}
          <mesh
            position={[point.position.x, point.position.y, point.position.z]}
            rotation={[INDICATOR_RING_ROTATION_X, 0, 0]}
          >
            <torusGeometry args={[INDICATOR_RING_RADIUS, INDICATOR_RING_TUBE_RADIUS, INDICATOR_RING_RADIAL_SEGMENTS, INDICATOR_RING_TUBULAR_SEGMENTS]} />
            <meshStandardMaterial
              color={indicatorColor}
              emissive={indicatorColor}
              emissiveIntensity={INDICATOR_RING_EMISSIVE_INTENSITY}
              metalness={INDICATOR_RING_METALNESS}
              roughness={INDICATOR_RING_ROUGHNESS}
            />
          </mesh>
          {/* The pinned point itself */}
          <DataPoint
            key={`pinned-${point.id}-${point.timestamp}`}
            point={point}
            scale={PINNED_POINT_SCALE}
            opacity={PINNED_POINT_OPACITY}
            onSelect={onSelectPoint}
          />
        </group>
      )
    })
  }, [pinnedPoints, onSelectPoint])

  return (
    <group>
      {/* All live points in a single InstancedMesh (one draw call, nothing remounted per batch) */}
      <LivePointsInstanced
        points={filteredLivePoints}
        batch={livePoints}
        capacity={LIVE_POINTS_COUNT}
        scale={DEFAULT_POINT_SCALE}
        opacity={LIVE_POINT_OPACITY}
        onSelect={onSelectPoint}
        onHover={onHoverPoint}
      />
      {renderedHoveredPoint}
      {renderedSelectedPoint}
      {renderedPinnedPoints}
    </group>
  )
}

export default DataPointCloud
