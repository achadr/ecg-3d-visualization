import { Canvas } from '@react-three/fiber'

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

      {/* Temporary test sphere - will be removed */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>

      {/* Scene content */}
      {children}
    </Canvas>
  )
}

export default Scene3D
