import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PointDataDisplay from '../components/PointDataDisplay'
import type { ElectrophysiologyPoint } from '../types/electrophysiology'

describe('PointDataDisplay', () => {
  const mockPoint: ElectrophysiologyPoint = {
    id: '123',
    timestamp: 1234567890,
    position: { x: 1.23, y: -0.45, z: 0.67 },
    voltage: 3.45,
    type: 'healthy'
  }

  it('should render point type', () => {
    render(<PointDataDisplay point={mockPoint} />)

    expect(screen.getByText('Type:')).toBeInTheDocument()
    expect(screen.getByText('healthy')).toBeInTheDocument()
  })

  it('should render voltage with 2 decimal places', () => {
    render(<PointDataDisplay point={mockPoint} />)

    expect(screen.getByText('Voltage:')).toBeInTheDocument()
    expect(screen.getByText('3.45 mV')).toBeInTheDocument()
  })

  it('should render x, y, z coordinates with 2 decimal places', () => {
    render(<PointDataDisplay point={mockPoint} />)

    expect(screen.getByText('x:')).toBeInTheDocument()
    expect(screen.getByText('1.23')).toBeInTheDocument()

    expect(screen.getByText('y:')).toBeInTheDocument()
    expect(screen.getByText('-0.45')).toBeInTheDocument()

    expect(screen.getByText('z:')).toBeInTheDocument()
    expect(screen.getByText('0.67')).toBeInTheDocument()
  })

  it('should render all labels without inline color when labelColor is not provided', () => {
    const { container } = render(<PointDataDisplay point={mockPoint} />)

    const labels = container.querySelectorAll('.label')
    expect(labels).toHaveLength(5) // type, voltage, x, y, z

    labels.forEach(label => {
      expect(label.getAttribute('style')).toBeNull()
    })
  })

  it('should apply labelColor to all labels when provided', () => {
    const { container } = render(<PointDataDisplay point={mockPoint} labelColor="#ff0000" />)

    const labels = container.querySelectorAll('.label')
    expect(labels).toHaveLength(5)

    labels.forEach(label => {
      expect(label).toHaveStyle({ color: '#ff0000' })
    })
  })

  it('should handle different tissue types', () => {
    const scarPoint: ElectrophysiologyPoint = { ...mockPoint, type: 'scar' }
    const { rerender } = render(<PointDataDisplay point={scarPoint} />)
    expect(screen.getByText('scar')).toBeInTheDocument()

    const borderPoint: ElectrophysiologyPoint = { ...mockPoint, type: 'border' }
    rerender(<PointDataDisplay point={borderPoint} />)
    expect(screen.getByText('border')).toBeInTheDocument()
  })

  it('should handle negative coordinates', () => {
    const pointWithNegatives: ElectrophysiologyPoint = {
      ...mockPoint,
      position: { x: -1.5, y: -2.3, z: -0.8 }
    }

    render(<PointDataDisplay point={pointWithNegatives} />)

    expect(screen.getByText('-1.50')).toBeInTheDocument()
    expect(screen.getByText('-2.30')).toBeInTheDocument()
    expect(screen.getByText('-0.80')).toBeInTheDocument()
  })

  it('should handle low voltage values', () => {
    const lowVoltagePoint: ElectrophysiologyPoint = {
      ...mockPoint,
      voltage: 0.25
    }

    render(<PointDataDisplay point={lowVoltagePoint} />)
    expect(screen.getByText('0.25 mV')).toBeInTheDocument()
  })
})
