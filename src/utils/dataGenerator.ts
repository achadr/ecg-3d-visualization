/**
 * Data Generator Utility
 * Generates realistic electrophysiology mapping data points
 * for cardiac ablation procedures
 *
 * Written using TDD approach - tests written first
 */

import type {
  ElectrophysiologyPoint,
  TissueType,
  Point3D,
  ColorValue
} from '../types/electrophysiology'
import {
  VOLTAGE_THRESHOLD_SCAR,
  VOLTAGE_THRESHOLD_BORDER,
  VOLTAGE_HEALTHY_MIN,
  VOLTAGE_HEALTHY_RANGE,
  VOLTAGE_BORDER_MIN,
  VOLTAGE_BORDER_MULTIPLIER,
  VOLTAGE_SCAR_MAX,
  TISSUE_HEALTHY_PROBABILITY,
  TISSUE_BORDER_PROBABILITY,
  PSEUDO_RANDOM_SEED_MULTIPLIER,
  HEART_FULL_ROTATION,
  HEART_HEIGHT_RANGE,
  HEART_HEIGHT_OFFSET,
  HEART_DEPTH_MULTIPLIER,
  HEART_DEPTH_CENTER_OFFSET,
  HEART_MIN_HEIGHT_FACTOR,
  HEART_HEIGHT_DIVISOR,
  HEART_BASE_RADIUS,
  HEART_X_SHIFT,
  HEART_X_CENTER_OFFSET,
  HEART_Z_RADIUS_MULTIPLIER,
  HEART_Y_SHIFT,
  COLOR_SCAR,
  COLOR_BORDER,
  COLOR_HEALTHY,
  INDICATOR_COLOR_PALETTE,
} from '../constants/electrophysiologyConfig'

/**
 * Generates a random point on the surface of a heart-shaped geometry
 * Uses spherical coordinates with perturbations to approximate heart shape
 *
 * @param seed - Seed value for deterministic randomness
 * @returns 3D position {x, y, z}
 */
function generateHeartSurfacePosition(seed: number): Point3D {
  // Use seed for reproducible randomness
  const pseudoRandom = (s: number): number => {
    const x = Math.sin(s) * PSEUDO_RANDOM_SEED_MULTIPLIER
    return x - Math.floor(x)
  }

  // Generate points distributed around the heart mesh
  // Heart mesh is centered at (0, -0.5, 0) with width ~2 units and depth ~1.2
  const u = pseudoRandom(seed)
  const v = pseudoRandom(seed + 1)
  const w = pseudoRandom(seed + 2)

  // Use cylindrical-like distribution that matches heart shape better
  const angle = u * HEART_FULL_ROTATION // Full rotation around Y axis
  const height = v * HEART_HEIGHT_RANGE + HEART_HEIGHT_OFFSET // Vertical distribution (-0.9 to 0.9)
  const depth = (w - HEART_DEPTH_CENTER_OFFSET) * HEART_DEPTH_MULTIPLIER // Reduced depth variation (-0.2 to 0.2)

  // Base radius that varies with height (wider at top, narrower at bottom)
  const heightFactor = Math.max(HEART_MIN_HEIGHT_FACTOR, 1 - Math.abs(height) / HEART_HEIGHT_DIVISOR)
  const radius = HEART_BASE_RADIUS * heightFactor

  // Calculate x and z from angle and radius
  // Heart mesh is rotated 180° around Z axis and positioned at (0, -0.5, 0)
  const x = -(radius * Math.cos(angle) - HEART_X_CENTER_OFFSET) + HEART_X_SHIFT // Shift more left
  const z = depth + radius * HEART_Z_RADIUS_MULTIPLIER * Math.sin(angle) // Reduced Z variation
  const y = height + HEART_Y_SHIFT // Shift more down

  return { x, y, z }
}

/**
 * Generates realistic voltage values for electrophysiology mapping
 * Normal myocardium: 1.5-5.0 mV
 * Scar tissue: < 0.5 mV
 * Border zone: 0.5-1.5 mV
 *
 * @param seed - Seed for variation
 * @returns Voltage in millivolts
 */
function generateVoltage(seed: number): number {
  const random = Math.sin(seed * 0.1) * 0.5 + 0.5 // 0-1 range

  // 70% healthy, 20% border zone, 10% scar
  if (random < TISSUE_HEALTHY_PROBABILITY) {
    // Healthy tissue
    return VOLTAGE_HEALTHY_MIN + random * VOLTAGE_HEALTHY_RANGE
  } else if (random < TISSUE_BORDER_PROBABILITY) {
    // Border zone
    return VOLTAGE_BORDER_MIN + (random - TISSUE_HEALTHY_PROBABILITY) * VOLTAGE_BORDER_MULTIPLIER
  } else {
    // Scar tissue (strictly < 0.5)
    return random * VOLTAGE_SCAR_MAX
  }
}

/**
 * Main data generator function
 * Creates a complete electrophysiology data point
 *
 * @param frameCount - Current frame/iteration number
 * @returns Data point with id, timestamp, position, voltage, and type
 */
export function generateElectrophysiologyPoint(frameCount: number): ElectrophysiologyPoint {
  const timestamp = Date.now()
  const position = generateHeartSurfacePosition(frameCount)
  const voltage = generateVoltage(frameCount)

  // Classify tissue type based on voltage
  let type: TissueType = 'healthy'
  if (voltage < VOLTAGE_THRESHOLD_SCAR) {
    type = 'scar'
  } else if (voltage < VOLTAGE_THRESHOLD_BORDER) {
    type = 'border'
  }

  return {
    id: String(frameCount),
    timestamp,
    position,
    voltage: parseFloat(voltage.toFixed(2)),
    type
  }
}

/**
 * Batch generator for testing purposes
 * Generates multiple points at once
 *
 * @param count - Number of points to generate
 * @param startIndex - Starting index for IDs
 * @returns Array of data points
 */
export function generateBatch(count: number, startIndex: number = 0): ElectrophysiologyPoint[] {
  const points: ElectrophysiologyPoint[] = []
  for (let i = 0; i < count; i++) {
    points.push(generateElectrophysiologyPoint(startIndex + i))
  }
  return points
}

/**
 * Helper to determine color based on voltage
 * For visualization purposes
 *
 * @param voltage - Voltage value in mV
 * @returns Hex color code
 */
export function getColorFromVoltage(voltage: number): ColorValue {
  if (voltage < VOLTAGE_THRESHOLD_SCAR) {
    // Scar - Red
    return COLOR_SCAR
  } else if (voltage < VOLTAGE_THRESHOLD_BORDER) {
    // Border zone - Yellow/Orange
    return COLOR_BORDER
  } else {
    // Healthy - Purple/Blue
    return COLOR_HEALTHY
  }
}

/**
 * Helper to generate a unique indicator color for each pinned point
 * Uses a palette of vibrant, distinct colors that cycle through
 *
 * @param index - Index of the pinned point (0, 1, 2, ...)
 * @returns Hex color code for the indicator ring
 */
export function getIndicatorColorFromIndex(index: number): string {
  // Cycle through the palette if more than 10 points are pinned
  return INDICATOR_COLOR_PALETTE[index % INDICATOR_COLOR_PALETTE.length]
}

export default generateElectrophysiologyPoint
