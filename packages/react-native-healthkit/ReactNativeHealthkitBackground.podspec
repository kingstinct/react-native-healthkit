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

  s.source_files = "ios/BackgroundDeliveryManager.swift", "ios/NativeSyncEngine.swift"
  s.frameworks   = "HealthKit"

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "SWIFT_VERSION" => "5.0",
  }
end
