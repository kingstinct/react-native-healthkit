# Adding a native API

Paths below are for `packages/react-native-healthkit`. `packages/health-records` is the same, with a single spec (`HealthRecordsModule`) and `healthRecords.ios.ts` / `healthRecords.ts`.

## 0. Decide where it lives

- **Existing module or a new one?** Add to the module whose HealthKit area it belongs to: `CoreModule` (store-level: auth, background, sources, deletes), `QuantityTypeModule`, `CategoryTypeModule`, `WorkoutsModule`, and so on. Create a new module only for a new HealthKit area.
- **Proxy method?** Methods on returned objects (for example workout routes) go in `WorkoutProxy.nitro.ts` / `SourceProxy.nitro.ts`.
- **Core or package?** Put Swift helpers in the `ReactNativeHealthkitCore` pod, or types in `packages/core/src/types`, **only if both packages use them**. Otherwise keep them in the package.
- **Read Apple's doc first:** `https://developer.apple.com/documentation/healthkit/<symbol>.md`. Note the `availability` header (iOS version) and whether the API is async, throws, or raises Objective-C exceptions.

## 1. Spec (`src/specs/<Module>.nitro.ts`)

```ts
export interface CoreModule extends HybridObject<{ ios: 'swift' }> {
  /**
   * What it does, in HealthKit terms. Mention iOS requirements and behaviour on older iOS.
   * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/earliestauthorizedsampledate(for:) Apple Docs}
   */
  getEarliestAuthorizedSampleDates(
    objectTypeIdentifiers: readonly ObjectTypeIdentifier[],
  ): Promise<Record<string, Date>>
}
```

- Keep names and argument order close to HealthKit.
- Use `Date` for dates, string literal unions for identifiers, and `AnyMap` for metadata.
- Types are limited to what Nitro supports: primitives, `Date`, arrays, `Record`, interfaces, enums, unions of string literals, `Promise`, functions and other HybridObjects.
- Loosely typed natives can get a **typed** overlay interface (e.g. `QuantityTypeModuleTyped`, which narrows `unit`, `metadata` and category `value` by identifier generic). It is applied with an `as` cast in `src/modules.ts`.
- **New module only:** add it to `nitro.json` → `autolinking` (`"FooModule": { "swift": "FooModule" }`) and create it in `src/modules.ts`: `NitroModules.createHybridObject<FooModule>('FooModule')`.

## 2. Codegen

```sh
bun codegen:healthkit   # builds core, runs nitrogen, patches Swift (fix-codegen), builds the plugin
```

This generates `nitrogen/generated/**` (gitignored) with a `Hybrid<Module>Spec` Swift protocol to implement. Run full `bun codegen` if you also want `pod install` for the example app.

## 3. Swift (`ios/<Module>.swift`)

```swift
import HealthKit
import NitroModules
import ReactNativeHealthkitCore

class CoreModule: HybridCoreModuleSpec {
  func getEarliestAuthorizedSampleDates(objectTypeIdentifiers: [ObjectTypeIdentifier]) -> Promise<[String: Date]> {
    return Promise.async {
      #if compiler(>=6.4)          // Xcode 27 toolchain: the symbol exists at compile time
        if #available(iOS 27.0, *) { // and at runtime
          let types = objectTypesFromArray(typeIdentifiers: objectTypeIdentifiers)
          let dates = try await store.earliestAuthorizedSampleDate(for: types)
          return dates.reduce(into: [String: Date]()) { $0[$1.key.identifier] = $1.value }
        }
      #else
        if #available(iOS 27.0, *) {
          warnWithPrefix("getEarliestAuthorizedSampleDates needs to be built with Xcode 27.0 or later")
        }
      #endif
      return [String: Date]() // graceful fallback on older iOS
    }
  }
}
```

- `store` is the shared `HKHealthStore` from core. Never create another one.
- **New-SDK APIs need both guards.** `#if compiler(>=…)` keeps the pod building on older Xcode, which users and CI still run. `#available` handles older iOS at runtime.
  - Compiler to Xcode: Swift 6.2 is Xcode 26, Swift 6.4 is Xcode 27.
  - Prefer a neutral fallback with a warning over throwing, unless there is no meaningful fallback.
- Reuse core helpers:
  - identifier → type: `TypeIdentifiers.swift`
  - filter → `NSPredicate`: `Predicates.swift`, plus `PredicateHelpers.swift` in the package
  - anchors: `Anchors.swift`
  - metadata (de)serialization: `MetadataSerialization.swift`
  - Objective-C exception safety: `runCatchingObjCExceptions`, `parseUnitStringSafe`
- Returning native objects that need follow-up calls? Make them a HybridObject proxy like `WorkoutProxy`, and report `memorySize`. Otherwise return plain structs.
- Run `bun run swiftlint` (config: `.swiftlint.yml`).

## 4. JS wiring

1. **`src/healthkit.ios.ts`**: `export const getEarliestAuthorizedSampleDates = Core.getEarliestAuthorizedSampleDates.bind(Core)`. Add it to the `export default { ... }` object too.
2. **`src/healthkit.ts`** (Android/web): a stub with a neutral return value that matches the iOS signature, also added to `HealthkitModule`:
   ```ts
   export const getEarliestAuthorizedSampleDates = UnavailableFnFromModule('getEarliestAuthorizedSampleDates', Promise.resolve({}))
   ```
   `HealthkitModule` is typed as `Omit<typeof ReactNativeHealthkit, 'default'>`, so forgetting this is a `bun typecheck` error.
3. **Hooks** (optional) go in `src/hooks/useX.ts`. They are exported from `healthkit.ios.ts` and stubbed in `healthkit.ts`.
   - Keep callbacks in refs (see `useSubscribeToChanges`) so inline callbacks don't resubscribe.
   - Satisfy Biome's `useExhaustiveDependencies`.
4. **`src/test-setup.ts`**: add `getEarliestAuthorizedSampleDates: jest.fn()` to `mockModule`, so every hybrid object mock has it.
5. **Example app (recommended):** exercise it in `apps/example/app/(tabs)/…`. If it's worth guarding end-to-end, add a scenario in `apps/example/contracts/scenarios.ts`.

## 5. Tests, changeset, verify

- Add a unit test next to the hook or util (`*.test.ts`, `bun:test` plus `@testing-library/react-native`). Mock native calls with `jest.spyOn(Core, 'fn')`.
- Add a changeset: `minor` for a new API, `patch` for a fix.
- Follow [verify-and-release.md](verify-and-release.md).

Template commit: `029edee` touched the spec, `CoreModule.swift`, `healthkit.ios.ts`, `healthkit.ts`, `test-setup.ts` and a changeset. That is the minimal complete set for a new function.

## Expo config plugin changes

- Package plugins live in `app.plugin.ts`. They compose `withHealthKit` and `withUsageDescription` from `@react-native-healthkit/core/plugin` (`packages/core/src/plugin/index.ts`).
- The plugins are compiled to a gitignored `app.plugin.js` by `bun run build:plugins` (root) or `bun run build:plugin` (package). Rebuild before testing with `expo prebuild` in `apps/example`.
- Keep options backwards compatible, and document new options in the README and in the consumer skill (`skills/react-native-healthkit/references/setup.md`).
