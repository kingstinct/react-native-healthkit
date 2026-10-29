import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type { QuantitySampleForSaving } from '../types/QuantitySample'
import type { WorkoutConfiguration } from '../types/WorkoutKit'
import type {
  WorkoutActivityForSaving,
  WorkoutBuilderActivity,
  WorkoutEvent,
} from '../types/Workouts'
import type { WorkoutProxy } from './WorkoutProxy.nitro'

/**
 * Incrementally builds a workout and saves it to HealthKit. Create one with `createWorkoutBuilder`.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder Apple Docs }
 */
export interface WorkoutBuilder extends HybridObject<{ ios: 'swift' }> {
  readonly workoutConfiguration: WorkoutConfiguration
  readonly startDate?: Date
  readonly endDate?: Date
  readonly metadata: AnyMap
  readonly workoutEvents: readonly WorkoutEvent[]
  /**
   * Always empty below iOS 16.
   */
  readonly workoutActivities: readonly WorkoutBuilderActivity[]

  /**
   * Duration of the workout at `date` in seconds, excluding paused intervals.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/elapsedtime(at:) Apple Docs }
   */
  elapsedTime(date: Date): number

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/begincollection(withstart:completion:) Apple Docs }
   */
  beginCollection(startDate: Date): Promise<void>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/add(_:completion:) Apple Docs }
   */
  add(samples: readonly QuantitySampleForSaving[]): Promise<void>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/addmetadata(_:completion:) Apple Docs }
   */
  addMetadata(metadata: AnyMap): Promise<void>

  /**
   * A pause event can only be followed by a resume event, and a resume event only by a pause event.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/addworkoutevents(_:completion:) Apple Docs }
   */
  addWorkoutEvents(workoutEvents: readonly WorkoutEvent[]): Promise<void>

  /**
   * Requires iOS 16 or later. Resolves with the UUID of the added activity, for `updateActivity*`.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/addworkoutactivity(_:completion:) Apple Docs }
   */
  addWorkoutActivity(workoutActivity: WorkoutActivityForSaving): Promise<string>

  /**
   * Requires iOS 16 or later.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/updateactivity(uuid:end:completion:) Apple Docs }
   */
  updateActivityEndDate(uuid: string, endDate: Date): Promise<void>

  /**
   * Requires iOS 16 or later.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/updateactivity(uuid:adding:completion:) Apple Docs }
   */
  updateActivityMetadata(uuid: string, metadata: AnyMap): Promise<void>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/endcollection(withend:completion:) Apple Docs }
   */
  endCollection(endDate: Date): Promise<void>

  /**
   * Creates the workout and saves it to HealthKit. Call `endCollection` first.
   * Resolves with `undefined` if the workout was saved but can't be read back because the device is locked.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/finishworkout(completion:) Apple Docs }
   */
  finishWorkout(): Promise<WorkoutProxy | undefined>

  /**
   * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutbuilder/discardworkout() Apple Docs }
   */
  discardWorkout(): void
}
