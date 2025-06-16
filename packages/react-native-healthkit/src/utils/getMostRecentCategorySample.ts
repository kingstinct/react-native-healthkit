import { CategoryTypes } from '../modules'
import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier'

export async function getMostRecentCategorySample<
  T extends CategoryTypeIdentifier,
>(identifier: T) {
  const samples = await CategoryTypes.queryCategorySamples(identifier, {
    limit: 1,
    ascending: false,
  })

  return samples[0]
}

export default getMostRecentCategorySample
