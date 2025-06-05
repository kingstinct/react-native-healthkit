# copilot-instructions

This file contains instructions for Copilot to follow when working with code in this repository.

## Project Overview
This repository is a monorepo centering around the package react-native-healthkit. It exposes Apple Healthkit APIs to React Native and uses react-native-nitro-modules with nitrogen to generate type-safe types.

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

IMPORTANT: After making code changes, you MUST use the XcodeBuildMCP commands to build and verify the project compiles without errors:

First, discover available schemes:

Use MCP tool from XCodeBuildMCP: list_schems_proj with projectPath: "/Users/robertherber/code/react-native-healthkit-nitro/apps/example/ios/reactnativehealthkitexample.xcodeproj"
Build the reactnativehealthkitexample scheme for iOS Simulator:

Use MCP tool from XcodeBuildMCP: build_ios_sim_name_proj with parameters:
{
  projectPath: "/Users/robertherber/code/react-native-healthkit-nitro/apps/example/ios/reactnativehealthkitexample.xcodeproj", 
  scheme: "reactnativehealthkitexample", 
  simulatorName: "iPhone 16" 
}

If there are build errors, fix them before considering the task complete.

This ensures code changes are syntactically correct and don't break the build.