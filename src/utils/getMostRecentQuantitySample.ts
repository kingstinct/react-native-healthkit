import queryQuantitySamples from './queryQuantitySamples'

import type { HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types'

async function getMostRecentQuantitySample<
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(
  identifier: TIdentifier,
  unit: TUnit,
) {
  const samples = await queryQuantitySamples(identifier, {
    limit: 1,
    unit,
  })
  return samples.samples[0] || null
}

export default getMostRecentQuantitySample
