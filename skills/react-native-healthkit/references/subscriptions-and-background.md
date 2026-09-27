# Subscriptions and background delivery

## Foreground: observing changes

```ts
import { subscribeToChanges } from '@kingstinct/react-native-healthkit'

const subscription = subscribeToChanges('HKQuantityTypeIdentifierStepCount', ({ typeIdentifier, errorMessage }) => {
  if (errorMessage) return console.warn(errorMessage)
  // Something changed: re-run your statistics or anchored query
})

subscription.remove() // returns false if it was already removed
```

- This wraps an `HKObserverQuery`. The callback does **not** include the changed samples. It only tells you *something* changed, so re-query, ideally with an anchor (`queryQuantitySamplesWithAnchor`) to get just the delta.
- The observer typically fires once right after it starts.
- Request authorization for the type before subscribing.
- Characteristics can't be observed.

### Convenience wrappers

| API | Behaviour |
| --- | --- |
| `subscribeToQuantitySamples(id, cb, after = new Date())` | On each change, queries **all** samples since `after` (`limit: 0`) and calls `cb({ typeIdentifier, samples })`. Each call gets the full set since `after`, not just the new ones, so de-duplicate by `uuid`, and don't use a far-past `after` on high-frequency types. |
| `subscribeToCategorySamples(id, cb, after?)` | Same for category samples. |
| `useSubscribeToChanges(id, onChange)` | Hook; subscribes on mount and removes on unmount. It keeps the latest `onChange` in a ref, so inline callbacks are fine. |
| `useSubscribeToQuantitySamples` / `useSubscribeToCategorySamples` | Hook versions of the wrappers. |

The data hooks (`useMostRecentQuantitySample`, `useStatisticsForQuantity`, ...) already subscribe internally.

## Background delivery

Background delivery wakes your app, even when it has been terminated, when new data for a type is written. It needs:

1. The `com.apple.developer.healthkit.background-delivery` entitlement. The Expo plugin adds it by default (`background: true`). In bare RN, tick **Background Delivery** under the HealthKit capability.
2. An observer query registered **at launch**. HealthKit delivers to observers, and after a cold start your JS hasn't run yet.

The library handles point 2 natively:

```ts
import { configureBackgroundTypes, clearBackgroundTypes, UpdateFrequency, subscribeToChanges } from '@kingstinct/react-native-healthkit'

// Call once (e.g. after onboarding). Persisted to UserDefaults and re-registered natively on every launch.
await configureBackgroundTypes(
  ['HKQuantityTypeIdentifierStepCount', 'HKWorkoutTypeIdentifier'],
  UpdateFrequency.hourly, // immediate | hourly | daily | weekly
)

// At app start (e.g. in your root module, not inside a screen), attach JS handlers.
// For configured types, subscribeToChanges attaches to the native observer instead of creating a second one.
subscribeToChanges('HKQuantityTypeIdentifierStepCount', async () => {
  await syncStepsWithAnchor() // keep it short: iOS gives you limited background time
})

// To turn it off entirely:
await clearBackgroundTypes()
```

- No AppDelegate changes are needed. The pod registers observers on `UIApplicationDidFinishLaunchingNotification`.
- Change events that arrive before JS attaches a handler are buffered natively and delivered once `subscribeToChanges` is called for that type. Attach handlers early (at module load or in your root component) so the wake isn't wasted.
- `enableBackgroundDelivery(id, frequency)`, `disableBackgroundDelivery(id)` and `disableAllBackgroundDelivery()` are the raw HealthKit calls. Without an observer registered at launch they won't wake a terminated app, so prefer `configureBackgroundTypes`.
- **Frequency is a maximum.** iOS may batch deliveries, and some types (e.g. steps) are capped at hourly regardless of what you request.
- **Locked device:** HealthKit data is encrypted while the phone is locked, so queries in a background wake can fail. Check `isProtectedDataAvailable()` and retry on the next wake. Statistics queries already retry once on `errorDatabaseInaccessible`.
- Test on a real device. Background delivery on the simulator is unreliable.
- Health Records have their own `configureBackgroundTypes` in `@react-native-healthkit/health-records`.

## Apple references

- [HKObserverQuery](https://developer.apple.com/documentation/healthkit/hkobserverquery.md)
- [enableBackgroundDelivery(for:frequency:withCompletion:)](https://developer.apple.com/documentation/healthkit/hkhealthstore/enablebackgrounddelivery(for:frequency:withcompletion:).md)
- [HKUpdateFrequency](https://developer.apple.com/documentation/healthkit/hkupdatefrequency.md)
- [Background delivery entitlement](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit.background-delivery.md)
- [HKAnchoredObjectQuery](https://developer.apple.com/documentation/healthkit/hkanchoredobjectquery.md)
