import ensureUnit from './ensureUnit'
import Native from '../native-types'

import type { HKQuantityTypeIdentifier, HKStatisticsOptions, UnitForIdentifier } from '../native-types'

async function queryStatisticsForQuantity<TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>>(
  identifier: TIdentifier,
  options: readonly HKStatisticsOptions[],
  from: Date,
  to?: Date,
  unit?: TUnit,
) {
  const actualUnit = await ensureUnit(identifier, unit)
  const toDate = to || new Date()
  const { mostRecentQuantityDateInterval, ...rawResponse } = await Native.queryStatisticsForQuantity(
    identifier,
    actualUnit,
    from.toISOString(),
    toDate.toISOString(),
    options,
  )

  const response = {
    ...rawResponse,
    ...(mostRecentQuantityDateInterval
      ? {
        mostRecentQuantityDateInterval: {
          from: new Date(mostRecentQuantityDateInterval.from),
          to: new Date(mostRecentQuantityDateInterval.to),
        },
      }
      : {}),
  }

  return response
}

export default queryStatisticsForQuantity
