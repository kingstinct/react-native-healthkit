import ensureUnit from './ensureUnit'
import Native from '../native-types'

import type { HKQuantityTypeIdentifier, HKStatisticsOptions, UnitForIdentifier } from '../native-types'

async function queryStatisticsCollectionForQuantity<TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>>(
  identifier: TIdentifier,
  options: readonly HKStatisticsOptions[],
  anchorDate: Date,
  intervalComponents: any,
  unit?: TUnit,
) {
  const actualUnit = await ensureUnit(identifier, unit)
  const rawResponse = await Native.queryStatisticsCollectionForQuantity(
    identifier,
    actualUnit,
    options,
    anchorDate.toISOString(),
    intervalComponents
  )

  return rawResponse
}

export default queryStatisticsCollectionForQuantity
