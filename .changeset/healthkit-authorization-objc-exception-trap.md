---
"@kingstinct/react-native-healthkit": patch
---

fix: catch Objective-C exceptions in `requestAuthorization` and `getRequestStatusForAuthorization`

`HKHealthStore.requestAuthorization` / `getRequestStatusForAuthorization` can raise a synchronous `NSException` (e.g. `NSInvalidArgumentException` for interdependent read types). The Swift wrapper never caught Objective-C exceptions, so on iOS 26 the exception escapes the `async` task and terminates the process with `EXC_BREAKPOINT (SIGTRAP)`. Wrap the calls in an ObjC `@try/@catch` and resume the continuation with the error instead of trapping. Fixes #331, #366.
