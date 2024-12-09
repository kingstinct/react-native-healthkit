import Native from '../native-types'

const workoutSessionMirroringStartHandler: () => Promise<boolean> = async () => Native.workoutSessionMirroringStartHandler()

export default workoutSessionMirroringStartHandler
