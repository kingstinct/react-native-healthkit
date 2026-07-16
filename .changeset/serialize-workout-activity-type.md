---
'@kingstinct/react-native-healthkit': minor
---

Serialize each workout sub-activity's `activityType` (the raw `HKWorkoutActivityType` from its `workoutConfiguration`) on `WorkoutActivity`, alongside `startDate`/`endDate`/`uuid`/`duration`. This lets consumers type the legs of multisport (`.swimBikeRun`) workouts — e.g. splitting a triathlon into its swim/bike/run legs — which the bridge previously didn't carry.
