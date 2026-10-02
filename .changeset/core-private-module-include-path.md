---
"@kingstinct/react-native-healthkit": patch
"@react-native-healthkit/health-records": patch
---

Fix iOS builds failing with `Unable to resolve module dependency: 'ReactNativeHealthkitCore_Private'` when React Native is built from source with static frameworks (explicit module builds). The pods that depend on `ReactNativeHealthkitCore` now add the core's `ios/` directory to their `SWIFT_INCLUDE_PATHS`, resolved the way Node resolves the dependency.
