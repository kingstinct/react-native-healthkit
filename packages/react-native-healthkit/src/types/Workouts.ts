import type { AnyMap } from 'react-native-nitro-modules'
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
  boxing = 8,
  climbing = 9,
  cricket = 10,
  crossTraining = 11,
  curling = 12,
  cycling = 13,
  dance = 14,
  danceInspiredTraining = 15,
  elliptical = 16,
  equestrianSports = 17,
  fencing = 18,
  fishing = 19,
  functionalStrengthTraining = 20,
  golf = 21,
  gymnastics = 22,
  handball = 23,
  hiking = 24,
  hockey = 25,
  hunting = 26,
  lacrosse = 27,
  martialArts = 28,
  mindAndBody = 29,
  mixedMetabolicCardioTraining = 30,
  paddleSports = 31,
  play = 32,
  preparationAndRecovery = 33,
  racquetball = 34,
  rowing = 35,
  rugby = 36,
  running = 37,
  sailing = 38,
  skatingSports = 39,
  snowSports = 40,
  soccer = 41,
  softball = 42,
  squash = 43,
  stairClimbing = 44,
  surfingSports = 45,
  swimming = 46,
  tableTennis = 47,
  tennis = 48,
  trackAndField = 49,
  traditionalStrengthTraining = 50,
  volleyball = 51,
  walking = 52,
  waterFitness = 53,
  waterPolo = 54,
  waterSports = 55,
  wrestling = 56,
  yoga = 57,
  barre = 58,
  coreTraining = 59,
  crossCountrySkiing = 60,
  downhillSkiing = 61,
  flexibility = 62,
  highIntensityIntervalTraining = 63,
  jumpRope = 64,
  kickboxing = 65,
  pilates = 66,
  snowboarding = 67,
  stairs = 68,
  stepTraining = 69,
  wheelchairWalkPace = 70,
  wheelchairRunPace = 71,
  taiChi = 72,
  mixedCardio = 73,
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
  readonly metadata?: AnyMap
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

export interface WorkoutRouteLocation {
  readonly longitude: number
  readonly latitude: number
  readonly altitude: number
  readonly speed: number
  readonly timestamp: number
  readonly horizontalAccuracy: number
  readonly speedAccuracy: number
  readonly verticalAccuracy: number
  readonly distance: number | null
}

export interface WorkoutPlan {
  readonly id: string
  readonly activityType: WorkoutActivityType
}

export type FilterForWorkouts = FilterForSamplesBase & {
  readonly workoutActivityType?: WorkoutActivityType
}

export type QueryDeletedWorkoutsOptions = {
  readonly from?: Date
  readonly to?: Date
  readonly limit?: number
  readonly ascending?: boolean
  readonly anchor?: string
  readonly filter?: FilterForWorkouts
}

export type QueryWorkoutsOptions = QueryDeletedWorkoutsOptions & {
  readonly withDeletedObjects?: boolean
}

export interface LocationForSaving {
  readonly latitude: number
  readonly longitude: number
  readonly altitude: number
  readonly horizontalAccuracy: number
  readonly verticalAccuracy: number
  readonly course: number
  readonly speed: number
  readonly timestamp: number
}

export interface SaveWorkoutOptions {
  readonly startDate: Date
  readonly endDate: Date
  readonly workoutActivityType: WorkoutActivityType
  readonly duration?: Quantity
  readonly totalDistance?: Quantity
  readonly totalEnergyBurned?: Quantity
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

export type WorkoutSampleQueryResult =
  & WorkoutSample
  & WorkoutProxy
  & { readonly deletedObjects?: readonly DeletedSample[] }
