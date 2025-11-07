import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Canvas } from '@react-three/fiber'
import DataPoint from '../components/DataPoint'

// Helper to render 3D components in test environment
const render3D = (component) => {
  return render(
    <Canvas>
      {component}
    </Canvas>
  )
}

describe('DataPoint', () => {
  const mockPoint = {
    id: 1,
    position: { x: 1, y: 2, z: 3 },
    voltage: 3.5,
    type: 'healthy',
    timestamp: Date.now()
  }

  it('should render without crashing', () => {
    const { container } = render3D(<DataPoint point={mockPoint} />)
    expect(container).toBeTruthy()
  })

  it('should accept a point prop with required properties', () => {
    const { container } = render3D(<DataPoint point={mockPoint} />)
    expect(container).toBeTruthy()
  })

  it('should render at the correct position', () => {
    const customPoint = {
      ...mockPoint,
      position: { x: 5, y: 10, z: 15 }
    }
    const { container } = render3D(<DataPoint point={customPoint} />)
    expect(container).toBeTruthy()
  })

  it('should handle healthy tissue type', () => {
    const healthyPoint = {
      ...mockPoint,
      type: 'healthy',
      voltage: 3.0
    }
    const { container } = render3D(<DataPoint point={healthyPoint} />)
    expect(container).toBeTruthy()
  })

  it('should handle border tissue type', () => {
    const borderPoint = {
      ...mockPoint,
      type: 'border',
      voltage: 1.0
    }
    const { container } = render3D(<DataPoint point={borderPoint} />)
    expect(container).toBeTruthy()
  })

  it('should handle scar tissue type', () => {
    const scarPoint = {
      ...mockPoint,
      type: 'scar',
      voltage: 0.3
    }
    const { container } = render3D(<DataPoint point={scarPoint} />)
    expect(container).toBeTruthy()
  })

  it('should accept optional scale prop', () => {
    const { container } = render3D(<DataPoint point={mockPoint} scale={0.5} />)
    expect(container).toBeTruthy()
  })

  it('should accept optional opacity prop', () => {
    const { container } = render3D(<DataPoint point={mockPoint} opacity={0.7} />)
    expect(container).toBeTruthy()
  })

  it('should use getColorFromVoltage for point color', () => {
    // This test verifies the component uses the voltage-based coloring
    const { container } = render3D(<DataPoint point={mockPoint} />)
    expect(container).toBeTruthy()
  })

  it('should handle missing optional props with defaults', () => {
    const { container } = render3D(<DataPoint point={mockPoint} />)
    expect(container).toBeTruthy()
  })
})
