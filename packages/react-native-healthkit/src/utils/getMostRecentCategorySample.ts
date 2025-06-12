import { CategoryTypes } from "../"
import type { CategoryTypeIdentifier } from "../types/CategoryTypeIdentifier"


export async function getMostRecentCategorySample(
  identifier: CategoryTypeIdentifier,
) {
  const samples = await CategoryTypes.queryCategorySamples(identifier, {
    limit: 1,
    ascending: false,
  })

  return samples[0]
}

export default getMostRecentCategorySample
