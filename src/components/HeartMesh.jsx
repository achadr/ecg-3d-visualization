import { useMemo } from 'react'
import * as THREE from 'three'

function HeartMesh() {
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape()
    const x = 0, y = 0

    shape.moveTo(x + 0.5, y + 0.5)
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y)
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7)
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9)
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7)
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y)
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5)

    const extrudeSettings = {
      depth: 1.2,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 4,
      bevelSize: 0.2,
      bevelThickness: 0.2,
      curveSegments: 16
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  return (
    <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI]}>
      <primitive object={heartShape} attach="geometry" />
      <meshStandardMaterial
        color="#ff4d4d"
        wireframe={true}
        emissive="#ff1a1a"
        emissiveIntensity={0.3}
        metalness={0}
        roughness={1}
      />
    </mesh>
  )
}

export default HeartMesh
