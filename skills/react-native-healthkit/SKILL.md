---
name: react-native-healthkit
description: How to use @kingstinct/react-native-healthkit (and its sibling @react-native-healthkit/health-records) to read, write and subscribe to Apple HealthKit data from React Native / Expo apps. Use whenever code imports either package, when the user asks about HealthKit, Apple Health, steps, heart rate, sleep, workouts, clinical/FHIR health records, HealthKit permissions, background delivery or the healthkit Expo config plugin in a React Native project.
---

# react-native-healthkit

`@kingstinct/react-native-healthkit` is a Nitro Modules binding that maps HealthKit almost 1:1 into TypeScript. Identifiers, units and metadata keys are the **same strings HealthKit uses natively**, so Apple's documentation applies directly (see [Apple docs as Markdown](references/apple-docs.md)).

## Rules that prevent the most common bugs

1. **iOS only, no Expo Go.** Needs a dev client / native build. On Android and web every export is a stub that warns once and returns an empty/`false` value; it never throws. Guard UI with `isHealthDataAvailable()`.
2. **Request authorization before any query or subscription** for every type you touch. Querying a type you never requested can crash the app. A classic mistake: a hook that fetches on mount in the same component that requests permission. Gate data hooks behind the authorization result.
3. **Read permission is invisible.** HealthKit never tells you whether reading was denied: you just get no samples. `authorizationStatusFor()` only reports *write* (share) status. `getRequestStatusForAuthorization()` only says whether the prompt would still be shown. Design UX for "no data" rather than "denied".
4. **Identifiers are string literals**, e.g. `'HKQuantityTypeIdentifierStepCount'`, not enums. Type names drop the `HK` prefix (`QuantityTypeIdentifier`, `WorkoutActivityType`, `CategoryValueSleepAnalysis`).
5. **`limit` is required** on sample queries. `limit: 0` (or negative) means "all". Results are **newest first** unless `ascending: true`.
6. **Units are HKUnit strings** (`'count'`, `'count/min'`, `'kg'`, `'kcal'`, `'mg/dL'`, `'%'`, `'ms'`) and are typed per identifier. Omit `unit` to get the user's preferred unit. Validate dynamic units with `isQuantityCompatibleWithUnit()`.
7. **Dates are JS `Date` objects** both in and out.
8. **Prefer statistics queries over raw samples** for totals and averages (steps per day, average heart rate). `queryStatisticsForQuantity` / `queryStatisticsCollectionForQuantity` de-duplicate overlapping sources (iPhone + Watch) the same way the Health app does. Summing raw step samples double counts.
9. **Workouts and sources are native proxies.** Call `toJSON()` before putting them in state or storage, and `dispose()` them when iterating large lists.
10. **Metadata keys use the serialized name**, not the Swift constant name: `HKExternalUUID`, not `HKMetadataKeyExternalUUID`.
11. **Newer identifiers need newer iOS.** The types include identifiers up to the latest SDK. On older iOS, `requestAuthorization` silently drops them (with a native warning) but querying them throws. Check `isObjectTypeAvailable(id)` first.
12. **Anchors are opaque base64 strings.** Persist `newAnchor` after each successful sync. An invalid anchor throws; omit `anchor` to start over.
13. **Simulator:** HealthKit works but starts empty (add data in the Health app or save samples yourself). Health Records are never available on the simulator.

## Minimal setup (Expo)

```sh
npx expo install @kingstinct/react-native-healthkit react-native-nitro-modules
```

```json
{ "expo": { "plugins": [["@kingstinct/react-native-healthkit", {
  "NSHealthShareUsageDescription": "We read your steps to show daily progress",
  "NSHealthUpdateUsageDescription": "We save your workouts to Apple Health",
  "background": true
}]] } }
```

Then `npx expo prebuild` and build a dev client. Bare RN, plugin options and entitlements are covered in [references/setup.md](references/setup.md).

## Minimal usage

```ts
import {
  isHealthDataAvailable,
  requestAuthorization,
  queryStatisticsForQuantity,
} from '@kingstinct/react-native-healthkit'

if (isHealthDataAvailable()) {
  await requestAuthorization({
    toRead: ['HKQuantityTypeIdentifierStepCount'],
    toShare: ['HKQuantityTypeIdentifierBodyMass'],
  })

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const { sumQuantity } = await queryStatisticsForQuantity(
    'HKQuantityTypeIdentifierStepCount',
    ['cumulativeSum'],
    { filter: { date: { startDate: startOfDay } } },
  )
  console.log(sumQuantity?.quantity, sumQuantity?.unit) // 4231 'count'
}
```

## References: load the one that matches the task

| Task | Read |
| --- | --- |
| Installing, Expo plugin options, bare RN, entitlements, Info.plist, Android/web behaviour | [references/setup.md](references/setup.md) |
| Requesting and checking permissions, hooks, per-object auth, iOS-version gating | [references/authorization.md](references/authorization.md) |
| Reading samples, filters, statistics, anchors, units, sources, hooks | [references/querying.md](references/querying.md) |
| Saving and deleting samples, correlations, metadata | [references/writing.md](references/writing.md) |
| Live updates, observer queries, background delivery | [references/subscriptions-and-background.md](references/subscriptions-and-background.md) |
| Workouts, routes, state of mind, medications, ECG, heartbeat series, characteristics | [references/workouts-and-other-types.md](references/workouts-and-other-types.md) |
| Clinical records / FHIR (`@react-native-healthkit/health-records`) | [references/health-records.md](references/health-records.md) |
| Looking up HealthKit semantics in Apple's docs (Markdown links) | [references/apple-docs.md](references/apple-docs.md) |

## When unsure about an exact signature

The package's TypeScript types are the source of truth. They are generated from the iOS SDK and more precise than any prose. Look in `node_modules/@kingstinct/react-native-healthkit/src/`:
- `specs/*.nitro.ts`: every native function, with JSDoc links to Apple docs.
- `healthkit.ios.ts`: the exported function names.
- `types/QueryOptions.ts`: filter and option shapes.
- `generated/healthkit.generated.ts`: every identifier, its iOS availability, its canonical unit and its category value enums.
