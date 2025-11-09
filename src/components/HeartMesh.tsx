import { useMemo } from 'react'
import * as THREE from 'three'
import {
  HEART_MESH_POSITION,
  HEART_MESH_ROTATION_Z,
  HEART_EXTRUDE_DEPTH,
  HEART_BEVEL_SEGMENTS,
  HEART_EXTRUDE_STEPS,
  HEART_BEVEL_SIZE,
  HEART_BEVEL_THICKNESS,
  HEART_CURVE_SEGMENTS,
  HEART_MESH_COLOR,
  HEART_MESH_EMISSIVE_COLOR,
  HEART_MESH_EMISSIVE_INTENSITY,
  HEART_MESH_METALNESS,
  HEART_MESH_ROUGHNESS,
} from '../constants/visualization'
import {
  HEART_BEZIER_X_OFFSET,
  HEART_BEZIER_Y_OFFSET,
  HEART_BEZIER_START,
  HEART_BEZIER_CP1,
  HEART_BEZIER_CP2,
  HEART_BEZIER_CP3,
  HEART_BEZIER_CP4,
  HEART_BEZIER_CP5,
  HEART_BEZIER_CP6,
  HEART_BEZIER_CP7,
  HEART_BEZIER_CP8,
  HEART_BEZIER_CP9,
  HEART_BEZIER_CP10,
  HEART_BEZIER_CP11,
  HEART_BEZIER_CP12,
  HEART_BEZIER_CP13,
  HEART_BEZIER_CP14,
  HEART_BEZIER_CP15,
  HEART_BEZIER_CP16,
  HEART_BEZIER_CP17,
  HEART_BEZIER_CP18,
} from '../constants/electrophysiologyConfig'

function HeartMesh() {
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape()
    const x = HEART_BEZIER_X_OFFSET
    const y = HEART_BEZIER_Y_OFFSET

    shape.moveTo(x + HEART_BEZIER_START[0], y + HEART_BEZIER_START[1])
    shape.bezierCurveTo(x + HEART_BEZIER_CP1[0], y + HEART_BEZIER_CP1[1], x + HEART_BEZIER_CP2[0], y + HEART_BEZIER_CP2[1], x + HEART_BEZIER_CP3[0], y + HEART_BEZIER_CP3[1])
    shape.bezierCurveTo(x + HEART_BEZIER_CP4[0], y + HEART_BEZIER_CP4[1], x + HEART_BEZIER_CP5[0], y + HEART_BEZIER_CP5[1], x + HEART_BEZIER_CP6[0], y + HEART_BEZIER_CP6[1])
    shape.bezierCurveTo(x + HEART_BEZIER_CP7[0], y + HEART_BEZIER_CP7[1], x + HEART_BEZIER_CP8[0], y + HEART_BEZIER_CP8[1], x + HEART_BEZIER_CP9[0], y + HEART_BEZIER_CP9[1])
    shape.bezierCurveTo(x + HEART_BEZIER_CP10[0], y + HEART_BEZIER_CP10[1], x + HEART_BEZIER_CP11[0], y + HEART_BEZIER_CP11[1], x + HEART_BEZIER_CP12[0], y + HEART_BEZIER_CP12[1])
    shape.bezierCurveTo(x + HEART_BEZIER_CP13[0], y + HEART_BEZIER_CP13[1], x + HEART_BEZIER_CP14[0], y + HEART_BEZIER_CP14[1], x + HEART_BEZIER_CP15[0], y + HEART_BEZIER_CP15[1])
    shape.bezierCurveTo(x + HEART_BEZIER_CP16[0], y + HEART_BEZIER_CP16[1], x + HEART_BEZIER_CP17[0], y + HEART_BEZIER_CP17[1], x + HEART_BEZIER_CP18[0], y + HEART_BEZIER_CP18[1])

    const extrudeSettings = {
      depth: HEART_EXTRUDE_DEPTH,
      bevelEnabled: true,
      bevelSegments: HEART_BEVEL_SEGMENTS,
      steps: HEART_EXTRUDE_STEPS,
      bevelSize: HEART_BEVEL_SIZE,
      bevelThickness: HEART_BEVEL_THICKNESS,
      curveSegments: HEART_CURVE_SEGMENTS
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  return (
    <mesh position={HEART_MESH_POSITION} rotation={[0, 0, HEART_MESH_ROTATION_Z]}>
      <primitive object={heartShape} attach="geometry" />
      <meshStandardMaterial
        color={HEART_MESH_COLOR}
        wireframe={true}
        emissive={HEART_MESH_EMISSIVE_COLOR}
        emissiveIntensity={HEART_MESH_EMISSIVE_INTENSITY}
        metalness={HEART_MESH_METALNESS}
        roughness={HEART_MESH_ROUGHNESS}
      />
    </mesh>
  )
}

export default HeartMesh
