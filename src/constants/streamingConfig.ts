export const ECG_STREAMING_CONFIG = {
  // Device simulation
  SAMPLING_RATE: 500,              // Hz

  // Batch configuration
  // 50 points every 100ms = 500 points/second = 500 Hz ✓
  BATCH_SIZE: 50,
  BATCH_INTERVAL: 100,             // ms

  // Buffer size (circular/ring buffer)
  BUFFER_MAX_DURATION: 30,         // seconds
  BUFFER_MAX_SIZE: 15000,          // points (30s * 500Hz)

  // Display configuration
  DISPLAY_WINDOW: 10,              // seconds (what uPlot shows)

} as const;

export const ECG_CHART_CONFIG = {
  WIDTH: 1400,
  HEIGHT: 400,
  LINE_COLOR: '#e74c3c',
  LINE_WIDTH: 2,
  VOLTAGE_RANGE: [-2, 2] as [number, number], // mV
} as const;
