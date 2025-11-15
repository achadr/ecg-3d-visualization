import React from 'react';
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
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '15px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)',
      maxWidth: '90vw',
    }}>
      <h3 style={{
        margin: '0 0 10px 0',
        fontSize: '16px',
        textAlign: 'center',
        color: '#333'
      }}>
        ECG Real-Time Monitoring
      </h3>

      <ECGStreamControls
        isStreaming={isStreaming}
        onStart={onStart}
        onStop={onStop}
        onReset={onReset}
        bufferSize={bufferSize}
        maxBufferSize={maxBufferSize}
        progress={progress}
      />

      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <ECGStreamingChart
          data={buffer}
          isLive={isStreaming}
          width={700}
          height={200}
        />
      </div>
    </div>
  );
};
