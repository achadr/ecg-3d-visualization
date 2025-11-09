import { useMemo, useRef, memo, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import type { Mesh, MeshStandardMaterial } from 'three'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import { getColorFromVoltage } from '../utils/dataGenerator'
import {
  DEFAULT_POINT_SCALE,
  DEFAULT_POINT_OPACITY,
  SPHERE_GEOMETRY_WIDTH_SEGMENTS,
  SPHERE_GEOMETRY_HEIGHT_SEGMENTS,
  HOVER_COLOR,
  HOVER_EMISSIVE_INTENSITY,
  DEFAULT_EMISSIVE_INTENSITY,
  POINT_MATERIAL_METALNESS,
  POINT_MATERIAL_ROUGHNESS,
  ANIMATION_SPEED_MULTIPLIER,
  EASE_OUT_POWER,
} from '../constants/visualization'

/**
 * Props for DataPoint component
 */
interface DataPointProps {
  point: ElectrophysiologyPoint
  scale?: number
  opacity?: number
  onSelect?: (point: ElectrophysiologyPoint) => void
  onHover?: (point: ElectrophysiologyPoint | null) => void
}

/**
 * DataPoint Component
 * Renders a 3D sphere representing an electrophysiology data point
 * with smooth fade-in and scale animations
 *
 * Written using TDD approach - tests written first
 *
 * @param point - Data point with position, voltage, type
 * @param scale - Sphere size (default: 0.08)
 * @param opacity - Sphere opacity (default: 0.9)
 * @param onSelect - Optional callback when point is clicked
 */
function DataPoint({ point, scale = DEFAULT_POINT_SCALE, opacity = DEFAULT_POINT_OPACITY, onSelect, onHover }: DataPointProps) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  const animationProgress = useRef<number>(0)
  const [hovered, setHovered] = useState<boolean>(false)

  // Handle click on point
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (onSelect) {
      onSelect(point)
    }
  }

  // Handle hover start
  const handlePointerOver = () => {
    setHovered(true)
    if (onHover) {
      onHover(point)
    }
  }

  // Handle hover end
  const handlePointerOut = () => {
    setHovered(false)
    if (onHover) {
      onHover(null)
    }
  }

  // Get color based on voltage (memoized to avoid recalculation)
  const color = useMemo(() => {
    return getColorFromVoltage(point.voltage)
  }, [point.voltage])

  // Shared geometry to reduce memory usage
  const geometry = useMemo(() => [scale, SPHERE_GEOMETRY_WIDTH_SEGMENTS, SPHERE_GEOMETRY_HEIGHT_SEGMENTS] as const, [scale])

  // Animate fade-in and scale on mount
  useFrame((_state, delta) => {
    if (animationProgress.current < 1) {
      animationProgress.current += delta * ANIMATION_SPEED_MULTIPLIER // Animation speed

      if (animationProgress.current > 1) {
        animationProgress.current = 1
      }

      // Smooth fade-in
      if (materialRef.current) {
        materialRef.current.opacity = animationProgress.current * opacity
      }

      // Smooth scale-in with ease-out
      if (meshRef.current) {
        const easeOut = 1 - Math.pow(1 - animationProgress.current, EASE_OUT_POWER)
        meshRef.current.scale.setScalar(easeOut)
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[point.position.x, point.position.y, point.position.z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={geometry} />
      <meshStandardMaterial
        ref={materialRef}
        color={hovered ? HOVER_COLOR : color}
        transparent={true}
        opacity={0}
        emissive={hovered ? HOVER_COLOR : color}
        emissiveIntensity={hovered ? HOVER_EMISSIVE_INTENSITY : DEFAULT_EMISSIVE_INTENSITY}
        metalness={POINT_MATERIAL_METALNESS}
        roughness={POINT_MATERIAL_ROUGHNESS}
      />
    </mesh>
  )
}

// Memoize component to prevent unnecessary re-renders
export default memo(DataPoint)
