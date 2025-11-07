import { useMemo, useRef, memo, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import type { Mesh, MeshStandardMaterial } from 'three'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import { getColorFromVoltage } from '../utils/dataGenerator'

/**
 * Props for DataPoint component
 */
interface DataPointProps {
  point: ElectrophysiologyPoint
  scale?: number
  opacity?: number
  onSelect?: (point: ElectrophysiologyPoint) => void
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
function DataPoint({ point, scale = 0.08, opacity = 0.9, onSelect }: DataPointProps) {
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

  // Get color based on voltage (memoized to avoid recalculation)
  const color = useMemo(() => {
    return getColorFromVoltage(point.voltage)
  }, [point.voltage])

  // Shared geometry to reduce memory usage
  const geometry = useMemo(() => [scale, 16, 16] as const, [scale])

  // Animate fade-in and scale on mount
  useFrame((_state, delta) => {
    if (animationProgress.current < 1) {
      animationProgress.current += delta * 3 // Animation speed

      if (animationProgress.current > 1) {
        animationProgress.current = 1
      }

      // Smooth fade-in
      if (materialRef.current) {
        materialRef.current.opacity = animationProgress.current * opacity
      }

      // Smooth scale-in with ease-out
      if (meshRef.current) {
        const easeOut = 1 - Math.pow(1 - animationProgress.current, 3)
        meshRef.current.scale.setScalar(easeOut)
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[point.position.x, point.position.y, point.position.z]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={geometry} />
      <meshStandardMaterial
        ref={materialRef}
        color={hovered ? '#00ff00' : color}
        transparent={true}
        opacity={0}
        emissive={hovered ? '#00ff00' : color}
        emissiveIntensity={hovered ? 0.8 : 0.4}
        metalness={0}
        roughness={1}
      />
    </mesh>
  )
}

// Memoize component to prevent unnecessary re-renders
export default memo(DataPoint)
