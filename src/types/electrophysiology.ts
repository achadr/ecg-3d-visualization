/**
 * Type definitions for Cardiac Electrophysiology Data
 */

/** Position 3D dans l'espace */
export interface Point3D {
  x: number
  y: number
  z: number
}

/** Types de tissu cardiaque */
export type TissueType = 'healthy' | 'border' | 'scar'

/** Point de données d'électrophysiologie */
export interface ElectrophysiologyPoint {
  id: string
  position: Point3D
  voltage: number        // en millivolts (mV)
  type: TissueType
  timestamp: number
}

/** Fonction de génération de point */
export type PointGenerator = (frameCount: number) => ElectrophysiologyPoint

/** Configuration du stream de données */
export interface DataStreamConfig {
  generator: PointGenerator
  interval?: number      // ms entre chaque point (défaut: 100)
  maxPoints?: number     // taille du buffer circulaire (défaut: 50)
}

/** Couleur RGB pour Three.js */
export type ColorValue = string | number

/** Mapping de voltage vers couleur */
export interface VoltageColorMap {
  healthy: ColorValue    // ≥1.5 mV (purple)
  border: ColorValue     // 0.5-1.5 mV (orange)
  scar: ColorValue       // <0.5 mV (red)
}
