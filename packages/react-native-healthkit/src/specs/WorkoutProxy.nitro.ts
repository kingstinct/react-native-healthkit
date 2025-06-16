import type { HybridObject } from 'react-native-nitro-modules'
import type {
  LocationForSaving,
  WorkoutPlan,
  WorkoutRoute,
  WorkoutSample,
} from '../types/Workouts'

export interface WorkoutProxy
  extends HybridObject<{ ios: 'swift' }>,
    WorkoutSample {
  toJSON(): WorkoutSample
  saveWorkoutRoute(locations: readonly LocationForSaving[]): Promise<boolean>
  getWorkoutPlan(): Promise<WorkoutPlan | null>
  getWorkoutRoutes(): Promise<readonly WorkoutRoute[]>

  // nice to have here: getAllStatistics and getStatisticsForQuantityType
}
