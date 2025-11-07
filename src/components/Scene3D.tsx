import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ReactNode } from 'react'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import HeartMesh from './HeartMesh'
import DataPointCloud from './DataPointCloud'

/**
 * Props for Scene3D component
 */
interface Scene3DProps {
  children?: ReactNode
  onSelectPoint?: (point: ElectrophysiologyPoint) => void
  selectedPoint?: ElectrophysiologyPoint | null
  pinnedPoints?: ElectrophysiologyPoint[]
}

function Scene3D({ children, onSelectPoint, selectedPoint, pinnedPoints }: Scene3DProps) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 50
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />

      {/* Main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Rim light for depth */}
      <directionalLight
        position={[-3, -3, -5]}
        intensity={0.4}
        color="#ff9999"
      />

      {/* Top fill light */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        color="#ffcccc"
      />

      {/* OrbitControls for camera manipulation */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        enableDamping={true}
        dampingFactor={0.05}
      />

      {/* Heart mesh - stylized icosahedron */}
      <HeartMesh />

      {/* Dynamic data points streaming around the heart */}
      <DataPointCloud
        onSelectPoint={onSelectPoint}
        selectedPoint={selectedPoint}
        pinnedPoints={pinnedPoints}
      />

      {/* Scene content */}
      {children}
    </Canvas>
  )
}

export default Scene3D
