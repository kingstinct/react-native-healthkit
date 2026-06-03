---
"@kingstinct/react-native-healthkit": patch
---

Fix plugin crash when no options are passed and preserve existing `expo.ios.infoPlist` string values for `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription`. Pass `NSHealthUpdateUsageDescription: false` to omit the key entirely (for apps that only read health data).
