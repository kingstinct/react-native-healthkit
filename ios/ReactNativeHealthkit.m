#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ReactNativeHealthkit, NSObject)

RCT_EXTERN_METHOD(isHealthDataAvailable:(RCTPromiseResolveBlock)resolve
withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestAuthorization:(NSDictionary)toShare
                  read:NSDictionary
                  resolve:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getRequestStatusForAuthorization:(NSDictionary)toShare
                read:(NSDictionary)read
                resolve:(RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getLastSamples:(NSString)sampleTypeIdentifier
                    limit:(NSInteger)limit
                    unitString:(NSString)unitString
                    resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBiologicalSex:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getFitzpatrickSkinType:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBloodType:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDateOfBirth:(RCTPromiseResolveBlock)resolve
withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(authorizationStatusFor:(NSString)sampleTypeIdentifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPreferredUnits:(NSArray)forIdentifiers
resolve:(RCTPromiseResolveBlock)resolve
reject:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(writeSample:(NSString)sampleTypeIdentifier
                  unitString:(NSString)unitString
                  value:(double)value
                  start:(double)start
                  end:(double)end
                  metadata:(NSDictionary)metadata
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(getSamplesBetween:(NSString)sampleTypeIdentifier
                  unitString:(NSString)unitString
                  start:(NSDate)start
                  end:(NSDate)end
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)



@end
