/**
 * One HKActivitySummary — the per-day rollup behind the Apple activity rings.
 *
 * Activity summaries are keyed by calendar day ({@link https://developer.apple.com/documentation/healthkit/hkactivitysummary Apple Docs}),
 * not by timestamp, so the date is exposed as plain calendar components from
 * `HKActivitySummary.dateComponents(for:)` rather than a `Date` — converting to a
 * timestamp would force a timezone assumption onto callers.
 */
export interface ActivitySummary {
  /** Calendar year of the summary day (user's current calendar). */
  readonly dateYear: number
  /** Calendar month (1–12). */
  readonly dateMonth: number
  /** Calendar day of month (1–31). */
  readonly dateDay: number
  /** Move ring — active energy burned (kcal). */
  readonly activeEnergyBurned: number
  /** Move ring goal (kcal). */
  readonly activeEnergyBurnedGoal: number
  /** Exercise ring — Apple exercise time (minutes). */
  readonly appleExerciseTime: number
  /** Exercise ring goal (minutes). */
  readonly appleExerciseTimeGoal: number
  /** Stand ring — stand hours (count). */
  readonly appleStandHours: number
  /** Stand ring goal (count). */
  readonly appleStandHoursGoal: number
  /** Move-time variant (move-minutes mode) — minutes; 0 when the user's move ring tracks energy. */
  readonly appleMoveTime: number
  /** Move-time goal (minutes); 0 when unused. */
  readonly appleMoveTimeGoal: number
}
