import Native from '../native-types'

export type DeleteWorkoutSampleFn = (uuid: string) => Promise<boolean>

const deleteWorkoutSample: DeleteWorkoutSampleFn = async (uuid) => Native.deleteWorkoutSample(uuid)

export default deleteWorkoutSample
