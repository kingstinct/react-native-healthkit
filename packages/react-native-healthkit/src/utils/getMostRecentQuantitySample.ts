import { QuantityTypes } from '../modules'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'

async function getMostRecentQuantitySample(
  identifier: QuantityTypeIdentifier,
  unit?: string,
) {
  const samples = await QuantityTypes.queryQuantitySamples(identifier, {
    limit: 1,
    unit,
  })

  return samples[0]
}

export default getMostRecentQuantitySample
