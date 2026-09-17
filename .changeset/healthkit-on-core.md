---
"@kingstinct/react-native-healthkit": major
---

refactor: move the code shared with `@react-native-healthkit/health-records` into the new `@react-native-healthkit/core` package.

Nothing to install: core is a regular dependency pinned to this package's exact version, so your package manager brings in the matching copy and Expo autolinks it. Bare React Native apps must still list it in their own `package.json`, because the React Native CLI only autolinks packages named there:

```sh
bun add @react-native-healthkit/core
```

Public API is unchanged. The shared types (`AuthorizationStatus`, `UpdateFrequency`, `Device`, `SourceRevision`, `DateFilter`, `EmitterSubscription`, …) are still exported from this package but are now the same declarations as in `@react-native-healthkit/health-records`, so values can flow between the two packages without casts. `SampleType` fields and `EmitterSubscription.remove` (which now reports whether the subscription was still active) follow the core definitions. Background delivery configured before this release is picked up unchanged; the shared manager keeps reading the existing UserDefaults keys.
