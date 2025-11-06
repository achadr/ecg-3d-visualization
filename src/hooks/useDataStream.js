import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook to simulate real-time data streaming
 * Manages streaming state, data accumulation, and cleanup
 *
 * @param {Function} dataGenerator - Function that generates data points
 * @param {number} interval - Interval in ms between data generations (default: 100ms)
 * @param {number} maxPoints - Maximum number of points to keep in memory (default: 1000)
 * @returns {Object} { data, isStreaming, startStream, stopStream, clearData }
 */
function useDataStream(dataGenerator, interval = 100, maxPoints = 1000) {
  const [data, setData] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const intervalRef = useRef(null)
  const frameCountRef = useRef(0)

  const startStream = useCallback(() => {
    if (isStreaming) return

    setIsStreaming(true)
    frameCountRef.current = 0

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

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsStreaming(false)
  }, [])

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
