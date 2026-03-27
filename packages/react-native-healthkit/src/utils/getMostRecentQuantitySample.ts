import { QuantityTypes } from '../modules'
import type { UnitForIdentifier } from '../types/QuantityType'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'

async function getMostRecentQuantitySample<T extends QuantityTypeIdentifier>(
  identifier: T,
  unit?: UnitForIdentifier<T>,
) {
  const samples = await QuantityTypes.queryQuantitySamples(identifier, {
    limit: 1,
    unit,
  })

  return samples[0]
}

export default getMostRecentQuantitySample
