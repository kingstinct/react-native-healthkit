#import "ExceptionCatcher.h"

HKUnit * _Nullable HKUnitFromStringCatchingExceptions(NSString * _Nonnull unitString, NSError * _Nullable * _Nullable outError) {
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

BOOL RunBlockCatchingObjCExceptions(void (NS_NOESCAPE ^block)(void), NSError * _Nullable * _Nullable outError) {
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

BOOL HKGetRequestStatusForAuthorizationCatchingExceptions(HKHealthStore *store,
                                                          NSSet<HKSampleType *> *toShare,
                                                          NSSet<HKObjectType *> *toRead,
                                                          void (^completion)(HKAuthorizationRequestStatus, NSError *),
                                                          NSError **outError) {
    if (outError) { *outError = nil; }
    @try {
        [store getRequestStatusForAuthorizationToShareTypes:toShare readTypes:toRead completion:completion];
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

BOOL HKRequestAuthorizationCatchingExceptions(HKHealthStore *store,
                                              NSSet<HKSampleType *> *toShare,
                                              NSSet<HKObjectType *> *toRead,
                                              void (^completion)(BOOL, NSError *),
                                              NSError **outError) {
    if (outError) { *outError = nil; }
    @try {
        [store requestAuthorizationToShareTypes:toShare readTypes:toRead completion:completion];
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
