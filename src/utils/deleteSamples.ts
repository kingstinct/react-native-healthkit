import Native from '../native-types'

import type { HKQuantityTypeIdentifier } from '../native-types'

export type DeleteSamplesFn = <
  TIdentifier extends HKQuantityTypeIdentifier
>(
  sample: {
    readonly identifier: TIdentifier,
    readonly startDate?: Date;
    readonly endDate?: Date;
  }
) => Promise<boolean>

const deleteSamples: DeleteSamplesFn = async (sample) => {
  const start = sample.startDate || new Date()
  const end = sample.endDate || new Date()
  const { identifier } = sample

  return Native.deleteSamples(identifier, start.toISOString(), end.toISOString())
}

export default deleteSamples
