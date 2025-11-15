// Base configuration
const SAMPLING_RATE =500;              // Hz
const BATCH_INTERVAL = 100;             // ms
const BUFFER_MAX_DURATION = 2;          // seconds

export const ECG_STREAMING_CONFIG = {
  // Device simulation
  SAMPLING_RATE,

  // Batch configuration
  // Auto-calculated to match sampling rate
  BATCH_SIZE: (SAMPLING_RATE * BATCH_INTERVAL) / 1000,  // 50 points every 100ms = 500 Hz
  BATCH_INTERVAL,
  BUFFER_MAX_DURATION,
  // Auto-calculated based on duration and sampling rate
  BUFFER_MAX_SIZE: BUFFER_MAX_DURATION * SAMPLING_RATE,  // 2s * 500Hz = 1000 points


} as const;

export const ECG_CHART_CONFIG = {
  WIDTH: 1400,
  HEIGHT: 400,
  LINE_COLOR: '#e74c3c',
  LINE_WIDTH: 2,
  VOLTAGE_RANGE: [-2, 2] as [number, number], // mV
} as const;
