import Native from '../native-types'

import type { HKCategoryTypeIdentifier, HKCategoryValueForIdentifier, MetadataMapperForCategoryIdentifier } from '../native-types'

/**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614168-savecategorysample save(_:withCompletion:) (Apple Docs)}
   * @see {@link https://developer.apple.com/documentation/healthkit/saving_data_to_healthkit Saving data to HealthKit (Apple Docs)}
   */
async function saveCategorySample<T extends HKCategoryTypeIdentifier>(
  identifier: T,
  value: HKCategoryValueForIdentifier<T>,
  options?: {
    readonly start?: Date;
    readonly end?: Date;
    readonly metadata?: MetadataMapperForCategoryIdentifier<T>;
  },
) {
  const start = options?.start || options?.end || new Date()
  const end = options?.end || options?.start || new Date()
  const metadata = options?.metadata || {}

  return Native.saveCategorySample(
    identifier,
    value,
    start.toISOString(),
    end.toISOString(),
    metadata || {},
  )
}

export default saveCategorySample
