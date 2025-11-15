import React, { useRef, useEffect } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import type { ECGPoint } from '../../types/ecg';
import { ECG_CHART_CONFIG } from '../../constants/ecgStreamingConfig';

interface ECGStreamingChartProps {
  data: ECGPoint[];
  isLive?: boolean;
  width?: number;
  height?: number;
}

export const ECGStreamingChart: React.FC<ECGStreamingChartProps> = ({
  data,
  isLive = false,
  width = ECG_CHART_CONFIG.WIDTH,
  height = ECG_CHART_CONFIG.HEIGHT
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);
  const pendingDataRef = useRef<ECGPoint[] | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Store pending data
    pendingDataRef.current = data;

    // Cancel any pending animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Schedule update on next animation frame (synced with browser refresh ~60 FPS)
    rafIdRef.current = requestAnimationFrame(() => {
      if (!pendingDataRef.current || !chartRef.current) return;

      // Prepare data for uPlot (expects array of arrays)
      const timestamps = pendingDataRef.current.map(d => d.timestamp);
      const values = pendingDataRef.current.map(d => d.value);
      const uplotData: uPlot.AlignedData = [timestamps, values];

      const opts: uPlot.Options = {
        width,
        height,
        cursor: {
          drag: { x: false, y: false },
          points: { show: false }
        },
        series: [
          { label: "Time (s)" },
          {
            label: "ECG (mV)",
            stroke: ECG_CHART_CONFIG.LINE_COLOR,
            width: ECG_CHART_CONFIG.LINE_WIDTH,
            spanGaps: false,
          }
        ],
        scales: {
          x: {
            time: false,
          },
          y: {
            auto: false,
            range: ECG_CHART_CONFIG.VOLTAGE_RANGE,
          }
        },
        axes: [
          {
            grid: { show: true, stroke: "#e0e0e0", width: 1 },
            ticks: { show: true },
            label: "Time (s)",
            labelSize: 30,
          },
          {
            grid: { show: true, stroke: "#e0e0e0", width: 1 },
            ticks: { show: true },
            label: "Voltage (mV)",
            labelSize: 30,
          }
        ],
      };

      if (plotRef.current) {
        // Update existing plot
        plotRef.current.setData(uplotData);
        plotRef.current.setSize({ width, height });
      } else {
        // Create new plot
        plotRef.current = new uPlot(opts, uplotData, chartRef.current);
      }
    });

    return () => {
      // Cleanup on unmount
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (plotRef.current) {
        plotRef.current.destroy();
        plotRef.current = null;
      }
    };
  }, [data, width, height]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={chartRef} />
      {isLive && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '10px',
          background: '#e74c3c',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          🔴 LIVE
        </div>
      )}
    </div>
  );
};
