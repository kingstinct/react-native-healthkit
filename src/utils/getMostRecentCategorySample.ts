import queryCategorySamples from './queryCategorySamples'

import type { HKCategoryTypeIdentifier } from '../native-types'

async function getMostRecentCategorySample<
  T extends HKCategoryTypeIdentifier
>(
  identifier: T,
) {
  const samples = await queryCategorySamples(identifier, {
    limit: 1,
    ascending: false,
  })

  return samples[0] || null
}

export default getMostRecentCategorySample
