import { Workouts } from '../modules'

const getMostRecentWorkout = async () => {
  const workouts = await Workouts.queryWorkoutSamples({
    limit: 1,
    ascending: false,
  })

  return workouts[0]
}

export default getMostRecentWorkout
