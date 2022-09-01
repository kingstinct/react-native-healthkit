import Native from '../native-types'

import type { MetadataMapperForQuantityIdentifier, HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types'

async function saveQuantitySample<TType extends HKQuantityTypeIdentifier>(
  identifier: TType,
  unit: UnitForIdentifier<TType>,
  value: number,
  options?: {
    readonly start?: Date;
    readonly end?: Date;
    readonly metadata?: MetadataMapperForQuantityIdentifier<TType>;
  },
) {
  const start = options?.start || options?.end || new Date()
  const end = options?.end || options?.start || new Date()
  const metadata = options?.metadata || {}

  return Native.saveQuantitySample(
    identifier,
    unit,
    value,
    start.toISOString(),
    end.toISOString(),
    metadata,
  )
}

export default saveQuantitySample
