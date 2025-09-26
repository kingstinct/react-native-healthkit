import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro'
import getWorkoutById from '../utils/getWorkoutById'
import useSubscribeToChanges from './useSubscribeToChanges'

/**
 * @returns the most recent workout sample.
 */
export function useWorkoutById(
  uuid: string,
  options?: {
    readonly energyUnit?: string
    readonly distanceUnit?: string
  },
) {
  const [workout, setWorkout] = useState<WorkoutProxy>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const update = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedWorkout = await getWorkoutById(uuid)
      setWorkout(fetchedWorkout)
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Unknown error fetching workout by ID'),
      )
    } finally {
      setIsLoading(false)
    }
  }, [uuid])

  useEffect(() => {
    void update()
  }, [update])

  useSubscribeToChanges('HKWorkoutTypeIdentifier', update)

  return { workout, isLoading, error }
}

export default useWorkoutById
