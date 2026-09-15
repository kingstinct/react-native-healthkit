---
"@kingstinct/react-native-healthkit": major
---

refactor: move the code shared with `@react-native-healthkit/health-records` into the new `@react-native-healthkit/core` package. Add it next to `react-native-nitro-modules` when upgrading:

```sh
bun add @react-native-healthkit/core
```

It is a peer dependency, like `react-native-nitro-modules`: Expo autolinks it through the peer dependency, while bare React Native apps must list it in their own `package.json` for the `ReactNativeHealthkitCore` pod to be linked.

Public API is unchanged. The shared types (`AuthorizationStatus`, `UpdateFrequency`, `Device`, `SourceRevision`, `DateFilter`, `EmitterSubscription`, …) are still exported from this package but are now the same declarations as in `@react-native-healthkit/health-records`, so values can flow between the two packages without casts. `SampleType` fields and `EmitterSubscription.remove` (which now reports whether the subscription was still active) follow the core definitions. Background delivery configured before this release is picked up unchanged; the shared manager keeps reading the existing UserDefaults keys.
