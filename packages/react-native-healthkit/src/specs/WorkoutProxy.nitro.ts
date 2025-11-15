import type { HybridObject } from 'react-native-nitro-modules'
import type { QuantityTypeIdentifier, QueryStatisticsResponse } from '../types'
import type {
  LocationForSaving,
  WorkoutPlan,
  WorkoutRoute,
  WorkoutSample,
} from '../types/Workouts'

export interface WorkoutProxy
  extends HybridObject<{ ios: 'swift' }>,
    WorkoutSample {
  toJSON(key?: string): WorkoutSample
  saveWorkoutRoute(locations: readonly LocationForSaving[]): Promise<boolean>
  getWorkoutPlan(): Promise<WorkoutPlan | undefined>
  getWorkoutRoutes(): Promise<readonly WorkoutRoute[]>
  getStatistic(
    quantityType: QuantityTypeIdentifier,
    unitOverride?: string,
  ): Promise<QueryStatisticsResponse | undefined>
  getAllStatistics(): Promise<Record<string, QueryStatisticsResponse>>
}
