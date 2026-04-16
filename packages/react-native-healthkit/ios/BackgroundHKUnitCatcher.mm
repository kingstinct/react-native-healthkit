//
// BackgroundHKUnitCatcher.mm
//
// See header for rationale — companion-pod-local NSException catcher for
// HKUnit parsing. Function name distinct from the main pod's
// HKUnitFromStringCatchingExceptions so both pods can link cleanly.
//

#import "BackgroundHKUnitCatcher.h"

HKUnit * _Nullable BGSafeHKUnitFromString(NSString * _Nonnull unitString, NSError * _Nullable * _Nullable outError) {
    if (outError) { *outError = nil; }
    @try {
        return [HKUnit unitFromString:unitString];
    }
    @catch (NSException *exception) {
        if (outError) {
            NSDictionary *userInfo = exception.userInfo ?: @{};
            *outError = [NSError errorWithDomain:exception.name code:0 userInfo:userInfo];
        }
        return nil;
    }
}
