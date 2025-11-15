import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePointSelection } from '../hooks/usePointSelection'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'

/**
 * Helper function to create a mock point
 */
function createMockPoint(id: number, timestamp: number = Date.now()): ElectrophysiologyPoint {
  return {
    id,
    timestamp,
    position: { x: 0, y: 0, z: 0 },
    voltage: 1.5,
    tissueType: 'healthy',
    color: '#8844ff',
  }
}

describe('usePointSelection', () => {
  describe('Initial state', () => {
    it('should initialize with null selected and hovered points', () => {
      const { result } = renderHook(() => usePointSelection())

      expect(result.current.selectedPoint).toBeNull()
      expect(result.current.hoveredPoint).toBeNull()
      expect(result.current.pinnedPoints).toEqual([])
    })
  })

  describe('handleSelectPoint', () => {
    it('should select a point', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1)

      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })

      expect(result.current.selectedPoint).toEqual(mockPoint)
    })

    it('should replace previously selected point', () => {
      const { result } = renderHook(() => usePointSelection())
      const point1 = createMockPoint(1)
      const point2 = createMockPoint(2)

      act(() => {
        result.current.handleSelectPoint(point1)
      })

      expect(result.current.selectedPoint).toEqual(point1)

      act(() => {
        result.current.handleSelectPoint(point2)
      })

      expect(result.current.selectedPoint).toEqual(point2)
    })
  })

  describe('handleHoverPoint', () => {
    it('should set hovered point', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1)

      act(() => {
        result.current.handleHoverPoint(mockPoint)
      })

      expect(result.current.hoveredPoint).toEqual(mockPoint)
    })

    it('should clear hovered point when null is passed', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1)

      act(() => {
        result.current.handleHoverPoint(mockPoint)
      })

      expect(result.current.hoveredPoint).toEqual(mockPoint)

      act(() => {
        result.current.handleHoverPoint(null)
      })

      expect(result.current.hoveredPoint).toBeNull()
    })

    it('should replace previously hovered point', () => {
      const { result } = renderHook(() => usePointSelection())
      const point1 = createMockPoint(1)
      const point2 = createMockPoint(2)

      act(() => {
        result.current.handleHoverPoint(point1)
      })

      expect(result.current.hoveredPoint).toEqual(point1)

      act(() => {
        result.current.handleHoverPoint(point2)
      })

      expect(result.current.hoveredPoint).toEqual(point2)
    })
  })

  describe('handlePinPoint', () => {
    it('should pin the selected point', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1)

      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })

      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.pinnedPoints).toHaveLength(1)
      expect(result.current.pinnedPoints[0]).toEqual(mockPoint)
    })

    it('should deselect point after pinning', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1)

      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })

      expect(result.current.selectedPoint).toEqual(mockPoint)

      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.selectedPoint).toBeNull()
    })

    it('should not pin if no point is selected', () => {
      const { result } = renderHook(() => usePointSelection())

      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.pinnedPoints).toHaveLength(0)
    })

    it('should not pin already pinned point', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1, 12345)

      // Pin the point first time
      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })

      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.pinnedPoints).toHaveLength(1)

      // Try to pin the same point again
      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })

      act(() => {
        result.current.handlePinPoint()
      })

      // Should still have only 1 pinned point (not duplicated)
      expect(result.current.pinnedPoints).toHaveLength(1)
    })

    it('should pin multiple different points', () => {
      const { result } = renderHook(() => usePointSelection())
      const point1 = createMockPoint(1, 1000)
      const point2 = createMockPoint(2, 2000)
      const point3 = createMockPoint(3, 3000)

      // Pin first point
      act(() => {
        result.current.handleSelectPoint(point1)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      // Pin second point
      act(() => {
        result.current.handleSelectPoint(point2)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      // Pin third point
      act(() => {
        result.current.handleSelectPoint(point3)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.pinnedPoints).toHaveLength(3)
      expect(result.current.pinnedPoints[0]).toEqual(point1)
      expect(result.current.pinnedPoints[1]).toEqual(point2)
      expect(result.current.pinnedPoints[2]).toEqual(point3)
    })
  })

  describe('handleDeselectPoint', () => {
    it('should deselect the selected point', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1)

      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })

      expect(result.current.selectedPoint).toEqual(mockPoint)

      act(() => {
        result.current.handleDeselectPoint()
      })

      expect(result.current.selectedPoint).toBeNull()
    })

    it('should do nothing if no point is selected', () => {
      const { result } = renderHook(() => usePointSelection())

      act(() => {
        result.current.handleDeselectPoint()
      })

      expect(result.current.selectedPoint).toBeNull()
    })
  })

  describe('handleUnpinPoint', () => {
    it('should remove a pinned point', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1, 12345)

      // Pin the point
      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.pinnedPoints).toHaveLength(1)

      // Unpin the point
      act(() => {
        result.current.handleUnpinPoint(mockPoint)
      })

      expect(result.current.pinnedPoints).toHaveLength(0)
    })

    it('should remove correct point from multiple pinned points', () => {
      const { result } = renderHook(() => usePointSelection())
      const point1 = createMockPoint(1, 1000)
      const point2 = createMockPoint(2, 2000)
      const point3 = createMockPoint(3, 3000)

      // Pin three points
      act(() => {
        result.current.handleSelectPoint(point1)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      act(() => {
        result.current.handleSelectPoint(point2)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      act(() => {
        result.current.handleSelectPoint(point3)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.pinnedPoints).toHaveLength(3)

      // Unpin the middle point
      act(() => {
        result.current.handleUnpinPoint(point2)
      })

      expect(result.current.pinnedPoints).toHaveLength(2)
      expect(result.current.pinnedPoints[0]).toEqual(point1)
      expect(result.current.pinnedPoints[1]).toEqual(point3)
    })

    it('should do nothing if point is not pinned', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1)

      act(() => {
        result.current.handleUnpinPoint(mockPoint)
      })

      expect(result.current.pinnedPoints).toHaveLength(0)
    })

    it('should use both id and timestamp to identify unique points', () => {
      const { result } = renderHook(() => usePointSelection())
      // Same id but different timestamps = different points
      const point1 = createMockPoint(1, 1000)
      const point2 = createMockPoint(1, 2000)

      // Pin both points
      act(() => {
        result.current.handleSelectPoint(point1)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      act(() => {
        result.current.handleSelectPoint(point2)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.pinnedPoints).toHaveLength(2)

      // Unpin only the first point
      act(() => {
        result.current.handleUnpinPoint(point1)
      })

      expect(result.current.pinnedPoints).toHaveLength(1)
      expect(result.current.pinnedPoints[0]).toEqual(point2)
    })
  })

  describe('isPointPinned', () => {
    it('should return true for pinned point', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1, 12345)

      // Pin the point
      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.isPointPinned(mockPoint)).toBe(true)
    })

    it('should return false for non-pinned point', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1)

      expect(result.current.isPointPinned(mockPoint)).toBe(false)
    })

    it('should use both id and timestamp for identification', () => {
      const { result } = renderHook(() => usePointSelection())
      const point1 = createMockPoint(1, 1000)
      const point2 = createMockPoint(1, 2000) // Same id, different timestamp

      // Pin only point1
      act(() => {
        result.current.handleSelectPoint(point1)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.isPointPinned(point1)).toBe(true)
      expect(result.current.isPointPinned(point2)).toBe(false)
    })
  })

  describe('canPinPoint', () => {
    it('should return true if a point is selected and not pinned', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1)

      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })

      expect(result.current.canPinPoint()).toBe(true)
    })

    it('should return false if no point is selected', () => {
      const { result } = renderHook(() => usePointSelection())

      expect(result.current.canPinPoint()).toBe(false)
    })

    it('should return false if selected point is already pinned', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1, 12345)

      // Pin the point
      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      // Select the same point again
      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })

      expect(result.current.canPinPoint()).toBe(false)
    })
  })

  describe('clearAllPinnedPoints', () => {
    it('should clear all pinned points', () => {
      const { result } = renderHook(() => usePointSelection())
      const point1 = createMockPoint(1, 1000)
      const point2 = createMockPoint(2, 2000)
      const point3 = createMockPoint(3, 3000)

      // Pin three points
      act(() => {
        result.current.handleSelectPoint(point1)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      act(() => {
        result.current.handleSelectPoint(point2)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      act(() => {
        result.current.handleSelectPoint(point3)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      expect(result.current.pinnedPoints).toHaveLength(3)

      // Clear all
      act(() => {
        result.current.clearAllPinnedPoints()
      })

      expect(result.current.pinnedPoints).toHaveLength(0)
    })

    it('should do nothing if no points are pinned', () => {
      const { result } = renderHook(() => usePointSelection())

      act(() => {
        result.current.clearAllPinnedPoints()
      })

      expect(result.current.pinnedPoints).toHaveLength(0)
    })

    it('should not affect selected or hovered points', () => {
      const { result } = renderHook(() => usePointSelection())
      const selectedPoint = createMockPoint(1)
      const hoveredPoint = createMockPoint(2)
      const pinnedPoint = createMockPoint(3)

      act(() => {
        result.current.handleSelectPoint(selectedPoint)
        result.current.handleHoverPoint(hoveredPoint)
      })

      // Pin a point
      act(() => {
        result.current.handleSelectPoint(pinnedPoint)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      // Re-select the original selected point
      act(() => {
        result.current.handleSelectPoint(selectedPoint)
      })

      // Clear pinned points
      act(() => {
        result.current.clearAllPinnedPoints()
      })

      expect(result.current.pinnedPoints).toHaveLength(0)
      expect(result.current.selectedPoint).toEqual(selectedPoint)
      expect(result.current.hoveredPoint).toEqual(hoveredPoint)
    })
  })

  describe('Complex scenarios', () => {
    it('should handle selecting, hovering, pinning different points simultaneously', () => {
      const { result } = renderHook(() => usePointSelection())
      const selectedPoint = createMockPoint(1, 1000)
      const hoveredPoint = createMockPoint(2, 2000)
      const pinnedPoint = createMockPoint(3, 3000)

      // Select a point
      act(() => {
        result.current.handleSelectPoint(selectedPoint)
      })

      // Hover a different point
      act(() => {
        result.current.handleHoverPoint(hoveredPoint)
      })

      // Pin a different point (need to select it first)
      act(() => {
        result.current.handleSelectPoint(pinnedPoint)
      })
      act(() => {
        result.current.handlePinPoint()
      })

      // Re-select the original point
      act(() => {
        result.current.handleSelectPoint(selectedPoint)
      })

      expect(result.current.selectedPoint).toEqual(selectedPoint)
      expect(result.current.hoveredPoint).toEqual(hoveredPoint)
      expect(result.current.pinnedPoints).toHaveLength(1)
      expect(result.current.pinnedPoints[0]).toEqual(pinnedPoint)
    })

    it('should handle workflow: hover → select → pin → unpin', () => {
      const { result } = renderHook(() => usePointSelection())
      const mockPoint = createMockPoint(1, 12345)

      // Step 1: Hover
      act(() => {
        result.current.handleHoverPoint(mockPoint)
      })
      expect(result.current.hoveredPoint).toEqual(mockPoint)

      // Step 2: Select
      act(() => {
        result.current.handleSelectPoint(mockPoint)
      })
      expect(result.current.selectedPoint).toEqual(mockPoint)

      // Step 3: Pin
      act(() => {
        result.current.handlePinPoint()
      })
      expect(result.current.pinnedPoints).toHaveLength(1)
      expect(result.current.selectedPoint).toBeNull() // Auto-deselected

      // Step 4: Unpin
      act(() => {
        result.current.handleUnpinPoint(mockPoint)
      })
      expect(result.current.pinnedPoints).toHaveLength(0)

      // Hover should still be there (independent)
      expect(result.current.hoveredPoint).toEqual(mockPoint)
    })
  })
})
