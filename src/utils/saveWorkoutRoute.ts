import Native from '../native-types'

import type { CLLocationRawForSaving } from '../types'

async function saveWorkoutRoute(
  workoutUUID: string,
  locations: readonly CLLocationRawForSaving[],
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