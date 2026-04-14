//
// BackgroundHKUnitCatcher.h
//
// Companion-pod-only mirror of the main pod's ExceptionCatcher. Kept under
// a subdirectory (ios/background-internal/) and excluded from the main
// pod's source_files so the same C function symbol isn't defined twice
// — linkers treat duplicate C symbols across static libraries as an error.
//
// The companion pod cannot depend on the main pod (which would pull in
// NitroModules / C++ interop and defeat the point of a lightweight
// background pod safe for AppDelegate imports), so this file duplicates
// the logic under a different function name.
//

#import <Foundation/Foundation.h>
#import <HealthKit/HealthKit.h>

#ifdef __cplusplus
extern "C" {
#endif

/// Safely parse an HKUnit string without letting Apple's NSException bubble
/// out. Returns `nil` on invalid strings and (if `outError` non-null)
/// captures the exception name + userInfo.
HKUnit * _Nullable BGSafeHKUnitFromString(NSString * _Nonnull unitString, NSError * _Nullable * _Nullable outError);

#ifdef __cplusplus
}
#endif
