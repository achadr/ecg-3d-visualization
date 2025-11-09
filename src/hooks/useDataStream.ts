import { useState, useEffect, useCallback, useRef } from 'react'
import type { ElectrophysiologyPoint, PointGenerator } from '../types/electrophysiology'
import {
  DEFAULT_STREAM_INTERVAL_MS,
  DEFAULT_MAX_POINTS,
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
 * Custom hook to simulate real-time data streaming
 * Manages streaming state, data accumulation, and cleanup
 *
 * Written using TDD approach - tests written first
 *
 * @param dataGenerator - Function that generates data points
 * @param interval - Interval in ms between data generations (default: 1000ms)
 * @param maxPoints - Maximum number of points to keep in memory (default: 1000)
 * @returns Object with data, streaming state, and control functions
 */
function useDataStream(
  dataGenerator: PointGenerator,
  interval: number = DEFAULT_STREAM_INTERVAL_MS,
  maxPoints: number = DEFAULT_MAX_POINTS
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

    setIsStreaming(true)

    intervalRef.current = setInterval(() => {
      const newPoint = dataGenerator(frameCountRef.current)

      setData((prevData) => {
        const updatedData = [...prevData, newPoint]

        // Keep only the most recent maxPoints
        if (updatedData.length > maxPoints) {
          return updatedData.slice(-maxPoints)
        }

        return updatedData
      })

      frameCountRef.current += 1
    }, interval)
  }, [dataGenerator, interval, maxPoints, isStreaming])

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
