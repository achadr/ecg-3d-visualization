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

  // Spherical coordinates with heart-shape bias
  const theta = pseudoRandom(seed) * Math.PI * 2 // Azimuthal angle
  const phi = pseudoRandom(seed + 1) * Math.PI // Polar angle

  // Base radius with variation
  const baseRadius = 1.2
  const radiusVariation = 0.3 * pseudoRandom(seed + 2)
  const r = baseRadius + radiusVariation

  // Convert to Cartesian with heart-shape adjustments
  let x = r * Math.sin(phi) * Math.cos(theta)
  let y = r * Math.sin(phi) * Math.sin(theta) - 0.5 // Offset downward
  let z = r * Math.cos(phi)

  // Heart shape perturbation (narrower at bottom, wider at top)
  const heartFactor = 1 + 0.3 * Math.sin(phi)
  x *= heartFactor
  z *= heartFactor

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
