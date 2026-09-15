# copilot-instructions

This file contains instructions for Copilot to follow when working with code in this repository.

## Project Overview
This repository is a monorepo centering around the package react-native-healthkit (`packages/react-native-healthkit`, published as `@kingstinct/react-native-healthkit`), with a sibling package `packages/health-records` (published as `@react-native-healthkit/health-records`) for clinical health records. Both depend on `packages/core` (published as `@react-native-healthkit/core`), which holds their shared TypeScript types, Expo config plugin building blocks and the `ReactNativeHealthkitCore` pod (shared `HKHealthStore`, queries, predicates, metadata serialization, background delivery). Core has no Nitro specs of its own; the other packages import its types into theirs, so nitrogen generates per-package copies of them. Core must be built (`bun run build:core`) before the other packages build, codegen or typecheck on their own; `bun install` does this in `postinstall`. They expose Apple Healthkit APIs to React Native and use react-native-nitro-modules with nitrogen to generate type-safe types. We use React Native and Expo.

## Development Commands
```bash
# install dependencies (after adding any packages, can be run on root level)
bun install

# install cocoapods (after adding any packages with native code)
cd apps/example/ios && pod install

# After changes to any Nitro types (in `/packages/react-native-healthkit/src/specs` or `/packages/health-records/src/specs` and types referenced from there, including `/packages/core/src/types`; not necessary when ios/Swift files or unrelated TS-files have changed)
bun codegen # or bun codegen:healthkit / bun codegen:health-records for one package

# start packager
cd apps/example && bun start
```

## Build Verification Rule

IMPORTANT: After making code changes, you MUST:
- if you've changed anything in the `src/specs` directory of either package, run `bun codegen` to regenerate types.
- first run `bun typecheck` and `bun lint` to ensure code quality and type safety. Iterate on these until they pass.
- finally use xcodebuild to build and verify the project compiles without errors. Build the reactnativehealthkitexample scheme for iOS Simulator using specific simulator UUID to avoid conflicts. Note: Using simulatorId instead of simulatorName to avoid conflicts when multiple simulators have the same name.
- For any features or bug fixes, add changesets. Easily done by running `bun changeset` and following the prompts, follow semver best practices.

If there are build or validation errors, fix them before considering the task complete.

This ensures code changes are syntactically correct and don't break the build.
