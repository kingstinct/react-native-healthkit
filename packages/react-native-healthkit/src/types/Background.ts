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
 * Type configuration for native background sync.
 *
 * Maps a HealthKit identifier (what the library observes/queries) to the
 * `type` name and `unit` string the consumer's backend expects in the output.
 * The library is generic — it emits records using whatever translation the
 * consumer provides.
 *
 * - `identifier`: HKQuantityTypeIdentifier / HKCategoryTypeIdentifier / HKWorkoutTypeIdentifier
 * - `type`: consumer's canonical type name (e.g. "steps"). Included verbatim in output records.
 * - `unit`: HealthKit unit string (e.g. "count", "m", "kcal"). Used both for querying HKUnit and as the record's `unit` field.
 * - `cumulative`: set `true` for quantity types where multiple sources overlap
 *   (e.g. iPhone + Watch both record steps). The library uses
 *   `HKStatisticsCollectionQuery` with `.cumulativeSum` and emits one daily
 *   total (Apple deduplicates across sources). Set `false` for discrete
 *   observations (heart rate, weight, HRV) where each sample is independent.
 *
 * @example
 * // Cumulative — steps, distance, active energy, exercise minutes, flights
 * { identifier: 'HKQuantityTypeIdentifierStepCount', type: 'steps', unit: 'count', cumulative: true }
 *
 * // Discrete — heart rate, HRV, weight, body temperature, blood pressure
 * { identifier: 'HKQuantityTypeIdentifierHeartRate', type: 'heart_rate', unit: 'count/min', cumulative: false }
 *
 * // Category — sleep, mindful sessions (always discrete)
 * { identifier: 'HKCategoryTypeIdentifierSleepAnalysis', type: 'sleep', unit: '', cumulative: false }
 */
export interface SyncTypeConfig {
  readonly identifier: string
  readonly type: string
  readonly unit: string
  readonly cumulative: boolean
}

/**
 * HTTP endpoint configuration for native background sync.
 * The library sends HealthKit data as JSON to this endpoint — no assumptions
 * about auth scheme, API paths, or backend implementation.
 *
 * Body shape sent: `{ records: [...] }` where each record contains
 * `type`, `value`, `unit`, `startTime`, `endTime`, `sourceRecordId`, `granularity`.
 */
export interface BackgroundSyncEndpoint {
  readonly url: string
  readonly method: string
  readonly headers: Record<string, string>
}
