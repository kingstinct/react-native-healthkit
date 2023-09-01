import Native from '../native-types'

import type { CLLocationForSaving } from '../types'

async function saveWorkoutRoute(
  workoutUUID: string,
  locations: readonly CLLocationForSaving[],
) {
  return Native.saveWorkoutRoute(
    workoutUUID,
    locations.map((location) => {
      const { timestamp, ...rest } = location
      return {
        ...rest,
        ...(timestamp ? { timestamp: new Date(timestamp).toISOString() } : { timestamp: '' }),
      }
    }),
  )
}

export default saveWorkoutRoute
