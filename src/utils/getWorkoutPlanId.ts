import Native from "../native-types"

async function getWorkoutPlanId(workoutUUID: string) {
  return Native.getWorkoutPlanId(workoutUUID)
}

export default getWorkoutPlanId
