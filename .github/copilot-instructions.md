# copilot-instructions

This file contains instructions for Copilot to follow when working with code in this repository.

## Project Overview
This repository is a monorepo centering around the package react-native-healthkit. It exposes Apple Healthkit APIs to React Native and uses react-native-nitro-modules with nitrogen to generate type-safe types. We use React Native and Expo.

## Development Commands
```bash
# install dependencies (after adding any packages, can be run on root level)
bun install

# install cocoapods (after adding any packages with native code)
cd apps/example/ios && pod install

# After changes to any Nitro types (all in the `/packages/react-native-healthkit/src/specs` directory and referenced from there, it's not necessary when ios/Swift files or unrelated TS-files have changed)
bun codegen

# start packager
cd apps/example && bun start
```

## Build Verification Rule

IMPORTANT: After making code changes, you MUST: 
- first run `bun typecheck` and `bun lint` to ensure code quality and type safety. Iterate on these until they pass.
- finally use xcodebuild to build and verify the project compiles without errors. Build the reactnativehealthkitexample scheme for iOS Simulator using specific simulator UUID to avoid conflicts. Note: Using simulatorId instead of simulatorName to avoid conflicts when multiple simulators have the same name.

If there are build or validation errors, fix them before considering the task complete.

This ensures code changes are syntactically correct and don't break the build.