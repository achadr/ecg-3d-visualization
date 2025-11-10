import { useState, useEffect, useCallback, useRef } from 'react'
import type { ElectrophysiologyPoint, PointGenerator } from '../types/electrophysiology'
import {
  POINTS_UPDATE_INTERVAL_MS,
  LIVE_POINTS_COUNT,
} from '../constants/visualization'

/**
 * Return type for useDataStream hook
 */
interface UseDataStreamReturn {
  data: ElectrophysiologyPoint[]
  isStreaming: boolean
  startStream: () => void
  stopStream: () => void
  clearData: () => void
}

/**
 * Custom hook to manage real-time batch data streaming
 * Generates multiple points per interval and replaces the entire batch
 * Separates data generation logic from rendering components
 *
 * @param dataGenerator - Function that generates data points
 * @param interval - Interval in ms between batch generations (default: 1000ms)
 * @param batchSize - Number of points to generate per interval (default: 100
 * @returns Object with data, streaming state, and control functions
 */
function useDataStream(
  dataGenerator: PointGenerator,
  interval: number = POINTS_UPDATE_INTERVAL_MS,
  batchSize: number = LIVE_POINTS_COUNT
): UseDataStreamReturn {
  const [data, setData] = useState<ElectrophysiologyPoint[]>([])
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameCountRef = useRef<number>(0)

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const startStream = useCallback(() => {
    if (isStreaming) return

    // Generate initial batch
    const initialBatch = Array.from({ length: batchSize }, (_, i) =>
      dataGenerator(i)
    )
    setData(initialBatch)
    setIsStreaming(true)

    // Update batch at regular intervals
    intervalRef.current = setInterval(() => {
      frameCountRef.current += 1
      const newBatch = Array.from({ length: batchSize }, (_, i) =>
        dataGenerator(frameCountRef.current * batchSize + i)
      )
      setData(newBatch)
    }, interval)
  }, [dataGenerator, interval, batchSize, isStreaming])

  const clearData = useCallback(() => {
    stopStream()
    setData([])
    frameCountRef.current = 0
  }, [stopStream])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    data,
    isStreaming,
    startStream,
    stopStream,
    clearData
  }
}

export default useDataStream
