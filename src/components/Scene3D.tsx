import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ReactNode } from 'react'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import HeartMesh from './HeartMesh'
import DataPointCloud from './DataPointCloud'
import {
  CAMERA_POSITION_Z,
  CAMERA_FOV,
  AMBIENT_LIGHT_INTENSITY,
  MAIN_LIGHT_POSITION,
  MAIN_LIGHT_INTENSITY,
  MAIN_LIGHT_COLOR,
  RIM_LIGHT_POSITION,
  RIM_LIGHT_INTENSITY,
  RIM_LIGHT_COLOR,
  FILL_LIGHT_POSITION,
  FILL_LIGHT_INTENSITY,
  FILL_LIGHT_COLOR,
  ORBIT_MIN_DISTANCE,
  ORBIT_MAX_DISTANCE,
  ORBIT_DAMPING_FACTOR,
} from '../constants/visualization'

/**
 * Props for Scene3D component
 */
interface Scene3DProps {
  children?: ReactNode
  onSelectPoint?: (point: ElectrophysiologyPoint) => void
  onHoverPoint?: (point: ElectrophysiologyPoint | null) => void
  selectedPoint?: ElectrophysiologyPoint | null
  hoveredPoint?: ElectrophysiologyPoint | null
  pinnedPoints?: ElectrophysiologyPoint[]
}

function Scene3D({ children, onSelectPoint, onHoverPoint, selectedPoint, hoveredPoint, pinnedPoints }: Scene3DProps) {
  return (
    <Canvas
      camera={{
        position: [0, 0, CAMERA_POSITION_Z],
        fov: CAMERA_FOV
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />

      {/* Main directional light */}
      <directionalLight
        position={MAIN_LIGHT_POSITION}
        intensity={MAIN_LIGHT_INTENSITY}
        color={MAIN_LIGHT_COLOR}
      />

      {/* Rim light for depth */}
      <directionalLight
        position={RIM_LIGHT_POSITION}
        intensity={RIM_LIGHT_INTENSITY}
        color={RIM_LIGHT_COLOR}
      />

      {/* Top fill light */}
      <pointLight
        position={FILL_LIGHT_POSITION}
        intensity={FILL_LIGHT_INTENSITY}
        color={FILL_LIGHT_COLOR}
      />

      {/* OrbitControls for camera manipulation */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={ORBIT_MIN_DISTANCE}
        maxDistance={ORBIT_MAX_DISTANCE}
        enableDamping={true}
        dampingFactor={ORBIT_DAMPING_FACTOR}
      />

      {/* Heart mesh - stylized icosahedron */}
      <HeartMesh />

      {/* Dynamic data points streaming around the heart */}
      <DataPointCloud
        onSelectPoint={onSelectPoint}
        onHoverPoint={onHoverPoint}
        selectedPoint={selectedPoint}
        hoveredPoint={hoveredPoint}
        pinnedPoints={pinnedPoints}
      />

      {/* Scene content */}
      {children}
    </Canvas>
  )
}

export default Scene3D
