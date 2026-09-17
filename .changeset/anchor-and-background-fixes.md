---
"@kingstinct/react-native-healthkit": major
"@react-native-healthkit/core": major
"@react-native-healthkit/health-records": major
---

fix: reject undecodable anchors instead of silently restarting the query

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
