import { usePointSelection } from './hooks/usePointSelection'
import { useMemo } from 'react'
import Scene3D from './components/Scene3D'
import CoordinatesDisplay from './components/CoordinatesDisplay'
import PinnedPointsDisplay from './components/PinnedPointsDisplay'
import { ECGDisplay } from './components/ECGVisualization/ECGDisplay'
import { useECGStreamingSimulator } from './hooks/useECGStreamingSimulator'
import { generateECGData } from './utils/ecgGenerator'
import { ECG_STREAMING_CONFIG } from './constants/ecgStreamingConfig'
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

  // Generate ECG dataset once
  const ecgDataset = useMemo(() => {
    return generateECGData(
      300,  // 5 minutes
      ECG_STREAMING_CONFIG.SAMPLING_RATE,
      60    // 60 BPM
    );
  }, []);

  // ECG streaming configuration
  const streamConfig = {
    batchSize: ECG_STREAMING_CONFIG.BATCH_SIZE,
    batchInterval: ECG_STREAMING_CONFIG.BATCH_INTERVAL,
    bufferMaxSize: ECG_STREAMING_CONFIG.BUFFER_MAX_SIZE,
    bufferMaxDuration: ECG_STREAMING_CONFIG.BUFFER_MAX_DURATION,
  };

  // Simulate real-time ECG streaming
  const {
    buffer: ecgBuffer,
    isStreaming: ecgIsStreaming,
    progress: ecgProgress,
    startStreaming: ecgStartStreaming,
    stopStreaming: ecgStopStreaming,
    resetStream: ecgResetStream
  } = useECGStreamingSimulator(ecgDataset, streamConfig);

  return (
    <div className="app-container">
      <Scene3D
        onSelectPoint={handleSelectPoint}
        onHoverPoint={handleHoverPoint}
        selectedPoint={selectedPoint}
        hoveredPoint={hoveredPoint}
        pinnedPoints={pinnedPoints}
      />
      <ECGDisplay
        buffer={ecgBuffer}
        isStreaming={ecgIsStreaming}
        progress={ecgProgress}
        onStart={ecgStartStreaming}
        onStop={ecgStopStreaming}
        onReset={ecgResetStream}
        maxBufferSize={streamConfig.bufferMaxSize}
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
