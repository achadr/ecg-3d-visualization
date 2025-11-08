import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import './PinnedPointsDisplay.css'

/**
 * Props for PinnedPointsDisplay component
 */
interface PinnedPointsDisplayProps {
  pinnedPoints: ElectrophysiologyPoint[]
  onUnpin: (point: ElectrophysiologyPoint) => void
}

/**
 * PinnedPointsDisplay Component
 * Displays multiple UI panels for pinned points
 * Each pinned point gets its own panel that can be unpinned
 */
function PinnedPointsDisplay({ pinnedPoints, onUnpin }: PinnedPointsDisplayProps) {
  if (pinnedPoints.length === 0) return null

  return (
    <div className="pinned-points-container">
      {pinnedPoints.map((point, index) => (
        <div
          key={`pinned-panel-${point.id}-${point.timestamp}`}
          className="pinned-panel"
          style={{ top: `${20 + index * 220}px` }}
        >
          <h3>Pinned #{point.id}</h3>
          <div className="coord-row">
            <span className="label">Type:</span>
            <span className="value">{point.type}</span>
          </div>
          <div className="coord-row">
            <span className="label">Voltage:</span>
            <span className="value">{point.voltage.toFixed(2)} mV</span>
          </div>
          <div className="coord-row">
            <span className="label">x:</span>
            <span className="value">{point.position.x.toFixed(2)}</span>
          </div>
          <div className="coord-row">
            <span className="label">y:</span>
            <span className="value">{point.position.y.toFixed(2)}</span>
          </div>
          <div className="coord-row">
            <span className="label">z:</span>
            <span className="value">{point.position.z.toFixed(2)}</span>
          </div>
          <div className="button-group">
            <button
              className="btn-unpin"
              onClick={() => onUnpin(point)}
            >
              Unpin
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PinnedPointsDisplay
