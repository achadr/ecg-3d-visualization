import React, { useState } from 'react';
import { ECGStreamingChart } from './ECGStreamingChart';
import { ECGStreamControls } from './ECGStreamControls';
import type { ECGPoint } from '../../types/ecg';

interface ECGDisplayProps {
  buffer: ECGPoint[];
  isStreaming: boolean;
  progress: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  maxBufferSize: number;
}

export const ECGDisplay: React.FC<ECGDisplayProps> = ({
  buffer,
  isStreaming,
  progress,
  onStart,
  onStop,
  onReset,
  maxBufferSize
}) => {
  const bufferSize = buffer.length;
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true); // true = green/black, false = red/white

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.97)',
      borderRadius: '8px',
      padding: isMinimized ? '8px' : '10px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(8px)',
      width: isMinimized ? 'auto' : '750px',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMinimized ? '0' : '8px',
      }}>
        <h3 style={{
          margin: '0',
          fontSize: '13px',
          fontWeight: '600',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {isStreaming && <span style={{ color: '#e74c3c', fontSize: '10px' }}>●</span>}
          ECG Monitor
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            style={{
              background: 'transparent',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px 8px',
              color: '#666',
              lineHeight: 1,
            }}
            title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkTheme ? '☀' : '🌙'}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '2px 6px',
              color: '#666',
              lineHeight: 1,
            }}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '□' : '−'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          {/* Left column: Controls */}
          <ECGStreamControls
            isStreaming={isStreaming}
            onStart={onStart}
            onStop={onStop}
            onReset={onReset}
            bufferSize={bufferSize}
            maxBufferSize={maxBufferSize}
            progress={progress}
          />

          {/* Right column: Chart */}
          <div style={{
            background: isDarkTheme ? '#000000' : '#ffffff',
            borderRadius: '4px',
            padding: '6px',
            boxShadow: isDarkTheme ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.08)',
            flex: 1,
            minWidth: 0
          }}>
            <ECGStreamingChart
              data={buffer}
              isLive={isStreaming}
              width={610}
              height={200}
              isDarkTheme={isDarkTheme}
            />
          </div>
        </div>
      )}
    </div>
  );
};
