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
import type { WorkoutBuilder } from './WorkoutBuilder.nitro'
import type { WorkoutProxy } from './WorkoutProxy.nitro'

export interface WorkoutsModule extends HybridObject<{ ios: 'swift' }> {
  /**
   * Saves a workout without events or activities. To save pauses, laps or activities, use
   * `createWorkoutBuilder` instead. Uses the `HKWorkout` initializers deprecated in iOS 17.
   */
  saveWorkoutSample(
    workoutActivityType: WorkoutActivityType,
    quantities: readonly QuantitySampleForSaving[],
    startDate: Date,
    endDate: Date,
    totals?: WorkoutTotals,
    metadata?: AnyMap,
  ): Promise<WorkoutProxy>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/init(healthstore:configuration:device:) Apple Docs }
   */
  createWorkoutBuilder(
    workoutConfiguration: WorkoutConfiguration,
  ): WorkoutBuilder

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
