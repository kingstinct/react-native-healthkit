import queryQuantitySamples from './queryQuantitySamples'

import type { HKQuantityTypeIdentifier, UnitForIdentifier } from '../native-types'
import type { HKQuantitySample } from '../types'

async function getMostRecentQuantitySample<
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier>
>(
  identifier: TIdentifier,
  unit: TUnit,
): Promise<HKQuantitySample<TIdentifier, TUnit> | null> {
  const samples = await queryQuantitySamples(identifier, {
    limit: 1,
    unit,
  })

  const lastSample = samples[0]

  if (lastSample) {
    return lastSample as HKQuantitySample<TIdentifier, TUnit>
  }
  return null
}

export default getMostRecentQuantitySample
