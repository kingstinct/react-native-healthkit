# Verify, test and release

## Local checks (run from the repo root)

| Command | What it does | When |
| --- | --- | --- |
| `bun install` | Installs deps; `postinstall` builds core and the Expo plugins | After pulling or adding deps |
| `bun codegen` | build:core, then nitrogen for both packages, then fix-codegen, then `pod install` in `apps/example/ios` | After spec or referenced-type changes |
| `bun typecheck` | Root `tsc --noEmit` | Always |
| `cd packages/react-native-healthkit && bun run typecheck` | Also compiles `src/type-tests` (type-level assertions for generated typing) | After typing changes |
| `bun lint` / `bun lint-fix` | Biome check / autofix | Always |
| `bun run test` | `bun test` in packages/react-native-healthkit (preloads `src/test-setup.ts`, which mocks Nitro) | Always |
| `bun run swiftlint` | SwiftLint (generated code excluded) | Swift changes |
| `cd packages/react-native-healthkit && bun run check:generated` | Regenerates from the SDK and fails on diff (macOS, newest Xcode) | Generator or identifier changes |

## Native build (macOS only)

```sh
cd apps/example
bunx expo prebuild --platform ios   # (re)creates ios/ with RNHealthKit.xcworkspace; runs pod install
xcrun simctl list devices available # pick a simulator UUID
xcodebuild -workspace ios/RNHealthKit.xcworkspace -scheme RNHealthKit -configuration Debug \
  -sdk iphonesimulator -destination 'platform=iOS Simulator,id=<SIMULATOR_UUID>' build
```

- `bun run build-sim` in `apps/example` does the same with a generic simulator destination.
- Use the simulator **UUID**, not its name: several simulators can share a name.
- Build on the oldest **and** newest supported Xcode when you touch `#if compiler` / `#available` code. CI runs both (currently Xcode 26 and 27).
- On Linux (cloud agents) you can't run xcodebuild, swiftlint or check:generated. Run the TS checks, then state clearly that the native build still needs verifying on macOS or in CI.

## Contract tests (end-to-end on a simulator)

- `bun run test:contracts`, i.e. `apps/example/scripts/run-healthkit-contracts.sh [SIMULATOR_ID]`.
- It needs a built example app on a booted simulator. It launches the app with the `contracts` route and waits for a JSON report.
- Scenarios live in `apps/example/contracts/` (`scenarios.ts`, `healthRecordsScenario.ts`, `memoryBenchmark.ts`).
- Useful env vars: `SIMULATOR_ID`, `REPORT_TIMEOUT_SECONDS`, `CONTRACT_DIAGNOSTICS_DIR`.

## CI (`.github/workflows/test.yml`)

- **Jobs:** `test`, `typecheck`, `lint`, `swiftlint`, `verify-generated` (newest Xcode runner) and `build-ios-xcode`.
- **`build-ios-xcode`** runs a matrix of Xcode versions. Each leg does build:core, codegen, `expo prebuild`, xcodebuild, then contract tests where enabled.
- **Path filters** skip the heavy iOS jobs when no native or contract-relevant files changed.
- **`package-preview.yml`** publishes pkg-pr-new previews of `./packages/*` for PRs.

## Changesets and release

- Create one with `bunx changeset` (or `bun run create-changeset`) and pick packages and bump type:
  - `patch`: fix;
  - `minor`: new API or identifier;
  - `major`: breaking change (renames, removed exports, changed return shapes).
- The three packages are `fixed`: they always release with one shared version, and core is exact-pinned.
- Changes to docs, the example app or CI don't need a changeset (`react-native-healthkit-example` is ignored).
- Release is automated. `autopublish.yml` opens a "Version Packages" PR via changesets/action. Merging it runs `bun run changeset-release`, which builds core, copies the root README into the package and publishes with npm OIDC.
