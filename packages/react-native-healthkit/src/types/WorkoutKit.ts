import type { WorkoutActivityType } from './Workouts'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutconfiguration Apple Docs }
 */
export interface WorkoutConfiguration {
  readonly activityType: WorkoutActivityType
  readonly locationType?: WorkoutSessionLocationType
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutsessionlocationtype Apple Docs }
 */
export enum WorkoutSessionLocationType {
  unknown = 1,
  indoor = 2,
  outdoor = 3,
}
