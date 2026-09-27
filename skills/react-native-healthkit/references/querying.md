# Querying

Every query needs read authorization for the type first (see [authorization.md](authorization.md)).

## Choosing the right query

| Need | Use | Underlying HealthKit query |
| --- | --- | --- |
| Totals, averages, min/max over a range | `queryStatisticsForQuantity` | `HKStatisticsQuery` |
| Per-day, per-hour or per-week buckets for charts | `queryStatisticsCollectionForQuantity` | `HKStatisticsCollectionQuery` |
| The same, broken down per source (Watch vs iPhone vs app) | `...SeparateBySource` variants | same, with `.separateBySource` |
| Individual samples | `queryQuantitySamples`, `queryCategorySamples`, `queryWorkoutSamples`, ... | `HKSampleQuery` |
| Incremental sync to a backend, including deletions | `...WithAnchor` variants | `HKAnchoredObjectQuery` |
| The single latest value | `getMostRecentQuantitySample` / `getMostRecentCategorySample` / `getMostRecentWorkout` | `HKSampleQuery` with limit 1 |

**Do not sum raw samples** for cumulative types like steps, distance or energy. Several devices record the same activity, and statistics queries de-duplicate them by source priority exactly like the Health app. Raw sums over-count.

## Sample queries

```ts
import { queryQuantitySamples, queryCategorySamples, CategoryValueSleepAnalysis } from '@kingstinct/react-native-healthkit'

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

const heartRates = await queryQuantitySamples('HKQuantityTypeIdentifierHeartRate', {
  limit: 0,            // required; 0 or negative = no limit
  ascending: true,     // default false = newest first (sorted by startDate)
  unit: 'count/min',   // optional; typed per identifier; defaults to the user's preferred unit
  filter: { date: { startDate: yesterday, endDate: new Date() } },
})
// heartRates[0]: { uuid, quantity, unit, startDate: Date, endDate: Date, quantityType,
//                  sourceRevision: { source: { name, bundleIdentifier }, version, productType, ... },
//                  device?, metadata, ... }

const sleep = await queryCategorySamples('HKCategoryTypeIdentifierSleepAnalysis', {
  limit: 0,
  filter: { date: { startDate: yesterday } },
})
const deepSleep = sleep.filter((s) => s.value === CategoryValueSleepAnalysis.asleepDeep)
```

Category `value`s are typed enums generated from the SDK, e.g. `CategoryValueSleepAnalysis`, `CategoryValueAppetiteChanges` or `CategoryValueSeverity`. Categories without values (e.g. `MindfulSession`) use `CategoryValueNotApplicable`.

## Filters (`FilterForSamples`)

```ts
filter: {
  date: { startDate?: Date, endDate?: Date, strictStartDate?: boolean, strictEndDate?: boolean },
  uuid: 'ABC-...',                  // or uuids: [...]
  metadata: { withMetadataKey: 'HKWasUserEntered', operatorType: ComparisonPredicateOperator.equalTo, value: true },
  workout: workoutProxy,            // samples associated with a workout
  sources: [sourceProxy],           // from querySources()
  AND: [...], OR: [...], NOT: [...] // one level of nesting, each item a base filter
}
```

- By default, the date filter matches samples that *overlap* the range. Set `strictStartDate` / `strictEndDate` to require samples to be fully inside it.
- To filter by source, get a `SourceProxy` from `querySources(identifier)` and match on `bundleIdentifier`:
  ```ts
  const sources = await querySources('HKQuantityTypeIdentifierStepCount')
  const watch = sources.filter((s) => s.bundleIdentifier.startsWith('com.apple.health'))
  ```
  `currentAppSource()` returns your own app's source.
- To exclude user-entered values: `NOT: [{ metadata: { withMetadataKey: 'HKWasUserEntered', operatorType: ComparisonPredicateOperator.equalTo, value: true } }]`.

## Statistics

```ts
import { queryStatisticsForQuantity, queryStatisticsCollectionForQuantity } from '@kingstinct/react-native-healthkit'

// One aggregate over a range
const today = await queryStatisticsForQuantity(
  'HKQuantityTypeIdentifierActiveEnergyBurned',
  ['cumulativeSum'],
  { filter: { date: { startDate: startOfDay, endDate: new Date() } }, unit: 'kcal' },
)
today.sumQuantity // { quantity: 412.3, unit: 'kcal' } | undefined

// Daily buckets for the last 7 days
const anchor = new Date(); anchor.setHours(0, 0, 0, 0)
const weekAgo = new Date(anchor.getTime() - 6 * 86_400_000)
const perDay = await queryStatisticsCollectionForQuantity(
  'HKQuantityTypeIdentifierStepCount',
  ['cumulativeSum'],
  anchor,          // anchorDate: aligns bucket boundaries (use local midnight for days)
  { day: 1 },      // intervalComponents: { minute?, hour?, day?, month?, year? }
  { filter: { date: { startDate: weekAgo, endDate: new Date() } } },
)
perDay.map((b) => ({ date: b.startDate, steps: b.sumQuantity?.quantity ?? 0 }))
```

- Statistics options are `'cumulativeSum' | 'discreteAverage' | 'discreteMin' | 'discreteMax' | 'mostRecent' | 'duration'`. Each identifier's aggregation style (cumulative or discrete) is in `src/generated/healthkit-schema.json` and in Apple's identifier docs.
- The response is `{ sumQuantity?, averageQuantity?, minimumQuantity?, maximumQuantity?, mostRecentQuantity?, mostRecentQuantityDateInterval?, duration?, startDate?, endDate?, sources }`.
- **Buckets with no data are omitted** from the collection result (it maps `HKStatisticsCollection.statistics()`). If a chart needs a continuous axis, fill the missing days yourself, keyed by `startDate`.
- Invalid options fail the query. Cumulative types (steps, energy, distance) take `cumulativeSum` and `duration`. Discrete types (heart rate, body mass) take `discreteAverage`, `discreteMin`, `discreteMax` and `mostRecent`.

## Anchored queries (sync)

```ts
let anchor: string | undefined = await storage.get('steps-anchor') // undefined on first sync

const { samples, deletedSamples, newAnchor } = await queryQuantitySamplesWithAnchor(
  'HKQuantityTypeIdentifierStepCount',
  { limit: 0, anchor },
)
await backend.upsert(samples)
await backend.delete(deletedSamples.map((d) => d.uuid))
await storage.set('steps-anchor', newAnchor) // only after the sync succeeded
```

- Anchored queries return changes in insertion order and don't support `ascending`.
- Page through a large backlog by passing a `limit` and looping until `samples` is empty.
- A malformed anchor throws. Catch it, clear the stored anchor and do a full resync.
- Available for: quantity, category, workout (`{ workouts, deletedSamples, newAnchor }`), correlation, state of mind, ECG, heartbeat series and medication events.

## Most recent + hooks

```ts
const latest = await getMostRecentQuantitySample('HKQuantityTypeIdentifierBodyMass', 'kg') // or undefined
```

| Hook | Returns |
| --- | --- |
| `useMostRecentQuantitySample(id, unit?)` | latest sample or `undefined`; refreshes on HealthKit changes |
| `useMostRecentCategorySample(id)` | same for category types |
| `useMostRecentWorkout()` | latest `WorkoutProxy` or `undefined` |
| `useStatisticsForQuantity(id, statistics, from, to?, unit?)` | `QueryStatisticsResponse \| null`; refetches on changes |
| `useSources(id)` | `SourceProxy[] \| null` |

The hooks set up an observer query, so they need authorization to have been requested **before** they mount.

## Units

- Units are HKUnit strings and are typed per identifier (`UnitForIdentifier<'HKQuantityTypeIdentifierBodyMass'>` → mass units).
- `getPreferredUnits(ids)` / `getPreferredUnit(id)` return the units the user picked in the Health app.
- `isQuantityCompatibleWithUnit(id, unit)` validates a unit string at runtime.
- Common units: `count`, `count/min`, `kcal`, `kJ`, `m`, `km`, `mi`, `kg`, `lb`, `%`, `mg/dL`, `mmol<180.15588000005408>/L` (glucose in mmol/L), `ms`, `degC`, `mmHg`, `L/min`, `dBASPL`, `hr`, `min`, `s`.
- **Percent values are fractions.** HealthKit's `%` unit is 0–1, so body fat of 17.5% is `quantity: 0.175`. Multiply by 100 for display. Save it the same way.

## Memory and performance

- Prefer statistics and date-bounded queries. Avoid `limit: 0` over years of heart-rate data.
- For big backfills, chunk by month or page with anchors.
- Keep plain objects in React state. Workouts and sources are proxies (see [workouts-and-other-types.md](workouts-and-other-types.md)).

## Apple references

- [Reading data from HealthKit](https://developer.apple.com/documentation/healthkit/reading-data-from-healthkit.md)
- [Queries](https://developer.apple.com/documentation/healthkit/queries.md)
- [HKStatisticsQuery](https://developer.apple.com/documentation/healthkit/hkstatisticsquery.md)
- [HKStatisticsCollectionQuery](https://developer.apple.com/documentation/healthkit/hkstatisticscollectionquery.md)
- [HKAnchoredObjectQuery](https://developer.apple.com/documentation/healthkit/hkanchoredobjectquery.md)
- [HKQuantityTypeIdentifier](https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier.md)
- [HKCategoryTypeIdentifier](https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier.md)
- [HKUnit](https://developer.apple.com/documentation/healthkit/hkunit.md)
- [HKSourceRevision](https://developer.apple.com/documentation/healthkit/hksourcerevision.md)
