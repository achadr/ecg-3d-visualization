import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import type { ECGPoint } from '../types/ecg'

// uPlot draws on a <canvas>, which the test DOM cannot do: replace it with a spy
// so the tests can count how many charts are created and how many updates they receive.
const uplotMock = vi.hoisted(() => {
  const setData = vi.fn()
  const destroy = vi.fn()
  const ctor = vi.fn(function (this: Record<string, unknown>) {
    this.setData = setData
    this.destroy = destroy
  })
  return { ctor, setData, destroy }
})

vi.mock('uplot', () => ({ default: uplotMock.ctor }))
vi.mock('uplot/dist/uPlot.min.css', () => ({}))

import { ECGStreamingChart } from '../components/ECGVisualization/ECGStreamingChart'

const batch = (start: number, count: number): ECGPoint[] =>
  Array.from({ length: count }, (_, i) => ({ timestamp: (start + i) / 500, value: Math.sin(start + i) }))

describe('ECGStreamingChart', () => {
  beforeEach(() => {
    uplotMock.ctor.mockClear()
    uplotMock.setData.mockClear()
    uplotMock.destroy.mockClear()
  })

  it('creates the chart once and updates it with setData when new samples arrive', async () => {
    const { rerender } = render(<ECGStreamingChart data={batch(0, 50)} isLive />)

    rerender(<ECGStreamingChart data={batch(0, 100)} isLive />)
    rerender(<ECGStreamingChart data={batch(0, 150)} isLive />)

    await waitFor(() => expect(uplotMock.setData).toHaveBeenCalled())

    expect(uplotMock.ctor).toHaveBeenCalledTimes(1)
    expect(uplotMock.destroy).not.toHaveBeenCalled()

    // The last update carries the latest buffer (150 samples)
    const [xValues] = uplotMock.setData.mock.lastCall![0]
    expect(xValues).toHaveLength(150)
  })

  it('recreates the chart when the theme changes', () => {
    const { rerender } = render(<ECGStreamingChart data={batch(0, 50)} isDarkTheme />)
    rerender(<ECGStreamingChart data={batch(0, 50)} isDarkTheme={false} />)

    expect(uplotMock.ctor).toHaveBeenCalledTimes(2)
    expect(uplotMock.destroy).toHaveBeenCalledTimes(1)
  })

  it('destroys the chart on unmount', () => {
    const { unmount } = render(<ECGStreamingChart data={batch(0, 50)} />)
    unmount()

    expect(uplotMock.destroy).toHaveBeenCalledTimes(1)
  })
})
