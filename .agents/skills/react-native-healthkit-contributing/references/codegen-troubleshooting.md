# Codegen and build troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| TS or nitrogen can't resolve `@react-native-healthkit/core` types; `Cannot find module '@react-native-healthkit/core'` | Core's `lib/` isn't built | `bun run build:core` (or `bun install`, which runs it) |
| Swift: `Bool(fromCxx: cachedCxxPart)` / `CxxConvertibleToBool` errors in `*Spec_cxx.swift` | Swift 6.2+ (Xcode 26+) dropped `shared_ptr` bool conversion; nitrogen output predates that | Rerun `bun codegen:<pkg>`, which ends with `fix-codegen` (a perl rewrite to `cachedCxxPart.use_count() > 0`). The podspec runs the same patch as a pre-compile `script_phase`. |
| `Hybrid<X>Spec` has no member / protocol conformance errors after editing a spec | Stale `nitrogen/generated` | `bun codegen:<pkg>` (it `rm -rf`s `nitrogen/generated` first), then `pod install` |
| New module compiles, but at runtime `createHybridObject('X')` fails with "not registered" | Missing `nitro.json` → `autolinking` entry, or pods not reinstalled | Add the entry, run `bun codegen` (which includes `pod install`), rebuild |
| `pod install`: `ReactNativeHealthkitCore (= x.y.z)` conflict | Core and package versions differ | Keep all three packages on the same version (changesets `fixed`); rerun `bun install` |
| Expo prebuild ignores plugin changes | `app.plugin.js` is gitignored build output | `bun run build:plugins` (root), then `expo prebuild --clean` |
| `app.plugin.js` missing on pack or publish | `prepack` guard | `bun run build:plugin` in the package |
| Swift: a symbol like `HKQuantityTypeIdentifier.heartRateVariabilityRMSSD` is not found on older Xcode | New-SDK symbol not compile-guarded | Wrap it in `#if compiler(>=6.4)` (Xcode 27) / `>=6.2` (Xcode 26) plus `#available` |
| `check:generated` diff in CI but not locally | Generated with an older SDK locally | Regenerate with the Xcode version CI uses for `verify-generated` (newest) |
| C++ interop errors from core's generated Swift header | Core Swift must not expose C++ thunks | Core's podspec sets `-clang-header-expose-decls=has-expose-attr`; keep it, and keep core APIs plain Swift and `public` |
| Hook tests fail with `undefined is not a function` for a new native method | `mockModule` in `src/test-setup.ts` lacks it | Add a `jest.fn()` for it |
| App crashes on querying a type that works in the example | Missing `requestAuthorization`, or the type isn't available on that iOS version | Request auth first; gate with `isObjectTypeAvailable` |

Reset everything as a last resort: `bun run reinstall`, then `bun codegen`, then `cd apps/example && bunx expo prebuild --clean`.
