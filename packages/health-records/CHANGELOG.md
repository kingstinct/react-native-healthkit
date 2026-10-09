# @react-native-healthkit/health-records

## 16.2.0
### Patch Changes

- b6de7dd: fix: call `getRequestStatusForAuthorization` and `requestAuthorization` from Objective-C so an exception HealthKit raises is caught instead of trapping (`EXC_BREAKPOINT`), and resume each continuation at most once
- Updated dependencies [b6de7dd]
  - @react-native-healthkit/core@16.2.0

## 16.1.0
### Patch Changes

- 9854ae3: Fix iOS builds failing with `Unable to resolve module dependency: 'ReactNativeHealthkitCore_Private'` when React Native is built from source with static frameworks (explicit module builds). The pods that depend on `ReactNativeHealthkitCore` now add the core's `ios/` directory to their `SWIFT_INCLUDE_PATHS`, resolved the way Node resolves the dependency.
  - @react-native-healthkit/core@16.1.0

## 16.0.0
### Major Changes

- 908aec2: chore: release the three packages on a single, shared version from now on
  
  `@kingstinct/react-native-healthkit`, `@react-native-healthkit/core` and
  `@react-native-healthkit/health-records` compile into one another's binary
  through the `ReactNativeHealthkitCore` pod, and nothing in CocoaPods or npm
  could previously detect a mismatched combination: the packages declared the
  core pod without a version and the core package with an open-ended range, so an
  incompatible pair failed as a Swift compile error deep inside `Pods`.
  
  They are now a changesets `fixed` group: every release publishes all three at
  the same version, and the lock is enforced at both levels.
  
  On npm, `@react-native-healthkit/core` moved from a peer dependency with an
  open-ended range to a **regular dependency pinned to an exact version**. Your
  package manager now installs the one matching core for you, there is no version
  for you to keep in sync, and an incompatible combination cannot be resolved in
  the first place. Expo autolinks it through that dependency, so most apps no
  longer need to mention core at all; a bare React Native app still lists it,
  because the React Native CLI only autolinks packages named in the app's own
  `package.json`.
  
  In CocoaPods, each dependent podspec requires a core pod of exactly its own
  version, so anything that slips past npm, such as a mixed-version family with
  the main package at 16.0.0 beside health records at 16.1.0, fails at `pod
  install` with a version conflict naming both pods rather than as a Swift
  compile error or a runtime surprise.
  
  An exact *peer* range was the obvious alternative and is the one thing that does
  not work here: changesets treats a peer dependency leaving its range as breaking
  for its dependents, and the fixed group then lifts everyone to that type, so any
  minor anywhere in the family would come out as a major. A regular dependency has
  no such feedback loop.
  
  Because the group adopts the highest version in it, this release moves
  `@react-native-healthkit/core` and `@react-native-healthkit/health-records` up
  to the main package's number. The jump is a renumbering, not a redesign: apart
  from the changes described in the other entries of this release, the two
  packages are what they were at 0.0.1 and 0.1.0. Upgrade the packages you use
  together; mixing majors across the family is no longer supported.
- 908aec2: fix: reject undecodable anchors instead of silently restarting the query
  
  `deserializeHKQueryAnchor` now throws for a base64 string that is not a valid
  `HKQueryAnchor` archive, in both packages. Previously `@kingstinct/react-native-healthkit`
  returned nil for such a value, and the anchored query then ran unanchored and
  resolved with the entire data set plus a fresh anchor, so a caller syncing on
  the anchor re-ingested everything as new with no error to notice. Pass a
  `nil`/absent anchor to start from the beginning deliberately; anything that
  fails to decode is now an error.
  
  Also in this release:
  
  - The core pod's background-delivery manager is registered under the
    Objective-C name `RNHealthKitCoreBackgroundDeliveryManager` rather than the
    bare `BackgroundDeliveryManager` that `@kingstinct/react-native-healthkit` 15
    and earlier export. Installing a core-based `@react-native-healthkit/health-records`
    alongside such a version no longer puts two classes with one name in the
    binary, which could leave the launch hook resolving either of them and
    silently drop background delivery.
  - Metadata values of a type that cannot cross the bridge are still dropped, but
    the warning is now logged once per metadata key per process instead of once
    per sample, so it surfaces without flooding the console or the
    background-delivery window.
  - `@react-native-healthkit/core` no longer ships an ESM build. Its previous
    `import` entry could not actually be loaded by Node: the main entry used
    extensionless directory imports and the plugin entry took named imports from
    CommonJS `@expo/config-plugins`. The `import` condition now resolves to the
    CommonJS build, which Node imports with working named exports.
- 908aec2: refactor: move the code shared with `@kingstinct/react-native-healthkit` into the new `@react-native-healthkit/core` dependency.
  
  Nothing to install: core is pinned to this package's exact version, so your package manager brings in the matching copy and Expo autolinks it. Bare React Native apps must still list it in their own `package.json` (`bun add @react-native-healthkit/core`), because the React Native CLI only autolinks packages named there. The public API is unchanged, and background delivery configured before this release keeps working: the shared manager reads the existing UserDefaults keys.

### Patch Changes

- Updated dependencies [908aec2]
- Updated dependencies [908aec2]
- Updated dependencies [908aec2]
  - @react-native-healthkit/core@16.0.0

## 0.1.0
### Minor Changes

- b38e92f: feat: add `@react-native-healthkit/health-records`, a new package exposing HealthKit clinical health records (FHIR) with authorization, sample and anchored queries, observer subscriptions, background delivery, an Expo config plugin and React hooks
