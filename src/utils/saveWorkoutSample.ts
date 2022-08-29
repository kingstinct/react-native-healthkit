import Native from '../native-types'
import ensureMetadata from './ensureMetadata'

import type { HKWorkoutActivityType, HKWorkoutMetadata } from '../native-types'
import type { HKQuantitySampleForSaving } from '../types'

async function saveWorkoutSample<TIdentifier extends HKWorkoutActivityType>(
  typeIdentifier: TIdentifier,
  quantities: readonly HKQuantitySampleForSaving[],
  _start: Date,
  options?: {
    readonly end?: Date;
    readonly metadata?: HKWorkoutMetadata;
  },
) {
  const start = _start.toISOString()
  const end = (options?.end || new Date()).toISOString()

  return Native.saveWorkoutSample(
    typeIdentifier,
    quantities.map(((s) => ({ ...s, metadata: ensureMetadata(s.metadata) }))),
    start,
    end,
    ensureMetadata(options?.metadata),
  )
}

export default saveWorkoutSample
