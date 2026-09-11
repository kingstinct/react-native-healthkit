#import <Foundation/Foundation.h>

/// Runs `block`, converting any Objective-C exception it raises into an NSError.
/// Prefixed to avoid a duplicate symbol with the equivalent helper in the core
/// ReactNativeHealthkit pod when both packages are installed.
BOOL HRRunBlockCatchingObjCExceptions(void (NS_NOESCAPE ^_Nonnull block)(void), NSError * _Nullable * _Nullable outError);
