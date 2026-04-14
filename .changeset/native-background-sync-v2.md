---
"@kingstinct/react-native-healthkit": major
---

**Native background sync v2** — four sample kinds, configurable lookback, deterministic dispatch.

This is a major-version bump to the background sync API introduced in the previous minor release. Breaking changes to `SyncTypeConfig`, `BackgroundSyncEndpoint`, and the `BackgroundDeliveryManager` → `NativeSyncEngine` dispatch contract.

### What's new

- **Four sample kinds** instead of the previous `cumulative: boolean`. `SyncTypeConfig.kind` now takes a string value of `'cumulativeQuantity' | 'discreteQuantity' | 'categorySample' | 'workout'`. The native engine dispatches per-kind query strategy:
  - `cumulativeQuantity` — `HKStatisticsCollectionQuery` with `.cumulativeSum` (steps, distance, calories, exercise minutes, flights)
  - `discreteQuantity` — `HKSampleQuery` for per-sample records (heart rate, HRV, weight, blood pressure, SpO2, body temperature)
  - `categorySample` — `HKSampleQuery` on `HKCategoryType`, with explicit value mapping for sleep stages (`in_bed`, `awake`, `asleep_core`, `asleep_deep`, `asleep_rem`, `asleep_unspecified`; iOS 15 legacy `asleep` preserved; unknown raw values emitted as `unknown:<N>` rather than silently dropped)
  - `workout` — `HKSampleQuery` on `HKWorkoutType`, emits activity type, duration, distance, energy, and (on iOS 17+) average + max heart rate via `workout.statistics(for:)`. Falls back to deprecated totals on iOS 15–16.

- **Configurable lookback** via `BackgroundSyncEndpoint.lookbackDays` (default `1` — today only, minimum-surprise for new consumers). Consumers that need Watch→iPhone eventual-consistency catch-up, offline-day recovery, or late-arriving correction picks can opt into higher values (e.g., `3`).

- **Deterministic dispatch** — the `BackgroundDeliveryManager` no longer gates native sync on "JS bridge absent". Every observer wake runs the native engine, which batches all registered types of the triggered kind in a single HTTP POST. When the JS bridge is also alive (foreground), the `subscribeToObserverQuery` callback still fires in parallel so consumers can reactively refresh UI; any duplicate pushes should be handled by the consumer's backend (e.g., dedup by `recordId`).

- **Swift concurrency** — internal rewrite uses `withThrowingTaskGroup` + `async let` to parallelize per-kind queries under a single 20-second deadline via `Task.sleep` + `Task.cancel`. `completionHandler()` is guaranteed to fire within the budget even on partial failure, avoiding iOS exponential backoff.

### Migration

```ts
// Before (v0.1)
const configs: SyncTypeConfig[] = [
  { identifier: '...', type: 'steps', unit: 'count', cumulative: true },
  { identifier: '...', type: 'heart_rate', unit: 'count/min', cumulative: false },
];
await configureBackgroundSync({ url, method, headers }, configs, frequency);

// After (v0.2)
const configs: SyncTypeConfig[] = [
  { identifier: '...', type: 'steps', unit: 'count', kind: 'cumulativeQuantity' },
  { identifier: '...', type: 'heart_rate', unit: 'count/min', kind: 'discreteQuantity' },
  { identifier: 'HKCategoryTypeIdentifierSleepAnalysis', type: 'sleep', unit: '', kind: 'categorySample' },
  { identifier: 'HKWorkoutTypeIdentifier', type: 'workout', unit: '', kind: 'workout' },
];
await configureBackgroundSync(
  { url, method, headers, lookbackDays: 1 },  // lookbackDays optional, default 1
  configs,
  frequency,
);
```

### Internal notes for contributors

- `NativeSyncEngine.swift` now exposes `syncKind(_:completion:)` as the primary entry point; the old `syncType(_:completion:)` is preserved as a back-compat wrapper.
- `BackgroundDeliveryManager.configure` now takes `registrations: [Registration]` (identifier + kind pairs) instead of `typeIdentifiers: [String]`. Persisted format changes from a string array to JSON-encoded registrations.
- Record shape gains optional fields per kind: `category` (categorySample), `workoutType`/`duration`/`distance`/`calories`/`averageHeartRate`/`maxHeartRate` (workout).
