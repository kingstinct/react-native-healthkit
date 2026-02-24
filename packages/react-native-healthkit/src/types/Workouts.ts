import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro'
import type { BaseSample, ComparisonPredicateOperator } from '../types'
import type { Quantity } from './QuantityType'
import type { FilterForSamplesBase } from './QueryOptions'
import type { DeletedSample } from './Shared'

export enum WorkoutActivityType {
  americanFootball = 1,
  archery = 2,
  australianFootball = 3,
  badminton = 4,
  baseball = 5,
  basketball = 6,
  bowling = 7,
  boxing = 8, // See also HKWorkoutActivityTypeKickboxing.,
  climbing = 9,
  cricket = 10,
  crossTraining = 11, // Any mix of cardio and/or strength training. See also HKWorkoutActivityTypeCoreTraining and HKWorkoutActivityTypeFlexibility.,
  curling = 12,
  cycling = 13,
  dance = 14,
  danceInspiredTraining = 15, // This enum remains available to access older data.,
  elliptical = 16,
  equestrianSports = 17, // Polo, Horse Racing, Horse Riding, etc.,
  fencing = 18,
  fishing = 19,
  functionalStrengthTraining = 20, // Primarily free weights and/or body weight and/or accessories,
  golf = 21,
  gymnastics = 22,
  handball = 23,
  hiking = 24,
  hockey = 25, // Ice Hockey, Field Hockey, etc.,
  hunting = 26,
  lacrosse = 27,
  martialArts = 28,
  mindAndBody = 29, // Qigong, meditation, etc.,
  mixedMetabolicCardioTraining = 30, // This enum remains available to access older data.,
  paddleSports = 31, // Canoeing, Kayaking, Outrigger, Stand Up Paddle Board, etc.,
  play = 32, // Dodge Ball, Hopscotch, Tetherball, Jungle Gym, etc.,
  preparationAndRecovery = 33, // Foam rolling, stretching, etc.,
  racquetball = 34,
  rowing = 35,
  rugby = 36,
  running = 37,
  sailing = 38,
  skatingSports = 39, // Ice Skating, Speed Skating, Inline Skating, Skateboarding, etc.,
  snowSports = 40, // Sledding, Snowmobiling, Building a Snowman, etc. See also HKWorkoutActivityTypeCrossCountrySkiing, HKWorkoutActivityTypeSnowboarding, and HKWorkoutActivityTypeDownhillSkiing.,
  soccer = 41,
  softball = 42,
  squash = 43,
  stairClimbing = 44, // See also HKWorkoutActivityTypeStairs and HKWorkoutActivityTypeStepTraining.,
  surfingSports = 45, // Traditional Surfing, Kite Surfing, Wind Surfing, etc.,
  swimming = 46,
  tableTennis = 47,
  tennis = 48,
  trackAndField = 49, // Shot Put, Javelin, Pole Vaulting, etc.,
  traditionalStrengthTraining = 50, // Primarily machines and/or free weights,
  volleyball = 51,
  walking = 52,
  waterFitness = 53,
  waterPolo = 54,
  waterSports = 55, // Water Skiing, Wake Boarding, etc.,
  wrestling = 56,
  yoga = 57,
  barre = 58, // HKWorkoutActivityTypeDanceInspiredTraining,
  coreTraining = 59,
  crossCountrySkiing = 60,
  downhillSkiing = 61,
  flexibility = 62,
  highIntensityIntervalTraining = 63,
  jumpRope = 64,
  kickboxing = 65,
  pilates = 66, // HKWorkoutActivityTypeDanceInspiredTraining,
  snowboarding = 67,
  stairs = 68,
  stepTraining = 69,
  wheelchairWalkPace = 70,
  wheelchairRunPace = 71,
  taiChi = 72,
  mixedCardio = 73, // HKWorkoutActivityTypeMixedMetabolicCardioTraining,
  handCycling = 74,
  discSports = 75,
  fitnessGaming = 76,
  cardioDance = 77,
  socialDance = 78,
  pickleball = 79,
  cooldown = 80,
  swimBikeRun = 82,
  transition = 83,
  underwaterDiving = 84,
  other = 3000,
}

export interface WorkoutEvent {
  readonly type: WorkoutEventType
  readonly startDate: Date
  readonly endDate: Date
}

export enum WorkoutEventType {
  pause = 1,
  resume = 2,
  lap = 3,
  marker = 4,
  motionPaused = 5,
  motionResumed = 6,
  segment = 7,
  pauseOrResumeRequest = 8,
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
  readonly date: Date // unix timestamp in milliseconds
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

export interface WorkoutSample extends BaseSample {
  readonly workoutActivityType: WorkoutActivityType
  readonly duration: Quantity
  readonly totalEnergyBurned?: Quantity
  readonly totalDistance?: Quantity
  readonly totalSwimmingStrokeCount?: Quantity
  readonly totalFlightsClimbed?: Quantity
  readonly events?: readonly WorkoutEvent[]
  readonly activities?: readonly WorkoutActivity[]

  readonly metadataAverageMETs?: Quantity
  readonly metadataElevationAscended?: Quantity
  readonly metadataElevationDescended?: Quantity
  readonly metadataIndoorWorkout?: boolean
  readonly metadataAverageSpeed?: Quantity
  readonly metadataMaximumSpeed?: Quantity
}
