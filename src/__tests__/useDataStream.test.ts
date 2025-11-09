import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useDataStream from '../hooks/useDataStream'
import { POINTS_UPDATE_INTERVAL_MS, LIVE_POINTS_COUNT } from '../constants/visualization'

describe('useDataStream', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with default values', () => {
    const mockGenerator = vi.fn()
    const { result } = renderHook(() => useDataStream(mockGenerator))

    expect(result.current.data).toEqual([])
    expect(result.current.isStreaming).toBe(false)
    expect(typeof result.current.startStream).toBe('function')
    expect(typeof result.current.stopStream).toBe('function')
    expect(typeof result.current.clearData).toBe('function')
  })

  it('should generate initial batch when startStream is called', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 1000, 10))

    act(() => {
      result.current.startStream()
    })

    expect(result.current.isStreaming).toBe(true)
    expect(result.current.data).toHaveLength(10)
    expect(mockGenerator).toHaveBeenCalledTimes(10)
    expect(result.current.data[0].id).toBe('0')
    expect(result.current.data[9].id).toBe('9')
  })

  it('should replace batch at specified interval', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 1000, 10))

    act(() => {
      result.current.startStream()
    })

    // Initial batch: ids 0-9
    expect(result.current.data).toHaveLength(10)
    expect(result.current.data[0].id).toBe('0')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Second batch: ids 10-19 (replaced, not accumulated)
    expect(result.current.data).toHaveLength(10)
    expect(result.current.data[0].id).toBe('10')
    expect(result.current.data[9].id).toBe('19')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Third batch: ids 20-29
    expect(result.current.data).toHaveLength(10)
    expect(result.current.data[0].id).toBe('20')
    expect(result.current.data[9].id).toBe('29')
  })

  it('should stop streaming when stopStream is called', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 1000, 10))

    act(() => {
      result.current.startStream()
    })

    expect(result.current.isStreaming).toBe(true)
    expect(result.current.data).toHaveLength(10)

    act(() => {
      result.current.stopStream()
    })

    expect(result.current.isStreaming).toBe(false)

    const dataBeforeAdvance = result.current.data
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    // Data should remain unchanged after stopping
    expect(result.current.data).toEqual(dataBeforeAdvance)
  })

  it('should clear data when clearData is called', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 1000, 10))

    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.data).toHaveLength(10)

    act(() => {
      result.current.clearData()
    })

    expect(result.current.data).toEqual([])
    expect(result.current.isStreaming).toBe(false)
  })

  it('should support custom batch sizes', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 1000, 5))

    act(() => {
      result.current.startStream()
    })

    expect(result.current.data).toHaveLength(5)
    expect(result.current.data[0].id).toBe('0')
    expect(result.current.data[4].id).toBe('4')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Second batch with size 5
    expect(result.current.data).toHaveLength(5)
    expect(result.current.data[0].id).toBe('5')
    expect(result.current.data[4].id).toBe('9')
  })

  it('should support large batch sizes', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 1000, 100))

    act(() => {
      result.current.startStream()
    })

    expect(result.current.data).toHaveLength(100)
    expect(result.current.data[0].id).toBe('0')
    expect(result.current.data[99].id).toBe('99')
  })

  it('should not start if already streaming', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 1000, 10))

    act(() => {
      result.current.startStream()
    })

    expect(result.current.isStreaming).toBe(true)
    const callCountAfterFirstStart = mockGenerator.mock.calls.length

    // Try to start again
    act(() => {
      result.current.startStream()
    })

    // Should not generate additional points
    expect(mockGenerator.mock.calls.length).toBe(callCountAfterFirstStart)
  })

  it('should cleanup interval on unmount', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result, unmount } = renderHook(() => useDataStream(mockGenerator, 1000, 10))

    act(() => {
      result.current.startStream()
    })

    expect(result.current.data).toHaveLength(10)

    const callCountBeforeUnmount = mockGenerator.mock.calls.length
    unmount()

    // Advance time after unmount - mockGenerator should not be called
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(mockGenerator.mock.calls.length).toBe(callCountBeforeUnmount)
  })

  it('should use default interval from constants', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result } = renderHook(() => useDataStream(mockGenerator))

    act(() => {
      result.current.startStream()
    })

    // Initial batch
    expect(result.current.data).toHaveLength(LIVE_POINTS_COUNT)

    act(() => {
      vi.advanceTimersByTime(POINTS_UPDATE_INTERVAL_MS)
    })

    // Should have generated new batch after default interval
    expect(result.current.data[0].id).toBe(String(LIVE_POINTS_COUNT))
  })

  it('should use default batch size from constants', () => {
    const mockGenerator = vi.fn((frameCount) => ({
      id: String(frameCount),
      position: { x: 0, y: 0, z: 0 },
      voltage: 1.5,
      type: 'healthy' as const,
      timestamp: Date.now()
    }))
    const { result } = renderHook(() => useDataStream(mockGenerator))

    act(() => {
      result.current.startStream()
    })

    expect(result.current.data).toHaveLength(LIVE_POINTS_COUNT)
  })
})
