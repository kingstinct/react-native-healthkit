import Foundation
import HealthKit
import NitroModules
func hasKnownTypedMetadata(_ values: [Any?]) -> Bool {
  values.contains { $0 != nil }
}
func metadataString(_ metadata: [String: Any]?, key: String) -> String? {
  metadata?[key] as? String
}
func metadataBool(_ metadata: [String: Any]?, key: String) -> Bool? {
  metadata?[key] as? Bool
}
func metadataNumber(_ metadata: [String: Any]?, key: String) -> Double? {
  if let value = metadata?[key] as? NSNumber {
    return value.doubleValue
  }
  return metadata?[key] as? Double
}
func metadataQuantity(_ metadata: [String: Any]?, key: String) -> Quantity? {
  serializeUnknownQuantityTyped(quantity: metadata?[key] as? HKQuantity)
}
func metadataEnum<T: RawRepresentable>(_ metadata: [String: Any]?, key: String, type: T.Type) -> T?
where T.RawValue == Int32 {
  guard let value = metadata?[key] as? NSNumber else {
    return nil
  }
  return T(rawValue: value.int32Value)
}
func serializeCategoryTypedMetadata(metadata: [String: Any]?) -> CategoryTypedMetadata? {
  let result = CategoryTypedMetadata(
    HKMenstrualCycleStart: metadataBool(metadata, key: "HKMenstrualCycleStart"),
    HKSexualActivityProtectionUsed: metadataBool(metadata, key: "HKSexualActivityProtectionUsed"),
    HKActivityType: metadataEnum(metadata, key: "HKActivityType", type: WorkoutActivityType.self),
    HKAlgorithmVersion: metadataNumber(metadata, key: "HKAlgorithmVersion"),
    HKAudioExposureDuration: metadataQuantity(metadata, key: "HKAudioExposureDuration"),
    HKBarometricPressure: metadataQuantity(metadata, key: "HKBarometricPressure"),
    HKMaximumLightIntensity: metadataQuantity(metadata, key: "HKMaximumLightIntensity"),
    HKPhysicalEffortEstimationType: metadataEnum(metadata, key: "HKPhysicalEffortEstimationType", type: PhysicalEffortEstimationType.self),
    HKUserMotionContext: metadataEnum(metadata, key: "HKUserMotionContext", type: UserMotionContext.self),
    HKWaterSalinity: metadataEnum(metadata, key: "HKWaterSalinity", type: WaterSalinity.self),
    HKWeatherCondition: serializeWeatherCondition(metadata?["HKWeatherCondition"] as? HKWeatherCondition),
    HKWeatherHumidity: metadataQuantity(metadata, key: "HKWeatherHumidity"),
    HKWeatherTemperature: metadataQuantity(metadata, key: "HKWeatherTemperature"),
    HKDeviceManufacturerName: metadataString(metadata, key: "HKDeviceManufacturerName"),
    HKDeviceName: metadataString(metadata, key: "HKDeviceName"),
    HKDeviceSerialNumber: metadataString(metadata, key: "HKDeviceSerialNumber"),
    HKDigitalSignature: metadataString(metadata, key: "HKDigitalSignature"),
    HKExternalUUID: metadataString(metadata, key: "HKExternalUUID"),
    HKFoodType: metadataString(metadata, key: "HKFoodType"),
    HKReferenceRangeLowerLimit: metadataNumber(metadata, key: "HKReferenceRangeLowerLimit"),
    HKReferenceRangeUpperLimit: metadataNumber(metadata, key: "HKReferenceRangeUpperLimit"),
    HKSyncIdentifier: metadataString(metadata, key: "HKSyncIdentifier"),
    HKSyncVersion: metadataNumber(metadata, key: "HKSyncVersion"),
    HKTimeZone: metadataString(metadata, key: "HKTimeZone"),
    HKUDIDeviceIdentifier: metadataString(metadata, key: "HKUDIDeviceIdentifier"),
    HKUDIProductionIdentifier: metadataString(metadata, key: "HKUDIProductionIdentifier"),
    HKWasTakenInLab: metadataBool(metadata, key: "HKWasTakenInLab"),
    HKWasUserEntered: metadataBool(metadata, key: "HKWasUserEntered")
  )
  return hasKnownTypedMetadata([result.HKMenstrualCycleStart, result.HKSexualActivityProtectionUsed, result.HKActivityType, result.HKAlgorithmVersion, result.HKAudioExposureDuration, result.HKBarometricPressure, result.HKMaximumLightIntensity, result.HKPhysicalEffortEstimationType, result.HKUserMotionContext, result.HKWaterSalinity, result.HKWeatherCondition, result.HKWeatherHumidity, result.HKWeatherTemperature, result.HKDeviceManufacturerName, result.HKDeviceName, result.HKDeviceSerialNumber, result.HKDigitalSignature, result.HKExternalUUID, result.HKFoodType, result.HKReferenceRangeLowerLimit, result.HKReferenceRangeUpperLimit, result.HKSyncIdentifier, result.HKSyncVersion, result.HKTimeZone, result.HKUDIDeviceIdentifier, result.HKUDIProductionIdentifier, result.HKWasTakenInLab, result.HKWasUserEntered]) ? result : nil
}
func serializeQuantityTypedMetadata(metadata: [String: Any]?) -> QuantityTypedMetadata? {
  let result = QuantityTypedMetadata(
    HKHeartRateMotionContext: serializeHeartRateMotionContext(metadata?["HKHeartRateMotionContext"] as? HKHeartRateMotionContext),
    HKHeartRateRecoveryActivityDuration: metadataQuantity(metadata, key: "HKHeartRateRecoveryActivityDuration"),
    HKHeartRateRecoveryActivityType: metadataEnum(metadata, key: "HKHeartRateRecoveryActivityType", type: WorkoutActivityType.self),
    HKHeartRateRecoveryMaxObservedRecoveryHeartRate: metadataQuantity(metadata, key: "HKHeartRateRecoveryMaxObservedRecoveryHeartRate"),
    HKHeartRateRecoveryTestType: metadataEnum(metadata, key: "HKHeartRateRecoveryTestType", type: HeartRateRecoveryTestType.self),
    HKHeartRateSensorLocation: metadataEnum(metadata, key: "HKHeartRateSensorLocation", type: HeartRateSensorLocation.self),
    HKSessionEstimate: metadataQuantity(metadata, key: "HKSessionEstimate"),
    HKBloodGlucoseMealTime: metadataEnum(metadata, key: "HKBloodGlucoseMealTime", type: BloodGlucoseMealTime.self),
    HKBodyTemperatureSensorLocation: metadataEnum(metadata, key: "HKBodyTemperatureSensorLocation", type: BodyTemperatureSensorLocation.self),
    HKInsulinDeliveryReason: serializeInsulinDeliveryReason(metadata?["HKInsulinDeliveryReason"] as? HKInsulinDeliveryReason),
    HKVO2MaxTestType: metadataEnum(metadata, key: "HKVO2MaxTestType", type: VO2MaxTestType.self),
    HKActivityType: metadataEnum(metadata, key: "HKActivityType", type: WorkoutActivityType.self),
    HKAlgorithmVersion: metadataNumber(metadata, key: "HKAlgorithmVersion"),
    HKAudioExposureDuration: metadataQuantity(metadata, key: "HKAudioExposureDuration"),
    HKBarometricPressure: metadataQuantity(metadata, key: "HKBarometricPressure"),
    HKMaximumLightIntensity: metadataQuantity(metadata, key: "HKMaximumLightIntensity"),
    HKPhysicalEffortEstimationType: metadataEnum(metadata, key: "HKPhysicalEffortEstimationType", type: PhysicalEffortEstimationType.self),
    HKUserMotionContext: metadataEnum(metadata, key: "HKUserMotionContext", type: UserMotionContext.self),
    HKWaterSalinity: metadataEnum(metadata, key: "HKWaterSalinity", type: WaterSalinity.self),
    HKWeatherCondition: serializeWeatherCondition(metadata?["HKWeatherCondition"] as? HKWeatherCondition),
    HKWeatherHumidity: metadataQuantity(metadata, key: "HKWeatherHumidity"),
    HKWeatherTemperature: metadataQuantity(metadata, key: "HKWeatherTemperature"),
    HKDeviceManufacturerName: metadataString(metadata, key: "HKDeviceManufacturerName"),
    HKDeviceName: metadataString(metadata, key: "HKDeviceName"),
    HKDeviceSerialNumber: metadataString(metadata, key: "HKDeviceSerialNumber"),
    HKDigitalSignature: metadataString(metadata, key: "HKDigitalSignature"),
    HKExternalUUID: metadataString(metadata, key: "HKExternalUUID"),
    HKFoodType: metadataString(metadata, key: "HKFoodType"),
    HKReferenceRangeLowerLimit: metadataNumber(metadata, key: "HKReferenceRangeLowerLimit"),
    HKReferenceRangeUpperLimit: metadataNumber(metadata, key: "HKReferenceRangeUpperLimit"),
    HKSyncIdentifier: metadataString(metadata, key: "HKSyncIdentifier"),
    HKSyncVersion: metadataNumber(metadata, key: "HKSyncVersion"),
    HKTimeZone: metadataString(metadata, key: "HKTimeZone"),
    HKUDIDeviceIdentifier: metadataString(metadata, key: "HKUDIDeviceIdentifier"),
    HKUDIProductionIdentifier: metadataString(metadata, key: "HKUDIProductionIdentifier"),
    HKWasTakenInLab: metadataBool(metadata, key: "HKWasTakenInLab"),
    HKWasUserEntered: metadataBool(metadata, key: "HKWasUserEntered")
  )
  return hasKnownTypedMetadata([result.HKHeartRateMotionContext, result.HKHeartRateRecoveryActivityDuration, result.HKHeartRateRecoveryActivityType, result.HKHeartRateRecoveryMaxObservedRecoveryHeartRate, result.HKHeartRateRecoveryTestType, result.HKHeartRateSensorLocation, result.HKSessionEstimate, result.HKBloodGlucoseMealTime, result.HKBodyTemperatureSensorLocation, result.HKInsulinDeliveryReason, result.HKVO2MaxTestType, result.HKActivityType, result.HKAlgorithmVersion, result.HKAudioExposureDuration, result.HKBarometricPressure, result.HKMaximumLightIntensity, result.HKPhysicalEffortEstimationType, result.HKUserMotionContext, result.HKWaterSalinity, result.HKWeatherCondition, result.HKWeatherHumidity, result.HKWeatherTemperature, result.HKDeviceManufacturerName, result.HKDeviceName, result.HKDeviceSerialNumber, result.HKDigitalSignature, result.HKExternalUUID, result.HKFoodType, result.HKReferenceRangeLowerLimit, result.HKReferenceRangeUpperLimit, result.HKSyncIdentifier, result.HKSyncVersion, result.HKTimeZone, result.HKUDIDeviceIdentifier, result.HKUDIProductionIdentifier, result.HKWasTakenInLab, result.HKWasUserEntered]) ? result : nil
}
func serializeWorkoutTypedMetadata(metadata: [String: Any]?) -> WorkoutTypedMetadata? {
  let result = WorkoutTypedMetadata(
    HKAlpineSlopeGrade: metadataQuantity(metadata, key: "HKAlpineSlopeGrade"),
    HKAppleFitnessPlusCatalogIdentifier: metadataString(metadata, key: "HKAppleFitnessPlusCatalogIdentifier"),
    HKAppleFitnessPlusSession: metadataBool(metadata, key: "HKAppleFitnessPlusSession"),
    HKAverageMETs: metadataQuantity(metadata, key: "HKAverageMETs"),
    HKAverageSpeed: metadataQuantity(metadata, key: "HKAverageSpeed"),
    HKCoachedWorkout: metadataBool(metadata, key: "HKCoachedWorkout"),
    HKCrossTrainerDistance: metadataQuantity(metadata, key: "HKCrossTrainerDistance"),
    HKElevationAscended: metadataQuantity(metadata, key: "HKElevationAscended"),
    HKElevationDescended: metadataQuantity(metadata, key: "HKElevationDescended"),
    HKFitnessMachineDuration: metadataQuantity(metadata, key: "HKFitnessMachineDuration"),
    HKGroupFitness: metadataBool(metadata, key: "HKGroupFitness"),
    HKIndoorBikeDistance: metadataQuantity(metadata, key: "HKIndoorBikeDistance"),
    HKIndoorWorkout: metadataBool(metadata, key: "HKIndoorWorkout"),
    HKLapLength: metadataQuantity(metadata, key: "HKLapLength"),
    HKMaximumSpeed: metadataQuantity(metadata, key: "HKMaximumSpeed"),
    HKSwimmingLocationType: metadataEnum(metadata, key: "HKSwimmingLocationType", type: WorkoutSwimmingLocationType.self),
    HKSWOLFScore: metadataNumber(metadata, key: "HKSWOLFScore"),
    HKWeatherCondition: serializeWeatherCondition(metadata?["HKWeatherCondition"] as? HKWeatherCondition),
    HKWeatherHumidity: metadataQuantity(metadata, key: "HKWeatherHumidity"),
    HKWeatherTemperature: metadataQuantity(metadata, key: "HKWeatherTemperature"),
    HKWorkoutBrandName: metadataString(metadata, key: "HKWorkoutBrandName"),
    HKActivityType: metadataEnum(metadata, key: "HKActivityType", type: WorkoutActivityType.self),
    HKAlgorithmVersion: metadataNumber(metadata, key: "HKAlgorithmVersion"),
    HKAudioExposureDuration: metadataQuantity(metadata, key: "HKAudioExposureDuration"),
    HKBarometricPressure: metadataQuantity(metadata, key: "HKBarometricPressure"),
    HKMaximumLightIntensity: metadataQuantity(metadata, key: "HKMaximumLightIntensity"),
    HKPhysicalEffortEstimationType: metadataEnum(metadata, key: "HKPhysicalEffortEstimationType", type: PhysicalEffortEstimationType.self),
    HKUserMotionContext: metadataEnum(metadata, key: "HKUserMotionContext", type: UserMotionContext.self),
    HKWaterSalinity: metadataEnum(metadata, key: "HKWaterSalinity", type: WaterSalinity.self),
    HKDeviceManufacturerName: metadataString(metadata, key: "HKDeviceManufacturerName"),
    HKDeviceName: metadataString(metadata, key: "HKDeviceName"),
    HKDeviceSerialNumber: metadataString(metadata, key: "HKDeviceSerialNumber"),
    HKDigitalSignature: metadataString(metadata, key: "HKDigitalSignature"),
    HKExternalUUID: metadataString(metadata, key: "HKExternalUUID"),
    HKFoodType: metadataString(metadata, key: "HKFoodType"),
    HKReferenceRangeLowerLimit: metadataNumber(metadata, key: "HKReferenceRangeLowerLimit"),
    HKReferenceRangeUpperLimit: metadataNumber(metadata, key: "HKReferenceRangeUpperLimit"),
    HKSyncIdentifier: metadataString(metadata, key: "HKSyncIdentifier"),
    HKSyncVersion: metadataNumber(metadata, key: "HKSyncVersion"),
    HKTimeZone: metadataString(metadata, key: "HKTimeZone"),
    HKUDIDeviceIdentifier: metadataString(metadata, key: "HKUDIDeviceIdentifier"),
    HKUDIProductionIdentifier: metadataString(metadata, key: "HKUDIProductionIdentifier"),
    HKWasTakenInLab: metadataBool(metadata, key: "HKWasTakenInLab"),
    HKWasUserEntered: metadataBool(metadata, key: "HKWasUserEntered")
  )
  return hasKnownTypedMetadata([result.HKAlpineSlopeGrade, result.HKAppleFitnessPlusCatalogIdentifier, result.HKAppleFitnessPlusSession, result.HKAverageMETs, result.HKAverageSpeed, result.HKCoachedWorkout, result.HKCrossTrainerDistance, result.HKElevationAscended, result.HKElevationDescended, result.HKFitnessMachineDuration, result.HKGroupFitness, result.HKIndoorBikeDistance, result.HKIndoorWorkout, result.HKLapLength, result.HKMaximumSpeed, result.HKSwimmingLocationType, result.HKSWOLFScore, result.HKWeatherCondition, result.HKWeatherHumidity, result.HKWeatherTemperature, result.HKWorkoutBrandName, result.HKActivityType, result.HKAlgorithmVersion, result.HKAudioExposureDuration, result.HKBarometricPressure, result.HKMaximumLightIntensity, result.HKPhysicalEffortEstimationType, result.HKUserMotionContext, result.HKWaterSalinity, result.HKDeviceManufacturerName, result.HKDeviceName, result.HKDeviceSerialNumber, result.HKDigitalSignature, result.HKExternalUUID, result.HKFoodType, result.HKReferenceRangeLowerLimit, result.HKReferenceRangeUpperLimit, result.HKSyncIdentifier, result.HKSyncVersion, result.HKTimeZone, result.HKUDIDeviceIdentifier, result.HKUDIProductionIdentifier, result.HKWasTakenInLab, result.HKWasUserEntered]) ? result : nil
}
func serializeWorkoutEventTypedMetadata(metadata: [String: Any]?) -> WorkoutEventTypedMetadata? {
  let result = WorkoutEventTypedMetadata(
    HKSwimmingStrokeStyle: metadataEnum(metadata, key: "HKSwimmingStrokeStyle", type: SwimmingStrokeStyle.self)
  )
  return hasKnownTypedMetadata([result.HKSwimmingStrokeStyle]) ? result : nil
}
