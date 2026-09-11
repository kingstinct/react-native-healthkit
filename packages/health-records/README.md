# @react-native-healthkit/health-records

React Native bindings for [HealthKit clinical health records](https://developer.apple.com/documentation/healthkit/accessing-health-records): allergies, conditions, immunizations, lab results, medications, procedures, vital signs, clinical notes and insurance coverage, delivered as FHIR resources.

Built on [Nitro Modules](https://nitro.margelo.com) and designed to sit next to [`@kingstinct/react-native-healthkit`](https://github.com/kingstinct/react-native-healthkit), but it works standalone too.

> Clinical records are read-only, only available on iOS/iPadOS/visionOS, and only in [regions where Apple supports Health Records](https://support.apple.com/en-us/HT208680). Check `supportsHealthRecords()` before offering the feature.

## Installation

```sh
bun add @react-native-healthkit/health-records react-native-nitro-modules
```

### Expo

Add the config plugin. It adds the `com.apple.developer.healthkit` and background-delivery entitlements, appends `health-records` to `com.apple.developer.healthkit.access`, and sets `NSHealthClinicalHealthRecordsShareUsageDescription` in Info.plist.

```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-healthkit/health-records",
        {
          "NSHealthClinicalHealthRecordsShareUsageDescription": "Used to show your lab results in the app"
        }
      ]
    ]
  }
}
```

Then run `npx expo prebuild`.

### Bare React Native

1. `cd ios && pod install`
2. Enable the **HealthKit** capability with **Clinical Health Records** checked in Xcode (this adds `health-records` to the `com.apple.developer.healthkit.access` entitlement array).
3. Add `NSHealthClinicalHealthRecordsShareUsageDescription` to your Info.plist.

Your App ID in the Apple Developer portal must also have the "Clinical Health Records" HealthKit option enabled, otherwise the build is rejected at signing.

## Usage

```ts
import {
  queryClinicalRecords,
  requestAuthorization,
  supportsHealthRecords,
  parseFHIRResourceData,
} from '@react-native-healthkit/health-records'

if (supportsHealthRecords()) {
  await requestAuthorization([
    'HKClinicalTypeIdentifierLabResultRecord',
    'HKClinicalTypeIdentifierAllergyRecord',
  ])

  const labResults = await queryClinicalRecords(
    'HKClinicalTypeIdentifierLabResultRecord',
    { limit: 0, ascending: false },
  )

  for (const record of labResults) {
    const fhir = parseFHIRResourceData(record) // parsed FHIR JSON
    console.log(record.displayName, record.fhirResource?.resourceType, fhir)
  }
}
```

### Incremental sync

```ts
const { records, deletedRecords, newAnchor } =
  await queryClinicalRecordsWithAnchor(
    'HKClinicalTypeIdentifierConditionRecord',
    { limit: 0, anchor: previouslyStoredAnchor },
  )
```

### Reacting to changes

```ts
const subscription = subscribeToClinicalRecordChanges(
  'HKClinicalTypeIdentifierImmunizationRecord',
  ({ typeIdentifier, errorMessage }) => {
    // re-query, typically with an anchor
  },
)
subscription.remove()
```

Or with hooks:

```tsx
const [authStatus, requestAuth] = useHealthRecordsAuthorization([
  'HKClinicalTypeIdentifierVitalSignRecord',
])
const { records, error, refetch } = useClinicalRecords(
  'HKClinicalTypeIdentifierVitalSignRecord',
)
```

## API

| Function | Description |
| --- | --- |
| `isHealthDataAvailable()` | Whether HealthKit is available on this device. |
| `supportsHealthRecords()` | Whether this device supports clinical records. |
| `requestAuthorization(toRead)` | Prompt for read access to the given clinical types. |
| `getRequestStatusForAuthorization(toRead)` | Whether prompting is still needed. |
| `authorizationStatusFor(type)` | Raw `HKAuthorizationStatus` for a type. |
| `queryClinicalRecords(type, options)` | Fetch records with filters, limit and sort order. |
| `queryClinicalRecordsWithAnchor(type, options)` | Anchored query returning records, deletions and a new anchor. |
| `subscribeToClinicalRecordChanges(type, callback)` | Observer query; returns `{ remove }`. |
| `configureBackgroundTypes(types, frequency)` / `clearBackgroundTypes()` | Persist types whose observers are registered at launch for background delivery. |
| `enableBackgroundDelivery(type, frequency)` / `disableBackgroundDelivery(type)` | Low-level HealthKit calls; prefer `configureBackgroundTypes`. |
| `parseFHIRResourceData(recordOrResource)` | Parse the FHIR JSON string. |
| `useHealthRecordsAuthorization`, `useClinicalRecords`, `useSubscribeToClinicalRecordChanges` | React hooks. |

Filters support `uuid`, `uuids`, `date`, `metadata` and `fhirResourceType`, combinable with `AND`, `OR` and `NOT`.

## Background delivery

To be woken when clinical records change while the app is terminated, HealthKit needs an observer query registered at launch. Configure the types once from JS and the package re-registers them natively on every cold start. No AppDelegate change is needed: the pod hooks `UIApplicationDidFinishLaunchingNotification` itself. Pass `background: false` to the config plugin to skip the entitlement:

```ts
await configureBackgroundTypes(
  ['HKClinicalTypeIdentifierLabResultRecord'],
  UpdateFrequency.immediate,
)
// later
subscribeToClinicalRecordChanges('HKClinicalTypeIdentifierLabResultRecord', refetch)
```

Bare React Native: enable the HealthKit **Background Delivery** entitlement; the launch hook is part of the pod.

## Testing

The iOS Simulator reports `supportsHealthRecords()` as `false` and has no clinical sample data, so it can only exercise authorization and empty queries. To see real records you need a physical device in a region where Health Records is available, signed in to a supported healthcare provider in the Health app.

## License

MIT
