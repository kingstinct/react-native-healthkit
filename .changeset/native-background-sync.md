---
"@kingstinct/react-native-healthkit": minor
---

Add `configureBackgroundSync` — native-first HealthKit background sync.

Runs entirely in native Swift (no JS bridge required) when an observer query fires after app termination. Queries HealthKit for today's data and POSTs to a configured HTTP endpoint. Uses `HKStatisticsCollectionQuery` with cumulativeSum for cumulative types (steps, distance, etc.) so iPhone + Watch overlaps are correctly deduplicated. Discrete types use `HKSampleQuery`.

**Design:**
- Library is generic — consumers provide the type/unit translation via `SyncTypeConfig` and the full HTTP endpoint config (url, method, headers). No assumptions about backend shape, auth scheme, or provider conventions.
- Body sent is `{ records: [...] }`. Each record has `type`, `value`, `unit`, `startTime`, `endTime`, `recordId` (HK UUID for discrete / `"{type}-{YYYY-MM-DD}"` for cumulative aggregates), `frequency` (`"realtime"` or `"daily"`).
- Hard 20-second sync budget (iOS allows ~30s total background execution).
- No retries — if the HTTP POST fails, the event is dropped and iOS will fire observers again on the next HealthKit change.
- Content-Type defaults to `application/json` if not provided in `headers`.
- Setup-time validation: URL well-formedness, HTTP method (POST/PUT/PATCH), non-empty typeConfigs, encodability to UserDefaults. All throw at `configureBackgroundSync()` time rather than failing silently on every wake.

**New native file:** `ios/NativeSyncEngine.swift` — part of the existing `ReactNativeHealthkitBackground` companion pod; no NitroModules/C++ dependencies.

**New TypeScript APIs:**
- `configureBackgroundSync(endpoint, typeConfigs, updateFrequency): Promise<boolean>`
- `clearBackgroundSync(): Promise<boolean>`
- `BackgroundSyncEndpoint` / `SyncTypeConfig` types (in `types/Background`)
