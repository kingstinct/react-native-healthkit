# @kingstinct/react-native-healthkit

[![Test Status](https://github.com/Kingstinct/react-native-healthkit/actions/workflows/test.yml/badge.svg)](https://github.com/Kingstinct/react-native-healthkit/actions/workflows/test.yml)
[![Latest version on NPM](https://img.shields.io/npm/v/@kingstinct/react-native-healthkit)](https://www.npmjs.com/package/@kingstinct/react-native-healthkit)
[![Downloads on NPM](https://img.shields.io/npm/dt/@kingstinct/react-native-healthkit)](https://www.npmjs.com/package/@kingstinct/react-native-healthkit)
[![Discord](https://dcbadge.limes.pink/api/server/hrgnETpsJA?style=flat)](https://discord.gg/hrgnETpsJA)


React Native bindings for HealthKit with full TypeScript and Promise support covering about any kind of data. Keeping TypeScript mappings as close as possible to HealthKit - both in regards to naming and serialization. This will make it easier to keep this library up-to-date with HealthKit as well as browsing [the official documentation](https://developer.apple.com/documentation/healthkit) (and if something - metadata properties for example - is not typed it will still be accessible).

| Data Types                  | Query | Save  | Subscribe | Examples                               |
| ----------------------------|:------|:------|:----------|:---------------------------------------|
| 100+ Quantity Types         | ✅    | ✅    | ✅       | Steps, energy burnt, blood glucose etc.. |
| 63 Category Types           | ✅    | ✅    | ✅       | Sleep analysis, mindful sessions etc.. |
| 75+ Workout Activity Types  | ✅    | ✅    | ✅       | Swimming, running, table tennis etc..  |
| Correlation Types           | ✅    | ✅    | ✅       | Food and blood pressure                |
| Document Types              | ✅    | ❌    | ✅       | [CDA documents](https://developer.apple.com/documentation/healthkit/hkcdadocument) exposed as Base64 data  |
| Clinical Records            | ⚠️    | ❌    | ⚠️       | Lab results etc in [FHIR JSON format](https://www.hl7.org/fhir/json.html) (see [Clinical Records](https://github.com/kingstinct/react-native-healthkit#clinical-records))  |

### Disclaimer

This library is provided as-is without any warranty and is not affiliated with Apple in any way. The data might be incomplete or inaccurate.

## Installation

### Expo
Usage with Expo is possible - just keep in mind it will not work in Expo Go and [you'll need to roll your own Dev Client](https://docs.expo.dev/development/getting-started/). 

1. `yarn add @kingstinct/react-native-healthkit react-native-nitro-modules`
2. Update your app.json with the config plugin:
```json
{
  "expo": {
    "plugins": ["@kingstinct/react-native-healthkit"]
  }
}
```
this will give you defaults that make the app build without any further configuration. If you want, you can override the defaults:
```json
{
  "expo": {
    "plugins": [
      ["@kingstinct/react-native-healthkit", {
        "NSHealthShareUsageDescription": "Your own custom usage description",
        "NSHealthUpdateUsageDescription": "Your own custom usage description",
        "background": true
      }]
    ]
  }
}
```
3. Build a new Dev Client

### Native or Expo Bare Workflow
1. `yarn add @kingstinct/react-native-healthkit react-native-nitro-modules`
2. `npx pod-install`
3. Set `NSHealthUpdateUsageDescription` and `NSHealthShareUsageDescription` in your `Info.plist` 
4. Enable the HealthKit capability for the project in Xcode.
5. Since this package is using Swift you might also need to add a bridging header in your project if you haven't already, you can [find more about that in the official React Native docs](https://reactnative.dev/docs/native-modules-ios#exporting-swift)

## Usage

During runtime check and request permissions with `requestAuthorization`. Failing to request authorization, or requesting a permission you haven't requested yet, will result in the app crashing. This is easy to miss - for example by requesting authorization in the same component where you have a hook trying to fetch data right away.. :)

Some hook examples:
```TypeScript
import { useHealthkitAuthorization, saveQuantitySample } from '@kingstinct/react-native-healthkit';

const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization(['HKQuantityTypeIdentifierBloodGlucose'])

// make sure that you've requested authorization before requesting data, otherwise your app will crash
import { useMostRecentQuantitySample, HKQuantityTypeIdentifier, useMostRecentCategorySample } from '@kingstinct/react-native-healthkit';

const mostRecentBloodGlucoseSample = useMostRecentQuantitySample('HKQuantityTypeIdentifierBloodGlucose')
const lastBodyFatSample = useMostRecentQuantitySample('HKQuantityTypeIdentifierBodyFatPercentage')
const lastMindfulSession = useMostRecentCategorySample('HKCategoryTypeIdentifierMindfulSession')
const lastWorkout = useMostRecentWorkout()
```

Some imperative examples:
```TypeScript
  import { isHealthDataAvailable, requestAuthorization, subscribeToChanges, saveQuantitySample, getMostRecentQuantitySample } from '@kingstinct/react-native-healthkit';

  const isAvailable = await isHealthDataAvailable();

  /* Read latest sample of any data */
  await requestAuthorization({ toRead: ['HKQuantityTypeIdentifierBodyFatPercentage'] }); // request read permission for bodyFatPercentage

  const { quantity, unit, startDate, endDate } = await getMostRecentQuantitySample('HKQuantityTypeIdentifierBodyFatPercentage'); // read latest sample
  
  console.log(quantity) // 17.5
  console.log(unit) // %

  await requestAuthorization({
    toRead: ['HKQuantityTypeIdentifierHeartRate']
  }); // request read permission for heart rate

  /* Subscribe to data (Make sure to request permissions before subscribing to changes) */
  const [hasRequestedAuthorization, setHasRequestedAuthorization] = useState(false);
  
  useEffect(() => {
    requestAuthorization(['HKQuantityTypeIdentifierHeartRate']).then(() => {
      setHasRequestedAuthorization(true);
    });
  }, []);
  
  useEffect(() => {
    if (hasRequestedAuthorization) {
      const unsubscribe = subscribeToChanges('HKQuantityTypeIdentifierHeartRate', () => {
        // refetch data as needed
      });

      return () => unsubscribe();
    }
  }, [hasRequestedAuthorization]);

  /* write data */
  await requestAuthorization({ toShare: ['HKQuantityTypeIdentifierInsulinDelivery'] }); // request write permission for insulin delivery

  saveQuantitySample(
      'HKQuantityTypeIdentifierInsulinDelivery',
      'IU',
      5.5,
      {
        metadata: {
          // Metadata keys could be arbirtary string to store app-specific data.
          // To use built-in types from https://developer.apple.com/documentation/healthkit/samples/metadata_keys
          // you need to specify string values instead of variable names (by dropping MetadataKey from the name).
          HKInsulinDeliveryReason: HKInsulinDeliveryReason.basal,
        },
      }
    );
```

### HealthKit Anchors
In 6.0 you can use HealthKit anchors to get changes and deleted items which is very useful for syncing. This is a breaking change - but a very easy one to handle that TypeScript should help you with. Most queries now return an object containing samples which is what was returned as only an array before. 

```newAnchor``` is a base64-encoded string returned from HealthKit that contain sync information.  After each successful sync, store the anchor for the next time your anchor query is called to only return the values that have changed.

```limit``` will indicate how many records to consider when sycning data, you can set this value to 0 indicate no limit.

Example:

```TypeScript
  const { newAnchor, samples, deletedSamples } = await queryQuantitySamplesWithAnchor('HKQuantityTypeIdentifierStepCount', {
    limit: 2,
  })

  const nextResult = await queryQuantitySamplesWithAnchor('HKQuantityTypeIdentifierStepCount', {
    limit: 2,
    anchor: newAnchor,
  })

  // etc..
```

## Background Delivery & Native Sync

HealthKit can wake your app in the background when new samples arrive, even
after the app has been terminated by the system. This library provides two
complementary APIs for that:

| API                        | Mechanism                     | Best for                                                     |
|----------------------------|-------------------------------|--------------------------------------------------------------|
| `configureBackgroundTypes` | Observer queries, JS callback | Updating app state, caches, notifications when data arrives  |
| `configureBackgroundSync`  | Observer queries, native HTTP | Shipping data to your backend without the JS bridge          |

Pick `configureBackgroundTypes` if you want JS code to run on each wake (JS bridge boots, your listeners fire). Pick `configureBackgroundSync` if you just need to forward data to a server — it runs entirely in native Swift and works even when JS is unavailable (e.g. just after a cold wake from termination).

The two are not mutually exclusive: you can use `configureBackgroundSync` for server forwarding and `subscribeToChanges` (foreground) for UI updates.

### `configureBackgroundTypes` — observer-only

Registers `HKObserverQuery` instances at AppDelegate time (before the JS bridge
boots) and enables background delivery. When samples arrive, events are queued
and flushed to your JS `subscribeToChanges` callback once the bridge connects.

Use this when you want **JS-side logic** to run on each delivery event.

```typescript
import { configureBackgroundTypes, UpdateFrequency } from '@kingstinct/react-native-healthkit'

await configureBackgroundTypes(
  ['HKQuantityTypeIdentifierStepCount', 'HKQuantityTypeIdentifierDistanceWalkingRunning'],
  UpdateFrequency.immediate,
)
```

### `configureBackgroundSync` — native-first sync

For apps that want to send data to a backend **without relying on the JS bridge**
(works even when the app is terminated), this registers observer queries and
runs a fully-native sync engine on each wake. The engine queries HealthKit for
today's data and POSTs to your configured HTTP endpoint.

- Cumulative types (marked `cumulative: true`) use `HKStatisticsCollectionQuery`
  with `.cumulativeSum` — Apple deduplicates across iPhone + Watch and returns
  one correct total per day.
- Discrete types use `HKSampleQuery` — individual samples with their HK UUIDs.
- You define the translation via `type` and `unit` fields so records arrive in
  whatever format your backend expects.

```typescript
import { configureBackgroundSync, UpdateFrequency } from '@kingstinct/react-native-healthkit'

await configureBackgroundSync(
  {
    url: 'https://api.example.com/ingest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <device-token>',
    },
  },
  [
    { identifier: 'HKQuantityTypeIdentifierStepCount', type: 'steps', unit: 'count', cumulative: true },
    { identifier: 'HKQuantityTypeIdentifierHeartRate', type: 'heart_rate', unit: 'count/min', cumulative: false },
  ],
  UpdateFrequency.immediate,
)
```

Body sent to your endpoint is a JSON object with a `records` array:

```json
{
  "records": [
    {
      "type": "steps",
      "value": 8318,
      "unit": "count",
      "startTime": "2026-04-11T22:00:00.000Z",
      "endTime": "2026-04-12T22:00:00.000Z",
      "recordId": "steps-2026-04-12",
      "frequency": "daily"
    }
  ]
}
```

Per-record fields:

| Field      | Description                                                                 |
|------------|-----------------------------------------------------------------------------|
| `type`     | The `type` string you provided in `SyncTypeConfig`                          |
| `value`    | Quantity sample value (in the unit you configured) or category sample rawValue |
| `unit`     | The `unit` string you provided in `SyncTypeConfig` (omitted for category samples) |
| `startTime`/`endTime` | ISO 8601 timestamps                                              |
| `recordId` | HKSample UUID for discrete types; `"{type}-{YYYY-MM-DD}"` for cumulative aggregates (stable for backend deduplication) |
| `frequency`| `"realtime"` for per-sample records, `"daily"` for cumulative daily totals  |
| `workoutActivityType` | HKWorkoutActivityType rawValue (workouts only)                   |
| `duration` | Workout duration in seconds (workouts only)                                 |

Call `clearBackgroundSync()` to stop observers and clear stored credentials.

**Important behaviors:**
- **No retries on failure.** If your endpoint is unreachable, the sync event is dropped. iOS will fire observers again on the next HealthKit change. Ensure your endpoint is highly available; don't rely on this for reconciliation.
- **Today-only window.** Each sync sends only the current day's data. For multi-day backfill, use the foreground API (`queryQuantitySamples`, `queryStatisticsCollectionForQuantity`, etc.) and your own sync loop when the app is open.
- **~15 second budget per sync.** iOS gives the app ~30s of background execution; the engine enforces a 20s hard timeout internally (5s buffer for iOS). If your endpoint takes longer, syncs are terminated. Optimize for low-latency ingestion.

**Requirements:**
- `com.apple.developer.healthkit.background-delivery` entitlement (handled by
  the Expo plugin with `background: true`, which is the default).
- The companion pod `ReactNativeHealthkitBackground` is automatically linked
  via `pod install` — it contains `BackgroundDeliveryManager.swift` and
  `NativeSyncEngine.swift`, and is free of NitroModules/C++ dependencies so
  AppDelegate can safely import it on any React Native version.

**Design notes:**
- User force-quit (swipe up in app switcher) does **not** disable HealthKit
  background delivery — the HealthKit daemon has its own launch registry
  separate from the general iOS scheduler.
- iOS gives ~30 seconds of background execution per wake; the native sync
  engine uses a 20-second hard timeout to stay within budget.
- Native sync only handles today's data — HealthKit + iOS already queue wakes
  for offline/catch-up scenarios, so there's no need for multi-day backfill.

## Migration to 9.0.0

There are a lot of under-the-hood changes in version 9.0.0, some of them are breaking (although I've tried to reduce it as much as possible).
- The library has been migrated to react-native-nitro-modules. This improves performance, type-safety and gets rid of a lot of boilerplate code that made it harder to maintain and add features to the library.
- Naming conventions have changed - most of the HK-prefixed stuff has been removed to avoid conflicts on the native side and also make the library more beautiful to look at. As an example the type previously called HKQuantityTypeIdentifier is now just QuantityTypeIdentifier.
- Fewer required params - for example calling `queryQuantitySamples('HKQuantityTypeIdentifierStepCount')` without arguments will simply return the last 20 samples.
- Flexible filters that map closer to the native constructs. For example this supports filtering by uuid, multiple uuids as well as on items related to a specific workout.
- `deleteObjects` replaces all previous deletion methods, using the new flexible filters.
- Workouts are returned as proxies containing not only data but also functions, for example `getWorkoutRoutes`.
- Object identifiers are now just strings (not enums), but more strictly typed for each use case.
- Units are now just strings. There's a `isQuantityCompatibleWithUnit()` helper function. Also, units are never required when querying, it always defaults to the users preferred unit.

## A note on Apple Documentation

We're striving to do as straight a mapping as possible to the Native Libraries. This means that in most cases the Apple Documentation makes sense. However, when it comes to the Healthkit [Metadata Keys](https://developer.apple.com/documentation/healthkit/samples/metadata_keys) the documentation doesn't actually reflect the serialized values. For example HKMetadataKeyExternalUUID in the documentation serializes to HKExternalUUID - which is what we use.

## Clinical Records

For accessing Clinical Records use old version (3.x) or use specific branch "including-clinical-records". The reason is we cannot refer to this code natively in apps without getting approval from Apple, this could probably be solved by the config plugin but we haven't had time to look into it yet.

## Android alternatives

For a similar library for Android, check out [react-native-health-connect](https://github.com/matinzd/react-native-health-connect/) that works with the new Health Connect. For Google Fit [react-native-google-fit](https://www.npmjs.com/package/react-native-google-fit) seems to be the most popular option, and and another possible option is to work directly with the Google Fit REST API which I've some experience with.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Sponsorship and enterprise-grade support

If you're using @kingstinct/react-native-healthkit to build your production app [please consider funding its continued development](https://github.com/sponsors/Kingstinct). It helps us spend more time on keeping this library as good as it can be.

At Kingstinct we're also able to provide enterprise-grade support for this package, [find us here](https://kingstinct.com) or [drop an email](mailto:healthkit@kingstinct.com) for more information. Also feel free to join our [Discord community](https://discord.gg/hrgnETpsJA).

## License

MIT

