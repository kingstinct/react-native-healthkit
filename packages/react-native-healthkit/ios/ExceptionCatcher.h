#import <Foundation/Foundation.h>
#import <HealthKit/HealthKit.h>

HKUnit * _Nullable HKUnitFromStringCatchingExceptions(NSString * _Nonnull unitString, NSError * _Nullable * _Nullable outError);
BOOL RunBlockCatchingObjCExceptions(void (NS_NOESCAPE ^_Nonnull block)(void), NSError * _Nullable * _Nullable outError);
