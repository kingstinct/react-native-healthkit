# @react-native-healthkit/core

Shared foundation for the react-native-healthkit packages:

- [`@kingstinct/react-native-healthkit`](https://github.com/kingstinct/react-native-healthkit/tree/master/packages/react-native-healthkit) – HealthKit samples, workouts, statistics, characteristics and more
- [`@react-native-healthkit/health-records`](https://github.com/kingstinct/react-native-healthkit/tree/master/packages/health-records) – clinical health records (FHIR)

You do not use this package directly. It is a peer dependency of the packages above and holds what they have in common:

- **TypeScript types** that both packages expose (`AuthorizationStatus`, `UpdateFrequency`, `Device`, `SourceRevision`, `DateFilter`, `EmitterSubscription`, …). Both packages re-export them, so import from the package you use.
- **Expo config plugin building blocks** (`@react-native-healthkit/core/plugin`): the HealthKit entitlements and Info.plist usage descriptions each package's `app.plugin.js` composes.
- **Native code** (`ReactNativeHealthkitCore` pod): the shared `HKHealthStore`, sample and anchored queries, anchor (de)serialization, predicate and metadata helpers, Objective-C exception catching, and the launch-time background-delivery observer registration.

## Installation

Install it next to the package you use:

```sh
bun add @react-native-healthkit/core react-native-nitro-modules
```

Expo autolinks it through the peer dependency. In a bare React Native app it must be listed in your own `package.json` for autolinking to pick up the pod.

This package shares its version with the two packages above. All three are released together on the same number, and their podspecs require a core pod of exactly their own version, so any mismatched or mixed-version combination fails at `pod install` rather than during the Swift build or at runtime. Upgrade them together.
