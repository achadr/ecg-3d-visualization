import { usePointSelection } from './hooks/usePointSelection'
import Scene3D from './components/Scene3D'
import CoordinatesDisplay from './components/CoordinatesDisplay'
import PinnedPointsDisplay from './components/PinnedPointsDisplay'
import './App.css'

function App() {
  // Use custom hook to manage point selection, hover, and pinning states
  // This separates business logic from presentation
  const {
    selectedPoint,
    hoveredPoint,
    pinnedPoints,
    handleSelectPoint,
    handleHoverPoint,
    handlePinPoint,
    handleDeselectPoint,
    handleUnpinPoint,
  } = usePointSelection()

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
