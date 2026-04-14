# Companion pod for HealthKit background delivery + native sync.
# Contains BackgroundDeliveryManager + NativeSyncEngine — no NitroModules, no C++ headers.
# Safe to import from AppDelegate on any RN version.

Pod::Spec.new do |s|
  s.name         = "ReactNativeHealthkitBackground"
  s.version      = "13.4.0"
  s.summary      = "HealthKit background delivery and native sync for React Native"
  s.homepage     = "https://github.com/kingstinct/react-native-healthkit"
  s.license      = "MIT"
  s.author       = "Robert Herber"
  s.source       = { :git => "https://github.com/kingstinct/react-native-healthkit.git" }
  s.ios.deployment_target = "13.0"

  s.source_files = [
    "ios/BackgroundDeliveryManager.swift",
    "ios/NativeSyncEngine.swift",
    # Companion-local ObjC helper (NSException catcher for HKUnit parsing).
    # The main pod's podspec excludes these filenames explicitly to avoid a
    # duplicate C-symbol linker error.
    "ios/BackgroundHKUnitCatcher.h",
    "ios/BackgroundHKUnitCatcher.mm",
  ]
  # Expose the ObjC helper's header to the pod's Swift module so
  # NativeSyncEngine.swift can call BGSafeHKUnitFromString without a manual
  # bridging header. CocoaPods puts listed public headers into the auto-
  # generated umbrella + modulemap.
  s.public_header_files = "ios/BackgroundHKUnitCatcher.h"

  s.frameworks   = "HealthKit"

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "SWIFT_VERSION" => "5.0",
    # The ObjC header #imports <HealthKit/HealthKit.h> which is a framework
    # import — framework modules disallow non-modular includes by default.
    "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES" => "YES",
    # NativeSyncEngine.swift is compiled by both the main pod and this
    # companion pod. Each pod has its own ObjC NSException catcher with a
    # distinct symbol name to avoid duplicate-symbol linker errors. This
    # flag lets NativeSyncEngine pick the right one via #if.
    "SWIFT_ACTIVE_COMPILATION_CONDITIONS" => "$(inherited) HEALTHKIT_BACKGROUND_POD",
  }
end
