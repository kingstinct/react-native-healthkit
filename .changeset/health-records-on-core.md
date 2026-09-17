---
"@react-native-healthkit/health-records": major
---

refactor: move the code shared with `@kingstinct/react-native-healthkit` into the new `@react-native-healthkit/core` dependency.

Nothing to install: core is pinned to this package's exact version, so your package manager brings in the matching copy and Expo autolinks it. Bare React Native apps must still list it in their own `package.json` (`bun add @react-native-healthkit/core`), because the React Native CLI only autolinks packages named there. The public API is unchanged, and background delivery configured before this release keeps working: the shared manager reads the existing UserDefaults keys.
