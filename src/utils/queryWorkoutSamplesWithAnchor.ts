import deserializeWorkout from './deserializeWorkout'
import getPreferredUnitsTyped from './getPreferredUnitsTyped'
import prepareOptions from './prepareOptions'
import Native from '../native-types'

import type {
  EnergyUnit, LengthUnit,
} from '../native-types'
import type {
  DeletedWorkoutSampleRaw, HKWorkout, QueryWorkoutsOptions,
} from '../types'

export type QueryWorkoutSamplesWithAnchorResponse<
  TEnergy extends EnergyUnit,
  TDistance extends LengthUnit
> = {
  readonly samples: readonly HKWorkout<TEnergy, TDistance>[],
  readonly deletedSamples: readonly DeletedWorkoutSampleRaw[],
  readonly newAnchor: string
}

async function queryCategorySamplesWithAnchor<
  TEnergy extends EnergyUnit,
  TDistance extends LengthUnit
>(
  options: Omit<QueryWorkoutsOptions<TEnergy, TDistance>, 'ascending'>,
): Promise<QueryWorkoutSamplesWithAnchorResponse<TEnergy, TDistance>> {
  const opts = prepareOptions(options)
  const { energyUnit, distanceUnit } = await getPreferredUnitsTyped(options)
  const raw = await Native.queryWorkoutSamplesWithAnchor(
    energyUnit,
    distanceUnit,
    opts.from,
    opts.to,
    opts.limit,
    opts.anchor,
  )

  return {
    samples: raw.samples.map(deserializeWorkout),
    deletedSamples: raw.deletedSamples,
    newAnchor: raw.newAnchor,
  }
}

export default queryCategorySamplesWithAnchor
