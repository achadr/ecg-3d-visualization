/**
 * Electrophysiology Data Constants
 * Medical and scientific parameters for cardiac electrophysiology mapping
 */

// === Voltage Thresholds (in millivolts) ===
export const VOLTAGE_THRESHOLD_SCAR = 0.5
export const VOLTAGE_THRESHOLD_BORDER = 1.5

// === Voltage Ranges ===
export const VOLTAGE_HEALTHY_MIN = 1.5
export const VOLTAGE_HEALTHY_RANGE = 3.5

export const VOLTAGE_BORDER_MIN = 0.5
export const VOLTAGE_BORDER_MULTIPLIER = 5

export const VOLTAGE_SCAR_MAX = 0.49

// === Tissue Distribution Probabilities ===
export const TISSUE_HEALTHY_PROBABILITY = 0.7
export const TISSUE_BORDER_PROBABILITY = 0.9

// === Heart Surface Generation Parameters ===
export const PSEUDO_RANDOM_SEED_MULTIPLIER = 10000

// Heart mesh spatial parameters
export const HEART_CENTER_Y = -0.5
export const HEART_WIDTH_UNITS = 2
export const HEART_DEPTH_UNITS = 1.2

// Cylindrical distribution parameters
export const HEART_FULL_ROTATION = Math.PI * 2
export const HEART_HEIGHT_RANGE = 1.8
export const HEART_HEIGHT_OFFSET = -0.9
export const HEART_DEPTH_MULTIPLIER = 0.4
export const HEART_DEPTH_CENTER_OFFSET = 0.5

// Radius calculation parameters
export const HEART_MIN_HEIGHT_FACTOR = 0.3
export const HEART_HEIGHT_DIVISOR = 1.5
export const HEART_BASE_RADIUS = 0.8

// Position adjustment parameters
export const HEART_X_SHIFT = -1.0
export const HEART_X_CENTER_OFFSET = 0.5
export const HEART_Z_RADIUS_MULTIPLIER = 0.2
export const HEART_Y_SHIFT = -1.2

// === Color Mapping for Voltage ===
export const COLOR_SCAR = '#ff0000'
export const COLOR_BORDER = '#ffaa00'
export const COLOR_HEALTHY = '#8844ff'

// === Indicator Color Palette ===
export const INDICATOR_COLOR_PALETTE = [
  '#00ffff', // Cyan
  '#ff00ff', // Magenta
  '#ffff00', // Yellow
  '#00ff00', // Lime green
  '#ff6600', // Orange
  '#0099ff', // Sky blue
  '#ff0099', // Hot pink
  '#66ff00', // Chartreuse
  '#9900ff', // Purple
  '#ff3333', // Red
] as const

export const INDICATOR_COLOR_PALETTE_SIZE = 10

// === Heart Shape Bezier Curve Parameters ===
export const HEART_BEZIER_X_OFFSET = 0
export const HEART_BEZIER_Y_OFFSET = 0

// Control points for heart shape (relative to offset)
export const HEART_BEZIER_START = [0.5, 0.5] as const
export const HEART_BEZIER_CP1 = [0.5, 0.5] as const
export const HEART_BEZIER_CP2 = [0.4, 0] as const
export const HEART_BEZIER_CP3 = [0, 0] as const

export const HEART_BEZIER_CP4 = [-0.6, 0] as const
export const HEART_BEZIER_CP5 = [-0.6, 0.7] as const
export const HEART_BEZIER_CP6 = [-0.6, 0.7] as const

export const HEART_BEZIER_CP7 = [-0.6, 1.1] as const
export const HEART_BEZIER_CP8 = [-0.3, 1.54] as const
export const HEART_BEZIER_CP9 = [0.5, 1.9] as const

export const HEART_BEZIER_CP10 = [1.2, 1.54] as const
export const HEART_BEZIER_CP11 = [1.6, 1.1] as const
export const HEART_BEZIER_CP12 = [1.6, 0.7] as const

export const HEART_BEZIER_CP13 = [1.6, 0.7] as const
export const HEART_BEZIER_CP14 = [1.6, 0] as const
export const HEART_BEZIER_CP15 = [1, 0] as const

export const HEART_BEZIER_CP16 = [0.7, 0] as const
export const HEART_BEZIER_CP17 = [0.5, 0.5] as const
export const HEART_BEZIER_CP18 = [0.5, 0.5] as const
