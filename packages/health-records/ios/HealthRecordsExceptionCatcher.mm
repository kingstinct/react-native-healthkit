#import "HealthRecordsExceptionCatcher.h"

BOOL HRRunBlockCatchingObjCExceptions(void (NS_NOESCAPE ^block)(void), NSError * _Nullable * _Nullable outError) {
    if (outError) { *outError = nil; }
    @try {
        block();
        return YES;
    }
    @catch (NSException *exception) {
        if (outError) {
            NSDictionary *userInfo = exception.userInfo ?: @{};
            *outError = [NSError errorWithDomain:exception.name code:0 userInfo:userInfo];
        }
        return NO;
    }
}
