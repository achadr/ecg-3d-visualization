import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Color, Object3D, type InstancedMesh, type MeshStandardMaterial } from 'three'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import { getColorFromVoltage } from '../utils/dataGenerator'
import {
  DEFAULT_POINT_SCALE,
  LIVE_POINT_OPACITY,
  SPHERE_GEOMETRY_WIDTH_SEGMENTS,
  SPHERE_GEOMETRY_HEIGHT_SEGMENTS,
  DEFAULT_EMISSIVE_INTENSITY,
  POINT_MATERIAL_METALNESS,
  POINT_MATERIAL_ROUGHNESS,
  ANIMATION_SPEED_MULTIPLIER,
  EASE_OUT_POWER,
} from '../constants/visualization'

/**
 * Props for LivePointsInstanced component
 */
interface LivePointsInstancedProps {
  points: ElectrophysiologyPoint[]
  /**
   * The raw batch received from the stream. The fade-in animation restarts only when it
   * changes, not when `points` is merely filtered (e.g. a point gets hovered or selected).
   */
  batch: unknown
  /** Maximum number of points the mesh can hold (size of a stream batch) */
  capacity: number
  scale?: number
  opacity?: number
  onSelect?: (point: ElectrophysiologyPoint) => void
  onHover?: (point: ElectrophysiologyPoint | null) => void
}

/**
 * LivePointsInstanced Component
 * Renders every live point of the stream with ONE InstancedMesh: one geometry,
 * one material and one draw call, instead of one mesh per point.
 *
 * When a new batch arrives, only the instance matrices and colors are rewritten:
 * nothing is unmounted or recreated, so there is no garbage to collect every second.
 * The batch fades and scales in with the same easing as DataPoint.
 *
 * Hover and selection: the hovered or selected point is rendered by the parent as a
 * separate DataPoint (frozen), which also handles the end of the hover.
 */
function LivePointsInstanced({
  points,
  batch,
  capacity,
  scale = DEFAULT_POINT_SCALE,
  opacity = LIVE_POINT_OPACITY,
  onSelect,
  onHover,
}: LivePointsInstancedProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  const animationProgress = useRef<number>(1)
  const lastBatch = useRef<unknown>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const tmpColor = useMemo(() => new Color(), [])
  const count = Math.min(points.length, capacity)

  // Writes every instance's position and scale (scale = eased animation progress)
  const writeMatrices = (progress: number) => {
    const mesh = meshRef.current
    if (!mesh) return
    const easeOut = 1 - Math.pow(1 - progress, EASE_OUT_POWER)
    for (let i = 0; i < count; i++) {
      const { x, y, z } = points[i].position
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(easeOut)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    // Let three.js recompute the bounds from the instances (used by raycasting and culling)
    mesh.boundingSphere = null
  }

  // Points changed: rewrite colors and matrices. A new batch also restarts the fade-in.
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    // Create the color buffer up front, so the shader is always compiled with instance colors
    if (!mesh.instanceColor) mesh.setColorAt(0, tmpColor.set('#ffffff'))

    mesh.count = count
    for (let i = 0; i < count; i++) {
      tmpColor.set(getColorFromVoltage(points[i].voltage))
      mesh.setColorAt(i, tmpColor)
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

    if (batch !== lastBatch.current) {
      lastBatch.current = batch
      animationProgress.current = 0
      if (materialRef.current) materialRef.current.opacity = 0
    }
    writeMatrices(animationProgress.current)
    // writeMatrices only reads points/count, both listed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, batch, count, tmpColor])

  // Animate fade-in and scale on each new batch (same easing as DataPoint)
  useFrame((_state, delta) => {
    if (animationProgress.current >= 1) return
    animationProgress.current = Math.min(1, animationProgress.current + delta * ANIMATION_SPEED_MULTIPLIER)
    if (materialRef.current) {
      materialRef.current.opacity = animationProgress.current * opacity
    }
    writeMatrices(animationProgress.current)
  })

  // DataPoint uses emissive = its own color. One material is shared here, so the
  // emissive glow is tinted per instance in the shader with the instance color.
  const onBeforeCompile = useMemo(
    () => (shader: { fragmentShader: string }) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n#ifdef USE_COLOR\n  totalEmissiveRadiance *= vColor.rgb;\n#endif'
      )
    },
    []
  )

  const pointAt = (event: ThreeEvent<PointerEvent | MouseEvent>) =>
    event.instanceId !== undefined && event.instanceId < count ? points[event.instanceId] : undefined

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const point = pointAt(event)
    if (!point) return
    event.stopPropagation()
    onSelect?.(point)
  }

  // Starts the hover; the frozen DataPoint rendered by the parent ends it (pointer out)
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const point = pointAt(event)
    if (!point) return
    event.stopPropagation()
    onHover?.(point)
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, capacity]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
    >
      <sphereGeometry args={[scale, SPHERE_GEOMETRY_WIDTH_SEGMENTS, SPHERE_GEOMETRY_HEIGHT_SEGMENTS]} />
      <meshStandardMaterial
        ref={materialRef}
        transparent={true}
        opacity={0}
        emissive="#ffffff"
        emissiveIntensity={DEFAULT_EMISSIVE_INTENSITY}
        metalness={POINT_MATERIAL_METALNESS}
        roughness={POINT_MATERIAL_ROUGHNESS}
        onBeforeCompile={onBeforeCompile}
      />
    </instancedMesh>
  )
}

export default LivePointsInstanced
