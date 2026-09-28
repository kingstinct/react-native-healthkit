# Writing and deleting

Writing requires the type in `toShare` of `requestAuthorization`. Only writeable identifiers type-check. Apple-computed types, such as `AppleExerciseTime`, `WalkingHeartRateAverage` and `AppleStandHour`, are read-only.

Check write permission with `authorizationStatusFor(id) === AuthorizationStatus.sharingAuthorized` before offering "Save to Health" UI.

## Quantity samples

```ts
import { saveQuantitySample } from '@kingstinct/react-native-healthkit'

const saved = await saveQuantitySample(
  'HKQuantityTypeIdentifierBodyMass',
  'kg',          // unit, typed per identifier
  72.4,          // value
  new Date(),    // start
  new Date(),    // end (same as start for point-in-time measurements)
  {              // metadata (optional)
    HKWasUserEntered: true,
    HKExternalUUID: 'my-db-row-123',
  },
)
saved?.uuid // keep this if you may need to delete the sample later
```

- Interval types (steps, energy, distance) need a real `start` < `end` that covers the period the value was measured over.
- Percent types take fractions: 17.5% body fat is `0.175` with unit `'%'`.

## Category samples

```ts
import { saveCategorySample, CategoryValueSleepAnalysis, CategoryValueNotApplicable } from '@kingstinct/react-native-healthkit'

await saveCategorySample('HKCategoryTypeIdentifierSleepAnalysis', CategoryValueSleepAnalysis.asleepCore, bedStart, bedEnd)
await saveCategorySample('HKCategoryTypeIdentifierMindfulSession', CategoryValueNotApplicable.notApplicable, start, end)
```

The `value` type is narrowed per identifier (`CategoryValueForIdentifier<T>`), so the compiler tells you which enum to use.

## Correlations (blood pressure, food)

```ts
import { saveCorrelationSample } from '@kingstinct/react-native-healthkit'

const now = new Date()
await saveCorrelationSample(
  'HKCorrelationTypeIdentifierBloodPressure',
  [
    { quantityType: 'HKQuantityTypeIdentifierBloodPressureSystolic', quantity: 120, unit: 'mmHg', startDate: now, endDate: now },
    { quantityType: 'HKQuantityTypeIdentifierBloodPressureDiastolic', quantity: 80, unit: 'mmHg', startDate: now, endDate: now },
  ],
  now,
  now,
)
```

- Authorize the **member** quantity types (systolic and diastolic), not the correlation type. HealthKit does not allow requesting correlation types directly.
- Quantity items use `startDate`/`endDate`. Category items in a correlation use `start`/`end` plus `categoryType`, `value` and `metadata`.
- Read them back with `queryCorrelationSamples('HKCorrelationTypeIdentifierBloodPressure', { limit: 10 })`. Each result has `.objects`.

## Workouts and state of mind

Both are covered in [workouts-and-other-types.md](workouts-and-other-types.md).

## Metadata

- Metadata is a plain object, typed per identifier, and can also hold your own custom keys.
- Built-in keys use the **serialized** HealthKit string, which differs from Apple's Swift constant name: write `HKExternalUUID`, not `HKMetadataKeyExternalUUID`. Drop the `MetadataKey` part.
- Enum-valued keys have exported enums, e.g. `HKInsulinDeliveryReason: InsulinDeliveryReason.basal`.
- Values can be `string | number | boolean | Date`, or a `Quantity` (`{ unit, quantity }`) for quantity-valued keys.
- **Avoid duplicates when re-syncing** from your own backend: set `HKSyncIdentifier` (your stable id) together with `HKSyncVersion` (an increasing number). HealthKit then replaces the older version instead of inserting a duplicate.

## Deleting

```ts
import { deleteObjects } from '@kingstinct/react-native-healthkit'

const deletedCount = await deleteObjects('HKQuantityTypeIdentifierBodyMass', { uuid: saved.uuid })
await deleteObjects('HKQuantityTypeIdentifierBodyMass', { date: { startDate: from, endDate: to } })
```

- `deleteObjects(identifier, filter)` takes the same `FilterForSamples` as queries and resolves to the number of deleted objects. It replaced every older delete method.
- An app can only delete samples **it saved itself**. Samples from other apps or devices are silently skipped.

## Apple references

- [Saving data to HealthKit](https://developer.apple.com/documentation/healthkit/saving-data-to-healthkit.md)
- [Metadata keys](https://developer.apple.com/documentation/healthkit/metadata-keys.md)
- [HKCorrelation](https://developer.apple.com/documentation/healthkit/hkcorrelation.md)
- [deleteObjects(of:predicate:withCompletion:)](https://developer.apple.com/documentation/healthkit/hkhealthstore/deleteobjects(of:predicate:withcompletion:).md)
