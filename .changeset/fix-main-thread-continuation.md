---
"@kingstinct/react-native-healthkit": patch
---

Fix SIGSEGV crash caused by HealthKit callbacks resuming Swift continuations on background threads. All HealthKit completion handlers now dispatch `continuation.resume(...)` to the main thread via `DispatchQueue.main.async`, preventing JSI/Hermes thread-safety violations when used with Nitro Modules.
