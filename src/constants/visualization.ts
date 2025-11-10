/**
 * Visualization Constants
 * Centralized configuration for 3D visualization, animations, and UI layout
 */

// === Camera Configuration ===
export const CAMERA_POSITION_Z = 8
export const CAMERA_FOV = 50

// === Lighting Configuration ===
export const AMBIENT_LIGHT_INTENSITY = 0.3

export const MAIN_LIGHT_POSITION = [5, 5, 5] as const
export const MAIN_LIGHT_INTENSITY = 0.8
export const MAIN_LIGHT_COLOR = '#ffffff'

export const RIM_LIGHT_POSITION = [-3, -3, -5] as const
export const RIM_LIGHT_INTENSITY = 0.4
export const RIM_LIGHT_COLOR = '#ff9999'

export const FILL_LIGHT_POSITION = [0, 5, 0] as const
export const FILL_LIGHT_INTENSITY = 0.5
export const FILL_LIGHT_COLOR = '#ffcccc'

// === Orbit Controls Configuration ===
export const ORBIT_MIN_DISTANCE = 3
export const ORBIT_MAX_DISTANCE = 20
export const ORBIT_DAMPING_FACTOR = 0.05

// === DataPoint Configuration ===
export const DEFAULT_POINT_SCALE = 0.08
export const DEFAULT_POINT_OPACITY = 0.9
export const LIVE_POINT_OPACITY = 0.8
export const SELECTED_POINT_SCALE = 0.09
export const SELECTED_POINT_OPACITY = 1.0
export const PINNED_POINT_SCALE = 0.1
export const PINNED_POINT_OPACITY = 1.0

export const SPHERE_GEOMETRY_WIDTH_SEGMENTS = 16
export const SPHERE_GEOMETRY_HEIGHT_SEGMENTS = 16

export const HOVER_COLOR = '#00ff00'
export const HOVER_EMISSIVE_INTENSITY = 0.8
export const DEFAULT_EMISSIVE_INTENSITY = 0.4

export const POINT_MATERIAL_METALNESS = 0
export const POINT_MATERIAL_ROUGHNESS = 1

// === DataPoint Animation Configuration ===
export const ANIMATION_SPEED_MULTIPLIER = 3
export const EASE_OUT_POWER = 3

// === UseDataStream Configuration ===
export const LIVE_POINTS_COUNT = 100
export const POINTS_UPDATE_INTERVAL_MS = 1000

// === Pinned Point Indicator Ring Configuration ===
export const INDICATOR_RING_RADIUS = 0.15
export const INDICATOR_RING_TUBE_RADIUS = 0.02
export const INDICATOR_RING_RADIAL_SEGMENTS = 16
export const INDICATOR_RING_TUBULAR_SEGMENTS = 32
export const INDICATOR_RING_ROTATION_X = Math.PI / 2
export const INDICATOR_RING_EMISSIVE_INTENSITY = 0.8
export const INDICATOR_RING_METALNESS = 0.3
export const INDICATOR_RING_ROUGHNESS = 0.7

// === Heart Mesh Configuration ===
export const HEART_MESH_POSITION = [0, -0.5, 0] as const
export const HEART_MESH_ROTATION_Z = Math.PI

export const HEART_EXTRUDE_DEPTH = 0.7
export const HEART_BEVEL_SEGMENTS = 3
export const HEART_EXTRUDE_STEPS = 4
export const HEART_BEVEL_SIZE = 0.3
export const HEART_BEVEL_THICKNESS = 0.2
export const HEART_CURVE_SEGMENTS = 16

export const HEART_MESH_COLOR = '#ff4d4d'
export const HEART_MESH_EMISSIVE_COLOR = '#f2594e'
export const HEART_MESH_EMISSIVE_INTENSITY = 0.3
export const HEART_MESH_METALNESS = 0
export const HEART_MESH_ROUGHNESS = 1

// === Data Stream Configuration ===
export const DEFAULT_STREAM_INTERVAL_MS = 100
export const DEFAULT_MAX_POINTS = 1000

// === UI Layout Configuration ===
export const PINNED_PANEL_TOP_OFFSET_PX = 20
export const PINNED_PANEL_VERTICAL_SPACING_PX = 220

// === Formatting Configuration ===
export const COORDINATE_DECIMAL_PLACES = 2
export const VOLTAGE_DECIMAL_PLACES = 2
