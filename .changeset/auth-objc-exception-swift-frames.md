---
"@kingstinct/react-native-healthkit": patch
"@react-native-healthkit/core": patch
"@react-native-healthkit/health-records": patch
---

fix: call `getRequestStatusForAuthorization` and `requestAuthorization` from Objective-C so an exception HealthKit raises is caught instead of trapping (`EXC_BREAKPOINT`), and resume each continuation at most once
