import { CategoryTypes } from '../modules'
import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier'

export async function getCategorySampleById<T extends CategoryTypeIdentifier>(
  identifier: T,
  uuid: string,
) {
  const samples = await CategoryTypes.queryCategorySamples(identifier, {
    limit: 1,
    filter: { uuid: uuid },
  })

  return samples[0]
}

export default getCategorySampleById
