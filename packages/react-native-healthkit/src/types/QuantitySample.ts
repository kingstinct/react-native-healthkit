import type { AnyMap } from 'react-native-nitro-modules'

import type { QuantityTypeIdentifier } from './QuantityTypeIdentifier'
import type { BaseSample } from './Shared'
import type { SourceRevision } from './Source'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitysample Apple Docs }
 */
export interface QuantitySample extends BaseSample {
  readonly quantityType: QuantityTypeIdentifier
  readonly quantity: number
  readonly unit: string
}

export interface QuantitySampleForSaving {
  readonly startDate: Date
  readonly endDate: Date
  readonly quantityType: QuantityTypeIdentifier
  readonly quantity: number
  readonly unit: string
  readonly metadata?: AnyMap
  readonly sourceRevision?: SourceRevision
}
