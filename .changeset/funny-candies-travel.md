---
"@kingstinct/react-native-healthkit": minor
"@react-native-healthkit/core": minor
---

Add `createWorkoutBuilder`, wrapping `HKWorkoutBuilder`, to save workouts with events (such as pause and resume) and activities. Core adds `createWorkoutEventSafe`, which creates an `HKWorkoutEvent` from Objective-C so an invalid event rejects instead of crashing.
  