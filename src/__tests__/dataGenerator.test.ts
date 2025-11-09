import { describe, it, expect } from 'vitest'
import {
  generateElectrophysiologyPoint,
  generateBatch,
  getColorFromVoltage,
  classifyTissueType,
  getIndicatorColorFromIndex
} from '../utils/dataGenerator'

describe('dataGenerator', () => {
  describe('generateElectrophysiologyPoint', () => {
    it('should generate a point with required properties', () => {
      const point = generateElectrophysiologyPoint(0)

      expect(point).toHaveProperty('id')
      expect(point).toHaveProperty('timestamp')
      expect(point).toHaveProperty('position')
      expect(point).toHaveProperty('voltage')
      expect(point).toHaveProperty('type')
    })

    it('should have position with x, y, z coordinates', () => {
      const point = generateElectrophysiologyPoint(0)

      expect(point.position).toHaveProperty('x')
      expect(point.position).toHaveProperty('y')
      expect(point.position).toHaveProperty('z')
      expect(typeof point.position.x).toBe('number')
      expect(typeof point.position.y).toBe('number')
      expect(typeof point.position.z).toBe('number')
    })

    it('should generate voltage within valid range (0-5 mV)', () => {
      const point = generateElectrophysiologyPoint(0)

      expect(point.voltage).toBeGreaterThanOrEqual(0)
      expect(point.voltage).toBeLessThanOrEqual(5)
    })

    it('should classify scar tissue correctly (voltage < 0.5)', () => {
      // Test multiple points to find a scar
      const points = Array.from({ length: 100 }, (_, i) =>
        generateElectrophysiologyPoint(i * 10 + 999)
      )

      const scarPoints = points.filter(p => p.type === 'scar')
      scarPoints.forEach(point => {
        expect(point.voltage).toBeLessThan(0.5)
      })
    })

    it('should classify border zone correctly (0.5 <= voltage < 1.5)', () => {
      const points = Array.from({ length: 100 }, (_, i) =>
        generateElectrophysiologyPoint(i * 10 + 500)
      )

      const borderPoints = points.filter(p => p.type === 'border')
      borderPoints.forEach(point => {
        expect(point.voltage).toBeGreaterThanOrEqual(0.5)
        expect(point.voltage).toBeLessThan(1.5)
      })
    })

    it('should classify healthy tissue correctly (voltage >= 1.5)', () => {
      const points = Array.from({ length: 100 }, (_, i) =>
        generateElectrophysiologyPoint(i * 10)
      )

      const healthyPoints = points.filter(p => p.type === 'healthy')
      healthyPoints.forEach(point => {
        expect(point.voltage).toBeGreaterThanOrEqual(1.5)
      })
    })

    it('should use frameCount as id', () => {
      const point1 = generateElectrophysiologyPoint(5)
      const point2 = generateElectrophysiologyPoint(42)

      expect(point1.id).toBe('5')
      expect(point2.id).toBe('42')
    })

    it('should generate deterministic results for same seed', () => {
      const point1 = generateElectrophysiologyPoint(123)
      const point2 = generateElectrophysiologyPoint(123)

      expect(point1.position.x).toBe(point2.position.x)
      expect(point1.position.y).toBe(point2.position.y)
      expect(point1.position.z).toBe(point2.position.z)
      expect(point1.voltage).toBe(point2.voltage)
      expect(point1.type).toBe(point2.type)
    })

    it('should round voltage to 2 decimal places', () => {
      const point = generateElectrophysiologyPoint(0)
      const decimalPlaces = (point.voltage.toString().split('.')[1] || '').length

      expect(decimalPlaces).toBeLessThanOrEqual(2)
    })
  })

  describe('generateBatch', () => {
    it('should generate specified number of points', () => {
      const batch = generateBatch(10)

      expect(batch).toHaveLength(10)
    })

    it('should generate sequential IDs starting from startIndex', () => {
      const batch = generateBatch(5, 100)

      expect(batch[0].id).toBe('100')
      expect(batch[1].id).toBe('101')
      expect(batch[2].id).toBe('102')
      expect(batch[3].id).toBe('103')
      expect(batch[4].id).toBe('104')
    })

    it('should default startIndex to 0', () => {
      const batch = generateBatch(3)

      expect(batch[0].id).toBe('0')
      expect(batch[1].id).toBe('1')
      expect(batch[2].id).toBe('2')
    })

    it('should return empty array for count of 0', () => {
      const batch = generateBatch(0)

      expect(batch).toHaveLength(0)
      expect(batch).toEqual([])
    })
  })

  describe('classifyTissueType', () => {
    it('should classify scar tissue for voltage < 0.5 mV', () => {
      expect(classifyTissueType(0.0)).toBe('scar')
      expect(classifyTissueType(0.3)).toBe('scar')
      expect(classifyTissueType(0.49)).toBe('scar')
    })

    it('should classify border zone for voltage 0.5 - 1.5 mV', () => {
      expect(classifyTissueType(0.5)).toBe('border')
      expect(classifyTissueType(1.0)).toBe('border')
      expect(classifyTissueType(1.49)).toBe('border')
    })

    it('should classify healthy tissue for voltage >= 1.5 mV', () => {
      expect(classifyTissueType(1.5)).toBe('healthy')
      expect(classifyTissueType(3.0)).toBe('healthy')
      expect(classifyTissueType(5.0)).toBe('healthy')
    })

    it('should handle boundary values correctly', () => {
      expect(classifyTissueType(0.5)).toBe('border') // Exactly at scar threshold
      expect(classifyTissueType(1.5)).toBe('healthy') // Exactly at border threshold
    })
  })

  describe('getColorFromVoltage', () => {
    it('should return red for scar tissue (< 0.5 mV)', () => {
      expect(getColorFromVoltage(0.0)).toBe('#ff0000')
      expect(getColorFromVoltage(0.3)).toBe('#ff0000')
      expect(getColorFromVoltage(0.49)).toBe('#ff0000')
    })

    it('should return orange for border zone (0.5 - 1.5 mV)', () => {
      expect(getColorFromVoltage(0.5)).toBe('#ffaa00')
      expect(getColorFromVoltage(1.0)).toBe('#ffaa00')
      expect(getColorFromVoltage(1.49)).toBe('#ffaa00')
    })

    it('should return purple for healthy tissue (>= 1.5 mV)', () => {
      expect(getColorFromVoltage(1.5)).toBe('#8844ff')
      expect(getColorFromVoltage(3.0)).toBe('#8844ff')
      expect(getColorFromVoltage(5.0)).toBe('#8844ff')
    })
  })

  describe('getIndicatorColorFromIndex', () => {
    it('should return colors from palette for indices 0-9', () => {
      expect(getIndicatorColorFromIndex(0)).toBe('#00ffff') // Cyan
      expect(getIndicatorColorFromIndex(1)).toBe('#ff00ff') // Magenta
      expect(getIndicatorColorFromIndex(2)).toBe('#ffff00') // Yellow
      expect(getIndicatorColorFromIndex(3)).toBe('#00ff00') // Lime green
      expect(getIndicatorColorFromIndex(4)).toBe('#ff6600') // Orange
      expect(getIndicatorColorFromIndex(5)).toBe('#0099ff') // Sky blue
      expect(getIndicatorColorFromIndex(6)).toBe('#ff0099') // Hot pink
      expect(getIndicatorColorFromIndex(7)).toBe('#66ff00') // Chartreuse
      expect(getIndicatorColorFromIndex(8)).toBe('#9900ff') // Purple
      expect(getIndicatorColorFromIndex(9)).toBe('#ff3333') // Red
    })

    it('should cycle through palette for indices beyond 9', () => {
      // Index 10 should wrap to index 0
      expect(getIndicatorColorFromIndex(10)).toBe('#00ffff')
      expect(getIndicatorColorFromIndex(11)).toBe('#ff00ff')

      // Index 20 should also wrap to index 0
      expect(getIndicatorColorFromIndex(20)).toBe('#00ffff')

      // Index 25 should wrap to index 5
      expect(getIndicatorColorFromIndex(25)).toBe('#0099ff')
    })

    it('should handle large indices correctly', () => {
      // 100 % 10 = 0
      expect(getIndicatorColorFromIndex(100)).toBe('#00ffff')

      // 123 % 10 = 3
      expect(getIndicatorColorFromIndex(123)).toBe('#00ff00')
    })

    it('should return consistent colors for same index', () => {
      const color1 = getIndicatorColorFromIndex(5)
      const color2 = getIndicatorColorFromIndex(5)
      expect(color1).toBe(color2)
    })
  })
})
