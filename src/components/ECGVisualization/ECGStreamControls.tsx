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
      padding: '10px',
      background: '#f8f9fa',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      minWidth: '100px',
    }}>
      {/* Control Buttons - Vertical Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={onStart}
          disabled={isStreaming}
          style={{
            padding: '8px 12px',
            fontSize: '12px',
            cursor: isStreaming ? 'not-allowed' : 'pointer',
            opacity: isStreaming ? 0.5 : 1,
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: isStreaming ? '#f5f5f5' : '#fff',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'center',
          }}
          title="Start Monitoring"
        >
          <span>▶</span>
          <span style={{ fontSize: '11px' }}>Start</span>
        </button>

        <button
          onClick={onStop}
          disabled={!isStreaming}
          style={{
            padding: '8px 12px',
            fontSize: '12px',
            cursor: !isStreaming ? 'not-allowed' : 'pointer',
            opacity: !isStreaming ? 0.5 : 1,
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: !isStreaming ? '#f5f5f5' : '#fff',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'center',
          }}
          title="Pause"
        >
          <span>⏸</span>
          <span style={{ fontSize: '11px' }}>Pause</span>
        </button>

        <button
          onClick={onReset}
          style={{
            padding: '8px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: '#fff',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'center',
          }}
          title="Reset"
        >
          <span>↻</span>
          <span style={{ fontSize: '11px' }}>Reset</span>
        </button>
      </div>

      {/* Status Info - Vertical Stack */}
      <div style={{
        borderTop: '1px solid #ddd',
        paddingTop: '10px'
      }}>
        <div style={{
          fontSize: '10px',
          color: '#666',
          marginBottom: '6px',
          textAlign: 'center'
        }}>
          <div>{bufferSize} / {maxBufferSize}</div>
          <div style={{ fontSize: '9px', color: '#999' }}>points</div>
        </div>

        {/* Vertical Progress Bar */}
        <div style={{
          width: '100%',
          height: '80px',
          background: '#e0e0e0',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}>
          <div style={{
            height: `${progress}%`,
            width: '100%',
            background: isStreaming ? '#e74c3c' : '#95a5a6',
            transition: 'height 0.1s linear'
          }} />
        </div>

        <div style={{
          fontSize: '11px',
          color: '#666',
          marginTop: '4px',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};
