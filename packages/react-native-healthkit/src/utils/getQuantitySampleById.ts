import { QuantityTypes } from '../modules'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'

async function getQuantitySampleById<T extends QuantityTypeIdentifier>(
  identifier: T,
  uuid: string,
  unit?: string,
) {
  const samples = await QuantityTypes.queryQuantitySamples(identifier, {
    limit: 1,
    unit,
    filter: {
      uuids: [uuid],
    },
  })

  return samples[0]
}

export default getQuantitySampleById
