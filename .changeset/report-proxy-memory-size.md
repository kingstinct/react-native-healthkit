---
"@kingstinct/react-native-healthkit": patch
---

Report an estimated native memory size for `WorkoutProxy` and `SourceProxy` HybridObjects so the JS garbage collector accounts for the `HKWorkout`/`HKSource` memory they keep alive, propagate errors from workout route location queries instead of crashing via `try!`, and document `dispose()` and other memory considerations for large datasets.
