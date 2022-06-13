#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ReactNativeHealthkit, RCTEventEmitter)

RCT_EXTERN_METHOD(isHealthDataAvailable:(RCTPromiseResolveBlock)resolve
withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(supportsHealthRecords:(RCTPromiseResolveBlock)resolve
withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestAuthorization:(NSDictionary)toShare
                  read:NSDictionary
                  resolve:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getRequestStatusForAuthorization:(NSDictionary)toShare
                read:(NSDictionary)read
                resolve:(RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBiologicalSex:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getFitzpatrickSkinType:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBloodType:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDateOfBirth:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(authorizationStatusFor:(NSString)typeIdentifier
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(enableBackgroundDelivery:(NSString)typeIdentifier
                  updateFrequency:(NSInteger)updateFrequency
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(disableBackgroundDelivery:(NSString)typeIdentifier
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(disableAllBackgroundDelivery:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(getPreferredUnits:(NSArray)forIdentifiers
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(saveQuantitySample:(NSString)typeIdentifier
                  unitString:(NSString)unitString
                  value:(double)value
                  start:(NSDate)start
                  end:(NSDate)end
                  metadata:(NSDictionary)metadata
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(subscribeToObserverQuery:(NSString)typeIdentifier
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(saveCategorySample:(NSString)typeIdentifier
                  value:(double)value
                  start:(NSDate)start
                  end:(NSDate)end
                  metadata:(NSDictionary)metadata
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(queryWorkoutSamples:(NSString)energyUnitString
                  distanceUnitString:(NSString)distanceUnitString
                  from:(NSDate)from
                  to:(NSDate)to
                  limit:(NSInteger)limit
                  ascending:(BOOL)ascending
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(queryCategorySamples:(NSString)typeIdentifier
                  from:(NSDate)from
                  to:(NSDate)to
                  limit:(NSInteger)limit
                  ascending:(BOOL)ascending
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(saveCorrelationSample:(NSString)typeIdentifier
                  samples:(NSArray)samples
                  start:(NSDate)start
                  end:(NSDate)end
                  metadata:(NSDictionary)metadata
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(saveWorkoutSample:(NSInteger)typeIdentifier
                  quantities:(NSArray)quantities
                  start:(NSDate)start
                  end:(NSDate)end
                  metadata:(NSDictionary)metadata
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(queryCorrelationSamples:(NSString)typeIdentifier
                  from:(NSDate)from
                  to:(NSDate)to
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(queryQuantitySamples:(NSString)typeIdentifier
                  unitString:(NSString)unitString
                  from:(NSDate)from
                  to:(NSDate)to
                  limit:(NSInteger)limit
                  ascending:(BOOL)ascending
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(unsubscribeQuery:(NSString)queryId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(queryStatisticsForQuantity:(NSString)typeIdentifier
                  unitString:(NSString)unitString
                  from:(NSDate)from
                  to:(NSDate)to
                  options:(NSArray)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(getWheelchairUse:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getWorkoutRoutes:(NSString)workoutUUID
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
)

@end
