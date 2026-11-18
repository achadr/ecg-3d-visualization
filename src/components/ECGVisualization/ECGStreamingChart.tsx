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

/** Converts the buffer into the column format uPlot expects ([x values, y values]). */
function toAlignedData(points: ECGPoint[]): uPlot.AlignedData {
  // Show an empty chart when there is no data yet
  if (points.length === 0) return [[0], [null]];
  return [points.map(d => d.timestamp), points.map(d => d.value)];
}

function buildOptions(width: number, height: number, isLive: boolean, isDarkTheme: boolean): uPlot.Options {
  // Theme colors
  const lineColor = '#e74c3c';
  const gridColor = isDarkTheme ? '#2a1a1a' : '#e0e0e0';
  const textColor = isDarkTheme ? '#e74c3c' : '#333333';

  return {
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
  const dataRef = useRef<ECGPoint[]>(data);
  const rafIdRef = useRef<number | null>(null);

  // Create the chart once, and again only when its options change (size, theme, live mode).
  // New samples do NOT recreate it: they go through setData below, which is what makes uPlot fast.
  useEffect(() => {
    if (!chartRef.current) return;

    const plot = new uPlot(
      buildOptions(width, height, isLive, isDarkTheme),
      toAlignedData(dataRef.current),
      chartRef.current
    );
    plotRef.current = plot;

    return () => {
      plot.destroy();
      plotRef.current = null;
    };
  }, [width, height, isLive, isDarkTheme]);

  // Push new samples into the existing chart, at most once per animation frame (~60 FPS).
  useEffect(() => {
    dataRef.current = data;

    // An update is already scheduled: it will read the latest data when it runs
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      plotRef.current?.setData(toAlignedData(dataRef.current));
    });
  }, [data]);

  // Cancel a pending update on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

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
