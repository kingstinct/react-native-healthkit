---
'@kingstinct/react-native-healthkit': patch
---

Fix the Expo config plugin's AppDelegate injection for background delivery:

- `app.plugin.js` (the compiled plugin `package.json` actually exposes) was out
  of sync with `app.plugin.ts` and never contained `withAppDelegatePlugin`, so
  `BackgroundDeliveryManager.shared.setupBackgroundObservers()` was never added
  to `didFinishLaunchingWithOptions` — background delivery silently stopped
  surviving app termination.
- The injection regex only matched a single-line Swift method signature; Expo
  SDK 53+ templates spread `didFinishLaunchingWithOptions` over multiple lines,
  so even the TS plugin missed it. The pattern now spans newlines.
- If the method still can't be found, the plugin now emits a
  `WarningAggregator` iOS warning instead of silently doing nothing.
