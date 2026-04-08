import type { AnyMap } from 'react-native-nitro-modules'
import type { QuantityTypedMetadataForIdentifierGenerated } from '../generated/healthkit.generated'
import type { UnitForIdentifier } from './QuantityType'
import type { QuantityTypeIdentifier } from './QuantityTypeIdentifier'
import type { BaseSample, MetadataWithUnknown } from './Shared'
import type { SourceRevision } from './Source'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitysample Apple Docs }
 */
export interface QuantitySample extends BaseSample {
  readonly quantityType: QuantityTypeIdentifier
  readonly quantity: number
  readonly unit: string
}

export type MetadataForQuantityIdentifier<
  T extends QuantityTypeIdentifier = QuantityTypeIdentifier,
> = MetadataWithUnknown<QuantityTypedMetadataForIdentifierGenerated<T>>

export interface QuantitySampleTyped<T extends QuantityTypeIdentifier>
  extends Omit<QuantitySample, 'quantityType' | 'unit' | 'metadata'> {
  readonly quantityType: T
  readonly unit: UnitForIdentifier<T>
  readonly metadata: MetadataForQuantityIdentifier<T>
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
