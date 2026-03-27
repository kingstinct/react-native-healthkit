import type {
  WorkoutEventTypedMetadata,
  WorkoutTypedMetadata,
} from '../generated/healthkit.generated'
import {
  WorkoutActivityType,
  WorkoutEventType,
} from '../generated/healthkit.generated'
import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro'
import type { BaseSample, ComparisonPredicateOperator } from '../types'
import type { Quantity } from './QuantityType'
import type { FilterForSamplesBase } from './QueryOptions'
import type { DeletedSample, MetadataWithUnknown } from './Shared'

export { WorkoutActivityType, WorkoutEventType }

export interface WorkoutEvent {
  readonly type: WorkoutEventType
  readonly startDate: Date
  readonly endDate: Date
  readonly metadata?: MetadataWithUnknown<WorkoutEventTypedMetadata>
}

export interface WorkoutActivity {
  readonly startDate: Date
  readonly endDate: Date
  readonly uuid: string
  readonly duration: number
}

export interface WorkoutRoute {
  readonly locations: readonly WorkoutRouteLocation[]
  readonly HKMetadataKeySyncIdentifier?: string
  readonly HKMetadataKeySyncVersion?: number
}

export interface QueryWorkoutSamplesWithAnchorResponse {
  readonly workouts: readonly WorkoutProxy[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export type WorkoutDurationPredicate = {
  readonly predicateOperator: ComparisonPredicateOperator
  readonly durationInSeconds: number
}

export interface FilterForWorkoutsBase
  extends Omit<FilterForSamplesBase, 'workout'> {
  readonly workoutActivityType?: WorkoutActivityType
  readonly duration?: WorkoutDurationPredicate
}

export interface FilterForWorkouts extends FilterForWorkoutsBase {
  OR?: FilterForWorkoutsBase[]
  NOT?: FilterForWorkoutsBase[]
  AND?: FilterForWorkoutsBase[]
}

export interface WorkoutQueryOptionsWithAnchor {
  filter?: FilterForWorkouts
  /**
   * Specify -1, 0 or any non-positive number for fetching all samples
   * */
  limit: number
  anchor?: string
}

export interface WorkoutQueryOptions {
  filter?: FilterForWorkouts
  /**
   * Specify -1, 0 or any non-positive number for fetching all samples
   * */
  limit: number
  ascending?: boolean
}

export interface WorkoutRouteLocation {
  readonly altitude: number
  readonly course: number
  readonly date: Date
  readonly distance?: number
  readonly horizontalAccuracy: number
  readonly latitude: number
  readonly longitude: number
  readonly speed: number
  readonly speedAccuracy: number
  readonly verticalAccuracy: number
}

export interface LocationForSaving {
  readonly altitude: number
  readonly course: number
  readonly date: Date
  readonly horizontalAccuracy: number
  readonly latitude: number
  readonly longitude: number
  readonly speed: number
  readonly verticalAccuracy: number
}

export interface WorkoutPlan {
  readonly id: string
  readonly activityType: WorkoutActivityType
}

export interface WorkoutTotals {
  readonly distance?: number
  readonly energyBurned?: number
}

export interface WorkoutSample extends Omit<BaseSample, 'metadata'> {
  readonly workoutActivityType: WorkoutActivityType
  readonly duration: Quantity
  readonly totalEnergyBurned?: Quantity
  readonly totalDistance?: Quantity
  readonly totalSwimmingStrokeCount?: Quantity
  readonly totalFlightsClimbed?: Quantity
  readonly events?: readonly WorkoutEvent[]
  readonly activities?: readonly WorkoutActivity[]
  readonly metadata: MetadataWithUnknown<WorkoutTypedMetadata>

  readonly metadataAverageMETs?: Quantity
  readonly metadataElevationAscended?: Quantity
  readonly metadataElevationDescended?: Quantity
  readonly metadataIndoorWorkout?: boolean
  readonly metadataAverageSpeed?: Quantity
  readonly metadataMaximumSpeed?: Quantity
}
