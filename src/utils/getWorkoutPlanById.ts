import Native from '../native-types'

async function getWorkoutPlanById(workoutUUID: string) {
  return Native.getWorkoutPlanById(workoutUUID)
}

export default getWorkoutPlanById
