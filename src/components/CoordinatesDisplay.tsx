import type { ElectrophysiologyPoint } from '../types/electrophysiology'
import PointDataDisplay from './PointDataDisplay'
import './CoordinatesDisplay.css'

interface CoordinatesDisplayProps {
  point: ElectrophysiologyPoint | null
  onPin?: () => void
  onDeselect?: () => void
}

/**
 * CoordinatesDisplay Component
 * Displays information about a selected electrophysiology data point
 * including position, voltage, and tissue type
 *
 * @param point - The selected point to display (null if no selection)
 * @param onPin - Optional callback to pin the selected point
 * @param onDeselect - Optional callback to deselect the current point
 */
function CoordinatesDisplay({ point, onPin, onDeselect }: CoordinatesDisplayProps) {
  if (!point) return null

  return (
    <div className="coordinates-panel">
      <h3>Point #{point.id}</h3>
      <PointDataDisplay point={point} />
      <div className="button-group">
        {onPin && <button onClick={onPin} className="btn-pin">Pin</button>}
        {onDeselect && <button onClick={onDeselect} className="btn-deselect">Deselect</button>}
      </div>
    </div>
  )
}

export default CoordinatesDisplay
