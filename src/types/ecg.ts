export interface ECGPoint {
  timestamp: number;  // In seconds
  value: number;      // In millivolts
}

export interface ECGDataset {
  timestamps: number[];
  values: number[];
  samplingRate: number;
  duration: number;
}

export interface StreamingConfig {
  batchSize: number;        // Points per batch
  batchInterval: number;    // Milliseconds between batches
  bufferMaxSize: number;    // Maximum buffer size (ring buffer)
  bufferMaxDuration: number; // Maximum duration in seconds
}
