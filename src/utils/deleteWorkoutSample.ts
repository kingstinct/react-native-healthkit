import Native from '../native-types'

import type { HKQuantityTypeIdentifier } from '../native-types'

export type DeleteWorkoutSampleFn = (
  uuid: string,
  options?: {
    readonly associatedQuantityTypes?: readonly HKQuantityTypeIdentifier[]
  }
) => Promise<boolean>

const deleteWorkoutSample: DeleteWorkoutSampleFn = async (uuid, options) => Native.deleteWorkoutSample(uuid, options?.associatedQuantityTypes || [])

export default deleteWorkoutSample
