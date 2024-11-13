import Native from '../native-types'

import type { HKWorkoutConfiguration } from '..'

const startWatchApp = (configuration: HKWorkoutConfiguration) => async () => Native.startWatchAppWithWorkoutConfiguration(configuration)

export default startWatchApp
