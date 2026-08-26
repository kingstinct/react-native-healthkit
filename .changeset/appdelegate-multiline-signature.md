---
"@kingstinct/react-native-healthkit": patch
---

fix: insert `setupBackgroundObservers()` into multi-line `didFinishLaunchingWithOptions` signatures

The config plugin matched the AppDelegate entry point with `/(func application\(.+didFinishLaunchingWithOptions.+\{)\n/`. `.` does not match newlines, so on Expo SDK 54+ — whose AppDelegate template spreads that signature across four lines — the match failed and `String.replace` returned the contents unchanged. The `import HealthKit` insert immediately above it still succeeded and the entitlement and Info.plist plugins still applied, so the build succeeded and the AppDelegate looked modified, while `BackgroundDeliveryManager.shared.setupBackgroundObservers()` was never added. Background delivery then only worked for observers registered by `subscribeToChanges` at runtime, and silently stopped surviving app termination.

Match with `[^{]*` instead, which spans newlines and also refuses to cross a `{`, so it cannot run out of an earlier `application(...)` overload into this one. Also warn when the insert finds no match, rather than failing silently.
