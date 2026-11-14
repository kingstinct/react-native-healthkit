# @kingstinct/exact-healthkit

Apple HealthKit for [Exact](https://github.com/expo/exact) apps. It exposes the
same functionality as
[`@kingstinct/react-native-healthkit`](../react-native-healthkit), under the same
names, as an Exact package: an interface (`exact.json`) and a Swift
implementation for iOS (`apple/`).

> Exact is pre-alpha, and so is this package. Expect both to change.

## Install

```sh
bun add @kingstinct/exact-healthkit
```

An app that reads or writes health data grants it in `app.ts`, with the purpose
text in `strings/en.json`, and names its privacy policy in `app.json`
(`"privacy_policy": "https://…"`). Exact derives the HealthKit entitlement and
`NSHealthShareUsageDescription` / `NSHealthUpdateUsageDescription` from the
grants, so there is no config plugin to add.

```ts
export const grants = 'device.health-read purpose.health\ndevice.health-write purpose.healthWrite'
```

## Use

From Contract:

```contract
use requestAuthorization, queryQuantitySamples, QuantitySample from "@kingstinct/exact-healthkit"

component Steps
  resource steps = queryQuantitySamples(identifier="HKQuantityTypeIdentifierStepCount", limit=20) as shape QuantitySample[] else empty()
  mutation asked as shape bool
  action ask
    send asked = requestAuthorization(toRead=["HKQuantityTypeIdentifierStepCount"])
  view
    column
      for s in steps key=s.uuid
        text `${s.quantity} ${s.unit}`
      button press=ask
        text "Allow Health access"
```

From data code, each name is a function taking one options object:

```ts
import { queryStatisticsCollectionForQuantity } from '@kingstinct/exact-healthkit'

const days = await queryStatisticsCollectionForQuantity({
  identifier: 'HKQuantityTypeIdentifierStepCount',
  statistics: ['cumulativeSum'],
  unit: 'count',
  anchorDate: Date.UTC(2026, 9, 1),
  intervalComponents: { minute: null, hour: null, day: 1, month: null, year: null },
})
```

## How it maps to react-native-healthkit

| react-native-healthkit | here |
| --- | --- |
| positional arguments and an `options` object | keyword options, flattened (`identifier=`, `limit=`, `filter=` …) |
| `Date` | ms since the epoch (`number`) |
| `metadata` (`AnyMap`) | `MetadataEntry[]`: `{ key, stringValue, numberValue, boolValue, dateValue, quantityValue }`, one value set |
| numeric enums (`WorkoutActivityType`, `BloodType` …) | their raw values, as `number` |
| `filter.OR` / `AND` / `NOT` | `anyOf` / `allOf` / `noneOf`, with the same semantics |
| `filter.sources: SourceProxy[]` | `sourceBundleIdentifiers: string[]` |
| `filter.workout: WorkoutProxy` | `workoutUuid: string` |
| `WorkoutProxy` methods | `getWorkoutRoutes`, `getWorkoutPlan`, `getWorkoutStatistic`, `getAllWorkoutStatistics`, `saveWorkoutRoute`, each taking `workoutUuid` |
| `getAllStatistics()` record | `WorkoutStatistic[]` (`{ quantityType, statistics }`) |
| correlation `objects` | `quantitySamples` and `categorySamples` |
| `getEarliestAuthorizedSampleDates` record | `EarliestAuthorizedSampleDate[]` |
| `areObjectTypesAvailable` record | `ObjectTypeAvailability[]` |
| `subscribeToChanges`, `useMostRecent…` and the other hooks | every read is live: an `HKObserverQuery` re-asks its readers when the type changes |
| sync and `…Async` pairs | one name; every name answers asynchronously |
| `save…` answering `T \| undefined` | answers `T`, or fails |

A shape's fields are all written, even when they are options: data code passes
`null` for one it leaves out (`{ ...filter, date: null }`), and Contract writes
every field of a record it builds.

### Permissions

Each HealthKit type is its own permission: `healthkit.read.<identifier>` and
`healthkit.share.<identifier>`. `requestAuthorization(toShare=, toRead=)` asks
for every one it names in one sheet. A read of a type the app never asked for
fails with `NotAllowedError` naming `requestAuthorization`. As with HealthKit
itself, a read the person denied is not an error: it answers only the samples
this app wrote.

### Not here yet

- **Background delivery** (`enableBackgroundDelivery`, `configureBackgroundTypes`
  and friends). Exact's iOS host wakes an app only for the kinds of wake it
  knows (regions, transfers); a HealthKit wake needs one added to the host.
  Live reads cover changes while the app runs.

### Errors

Failures carry DOM error names: `NotAllowedError` (authorization),
`NotSupportedError` (no Health data on this device, a type this OS lacks, any
platform but iOS), `NotReadableError` (the store is locked while the device is),
`TypeError` (a bad argument), `NotFoundError` (an unknown workout uuid).

HealthKit raises an Objective-C exception, which Swift cannot catch, for a unit
string it cannot parse or a request to write a read-only type. This package
checks both before HealthKit sees them and fails with `TypeError` instead.

## Under the agent

Under Exact's agent the package opens no `HKHealthStore`: it answers from an
in-memory store seeded with `fixture/health.json` (compiled in) and keeps what
the app saves and deletes, so a drive reads its own writes back. The agent's
`store` word swaps the store: a file name in `fixture/`, or inline JSON in the
same format:

```sh
bun exact.mjs agent ios 'prefer extension exact-healthkit.store="{\"quantities\": []}"' tree
```

The store holds quantity, category and workout samples and the
characteristics; other reads answer empty.

## Development

`exact.json` is generated by `scripts/manifest.mjs`, and `apple/Tables.swift`
(read-only types, canonical units, metadata key kinds and the default fixture)
by `scripts/tables.mjs` from react-native-healthkit's HealthKit schema. Edit
those and run `bun run manifest` and `bun run tables`; `bun run check` fails
when either is stale.

`test/drive.mjs` builds a conformance app (`test/fixture`) and drives it on an
iOS simulator under the agent:

```sh
EXACT_DIR=/path/to/exact bun test/drive.mjs --dir /somewhere/with/space
```
