require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ReactNativeHealthkitCore"
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
    # Objective-C exception catching and the launch hook
    "ios/**/*.{m,mm}",
  ]

  # The Objective-C exception helpers are only used by this pod's own Swift (see
  # Exceptions.swift). Keeping them private keeps them out of the generated
  # umbrella header, which dependents could otherwise not resolve when they
  # import this module.
  s.private_header_files = "ios/**/*.h"

  # No nitrogen-generated code here, but the Swift sources import NitroModules
  # (AnyMap, RuntimeError), which is only importable with C++ interop on — the
  # same flags nitrogen's autolinking sets on the packages that depend on this pod.
  s.pod_target_xcconfig = {
    # C++ compiler flags, mainly for folly.
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) FOLLY_NO_CONFIG FOLLY_CFG_NO_COROUTINES",
    # Allow importing Objective-C headers in Swift without bridging header
    "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES" => "YES",
    # Makes ios/module.modulemap (ReactNativeHealthkitCore_Private) importable from Swift
    "SWIFT_INCLUDE_PATHS" => "$(inherited) $(PODS_TARGET_SRCROOT)/ios",
    # Use C++ 20
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20",
    # Enables C++ <-> Swift interop (by default it's only ObjC)
    "SWIFT_OBJC_INTEROP_MODE" => "objcxx",
    # Enables stricter modular headers
    "DEFINES_MODULE" => "YES",
    # With C++ interop on, the generated -Swift.h header (part of this module's
    # clang module, so dependents compile it) would contain C++ thunks for every
    # public Swift function, and older toolchains (Xcode 26.6) fail on some of
    # them. Only expose declarations marked @_expose(Cxx), i.e. none; the
    # launch hook looks the manager up by name and needs no header.
    "OTHER_SWIFT_FLAGS" => "$(inherited) -Xfrontend -clang-header-expose-decls=has-expose-attr",
  }

  s.dependency 'NitroModules'
  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'
  install_modules_dependencies(s)
end
