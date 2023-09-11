import ensureUnit from './ensureUnit'
import prepareOptions from './prepareOptions'
import Native, {
  HKQuantityTypeIdentifier, UnitOfEnergy, UnitOfTime,
} from '../native-types'

import type { GenericQueryOptions } from '../types'

const queryActivitySummaryForQuantity = async <
  TEnergyUnit extends UnitOfEnergy,
  TTimeUnit extends UnitOfTime
>(
  options: Omit<GenericQueryOptions, 'anchor' | 'ascending' | 'limit'> & {
    readonly energyUnit?: TEnergyUnit,
    readonly timeUnit?: TTimeUnit
  },
) => {
  const energyUnit = await ensureUnit(HKQuantityTypeIdentifier.activeEnergyBurned, options.energyUnit)
    ?? UnitOfEnergy.Joules
  const timeUnit = await ensureUnit(HKQuantityTypeIdentifier.appleMoveTime, options.timeUnit)
    ?? UnitOfTime.Seconds

  const opts = prepareOptions(options)

  const data = await Native.queryActivitySummaryForQuantity(
    energyUnit,
    timeUnit,
    opts.from,
    opts.to,
  )

  return data.map((record) => ({
    ...record,
    startDate: new Date(record.startDate),
  }))
}

export default queryActivitySummaryForQuantity
