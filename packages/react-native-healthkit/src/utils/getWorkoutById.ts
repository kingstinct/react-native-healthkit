import { Workouts } from '../modules'

const getWorkoutById = async (uuid: string) => {
  const workouts = await Workouts.queryWorkoutSamples({
    limit: 1,
    filter: {
      uuids: [uuid],
    },
  })

  return workouts[0]
}

export default getWorkoutById
