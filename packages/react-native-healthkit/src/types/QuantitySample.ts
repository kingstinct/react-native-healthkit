import type { AnyMap } from 'react-native-nitro-modules'
import type {
  QuantityTypedMetadata,
  QuantityTypedMetadataForIdentifierGenerated,
} from '../generated/healthkit.generated'
import type { UnitForIdentifier } from './QuantityType'
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
  readonly typedMetadata?: QuantityTypedMetadata
}

export type QuantityTypedMetadataForIdentifier<
  T extends QuantityTypeIdentifier = QuantityTypeIdentifier,
> = QuantityTypedMetadataForIdentifierGenerated<T>

export interface QuantitySampleTyped<T extends QuantityTypeIdentifier>
  extends Omit<QuantitySample, 'quantityType' | 'unit' | 'typedMetadata'> {
  readonly quantityType: T
  readonly unit: UnitForIdentifier<T>
  readonly typedMetadata?: QuantityTypedMetadataForIdentifier<T>
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
