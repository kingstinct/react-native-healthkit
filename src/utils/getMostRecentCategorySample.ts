import queryCategorySamples from './queryCategorySamples'

import type { HKCategoryTypeIdentifier } from '../native-types'
import type { HKCategorySample } from '../types'

async function getMostRecentCategorySample<
  T extends HKCategoryTypeIdentifier
>(
  identifier: T,
): Promise<HKCategorySample<T> | null> {
  const samples = await queryCategorySamples(identifier, {
    limit: 1,
    ascending: false,
  })

  return samples[0] ?? null
}

export default getMostRecentCategorySample
