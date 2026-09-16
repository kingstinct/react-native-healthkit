# @react-native-healthkit/core

Shared foundation for the react-native-healthkit packages:

- [`@kingstinct/react-native-healthkit`](https://github.com/kingstinct/react-native-healthkit/tree/master/packages/react-native-healthkit) – HealthKit samples, workouts, statistics, characteristics and more
- [`@react-native-healthkit/health-records`](https://github.com/kingstinct/react-native-healthkit/tree/master/packages/health-records) – clinical health records (FHIR)

You do not use this package directly, and you do not need to install it: both packages above depend on it at an exact version, so your package manager brings in the matching copy. It holds what they have in common:

- **TypeScript types** that both packages expose (`AuthorizationStatus`, `UpdateFrequency`, `Device`, `SourceRevision`, `DateFilter`, `EmitterSubscription`, …). Both packages re-export them, so import from the package you use.
- **Expo config plugin building blocks** (`@react-native-healthkit/core/plugin`): the HealthKit entitlements and Info.plist usage descriptions each package's `app.plugin.js` composes.
- **Native code** (`ReactNativeHealthkitCore` pod): the shared `HKHealthStore`, sample and anchored queries, anchor (de)serialization, predicate and metadata helpers, Objective-C exception catching, and the launch-time background-delivery observer registration.

## Installation

Nothing to do: installing `@kingstinct/react-native-healthkit` or
`@react-native-healthkit/health-records` installs the exact matching version of
this package, and Expo autolinks it through that dependency.

The one exception is a bare React Native app, where the React Native CLI only
autolinks packages listed in the app's own `package.json`:

```sh
bun add @react-native-healthkit/core
```

This package shares its version with the two packages above. All three are released together on the same number, and their podspecs require a core pod of exactly their own version, so any mismatched or mixed-version combination fails at `pod install` rather than during the Swift build or at runtime. Upgrade them together.
