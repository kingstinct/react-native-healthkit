# Authorization

HealthKit permissions are per data type, and read and write are separate. The user can grant any subset. **Your app can learn whether writing was allowed, but never whether reading was allowed.**

## Requesting

```ts
import { requestAuthorization } from '@kingstinct/react-native-healthkit'

const didShowOrSkip = await requestAuthorization({
  toRead: [
    'HKQuantityTypeIdentifierStepCount',
    'HKQuantityTypeIdentifierHeartRate',
    'HKCategoryTypeIdentifierSleepAnalysis',
    'HKWorkoutTypeIdentifier',
    'HKCharacteristicTypeIdentifierDateOfBirth',
  ],
  toShare: ['HKQuantityTypeIdentifierBodyMass', 'HKWorkoutTypeIdentifier'],
})
```

- The argument is an object `{ toRead?, toShare? }`, not an array.
  - `toRead` accepts any `ObjectTypeIdentifier`, including characteristics.
  - `toShare` accepts only writeable sample types (`SampleTypeIdentifierWriteable`). Read-only types such as `HKQuantityTypeIdentifierAppleExerciseTime` are compile errors there.
- The promise resolving `true` means the request completed. It does **not** mean access was granted.
- The system sheet is only shown for types the user hasn't been asked about yet. Calling it again with the same types is cheap and shows nothing.
- To work with workout routes, request `'HKWorkoutRouteTypeIdentifier'` (exported as `WorkoutRouteTypeIdentifier`) in addition to `'HKWorkoutTypeIdentifier'`.

## Checking

| Function | Returns | Use it for |
| --- | --- | --- |
| `getRequestStatusForAuthorization({ toRead, toShare })` | `AuthorizationRequestStatus`: `unknown` (0), `shouldRequest` (1), `unnecessary` (2) | Deciding whether to show your own "Connect Apple Health" screen. |
| `authorizationStatusFor(identifier)` (sync) | `AuthorizationStatus`: `notDetermined` (0), `sharingDenied` (1), `sharingAuthorized` (2) | **Write** permission only. |
| `isHealthDataAvailable()` / `isHealthDataAvailableAsync()` | `boolean` | Device support. Returns false on Android/web and on some iPads. |
| `isProtectedDataAvailable()` | `boolean` | Whether the device is unlocked (HealthKit data is encrypted while the device is locked). Relevant in background work. |

Because read status is hidden, treat "zero samples" as possibly-denied. A good UX: show an empty state with a hint to open **Settings → Health → Data Access & Devices → Your App**.

## Hook

```tsx
import {
  AuthorizationRequestStatus,
  useHealthkitAuthorization,
} from '@kingstinct/react-native-healthkit'

const [status, request] = useHealthkitAuthorization({
  toRead: ['HKQuantityTypeIdentifierHeartRate'],
  toWrite: ['HKQuantityTypeIdentifierBodyMass'], // note: toWrite, not toShare
})

if (status === AuthorizationRequestStatus.shouldRequest) {
  return <Button title="Connect Apple Health" onPress={request} />
}
if (status === AuthorizationRequestStatus.unnecessary) {
  return <HeartRateScreen /> // safe to mount data hooks now
}
return null // status is null while loading
```

Mount data hooks (`useMostRecentQuantitySample`, `useStatisticsForQuantity`, subscriptions, ...) only after the status becomes `unnecessary`. Put them in a child component.

## iOS-version-gated types

Generated types include identifiers from the newest SDK. For example, `HKQuantityTypeIdentifierHeartRateVariabilityRMSSD` requires iOS 27. On an older OS:
- `requestAuthorization` drops unavailable identifiers and logs a native warning.
- Querying or saving them throws.

```ts
import { isObjectTypeAvailable, areObjectTypesAvailable } from '@kingstinct/react-native-healthkit'

if (isObjectTypeAvailable('HKQuantityTypeIdentifierHeartRateVariabilityRMSSD')) { /* ... */ }
const available = areObjectTypesAvailable(['HKQuantityTypeIdentifierCyclingPower', 'HKStateOfMindTypeIdentifier'])
```

The minimum iOS version of every identifier is listed in `QUANTITY_IDENTIFIER_IOS_AVAILABILITY` / `CATEGORY_IDENTIFIER_IOS_AVAILABILITY` in `src/generated/healthkit.generated.ts`.

## Special authorization flows

- **Per-object read authorization** (vision prescriptions, medications) uses its own sheet:
  ```ts
  await requestPerObjectReadAuthorization('HKUserAnnotatedMedicationTypeIdentifier')
  ```
  `requestMedicationsAuthorization` is deprecated in favour of this.
- **Limited-history access** (iOS 27+): users can grant only a recent window of data. `getEarliestAuthorizedSampleDates(identifiers)` returns `{ [identifier]: Date }` for the types that are limited. On older iOS it returns `{}`.
- **Clinical records** have their own `requestAuthorization` in `@react-native-healthkit/health-records` (see [health-records.md](health-records.md)).

## Apple references

- [Authorizing access to health data](https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data.md)
- [authorizationStatus(for:)](https://developer.apple.com/documentation/healthkit/hkhealthstore/authorizationstatus(for:).md)
- [getRequestStatusForAuthorization](https://developer.apple.com/documentation/healthkit/hkhealthstore/getrequeststatusforauthorization(toshare:read:completion:).md)
- [getEarliestAuthorizedSampleDate(for:)](https://developer.apple.com/documentation/healthkit/hkhealthstore/getearliestauthorizedsampledate(for:completion:).md)
- [Protecting user privacy](https://developer.apple.com/documentation/healthkit/protecting-user-privacy.md)
