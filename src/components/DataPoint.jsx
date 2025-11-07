import { useMemo, useRef, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { getColorFromVoltage } from '../utils/dataGenerator'

/**
 * DataPoint Component
 * Renders a 3D sphere representing an electrophysiology data point
 * with smooth fade-in and scale animations
 *
 * Written using TDD approach - tests written first
 *
 * @param {Object} point - Data point with position, voltage, type
 * @param {number} scale - Sphere size (default: 0.08)
 * @param {number} opacity - Sphere opacity (default: 0.9)
 */
function DataPoint({ point, scale = 0.08, opacity = 0.9 }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const animationProgress = useRef(0)

  // Get color based on voltage (memoized to avoid recalculation)
  const color = useMemo(() => {
    return getColorFromVoltage(point.voltage)
  }, [point.voltage])

  // Shared geometry to reduce memory usage
  const geometry = useMemo(() => [scale, 16, 16], [scale])

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
    >
      <sphereGeometry args={geometry} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        transparent={true}
        opacity={0}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0}
        roughness={1}
      />
    </mesh>
  )
}

// Memoize component to prevent unnecessary re-renders
export default memo(DataPoint)
