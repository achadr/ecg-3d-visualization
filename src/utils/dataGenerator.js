/**
 * Data Generator Utility
 * Generates realistic electrophysiology mapping data points
 * for cardiac ablation procedures
 *
 * Written using TDD approach - tests written first
 */

/**
 * Generates a random point on the surface of a heart-shaped geometry
 * Uses spherical coordinates with perturbations to approximate heart shape
 *
 * @param {number} seed - Seed value for deterministic randomness
 * @returns {Object} 3D position {x, y, z}
 */
function generateHeartSurfacePosition(seed) {
  // Use seed for reproducible randomness
  const pseudoRandom = (s) => {
    const x = Math.sin(s) * 10000
    return x - Math.floor(x)
  }

  // Generate points distributed around the heart mesh
  // Heart mesh is centered at (0, -0.5, 0) with width ~2 units and depth ~1.2
  const u = pseudoRandom(seed)
  const v = pseudoRandom(seed + 1)
  const w = pseudoRandom(seed + 2)

  // Use cylindrical-like distribution that matches heart shape better
  const angle = u * Math.PI * 2 // Full rotation around Y axis
  const height = v * 1.8 - 0.9 // Vertical distribution (-0.9 to 0.9)
  const depth = (w - 0.5) * 0.4 // Reduced depth variation (-0.2 to 0.2)

  // Base radius that varies with height (wider at top, narrower at bottom)
  const heightFactor = Math.max(0.3, 1 - Math.abs(height) / 1.5)
  const radius = 0.8 * heightFactor

  // Calculate x and z from angle and radius
  // Heart mesh is rotated 180° around Z axis and positioned at (0, -0.5, 0)
  const x = -(radius * Math.cos(angle) - 0.5) - 1.0 // Shift more left
  const z = depth + radius * 0.2 * Math.sin(angle) // Reduced Z variation
  const y = height - 1.2 // Shift more down

  return { x, y, z }
}

/**
 * Generates realistic voltage values for electrophysiology mapping
 * Normal myocardium: 1.5-5.0 mV
 * Scar tissue: < 0.5 mV
 * Border zone: 0.5-1.5 mV
 *
 * @param {number} seed - Seed for variation
 * @returns {number} Voltage in millivolts
 */
function generateVoltage(seed) {
  const random = Math.sin(seed * 0.1) * 0.5 + 0.5 // 0-1 range

  // 70% healthy, 20% border zone, 10% scar
  if (random < 0.7) {
    // Healthy tissue
    return 1.5 + random * 3.5
  } else if (random < 0.9) {
    // Border zone
    return 0.5 + (random - 0.7) * 5
  } else {
    // Scar tissue (strictly < 0.5)
    return random * 0.49
  }
}

/**
 * Main data generator function
 * Creates a complete electrophysiology data point
 *
 * @param {number} frameCount - Current frame/iteration number
 * @returns {Object} Data point with id, timestamp, position, voltage, and type
 */
export function generateElectrophysiologyPoint(frameCount) {
  const timestamp = Date.now()
  const position = generateHeartSurfacePosition(frameCount)
  const voltage = generateVoltage(frameCount)

  // Classify tissue type based on voltage
  let type = 'healthy'
  if (voltage < 0.5) {
    type = 'scar'
  } else if (voltage < 1.5) {
    type = 'border'
  }

  return {
    id: frameCount,
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
 * @param {number} count - Number of points to generate
 * @param {number} startIndex - Starting index for IDs
 * @returns {Array} Array of data points
 */
export function generateBatch(count, startIndex = 0) {
  const points = []
  for (let i = 0; i < count; i++) {
    points.push(generateElectrophysiologyPoint(startIndex + i))
  }
  return points
}

/**
 * Helper to determine color based on voltage
 * For visualization purposes
 *
 * @param {number} voltage - Voltage value in mV
 * @returns {string} Hex color code
 */
export function getColorFromVoltage(voltage) {
  if (voltage < 0.5) {
    // Scar - Red
    return '#ff0000'
  } else if (voltage < 1.5) {
    // Border zone - Yellow/Orange
    return '#ffaa00'
  } else {
    // Healthy - Purple/Blue
    return '#8844ff'
  }
}

export default generateElectrophysiologyPoint
