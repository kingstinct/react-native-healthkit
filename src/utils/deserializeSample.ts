import type { HKQuantitySampleRaw, HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types'
import type { HKQuantitySample } from '../types'

function deserializeQuantitySample<
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(
  sample: HKQuantitySampleRaw<TIdentifier, TUnit>,
): HKQuantitySample<TIdentifier, TUnit> {
  return {
    ...sample,
    startDate: new Date(sample.startDate),
    endDate: new Date(sample.endDate),
  }
}

export default deserializeQuantitySample
