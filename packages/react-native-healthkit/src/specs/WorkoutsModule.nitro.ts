import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { QuantitySampleForSaving } from '../types/QuantitySample'
import type { WorkoutConfiguration } from '../types/WorkoutKit'
import type {
  QueryWorkoutSamplesWithAnchorResponse,
  WorkoutActivityType,
  WorkoutQueryOptions,
  WorkoutQueryOptionsWithAnchor,
  WorkoutTotals,
} from '../types/Workouts'
import type { WorkoutProxy } from './WorkoutProxy.nitro'

export interface WorkoutsModule extends HybridObject<{ ios: 'swift' }> {
  saveWorkoutSample(
    workoutActivityType: WorkoutActivityType,
    quantities: readonly QuantitySampleForSaving[],
    startDate: Date,
    endDate: Date,
    totals: WorkoutTotals,
    metadata: AnyMap,
  ): Promise<WorkoutProxy>

  queryWorkoutSamplesWithAnchor(
    options: WorkoutQueryOptionsWithAnchor,
  ): Promise<QueryWorkoutSamplesWithAnchorResponse>

  queryWorkoutSamples(options: WorkoutQueryOptions): Promise<WorkoutProxy[]>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1648358-startwatchapp Apple Docs }
   */
  startWatchAppWithWorkoutConfiguration(
    workoutConfiguration: WorkoutConfiguration,
  ): Promise<boolean>
}
