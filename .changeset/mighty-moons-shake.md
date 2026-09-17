---
'@kingstinct/react-native-healthkit': minor
---

Add the iOS 27 quantity type `HKQuantityTypeIdentifierHeartRateVariabilityRMSSD` (ms, discrete/arithmetic, writeable), and expose `getEarliestAuthorizedSampleDates` - a binding for `HKHealthStore.earliestAuthorizedSampleDate(for:)`, which reports the earliest date the app may read samples from for each type the user granted only limited access to. Types without a limited-access lower bound are omitted from the result, and on iOS 26 and below it resolves to an empty object since the concept does not exist there.
