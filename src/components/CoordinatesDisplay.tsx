import type { ElectrophysiologyPoint } from '../types/electrophysiology'
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
        {onPin && <button onClick={onPin} className="btn-pin">Pin</button>}
        {onDeselect && <button onClick={onDeselect} className="btn-deselect">Deselect</button>}
      </div>
    </div>
  )
}

export default CoordinatesDisplay
