# Setup

## Requirements

- Peer dependencies: `react >= 19`, `react-native >= 0.79`, `react-native-nitro-modules >= 0.35`.
- iOS (and visionOS). The minimum iOS version is React Native's `min_ios_version_supported`. HealthKit is not available on iPad before iPadOS 17, so always check `isHealthDataAvailable()`.
- **Not Expo Go.** Use a [development build](https://docs.expo.dev/develop/development-builds/introduction/).
- `@kingstinct/react-native-healthkit`, `@react-native-healthkit/core` and `@react-native-healthkit/health-records` are released with **one shared version**. Core is an exact-pinned dependency and the pods require the exact same core pod version, so never mix versions (`pod install` fails if you do).

## Expo (managed / CNG)

```sh
npx expo install @kingstinct/react-native-healthkit react-native-nitro-modules
```

```json
{
  "expo": {
    "plugins": [
      ["@kingstinct/react-native-healthkit", {
        "NSHealthShareUsageDescription": "Read steps and heart rate to show your trends",
        "NSHealthUpdateUsageDescription": "Save workouts you record in the app",
        "background": true
      }]
    ]
  }
}
```

A bare `"@kingstinct/react-native-healthkit"` string works too; every option has a default.

| Option | Type | Default | Effect |
| --- | --- | --- | --- |
| `NSHealthShareUsageDescription` | `string \| true` | `"<App name> wants to read your health data"` | Read-permission prompt text. An existing Info.plist value is kept unless you pass a string. |
| `NSHealthUpdateUsageDescription` | `string \| false` | `"<App name> wants to update your health data"` | Write-permission prompt text. `false` omits the key (read-only apps). |
| `background` | `boolean` | `true` | Adds the `com.apple.developer.healthkit.background-delivery` entitlement. Set `false` if you never use background delivery. |

The plugin always adds the `com.apple.developer.healthkit` entitlement. No AppDelegate changes are needed: background observers are registered by the pod itself at launch.

After changing plugin options, run `npx expo prebuild` (or `--clean`) and rebuild the native app.

**App Review:** Write usage strings that explain *why* you need the data. Generic strings are a common rejection reason. Do not request write access you don't use.

## Bare React Native

```sh
npm install @kingstinct/react-native-healthkit @react-native-healthkit/core react-native-nitro-modules
npx pod-install
```

- `@react-native-healthkit/core` must be listed in **your** `package.json`, because RN CLI autolinking only links direct dependencies.
- Add `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` to `Info.plist`.
- Xcode → target → Signing & Capabilities → **+ HealthKit**. Tick **Background Delivery** if you use it.
- Your App ID in the Apple Developer portal needs the HealthKit capability.

## Non-iOS platforms

Importing on Android or web is safe. Every function is replaced by a stub:
- The first call logs one warning: `Platform "android" not supported`.
- Nothing throws.
- Each stub returns a neutral value: `isHealthDataAvailable()` → `false`, queries → `[]`, anchored queries → empty `samples`/`deletedSamples`, `requestAuthorization` → `false`, subscriptions → `{ remove: () => false }`.

So you can import unconditionally and branch on `isHealthDataAvailable()` or `Platform.OS`. For Android, pair this library with [react-native-health-connect](https://github.com/matinzd/react-native-health-connect).

## Testing on the simulator

HealthKit works on the iOS Simulator, but the store starts empty. Add data through the simulator's Health app, or save samples from your app in a dev-only screen. Workout routes, ECG, heartbeat series and Health Records need a real device.

## Apple references

- [Setting up HealthKit](https://developer.apple.com/documentation/healthkit/setting-up-healthkit.md)
- [HealthKit entitlement](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit.md)
- [Background delivery entitlement](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit.background-delivery.md)
- [NSHealthShareUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthshareusagedescription.md)
- [NSHealthUpdateUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthupdateusagedescription.md)
- [Protecting user privacy](https://developer.apple.com/documentation/healthkit/protecting-user-privacy.md)
