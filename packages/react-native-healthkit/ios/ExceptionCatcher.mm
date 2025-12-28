#import "ExceptionCatcher.h"

HKUnit * _Nullable HKUnitFromStringCatchingExceptions(NSString * _Nonnull unitString, NSError * _Nullable * _Nullable outError) {
    if (outError) { *outError = nil; }
    @try {
        HKUnit *unit = [HKUnit unitFromString:unitString];
        return unit;
    }
    @catch (NSException *exception) {
        if (outError) {
            NSDictionary *userInfo = exception.userInfo ?: @{};
          
            *outError = [NSError errorWithDomain:exception.name code:0 userInfo:userInfo];
        }
        return nil;
    }
}
