import { useState, useEffect, useRef, useCallback } from 'react';
import type { ECGDataset, ECGPoint, StreamingConfig } from '../types/ecg';

interface UseStreamingSimulatorReturn {
  buffer: ECGPoint[];
  isStreaming: boolean;
  progress: number;            // 0-100 (how much of dataset has been streamed)
  startStreaming: () => void;
  stopStreaming: () => void;
  resetStream: () => void;
}

export const useECGStreamingSimulator = (
  dataset: ECGDataset | null,
  config: StreamingConfig
): UseStreamingSimulatorReturn => {
  const [buffer, setBuffer] = useState<ECGPoint[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentIndexRef = useRef(0);
  const intervalIdRef = useRef<number | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  // Main streaming logic
  useEffect(() => {
    if (!dataset || !isStreaming) {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }

    intervalIdRef.current = window.setInterval(() => {
      const startIdx = currentIndexRef.current;
      const endIdx = Math.min(
        startIdx + config.batchSize,
        dataset.values.length
      );

      // Check if we've reached the end
      if (startIdx >= dataset.values.length) {
        // Loop back to beginning
        currentIndexRef.current = 0;
        setProgress(0);
        return;
      }

      // Create new batch of points
      const newPoints: ECGPoint[] = [];
      for (let i = startIdx; i < endIdx; i++) {
        newPoints.push({
          timestamp: dataset.timestamps[i],
          value: dataset.values[i]
        });
      }

      currentIndexRef.current = endIdx;

      // Update progress
      const newProgress = (endIdx / dataset.values.length) * 100;
      setProgress(newProgress);

      // Update buffer with optimized ring buffer logic
      setBuffer(prev => {
        // Calculate how many points to keep from the old buffer
        const pointsToRemove = Math.max(0, prev.length + newPoints.length - config.bufferMaxSize);

        // If buffer is full, remove old points first to avoid large array operations
        if (pointsToRemove > 0) {
          // Only keep the most recent points that will fit with the new batch
          const trimmedPrev = prev.slice(pointsToRemove);
          return [...trimmedPrev, ...newPoints];
        }

        // Buffer not full yet, just append
        return [...prev, ...newPoints];
      });

    }, config.batchInterval);

    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [dataset, isStreaming, config]);

  const startStreaming = useCallback(() => {
    setIsStreaming(true);
  }, []);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
  }, []);

  const resetStream = useCallback(() => {
    setIsStreaming(false);
    setBuffer([]);
    setProgress(0);
    currentIndexRef.current = 0;

    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  return {
    buffer,
    isStreaming,
    progress,
    startStreaming,
    stopStreaming,
    resetStream
  };
};
