import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import { getIndicatorColorFromIndex } from '../utils/dataGenerator'
import PointDataDisplay from './PointDataDisplay'
import './PinnedPointsDisplay.css'
import {
  PINNED_PANEL_TOP_OFFSET_PX,
  PINNED_PANEL_VERTICAL_SPACING_PX,
} from '../constants/visualization'

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
      {pinnedPoints.map((point, index) => {
        const indicatorColor = getIndicatorColorFromIndex(index)
        return (
          <div
            key={`pinned-panel-${point.id}-${point.timestamp}`}
            className="pinned-panel"
            style={{
              top: `${PINNED_PANEL_TOP_OFFSET_PX + index * PINNED_PANEL_VERTICAL_SPACING_PX}px`,
              borderColor: indicatorColor
            }}
          >
            <h3 style={{ color: indicatorColor, borderBottomColor: indicatorColor }}>Pinned #{point.id}</h3>
            <PointDataDisplay point={point} labelColor={indicatorColor} />
            <div className="button-group">
              <button
                className="btn-unpin"
                style={{
                  backgroundColor: indicatorColor,
                  color: '#000'
                }}
                onClick={() => onUnpin(point)}
              >
                Unpin
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PinnedPointsDisplay
