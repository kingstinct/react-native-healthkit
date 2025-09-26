import type { HybridObject } from 'react-native-nitro-modules'
import type {
  Quantity,
  QuantityTypeIdentifier,
  QueryStatisticsResponse,
} from '../types'
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
  getWorkoutPlan(): Promise<WorkoutPlan | null>
  getWorkoutRoutes(): Promise<readonly WorkoutRoute[]>
  getStatistic(
    quantityType: QuantityTypeIdentifier,
    unitOverride?: string,
  ): Promise<QueryStatisticsResponse | null>
  getAllStatistics(): Promise<Record<string, QueryStatisticsResponse>>

  /** @deprecated Use allStatistics or statistic() method instead */
  readonly totalDistance?: Quantity
  /** @deprecated Use allStatistics or statistic() method instead */
  readonly totalEnergyBurned?: Quantity
  /** @deprecated Use allStatistics or statistic() method instead */
  readonly totalSwimmingStrokeCount?: Quantity
  /** @deprecated Use allStatistics or statistic() method instead */
  readonly totalFlightsClimbed?: Quantity
}
