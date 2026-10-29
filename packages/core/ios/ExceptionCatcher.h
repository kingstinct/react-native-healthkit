#import <Foundation/Foundation.h>
#import <HealthKit/HealthKit.h>

/// Objective-C exception helpers for the Swift wrappers in Exceptions.swift.
HKUnit * _Nullable HKUnitFromStringCatchingExceptions(NSString * _Nonnull unitString, NSError * _Nullable * _Nullable outError);
BOOL RunBlockCatchingObjCExceptions(void (NS_NOESCAPE ^_Nonnull block)(void), NSError * _Nullable * _Nullable outError);

/// HealthKit authorization calls made from Objective-C, so the @try sits
/// directly above HealthKit. Wrapping a Swift closure with
/// RunBlockCatchingObjCExceptions leaves Swift frames between the @try and the
/// throw; an exception unwinding through them can trap (EXC_BREAKPOINT) before
/// the @catch runs. Return NO and fill outError if HealthKit raised. The
/// completion may still fire after a raise.
BOOL HKGetRequestStatusForAuthorizationCatchingExceptions(HKHealthStore * _Nonnull store,
                                                          NSSet<HKSampleType *> * _Nonnull toShare,
                                                          NSSet<HKObjectType *> * _Nonnull toRead,
                                                          void (^_Nonnull completion)(HKAuthorizationRequestStatus status, NSError * _Nullable error),
                                                          NSError * _Nullable * _Nullable outError);
BOOL HKRequestAuthorizationCatchingExceptions(HKHealthStore * _Nonnull store,
                                              NSSet<HKSampleType *> * _Nonnull toShare,
                                              NSSet<HKObjectType *> * _Nonnull toRead,
                                              void (^_Nonnull completion)(BOOL success, NSError * _Nullable error),
                                              NSError * _Nullable * _Nullable outError);

/// HKWorkoutEvent created from Objective-C, for the same reason as the
/// authorization calls above. HealthKit raises for invalid input, e.g. a pause
/// event with a non-zero duration. Returns nil and fills outError if it raised.
HKWorkoutEvent * _Nullable HKWorkoutEventCatchingExceptions(HKWorkoutEventType type,
                                                            NSDateInterval * _Nonnull dateInterval,
                                                            NSDictionary<NSString *, id> * _Nullable metadata,
                                                            NSError * _Nullable * _Nullable outError);
