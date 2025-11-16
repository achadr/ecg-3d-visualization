import React, { useRef, useEffect } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import './ECGStreamingChart.css';
import type { ECGPoint } from '../../types/ecg';
import { ECG_CHART_CONFIG } from '../../constants/ecgStreamingConfig';

interface ECGStreamingChartProps {
  data: ECGPoint[];
  isLive?: boolean;
  width?: number;
  height?: number;
  isDarkTheme?: boolean;
}

export const ECGStreamingChart: React.FC<ECGStreamingChartProps> = ({
  data,
  isLive = false,
  width = ECG_CHART_CONFIG.WIDTH,
  height = ECG_CHART_CONFIG.HEIGHT,
  isDarkTheme = true
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);
  const pendingDataRef = useRef<ECGPoint[] | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

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
      // Show empty chart if no data
      const timestamps = pendingDataRef.current.length > 0
        ? pendingDataRef.current.map(d => d.timestamp)
        : [0];
      const values = pendingDataRef.current.length > 0
        ? pendingDataRef.current.map(d => d.value)
        : [null];
      const uplotData: uPlot.AlignedData = [timestamps, values];

      // Theme colors
      const lineColor = isDarkTheme ? '#e74c3c' : '#e74c3c';
      const gridColor = isDarkTheme ? '#2a1a1a' : '#e0e0e0';
      const textColor = isDarkTheme ? '#e74c3c' : '#333333';

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
            stroke: lineColor,
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
            grid: { show: true, stroke: gridColor, width: 1 },
            ticks: { show: !isLive, size: 5, stroke: textColor },
            label: "Time (s)",
            labelSize: 20,
            font: "10px Arial",
            stroke: textColor,
            values: isLive ? () => [] : undefined, // Hide time tick values when live (they move)
          },
          {
            grid: { show: true, stroke: gridColor, width: 1 },
            ticks: { show: true, size: 5, stroke: textColor },
            label: "Voltage (mV)",
            labelSize: 20,
            font: "10px Arial",
            stroke: textColor,
            // Keep voltage values visible always
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
  }, [data, width, height, isLive, isDarkTheme]);

  return (
    <div
      style={{ position: 'relative' }}
      className={isDarkTheme ? 'ecg-chart-dark' : 'ecg-chart-light'}
    >
      <div ref={chartRef} />
      {isLive && (
        <div style={{
          position: 'absolute',
          top: '2px',
          right: '5px',
          background: '#e74c3c',
          color: 'white',
          padding: '3px 8px',
          borderRadius: '3px',
          fontSize: '10px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ fontSize: '8px' }}>●</span> LIVE
        </div>
      )}
    </div>
  );
};
