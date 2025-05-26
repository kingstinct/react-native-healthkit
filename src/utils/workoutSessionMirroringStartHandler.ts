import Native from '../native-types'

/**
* A block that the system calls when it starts a mirrored workout session between iOS and watchOS apps.
* @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/4172878-workoutsessionmirroringstarthand workoutSessionMirroringStartHandler (Apple Docs)}
* @returns {Promise<boolean>} A promise that resolves to true if mirroring started successfully, false otherwise.
* @throws {Error} If there's an error starting the mirroring session.
*/
const workoutSessionMirroringStartHandler: () => Promise<boolean> = async () => Native.workoutSessionMirroringStartHandler()

export default workoutSessionMirroringStartHandler
