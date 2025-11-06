import { useEffect } from 'react'
import useDataStream from '../hooks/useDataStream'
import { generateElectrophysiologyPoint } from '../utils/dataGenerator'
import DataPoint from './DataPoint'

/**
 * DataPointCloud Component
 * Manages the data stream and renders all active data points
 *
 * Automatically starts streaming on mount
 */
function DataPointCloud() {
  const { data, startStream } = useDataStream(
    generateElectrophysiologyPoint,
    100,  // Generate new point every 100ms
    50    // Keep last 50 points
  )

  // Auto-start streaming on mount
  useEffect(() => {
    startStream()
  }, [startStream])

  return (
    <group>
      {data.map((point) => (
        <DataPoint
          key={`${point.id}-${point.timestamp}`}
          point={point}
          scale={0.08}
          opacity={0.8}
        />
      ))}
    </group>
  )
}

export default DataPointCloud
