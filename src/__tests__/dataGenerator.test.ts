import { describe, it, expect } from 'vitest'
import {
  generateElectrophysiologyPoint,
  generateBatch,
  getColorFromVoltage
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
})
