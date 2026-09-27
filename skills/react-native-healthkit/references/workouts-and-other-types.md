# Workouts and other sample types

## Workouts

Authorize `'HKWorkoutTypeIdentifier'`. For routes also authorize `'HKWorkoutRouteTypeIdentifier'`. For per-workout statistics, authorize the quantity types you read (heart rate, energy, distance...).

```ts
import { queryWorkoutSamples, WorkoutActivityType, ComparisonPredicateOperator } from '@kingstinct/react-native-healthkit'

const runs = await queryWorkoutSamples({
  limit: 20,
  filter: {
    workoutActivityType: WorkoutActivityType.running,
    duration: { predicateOperator: ComparisonPredicateOperator.greaterThan, durationInSeconds: 600 },
    date: { startDate: monthAgo },
  },
})

for (const run of runs) {
  run.workoutActivityType   // WorkoutActivityType.running
  run.duration              // { quantity, unit: 's' }
  run.totalDistance         // { quantity, unit } | undefined
  run.totalEnergyBurned
  run.activities            // multi-sport segments
  run.events                // pauses, laps, segments
  run.metadata              // HKIndoorWorkout, HKAverageMETs, HKElevationAscended, ...

  const hr = await run.getStatistic('HKQuantityTypeIdentifierHeartRate', 'count/min') // avg/min/max
  const all = await run.getAllStatistics()   // Record<identifier, QueryStatisticsResponse>
  const routes = await run.getWorkoutRoutes() // [{ locations: [{ latitude, longitude, altitude, speed, course, date, ... }] }]
  const plan = await run.getWorkoutPlan()     // WorkoutKit plan { id, activityType } | undefined
}
```

- Samples recorded during a workout: `queryQuantitySamples('HKQuantityTypeIdentifierHeartRate', { limit: 0, filter: { workout: run } })`.
- Workout filters take `workoutActivityType` and `duration` in addition to `date`, `uuid(s)`, `metadata` and `sources`, plus one level of `AND` / `OR` / `NOT`.
- Other workout queries: `queryWorkoutSamplesWithAnchor({ limit, anchor })` returns `{ workouts, deletedSamples, newAnchor }`; `getMostRecentWorkout()`; `useMostRecentWorkout()`.

### Proxies: memory and state

Workouts (and `SourceProxy`) are **Nitro hybrid objects** that keep the native `HKWorkout` alive so methods like `getWorkoutRoutes()` work.

- Put plain data in React state, storage or network payloads: `const plain = run.toJSON()`. Proxies don't serialize well and hold native memory.
- When iterating many workouts, call `run.dispose()` after you're done. Any use after `dispose()` throws.
- Chunk big history loads by date range or anchor instead of `limit: 0` across years.

### Saving a workout

```ts
import { saveWorkoutSample, WorkoutActivityType } from '@kingstinct/react-native-healthkit'

const workout = await saveWorkoutSample(
  WorkoutActivityType.running,
  [ // quantity samples to associate with the workout
    { quantityType: 'HKQuantityTypeIdentifierActiveEnergyBurned', quantity: 320, unit: 'kcal', startDate: start, endDate: end },
    { quantityType: 'HKQuantityTypeIdentifierDistanceWalkingRunning', quantity: 5012, unit: 'm', startDate: start, endDate: end },
  ],
  start,
  end,
  { distance: 5012, energyBurned: 320 }, // totals: always meters and kcal
  { HKIndoorWorkout: false },
)
await workout.saveWorkoutRoute(locations) // LocationForSaving[]: latitude, longitude, altitude, speed, course, horizontalAccuracy, verticalAccuracy, date
```

- Request `toShare` for the workout type, every associated quantity type, and `HKWorkoutRouteTypeIdentifier` if you save a route.
- There is **no live `HKWorkoutSession` / `HKWorkoutBuilder` API** (those are watchOS-centric). `startWatchApp({ activityType, locationType })` launches your companion watchOS app to start a session there.

## State of mind (iOS 18+)

```ts
import { saveStateOfMindSample, queryStateOfMindSamples, StateOfMindKind, StateOfMindLabel, StateOfMindAssociation } from '@kingstinct/react-native-healthkit'

await saveStateOfMindSample(new Date(), StateOfMindKind.momentaryEmotion, 0.6 /* valence -1..1 */, [StateOfMindLabel.happy], [StateOfMindAssociation.work])
const moods = await queryStateOfMindSamples({ limit: 50 })
```

The identifier is `'HKStateOfMindTypeIdentifier'` (exported as `StateOfMindTypeIdentifier`).

## Medications (iOS 26+)

- Authorization is per object: `await requestPerObjectReadAuthorization('HKUserAnnotatedMedicationTypeIdentifier')`.
- `queryMedications()` returns the user's medication list.
- `queryMedicationEvents({ limit })` / `queryMedicationEventsWithAnchor(...)` return dose events.

## ECG and heartbeat series

- `queryElectrocardiogramSamples({ limit, includeVoltages?: false })`. Voltages are large, so fetch them only when you need the waveform. In `queryElectrocardiogramSamplesWithAnchor`, `includeVoltages` is required. The identifier is `'HKElectrocardiogramType'`.
- `queryHeartbeatSeriesSamples({ limit })` returns `heartbeats: { timeSinceSeriesStart, precededByGap }[]` (beat-to-beat intervals, used for HRV). The identifier is `'HKDataTypeIdentifierHeartbeatSeries'`.

## Characteristics

These are synchronous, read-only and not observable. Each also has an `...Async` variant:
- `getBiologicalSex()`
- `getBloodType()`
- `getDateOfBirth()` (`Date | undefined`)
- `getFitzpatrickSkinType()`
- `getWheelchairUse()`

Request the matching `HKCharacteristicTypeIdentifier...` in `toRead`.

## Apple references

- [HKWorkout](https://developer.apple.com/documentation/healthkit/hkworkout.md)
- [HKWorkoutActivityType](https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype.md)
- [HKWorkoutRoute](https://developer.apple.com/documentation/healthkit/hkworkoutroute.md)
- [Workout metadata keys](https://developer.apple.com/documentation/healthkit/workout-metadata-keys.md)
- [HKStateOfMind](https://developer.apple.com/documentation/healthkit/hkstateofmind.md)
- [HKUserAnnotatedMedication](https://developer.apple.com/documentation/healthkit/hkuserannotatedmedication.md)
- [HKElectrocardiogram](https://developer.apple.com/documentation/healthkit/hkelectrocardiogram.md)
- [HKHeartbeatSeriesSample](https://developer.apple.com/documentation/healthkit/hkheartbeatseriessample.md)
