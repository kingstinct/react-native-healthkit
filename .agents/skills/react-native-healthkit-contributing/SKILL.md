---
name: react-native-healthkit-contributing
description: How to change the react-native-healthkit monorepo itself (packages/core, packages/react-native-healthkit, packages/health-records, apps/example). Use when adding or changing a HealthKit identifier, a native (Nitro/Swift) API, a hook, the Expo config plugin, codegen, tests or CI in this repository, when nitrogen/codegen or the iOS build fails, or before committing/releasing changes here. For how to *use* the library in an app, see the react-native-healthkit skill instead.
metadata:
  internal: true
---

# Contributing to react-native-healthkit

## Mental model

```
packages/core            @react-native-healthkit/core: shared TS types (src/types), createUnavailableHelpers,
                         Expo plugin building blocks (src/plugin), ReactNativeHealthkitCore pod (ios/):
                         HealthKitStore, Queries, Predicates, Anchors, MetadataSerialization,
                         TypeIdentifiers, BackgroundDeliveryManager, ExceptionCatcher. No Nitro specs.
packages/react-native-healthkit   @kingstinct/react-native-healthkit: Nitro specs (src/specs/*.nitro.ts),
                         Swift impls (ios/*.swift), JS wiring (src/modules.ts, healthkit.ios.ts, healthkit.ts),
                         hooks, SDK-generated identifier types (src/generated, scripts/generate-healthkit*).
packages/health-records  @react-native-healthkit/health-records: one spec (HealthRecordsModule), FHIR types.
apps/example             Expo Router app (prebuild → ios/RNHealthKit.xcworkspace, scheme RNHealthKit),
                         plus contract tests (apps/example/contracts).
```

- **Core has no Nitro specs.** Packages import core's TS types into their specs, and nitrogen generates a per-package Swift copy of them. So **core must be built first** (`bun run build:core`) before codegen, typecheck or builds of the other packages. `bun install` does this in `postinstall`.
- Put code in core **only when both packages need it**. Core Swift must be `public`.
- All three packages share **one version** (changesets `fixed`), and the pods pin core to the exact same version.
- Identifiers, units, category value enums and metadata key maps are **generated from the iOS SDK**. Never hand-edit `src/generated/*`.

## Pick the workflow

| Task | Read |
| --- | --- |
| New HealthKit quantity or category identifier, category value, metadata key or workout activity type | [references/add-identifier.md](references/add-identifier.md) |
| New native function, module, hook or proxy method (Nitro spec → Swift → JS) | [references/add-native-api.md](references/add-native-api.md) |
| Checks to run, tests, CI, changesets and release | [references/verify-and-release.md](references/verify-and-release.md) |
| nitrogen, codegen, pod or Xcode build failures | [references/codegen-troubleshooting.md](references/codegen-troubleshooting.md) |

## Non-negotiables

1. After changing anything in `src/specs/` of either package, **or any type they reference** (including `packages/core/src/types`), run `bun codegen`. Use `bun codegen:healthkit` or `bun codegen:health-records` for a single package.
2. Before committing, run `bun typecheck`, `bun lint` and `bun run test` until they pass. For Swift changes, also run `bun run swiftlint`.
3. Build the example app with xcodebuild when on macOS (see [verify-and-release.md](references/verify-and-release.md)). On Linux you cannot. Say so explicitly instead of claiming the native build passed.
4. Add a changeset for every user-facing feature or fix (`bunx changeset`), bumping semver correctly.
5. Every new export needs **three** entries:
   - the iOS implementation in `healthkit.ios.ts`;
   - a non-iOS stub in `healthkit.ts` via `UnavailableFnFromModule` (a missing stub is a type error);
   - a `jest.fn()` in `src/test-setup.ts`'s `mockModule` if it calls a native module.
6. Look up Apple semantics as Markdown: append `.md` to any developer.apple.com documentation URL, e.g. `https://developer.apple.com/documentation/healthkit/hkhealthstore.md`. The metadata header's `availability` tells you the iOS version to gate on. Put the Apple link in the spec's JSDoc with `@see`.
7. Match the mapping philosophy: keep names and serialization **as close to HealthKit as possible**, so Apple's docs keep applying.

## Conventions

- **TypeScript:** Biome with single quotes, no semicolons and 2-space indent. `useExhaustiveDependencies` and `useHookAtTopLevel` are errors. `bun lint-fix` autofixes.
- **Swift:**
  - Async natives return `Promise.async { ... }`.
  - Throw or warn with each package's `ios/Helpers.swift` helpers (`runtimeErrorWithPrefix`, `warnWithPrefix`).
  - HealthKit raises Objective-C exceptions (for example on a bad unit string or invalid statistics options), and Swift can't catch those. Wrap such calls with core's `runCatchingObjCExceptions { }`, and parse unit strings with `parseUnitStringSafe(_:)` rather than `HKUnit(from:)`.
  - Gate new-SDK symbols with `#if compiler(>=X)` **and** `#available(iOS N, *)` (see add-native-api).
- **Commits:** Conventional commits (commitlint runs in husky `commit-msg`). `pre-commit` runs lint-staged (biome and swiftlint --fix). `pre-push` runs `bun run test && bun run typecheck`.
