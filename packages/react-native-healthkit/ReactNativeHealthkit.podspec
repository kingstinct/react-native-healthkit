require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ReactNativeHealthkit"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported, :visionos => 1.0 }
  s.source       = { :git => "https://github.com/kingstinct/react-native-healthkit.git", :tag => "#{s.version}" }

  s.source_files = [
    # Implementation (Swift)
    "ios/**/*.{swift}",
        # Implementation (C++ objects)
    "cpp/**/*.{hpp,cpp}",
  ]

  s.pod_target_xcconfig = {
    # C++ compiler flags, mainly for folly.
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) FOLLY_NO_CONFIG FOLLY_CFG_NO_COROUTINES",
    # Allow importing Objective-C headers in Swift without bridging header
    "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES" => "YES"
  }

  load 'nitrogen/generated/ios/ReactNativeHealthkit+autolinking.rb'
  add_nitrogen_files(s)


  # Workaround for Swift 6.2 (Xcode 26): shared_ptr lost automatic CxxConvertibleToBool conformance,
  # causing nitrogen-generated Bool(fromCxx:) calls to fail. Replace with use_count() > 0.
  # This can be removed once nitrogen fixes the codegen template upstream.
  s.script_phase = {
    :name => '[ReactNativeHealthkit] Fix Swift 6.2 CxxConvertibleToBool',
    :script => "perl -i -pe 's/Bool\\(fromCxx: cachedCxxPart\\)/cachedCxxPart.use_count() > 0/g' \"${PODS_TARGET_SRCROOT}/nitrogen/generated/ios/swift/\"*Spec_cxx.swift 2>/dev/null || true",
    :execution_position => :before_compile,
  }

  # The three packages are released in lockstep on a single version
  # (changesets `fixed`), so this pod is only ever built against a core of the
  # same major. Pinning it makes a mismatched install fail here, with a version
  # conflict naming both pods, instead of as a Swift compile error inside Pods.
  s.dependency 'ReactNativeHealthkitCore', "~> #{s.version.to_s.split('.').first}.0"
  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'
  install_modules_dependencies(s)
end
