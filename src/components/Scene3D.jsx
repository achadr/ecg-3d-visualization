import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import HeartMesh from './HeartMesh'

function Scene3D({ children }) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 50
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.5} />

      {/* Directional light for shadows and depth */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
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

      {/* Scene content */}
      {children}
    </Canvas>
  )
}

export default Scene3D
