import type { Quantity } from './QuantityType'
import type { DateFilter } from './QueryOptions'

/**
 * Raw values match `HKActivityMoveMode`.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkactivitymovemode Apple Docs HKActivityMoveMode}
 */
export enum ActivityMoveMode {
  activeEnergy = 1,
  appleMoveTime = 2,
}

export interface ActivitySummaryDateComponents {
  readonly era?: number
  readonly year?: number
  readonly month?: number
  readonly day?: number
}

/**
 * Represents daily Move, Exercise, and Stand ring data from HealthKit.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkactivitysummary Apple Docs HKActivitySummary}
 */
export interface ActivitySummary {
  readonly dateComponents: ActivitySummaryDateComponents
  readonly activityMoveMode: ActivityMoveMode
  readonly activeEnergyBurned: Quantity
  readonly activeEnergyBurnedGoal: Quantity
  readonly appleExerciseTime: Quantity
  readonly appleExerciseTimeGoal: Quantity
  readonly appleStandHours: Quantity
  readonly appleStandHoursGoal: Quantity
  readonly appleMoveTime?: Quantity
  readonly appleMoveTimeGoal?: Quantity
  readonly isPaused?: boolean
}

export interface ActivitySummaryQueryFilter {
  readonly date?: DateFilter
}
