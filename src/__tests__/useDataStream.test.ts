import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useDataStream from '../hooks/useDataStream'

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

  it('should start streaming when startStream is called', () => {
    const mockGenerator = vi.fn((frameCount) => ({ id: String(frameCount), position: { x: 0, y: 0, z: 0 }, voltage: 1.5, type: 'healthy' as const, timestamp: Date.now() }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 100))

    act(() => {
      result.current.startStream()
    })

    expect(result.current.isStreaming).toBe(true)
  })

  it('should generate data points at specified interval', () => {
    const mockGenerator = vi.fn((frameCount) => ({ id: String(frameCount), position: { x: 0, y: 0, z: 0 }, voltage: 1.5, type: 'healthy' as const, timestamp: Date.now() }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 100))

    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(100)
    })

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].id).toBe('0')

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[1].id).toBe('1')
  })

  it('should stop streaming when stopStream is called', () => {
    const mockGenerator = vi.fn((frameCount) => ({ id: String(frameCount), position: { x: 0, y: 0, z: 0 }, voltage: 1.5, type: 'healthy' as const, timestamp: Date.now() }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 100))

    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(100)
    })

    expect(result.current.isStreaming).toBe(true)
    expect(result.current.data).toHaveLength(1)

    act(() => {
      result.current.stopStream()
    })

    expect(result.current.isStreaming).toBe(false)

    // Advance time - should not generate more data
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.data).toHaveLength(1)
  })

  it('should clear data when clearData is called', () => {
    const mockGenerator = vi.fn((frameCount) => ({ id: String(frameCount), position: { x: 0, y: 0, z: 0 }, voltage: 1.5, type: 'healthy' as const, timestamp: Date.now() }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 100))

    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(300)
    })

    expect(result.current.data.length).toBeGreaterThan(0)

    act(() => {
      result.current.clearData()
    })

    expect(result.current.data).toEqual([])
    expect(result.current.isStreaming).toBe(false)
  })

  it('should respect maxPoints limit', () => {
    const mockGenerator = vi.fn((frameCount) => ({ id: String(frameCount), position: { x: 0, y: 0, z: 0 }, voltage: 1.5, type: 'healthy' as const, timestamp: Date.now() }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 100, 5))

    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.data.length).toBeLessThanOrEqual(5)

    // Verify we kept the most recent points
    const ids = result.current.data.map(d => d.id)
    expect(ids).toContain('9') // Most recent
  })

  it('should not start if already streaming', () => {
    const mockGenerator = vi.fn((frameCount) => ({ id: String(frameCount), position: { x: 0, y: 0, z: 0 }, voltage: 1.5, type: 'healthy' as const, timestamp: Date.now() }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 100))

    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(100)
    })

    expect(result.current.isStreaming).toBe(true)
    expect(result.current.data).toHaveLength(1)

    // Try to start again
    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(100)
    })

    // Should only have 2 points, not 3 (no double streaming)
    expect(result.current.data).toHaveLength(2)
  })

  it('should cleanup interval on unmount', () => {
    const mockGenerator = vi.fn((frameCount) => ({ id: String(frameCount), position: { x: 0, y: 0, z: 0 }, voltage: 1.5, type: 'healthy' as const, timestamp: Date.now() }))
    const { result, unmount } = renderHook(() => useDataStream(mockGenerator, 100))

    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(100)
    })

    expect(result.current.data).toHaveLength(1)

    unmount()

    // Advance time after unmount - mockGenerator should not be called
    const callCountBeforeUnmount = mockGenerator.mock.calls.length
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(mockGenerator.mock.calls.length).toBe(callCountBeforeUnmount)
  })

  it('should use default interval of 100ms', () => {
    const mockGenerator = vi.fn((frameCount) => ({ id: String(frameCount), position: { x: 0, y: 0, z: 0 }, voltage: 1.5, type: 'healthy' as const, timestamp: Date.now() }))
    const { result } = renderHook(() => useDataStream(mockGenerator))

    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(100)
    })

    expect(result.current.data).toHaveLength(1)
  })

  it('should use default maxPoints of 1000', () => {
    const mockGenerator = vi.fn((frameCount) => ({ id: String(frameCount), position: { x: 0, y: 0, z: 0 }, voltage: 1.5, type: 'healthy' as const, timestamp: Date.now() }))
    const { result } = renderHook(() => useDataStream(mockGenerator, 10))

    act(() => {
      result.current.startStream()
      vi.advanceTimersByTime(15000) // 1500 points
    })

    expect(result.current.data.length).toBeLessThanOrEqual(1000)
  })
})
