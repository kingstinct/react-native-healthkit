---
"@kingstinct/react-native-healthkit": patch
---

fix(plugin): `app.plugin.js` is no longer checked in; it is compiled from `app.plugin.ts` on build and on publish, so the published Expo config plugin can no longer drift from its source. The hand-maintained `app.plugin.js` had fallen behind `app.plugin.ts` since 14.0: it never contained the AppDelegate step that was supposed to call `BackgroundDeliveryManager.shared.setupBackgroundObservers()` at launch, so background-delivery observers configured via `configureBackgroundTypes` were not re-registered after the app was terminated.

That AppDelegate step also could not have compiled once emitted (the app target cannot import the pod's Swift module without pulling in Nitro's C++ headers), so it has been removed. The pod now registers the observers itself on `UIApplicationDidFinishLaunchingNotification`, the same approach `@react-native-healthkit/health-records` uses, and no AppDelegate change is needed in Expo or bare React Native apps.
