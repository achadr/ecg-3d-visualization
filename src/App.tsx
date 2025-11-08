import { useState } from 'react'
import type { ElectrophysiologyPoint } from './types/electrophysiology'
import Scene3D from './components/Scene3D'
import CoordinatesDisplay from './components/CoordinatesDisplay'
import PinnedPointsDisplay from './components/PinnedPointsDisplay'
import './App.css'

function App() {
  const [selectedPoint, setSelectedPoint] = useState<ElectrophysiologyPoint | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<ElectrophysiologyPoint | null>(null)
  const [pinnedPoints, setPinnedPoints] = useState<ElectrophysiologyPoint[]>([])

  const handleSelectPoint = (point: ElectrophysiologyPoint) => {
    setSelectedPoint(point)
  }

  const handleHoverPoint = (point: ElectrophysiologyPoint | null) => {
    setHoveredPoint(point)
  }

  const handlePinPoint = () => {
    if (selectedPoint) {
      setPinnedPoints([...pinnedPoints, selectedPoint])
      setSelectedPoint(null)
    }
  }

  const handleDeselectPoint = () => {
    setSelectedPoint(null)
  }

  const handleUnpinPoint = (point: ElectrophysiologyPoint) => {
    setPinnedPoints(pinnedPoints.filter((p) => p.id !== point.id || p.timestamp !== point.timestamp))
  }

  return (
    <div className="app-container">
      <Scene3D
        onSelectPoint={handleSelectPoint}
        onHoverPoint={handleHoverPoint}
        selectedPoint={selectedPoint}
        hoveredPoint={hoveredPoint}
        pinnedPoints={pinnedPoints}
      />
      <CoordinatesDisplay
        point={selectedPoint}
        onPin={handlePinPoint}
        onDeselect={handleDeselectPoint}
      />
      <PinnedPointsDisplay
        pinnedPoints={pinnedPoints}
        onUnpin={handleUnpinPoint}
      />
    </div>
  )
}

export default App
