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
  /**
   * Unit string emitted verbatim on output records — whatever the consumer's
   * backend expects in its wire schema (e.g. `bpm`, `percent`, `ml`).
   */
  readonly unit: string
  /**
   * HealthKit unit string in Apple's factorization grammar — used for
   * `HKUnit(from:)` when querying the HealthKit store. Examples: `count/min`,
   * `%`, `mL`, `kcal`, `ms`. Provide this when `unit` (the wire format) is
   * not a valid HKUnit string. When omitted, the library falls back to
   * `unit`. An invalid `hkUnit` causes `configureBackgroundSync` to throw
   * a descriptive error at setup time rather than crashing on a background
   * wake.
   */
  readonly hkUnit?: string
  readonly kind: SyncKind
}

// ---------------------------------------------------------------------------
// Output record types — the JSON shapes POSTed to the consumer's endpoint.
// These are documentation-only (the native engine builds the JSON in Swift);
// they are exported so consumers can type their backend request handlers.
// ---------------------------------------------------------------------------

/**
 * Device that produced the sample (from `HKDevice`).
 * Present on discrete, category, and workout records.
 * `null` when HealthKit doesn't associate a device with the sample.
 */
export interface SyncRecordDevice {
  readonly name?: string
  readonly manufacturer?: string
  readonly model?: string
  readonly hardwareVersion?: string
  readonly softwareVersion?: string
}

/**
 * Source app/revision that wrote the sample (from `HKSourceRevision`).
 * Present on discrete, category, and workout records.
 */
export interface SyncRecordSource {
  readonly name: string
  readonly bundleIdentifier: string
  readonly version?: string
}

/**
 * Fields common to every output record regardless of kind.
 */
export interface SyncRecordBase {
  readonly type: string
  readonly startTime: string
  readonly endTime: string
  readonly recordId: string
  /** `"daily"` for cumulative aggregates, `"realtime"` for per-sample records. */
  readonly frequency: 'daily' | 'realtime'
  /** IANA timezone identifier, e.g. `"Europe/Stockholm"`. */
  readonly timeZone: string
  /** UTC offset in minutes at sync time. */
  readonly timeZoneOffsetMinutes: number
  /** ISO 8601 date string in the user's local timezone. */
  readonly localDate: string
}

/**
 * Cumulative record — one per day per type.
 * Produced by `HKStatisticsCollectionQuery` with `.cumulativeSum`.
 * Apple deduplicates across sources (iPhone + Watch + 3rd-party).
 *
 * **No device/source/metadata** — `HKStatistics` is an aggregate with no
 * per-sample provenance.
 */
export interface SyncRecordCumulative extends SyncRecordBase {
  readonly value: number
  readonly unit: string
  readonly frequency: 'daily'
}

/**
 * Discrete quantity record — one per sample.
 * Produced by `HKSampleQuery` on `HKQuantityType`.
 * Includes device, source, and metadata from the original `HKQuantitySample`.
 */
export interface SyncRecordDiscrete extends SyncRecordBase {
  readonly value: number
  readonly unit: string
  readonly frequency: 'realtime'
  readonly device?: SyncRecordDevice
  readonly source?: SyncRecordSource
  readonly metadata?: Record<string, unknown>
}

/**
 * Category record — one per sample (e.g. each sleep segment).
 * Produced by `HKSampleQuery` on `HKCategoryType`.
 *
 * For sleep analysis the `category` field contains a human-readable stage name
 * (`in_bed`, `awake`, `asleep_core`, `asleep_deep`, `asleep_rem`,
 * `asleep_unspecified`, or `unknown:<N>` for future Apple values).
 * For other category types the raw integer `value` is included instead.
 */
export interface SyncRecordCategory extends SyncRecordBase {
  readonly frequency: 'realtime'
  readonly category?: string
  readonly value?: number
  readonly device?: SyncRecordDevice
  readonly source?: SyncRecordSource
  readonly metadata?: Record<string, unknown>
}

/**
 * Workout record — one per `HKWorkout` sample.
 * Includes summary stats, and on iOS 17+ average/max heart rate via
 * `workout.statistics(for:)`.
 */
export interface SyncRecordWorkout extends SyncRecordBase {
  readonly frequency: 'realtime'
  readonly workoutType: string
  readonly duration: number
  readonly distance?: { readonly value: number; readonly unit: 'm' }
  readonly calories?: { readonly value: number; readonly unit: 'kcal' }
  readonly averageHeartRate?: number
  readonly maxHeartRate?: number
  readonly device?: SyncRecordDevice
  readonly source?: SyncRecordSource
  readonly metadata?: Record<string, unknown>
}

/** Union of all output record types. */
export type SyncRecord =
  | SyncRecordCumulative
  | SyncRecordDiscrete
  | SyncRecordCategory
  | SyncRecordWorkout

/** Shape of the HTTP request body sent to the consumer's endpoint. */
export interface SyncRequestBody {
  readonly records: readonly SyncRecord[]
}

/**
 * HTTP endpoint configuration for native background sync.
 * The library sends HealthKit data as JSON to this endpoint — no assumptions
 * about auth scheme, API paths, or backend implementation.
 *
 * Body shape: {@link SyncRequestBody} — `{ records: [...] }` where each
 * record is a {@link SyncRecord}. Cumulative records contain only core fields
 * (type, value, unit, timestamps). Discrete, category, and workout records
 * additionally include `device`, `source`, and `metadata` from the underlying
 * `HKSample` — see {@link SyncRecordDiscrete}, {@link SyncRecordCategory},
 * {@link SyncRecordWorkout}.
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
