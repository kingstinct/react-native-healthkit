# Reading Apple's HealthKit docs as Markdown

The library maps HealthKit almost 1:1, so Apple's docs describe behaviour (units, aggregation, authorization quirks, iOS availability) better than any wrapper doc. developer.apple.com pages are JavaScript-rendered and fetch poorly. **Append `.md` to any `developer.apple.com/documentation/...` URL to get clean Markdown.**

```
https://developer.apple.com/documentation/healthkit/hkhealthstore      → HTML app shell
https://developer.apple.com/documentation/healthkit/hkhealthstore.md   → Markdown
```

- Paths are case-insensitive: `/documentation/HealthKit/HKHealthStore.md` works too.
- Symbols with arguments keep their Swift selector in the path: `.../hkhealthstore/enablebackgrounddelivery(for:frequency:withcompletion:).md`.
- The Markdown starts with an HTML comment holding JSON metadata. Its `availability` field (e.g. `"iOS: 27.0.0 -"`) is the quickest way to learn which iOS version a type needs.
- Links inside the Markdown are site-relative (`/documentation/HealthKit/...`). Prefix them with `https://developer.apple.com` and append `.md` to follow them.
- `/tutorials` and `/design` pages use `https://developer.apple.com/tutorials/data/<path>.md`.
- Older numeric-ID URLs (e.g. `.../hkhealthstore/1614152-requestauthorization`), which appear in some of the library's JSDoc, redirect to the modern path in a browser. For Markdown, use the modern path.

## Mapping library names to Apple symbols

| Library | Apple |
| --- | --- |
| `'HKQuantityTypeIdentifierStepCount'` | [`HKQuantityTypeIdentifier.stepCount`](https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/stepcount.md) |
| `'HKCategoryTypeIdentifierSleepAnalysis'`, `CategoryValueSleepAnalysis` | [`HKCategoryTypeIdentifier.sleepAnalysis`](https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier/sleepanalysis.md), [`HKCategoryValueSleepAnalysis`](https://developer.apple.com/documentation/healthkit/hkcategoryvaluesleepanalysis.md) |
| `WorkoutActivityType.running` | [`HKWorkoutActivityType.running`](https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype/running.md) |
| `queryStatisticsForQuantity` | [`HKStatisticsQuery`](https://developer.apple.com/documentation/healthkit/hkstatisticsquery.md) |
| `queryStatisticsCollectionForQuantity` | [`HKStatisticsCollectionQuery`](https://developer.apple.com/documentation/healthkit/hkstatisticscollectionquery.md) |
| `query*WithAnchor` | [`HKAnchoredObjectQuery`](https://developer.apple.com/documentation/healthkit/hkanchoredobjectquery.md) |
| `subscribeToChanges` | [`HKObserverQuery`](https://developer.apple.com/documentation/healthkit/hkobserverquery.md) |
| metadata `HKExternalUUID` | [`HKMetadataKeyExternalUUID`](https://developer.apple.com/documentation/healthkit/hkmetadatakeyexternaluuid.md) (the serialized value drops `MetadataKey`) |

To find an identifier's page, drop the `HK...TypeIdentifier` prefix and lowercase the first letter: `HKQuantityTypeIdentifierHeartRateVariabilitySDNN` → `hkquantitytypeidentifier/heartratevariabilitysdnn.md`.

## Index of useful pages

- Overview: [HealthKit](https://developer.apple.com/documentation/healthkit.md), [Setting up HealthKit](https://developer.apple.com/documentation/healthkit/setting-up-healthkit.md), [Data types](https://developer.apple.com/documentation/healthkit/data-types.md)
- Privacy: [Authorizing access to health data](https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data.md), [Protecting user privacy](https://developer.apple.com/documentation/healthkit/protecting-user-privacy.md)
- Store: [HKHealthStore](https://developer.apple.com/documentation/healthkit/hkhealthstore.md)
- Reading: [Reading data from HealthKit](https://developer.apple.com/documentation/healthkit/reading-data-from-healthkit.md), [Queries](https://developer.apple.com/documentation/healthkit/queries.md)
- Writing: [Saving data to HealthKit](https://developer.apple.com/documentation/healthkit/saving-data-to-healthkit.md), [Metadata keys](https://developer.apple.com/documentation/healthkit/metadata-keys.md)
- Units: [HKUnit](https://developer.apple.com/documentation/healthkit/hkunit.md)
- Identifiers: [HKQuantityTypeIdentifier](https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier.md), [HKCategoryTypeIdentifier](https://developer.apple.com/documentation/healthkit/hkcategorytypeidentifier.md)
- Background: [HKUpdateFrequency](https://developer.apple.com/documentation/healthkit/hkupdatefrequency.md), [background-delivery entitlement](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit.background-delivery.md)
- Workouts: [HKWorkout](https://developer.apple.com/documentation/healthkit/hkworkout.md), [HKWorkoutRoute](https://developer.apple.com/documentation/healthkit/hkworkoutroute.md)
- Health Records: [Accessing Health Records](https://developer.apple.com/documentation/healthkit/accessing-health-records.md)

## Where the library deliberately differs from Apple

- **Names:** Apple's enums become string literals, and exported TS type names drop `HK` (`QuantityTypeIdentifier`).
- **Metadata keys** use serialized values, not constant names (`HKExternalUUID`).
- **Units** are HKUnit unit strings (`'count/min'`) rather than `HKUnit` objects.
- **Predicates** are replaced by the `filter` object (`date`, `uuid(s)`, `metadata`, `workout`, `sources`, `AND` / `OR` / `NOT`).
- **Query results:** workouts come back as proxy objects with methods, instead of `HKWorkout` plus separate queries.
