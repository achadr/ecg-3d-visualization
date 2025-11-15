import type { ECGDataset } from '../types/ecg';

/**
 * Generates a realistic synthetic ECG signal
 * @param duration - Duration in seconds (default: 300s = 5 minutes)
 * @param samplingRate - Sampling rate in Hz (default: 500 Hz)
 * @param heartRate - Heart rate in BPM (default: 60 BPM)
 * @returns ECGDataset with realistic ECG waveform
 */
export const generateECGData = (
  duration: number = 300,
  samplingRate: number = 500,
  heartRate: number = 60
): ECGDataset => {
  const totalPoints = duration * samplingRate;
  const timestamps: number[] = [];
  const values: number[] = [];

  // Time between heartbeats (in seconds)
  const beatInterval = 60 / heartRate;

  // Generate timestamps
  for (let i = 0; i < totalPoints; i++) {
    timestamps.push(i / samplingRate);
  }

  // Generate ECG waveform
  for (let i = 0; i < totalPoints; i++) {
    const t = timestamps[i];

    // Position within current heartbeat cycle
    const beatPhase = (t % beatInterval) / beatInterval;

    let ecgValue = 0;

    // P wave (atrial depolarization) - around 0.16 of the cycle
    if (beatPhase >= 0.0 && beatPhase < 0.16) {
      const pTime = (beatPhase - 0.08) / 0.08;
      ecgValue += 0.15 * Math.exp(-(pTime * pTime) / 0.05);
    }

    // QRS complex (ventricular depolarization) - sharp spike around 0.2
    if (beatPhase >= 0.16 && beatPhase < 0.24) {
      const qrsTime = (beatPhase - 0.2) / 0.04;

      // Q wave (small negative)
      if (beatPhase < 0.19) {
        ecgValue -= 0.1 * Math.exp(-((beatPhase - 0.18) ** 2) / 0.0001);
      }

      // R wave (large positive spike)
      if (beatPhase >= 0.19 && beatPhase < 0.21) {
        ecgValue += 1.5 * Math.exp(-((beatPhase - 0.2) ** 2) / 0.00005);
      }

      // S wave (small negative)
      if (beatPhase >= 0.21) {
        ecgValue -= 0.2 * Math.exp(-((beatPhase - 0.22) ** 2) / 0.0001);
      }
    }

    // T wave (ventricular repolarization) - around 0.36
    if (beatPhase >= 0.28 && beatPhase < 0.5) {
      const tTime = (beatPhase - 0.38) / 0.1;
      ecgValue += 0.3 * Math.exp(-(tTime * tTime) / 0.1);
    }

    // Add baseline noise (realistic electrical interference)
    const noise = (Math.random() - 0.5) * 0.03;

    // Add slight baseline wander (respiratory artifact)
    const baselineWander = 0.05 * Math.sin(2 * Math.PI * t / 4);

    values.push(ecgValue + noise + baselineWander);
  }

  return {
    timestamps,
    values,
    samplingRate,
    duration
  };
};
