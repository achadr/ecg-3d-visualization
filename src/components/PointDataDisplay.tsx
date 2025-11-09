import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import {
  COORDINATE_DECIMAL_PLACES,
  VOLTAGE_DECIMAL_PLACES,
} from '../constants/visualization'

/**
 * Props for PointDataDisplay component
 */
interface PointDataDisplayProps {
  point: ElectrophysiologyPoint
  labelColor?: string
}

/**
 * PointDataDisplay Component
 * Reusable component for displaying point data (type, voltage, coordinates)
 * Used by both CoordinatesDisplay and PinnedPointsDisplay to eliminate duplication
 *
 * @param point - The point to display
 * @param labelColor - Optional color for labels (used in pinned points)
 */
function PointDataDisplay({ point, labelColor }: PointDataDisplayProps) {
  return (
    <>
      <div className="coord-row">
        <span className="label" style={labelColor ? { color: labelColor } : undefined}>
          Type:
        </span>
        <span className="value">{point.type}</span>
      </div>
      <div className="coord-row">
        <span className="label" style={labelColor ? { color: labelColor } : undefined}>
          Voltage:
        </span>
        <span className="value">{point.voltage.toFixed(VOLTAGE_DECIMAL_PLACES)} mV</span>
      </div>
      <div className="coord-row">
        <span className="label" style={labelColor ? { color: labelColor } : undefined}>
          x:
        </span>
        <span className="value">{point.position.x.toFixed(COORDINATE_DECIMAL_PLACES)}</span>
      </div>
      <div className="coord-row">
        <span className="label" style={labelColor ? { color: labelColor } : undefined}>
          y:
        </span>
        <span className="value">{point.position.y.toFixed(COORDINATE_DECIMAL_PLACES)}</span>
      </div>
      <div className="coord-row">
        <span className="label" style={labelColor ? { color: labelColor } : undefined}>
          z:
        </span>
        <span className="value">{point.position.z.toFixed(COORDINATE_DECIMAL_PLACES)}</span>
      </div>
    </>
  )
}

export default PointDataDisplay
