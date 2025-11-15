import React from 'react';

interface ECGStreamControlsProps {
  isStreaming: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  bufferSize: number;
  maxBufferSize: number;
  progress: number;
}

export const ECGStreamControls: React.FC<ECGStreamControlsProps> = ({
  isStreaming,
  onStart,
  onStop,
  onReset,
  bufferSize,
  maxBufferSize,
  progress
}) => {
  return (
    <div style={{
      padding: '20px',
      background: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Control Buttons */}
        <button
          onClick={onStart}
          disabled={isStreaming}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: isStreaming ? 'not-allowed' : 'pointer',
            opacity: isStreaming ? 0.5 : 1
          }}
        >
          ▶ Start Monitoring
        </button>

        <button
          onClick={onStop}
          disabled={!isStreaming}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: !isStreaming ? 'not-allowed' : 'pointer',
            opacity: !isStreaming ? 0.5 : 1
          }}
        >
          ⏸ Pause
        </button>

        <button
          onClick={onReset}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          ↻ Reset
        </button>

        {/* Status Indicators */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>
            Buffer: {bufferSize.toLocaleString()} / {maxBufferSize.toLocaleString()} points
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            background: '#ddd',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: isStreaming ? '#e74c3c' : '#95a5a6',
              transition: 'width 0.1s linear'
            }} />
          </div>

          <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
            Progress: {progress.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
