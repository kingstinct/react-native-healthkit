import type { HKCategorySampleRaw, HKCategoryTypeIdentifier } from '../native-types'
import type { HKCategorySample } from '../types'

const deserializeCategorySample = <T extends HKCategoryTypeIdentifier>(
  sample: HKCategorySampleRaw<T>,
): HKCategorySample<T> => ({
  ...sample,
  startDate: new Date(sample.startDate),
  endDate: new Date(sample.endDate),
})

export default deserializeCategorySample
