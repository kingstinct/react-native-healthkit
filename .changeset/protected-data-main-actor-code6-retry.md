---
"@kingstinct/react-native-healthkit": patch
---

iOS: read `isProtectedDataAvailable` on the main actor in `isProtectedDataAvailableAsync` (`UIApplication` is `@MainActor`-isolated), and retry a statistics query once when HealthKit refuses with `errorDatabaseInaccessible` while protected data is available — the store re-opens a moment after the device unlocks, and a query issued in that window was surfacing as an opaque `Code=6` string.
