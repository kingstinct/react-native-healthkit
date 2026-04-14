/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkupdatefrequency Apple Docs }
 */
export enum UpdateFrequency {
  immediate = 1,
  hourly = 2,
  daily = 3,
  weekly = 4,
}

/**
 * HealthKit sample kind — tells the native sync engine which query pattern
 * and record shape to use for a given identifier.
 *
 * - `cumulativeQuantity`: `HKQuantityType` aggregated via
 *   `HKStatisticsCollectionQuery` with `.cumulativeSum` and emitted as one
 *   per-day bucket. Apple deduplicates across sources (iPhone + Watch + 3rd
 *   party apps). Use for steps, distance, energy, exercise minutes, flights.
 * - `discreteQuantity`: `HKQuantityType` sampled directly via
 *   `HKSampleQuery`. Each sample becomes one record. Use for heart rate,
 *   HRV, weight, body temperature, blood pressure, SpO2.
 * - `categorySample`: `HKCategoryType` sampled via `HKSampleQuery`. Each
 *   segment becomes one record; the category value is emitted as a string
 *   name (e.g. `asleep_core`). Use for sleep analysis, mindful sessions.
 * - `workout`: `HKWorkoutType` queried via `HKSampleQuery`. Each workout
 *   becomes one record with summary fields (activity type, duration,
 *   distance, energy, HR stats). Uses iOS 17+ `statistics(for:)` when
 *   available, falls back to deprecated totals on iOS 15–16.
 *
 * Declared as a TypeScript union (not `enum`) so nitrogen generates a
 * string-backed C++ enum that bridges to a proper Swift enum.
 */
export type SyncKind =
  | 'cumulativeQuantity'
  | 'discreteQuantity'
  | 'categorySample'
  | 'workout'

/**
 * Type configuration for native background sync.
 *
 * Maps a HealthKit identifier (what the library observes/queries) to the
 * `type` name and `unit` string the consumer's backend expects in the output.
 * The library is generic — it emits records using whatever translation the
 * consumer provides.
 *
 * - `identifier`: HKQuantityTypeIdentifier / HKCategoryTypeIdentifier / HKWorkoutTypeIdentifier
 * - `type`: consumer's canonical type name (e.g. "steps"). Included verbatim in output records.
 * - `unit`: HealthKit unit string (e.g. "count", "m", "kcal"). Used both for
 *   querying HKUnit and as the record's `unit` field. Pass empty string for
 *   kinds where unit doesn't apply (`categorySample`, `workout`).
 * - `kind`: query pattern + record shape — see {@link SyncKind}.
 *
 * @example
 * // Cumulative — steps, distance, active energy, exercise minutes, flights
 * { identifier: 'HKQuantityTypeIdentifierStepCount', type: 'steps', unit: 'count', kind: 'cumulativeQuantity' }
 *
 * // Discrete — heart rate, HRV, weight, body temperature, blood pressure
 * { identifier: 'HKQuantityTypeIdentifierHeartRate', type: 'heart_rate', unit: 'count/min', kind: 'discreteQuantity' }
 *
 * // Category — sleep analysis (value becomes `asleep_core`, `asleep_deep`, etc.)
 * { identifier: 'HKCategoryTypeIdentifierSleepAnalysis', type: 'sleep', unit: '', kind: 'categorySample' }
 *
 * // Workout — emits activity type, duration, distance, energy, HR stats
 * { identifier: 'HKWorkoutTypeIdentifier', type: 'workout', unit: '', kind: 'workout' }
 */
export interface SyncTypeConfig {
  readonly identifier: string
  readonly type: string
  readonly unit: string
  readonly kind: SyncKind
}

/**
 * HTTP endpoint configuration for native background sync.
 * The library sends HealthKit data as JSON to this endpoint — no assumptions
 * about auth scheme, API paths, or backend implementation.
 *
 * Body shape sent: `{ records: [...] }` where each record contains
 * `type`, `value`, `unit`, `startTime`, `endTime`, `recordId`, `frequency`,
 * plus kind-specific extras (category value name, workout fields, etc.).
 *
 * - `lookbackDays`: how many days of history to re-query on every observer
 *   wake. Default `1` (today only — minimal work, minimal wire traffic). Set
 *   higher when the consumer needs catch-up for late Watch-to-iPhone sync,
 *   offline days, or data correction — typical values are 1–7. Backends
 *   should deduplicate on `recordId` since days get re-sent.
 */
export interface BackgroundSyncEndpoint {
  readonly url: string
  readonly method: string
  readonly headers: Record<string, string>
  readonly lookbackDays?: number
}
