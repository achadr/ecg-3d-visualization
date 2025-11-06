import { useMemo } from 'react'
import { getColorFromVoltage } from '../utils/dataGenerator'

/**
 * DataPoint Component
 * Renders a 3D sphere representing an electrophysiology data point
 *
 * Written using TDD approach - tests written first
 *
 * @param {Object} point - Data point with position, voltage, type
 * @param {number} scale - Sphere size (default: 0.08)
 * @param {number} opacity - Sphere opacity (default: 0.9)
 */
function DataPoint({ point, scale = 0.08, opacity = 0.9 }) {
  // Get color based on voltage
  const color = useMemo(() => {
    return getColorFromVoltage(point.voltage)
  }, [point.voltage])

  return (
    <mesh position={[point.position.x, point.position.y, point.position.z]}>
      <sphereGeometry args={[scale, 16, 16]} />
      <meshStandardMaterial
        color={color}
        transparent={true}
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0}
        roughness={1}
      />
    </mesh>
  )
}

export default DataPoint
