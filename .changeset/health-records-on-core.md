---
"@react-native-healthkit/health-records": minor
---

refactor: move the code shared with `@kingstinct/react-native-healthkit` into the new `@react-native-healthkit/core` peer dependency. Add it when upgrading:

```sh
bun add @react-native-healthkit/core
```

Expo autolinks it through the peer dependency; bare React Native apps must list it in their own `package.json`. The public API is unchanged, and background delivery configured before this release keeps working: the shared manager reads the existing UserDefaults keys.
