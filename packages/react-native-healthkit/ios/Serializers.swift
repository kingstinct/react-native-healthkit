//
//  Serializers.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit
import NitroModules

func serializeQuantityTyped(unit: HKUnit, quantityNullable: HKQuantity?) -> Quantity? {
  guard let q = quantityNullable else {
    return nil
  }

  return Quantity(
    unit: unit.unitString,
    quantity: q.doubleValue(for: unit)
  )
}

func serializeWeatherCondition(_ hkWeatherCondition: HKWeatherCondition?) -> WeatherCondition? {
  guard let hkWeatherCondition = hkWeatherCondition else {
    return nil
  }
  return WeatherCondition(rawValue: Int32(hkWeatherCondition.rawValue))
}

func serializeInsulinDeliveryReason(_ hkReason: HKInsulinDeliveryReason?) -> InsulinDeliveryReason? {
  guard let hkReason = hkReason else {
    return nil
  }
  return InsulinDeliveryReason(rawValue: Int32(hkReason.rawValue))
}

func serializeHeartRateMotionContext(_ hkContext: HKHeartRateMotionContext?)
  -> HeartRateMotionContext? {
  guard let hkContext = hkContext else {
    return nil
  }
  return HeartRateMotionContext(rawValue: Int32(hkContext.rawValue))
}

func serializeQuantityTyped(unit: HKUnit, quantity: HKQuantity) -> Quantity {
  return Quantity(
    unit: unit.unitString,
    quantity: quantity.doubleValue(for: unit)
  )
}

func serializeQuantitySample(sample: HKQuantitySample, unit: HKUnit) throws -> QuantitySample {
  if let quantityType = QuantityTypeIdentifier(fromString: sample.quantityType.identifier) {
    return QuantitySample(
      quantityType: quantityType,
      quantity: sample.quantity.doubleValue(for: unit),
      unit: unit.unitString,
      sampleType: serializeSampleType(sample.sampleType),
      startDate: sample.startDate,
      endDate: sample.endDate,
      hasUndeterminedDuration: sample.hasUndeterminedDuration,

      metadataWeatherCondition: serializeWeatherCondition(
        sample.metadata?[HKMetadataKeyWeatherCondition] as? HKWeatherCondition),
      metadataWeatherHumidity: serializeUnknownQuantityTyped(
        quantity: sample.metadata?[HKMetadataKeyWeatherHumidity] as? HKQuantity),
      metadataWeatherTemperature: serializeUnknownQuantityTyped(
        quantity: sample.metadata?[HKMetadataKeyWeatherTemperature] as? HKQuantity),
      metadataInsulinDeliveryReason: serializeInsulinDeliveryReason(
        sample.metadata?[HKMetadataKeyInsulinDeliveryReason] as? HKInsulinDeliveryReason),
      metadataHeartRateMotionContext: serializeHeartRateMotionContext(
        sample.metadata?[HKMetadataKeyHeartRateMotionContext] as? HKHeartRateMotionContext),

      uuid: sample.uuid.uuidString,
      sourceRevision: serializeSourceRevision(sample.sourceRevision),
      device: serializeDevice(hkDevice: sample.device),
      metadata: serializeMetadata(sample.metadata),

      metadataExternalUUID: sample.metadata?[HKMetadataKeyExternalUUID] as? String,
      metadataTimeZone: sample.metadata?[HKMetadataKeyTimeZone] as? String,
      metadataWasUserEntered: sample.metadata?[HKMetadataKeyWasUserEntered] as? Bool,
      metadataDeviceSerialNumber: sample.metadata?[HKMetadataKeyDeviceSerialNumber] as? String,
      metadataUdiDeviceIdentifier: sample.metadata?[HKMetadataKeyUDIDeviceIdentifier] as? String,
      metadataUdiProductionIdentifier: sample.metadata?[HKMetadataKeyUDIProductionIdentifier]
        as? String,
      metadataDigitalSignature: sample.metadata?[HKMetadataKeyDigitalSignature] as? String,
      metadataDeviceName: sample.metadata?[HKMetadataKeyDeviceName] as? String,
      metadataDeviceManufacturerName: sample.metadata?[HKMetadataKeyDeviceManufacturerName]
        as? String,
      metadataSyncIdentifier: sample.metadata?[HKMetadataKeySyncIdentifier] as? String,
      metadataSyncVersion: sample.metadata?[HKMetadataKeySyncVersion] as? Double,
      metadataWasTakenInLab: sample.metadata?[HKMetadataKeyWasTakenInLab] as? Bool,
      metadataReferenceRangeLowerLimit: sample.metadata?[HKMetadataKeyReferenceRangeLowerLimit]
        as? Double,
      metadataReferenceRangeUpperLimit: sample.metadata?[HKMetadataKeyReferenceRangeUpperLimit]
        as? Double,
      metadataAlgorithmVersion: sample.metadata?[HKMetadataKeyAlgorithmVersion] as? Double
    )
  }
  throw runtimeErrorWithPrefix(
    "Unable to recognize quantityType: \(sample.quantityType.identifier)")
}

func serializeDeletedSample(sample: HKDeletedObject) -> DeletedSample {
  return DeletedSample(
    uuid: sample.uuid.uuidString,
    metadata: serializeMetadata(sample.metadata)
  )
}

func serializeCategorySample(sample: HKCategorySample) -> CategorySample {
  return CategorySample(
    categoryType: CategoryTypeIdentifier(fromString: sample.categoryType.identifier)!,
    value: Double(sample.value),
    sampleType: serializeSampleType(sample.sampleType),
    startDate: sample.startDate,
    endDate: sample.endDate,
    hasUndeterminedDuration: sample.hasUndeterminedDuration,

    metadataWeatherCondition: serializeWeatherCondition(
      sample.metadata?[HKMetadataKeyWeatherCondition] as? HKWeatherCondition),
    metadataWeatherHumidity: serializeUnknownQuantityTyped(
      quantity: sample.metadata?[HKMetadataKeyWeatherHumidity] as? HKQuantity),
    metadataWeatherTemperature: serializeUnknownQuantityTyped(
      quantity: sample.metadata?[HKMetadataKeyWeatherTemperature] as? HKQuantity),
    metadataInsulinDeliveryReason: serializeInsulinDeliveryReason(
      sample.metadata?[HKMetadataKeyInsulinDeliveryReason] as? HKInsulinDeliveryReason),
    metadataHeartRateMotionContext: serializeHeartRateMotionContext(
      sample.metadata?[HKMetadataKeyHeartRateMotionContext] as? HKHeartRateMotionContext),

    uuid: sample.uuid.uuidString,
    sourceRevision: serializeSourceRevision(sample.sourceRevision),
    device: serializeDevice(hkDevice: sample.device),
    metadata: serializeMetadata(sample.metadata),

    metadataExternalUUID: sample.metadata?[HKMetadataKeyExternalUUID] as? String,
    metadataTimeZone: sample.metadata?[HKMetadataKeyTimeZone] as? String,
    metadataWasUserEntered: sample.metadata?[HKMetadataKeyWasUserEntered] as? Bool,
    metadataDeviceSerialNumber: sample.metadata?[HKMetadataKeyDeviceSerialNumber] as? String,
    metadataUdiDeviceIdentifier: sample.metadata?[HKMetadataKeyUDIDeviceIdentifier] as? String,
    metadataUdiProductionIdentifier: sample.metadata?[HKMetadataKeyUDIProductionIdentifier]
      as? String,
    metadataDigitalSignature: sample.metadata?[HKMetadataKeyDigitalSignature] as? String,
    metadataDeviceName: sample.metadata?[HKMetadataKeyDeviceName] as? String,
    metadataDeviceManufacturerName: sample.metadata?[HKMetadataKeyDeviceManufacturerName]
      as? String,
    metadataSyncIdentifier: sample.metadata?[HKMetadataKeySyncIdentifier] as? String,
    metadataSyncVersion: sample.metadata?[HKMetadataKeySyncVersion] as? Double,
    metadataWasTakenInLab: sample.metadata?[HKMetadataKeyWasTakenInLab] as? Bool,
    metadataReferenceRangeLowerLimit: sample.metadata?[HKMetadataKeyReferenceRangeLowerLimit]
      as? Double,
    metadataReferenceRangeUpperLimit: sample.metadata?[HKMetadataKeyReferenceRangeUpperLimit]
      as? Double,
    metadataAlgorithmVersion: sample.metadata?[HKMetadataKeyAlgorithmVersion] as? Double
  )
}

func serializeSource(_ source: HKSource) -> SourceProxy {
  return SourceProxy(
    source: source
  )
}

func serializeUnknownQuantityTyped(quantity: HKQuantity?) -> Quantity? {
  guard let quantity = quantity else {
    return nil
  }

  if quantity.is(compatibleWith: HKUnit.percent()) {
    return serializeQuantityTyped(unit: HKUnit.percent(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.second()) {
    return serializeQuantityTyped(unit: HKUnit.second(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.kilocalorie()) {
    return serializeQuantityTyped(unit: HKUnit.kilocalorie(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.count()) {
    return serializeQuantityTyped(unit: HKUnit.count(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.meter()) {
    return serializeQuantityTyped(unit: HKUnit.meter(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.degreeCelsius()) {
    return serializeQuantityTyped(unit: HKUnit.degreeCelsius(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.atmosphere()) {
    return serializeQuantityTyped(unit: HKUnit.atmosphere(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.gram()) {
    return serializeQuantityTyped(unit: HKUnit.gram(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.liter()) {
    return serializeQuantityTyped(unit: HKUnit.liter(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.volt()) {
    return serializeQuantityTyped(unit: HKUnit.volt(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.hertz()) {
    return serializeQuantityTyped(unit: HKUnit.hertz(), quantity: quantity)
  }

  if quantity.is(compatibleWith: SpeedUnit) {
    return serializeQuantityTyped(unit: SpeedUnit, quantity: quantity)
  }

  if quantity.is(compatibleWith: METUnit) {
    return serializeQuantityTyped(unit: METUnit, quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.internationalUnit()) {
    return serializeQuantityTyped(unit: HKUnit.internationalUnit(), quantity: quantity)
  }

  if quantity.is(compatibleWith: HKUnit.hertz()) {
    return serializeQuantityTyped(unit: HKUnit.hertz(), quantity: quantity)
  }
  if quantity.is(compatibleWith: HKUnit.decibelHearingLevel()) {
    return serializeQuantityTyped(unit: HKUnit.decibelHearingLevel(), quantity: quantity)
  }

  if #available(iOS 16.0, *) {
    if quantity.is(compatibleWith: HKUnit.watt()) {
      return serializeQuantityTyped(unit: HKUnit.watt(), quantity: quantity)
    }

    if quantity.is(compatibleWith: HKUnit.degreeAngle()) {
      return serializeQuantityTyped(unit: HKUnit.degreeAngle(), quantity: quantity)
    }
  }

  if #available(iOS 17.0, *) {
    if quantity.is(compatibleWith: HKUnit.lux()) {
      return serializeQuantityTyped(unit: HKUnit.lux(), quantity: quantity)
    }
  }

  #if compiler(>=6)
    if #available(iOS 18.0, *) {
      if quantity.is(compatibleWith: HKUnit.appleEffortScore()) {
        return serializeQuantityTyped(unit: HKUnit.appleEffortScore(), quantity: quantity)
      }
    }
  #endif

  return nil
}

func serializeUnknownQuantity(quantity: HKQuantity) -> [String: AnyValue]? {
  if let quantityTyped = serializeUnknownQuantityTyped(quantity: quantity) {
    return [
      "quantity": AnyValue.number(quantityTyped.quantity),
      "unit": AnyValue.string(quantityTyped.unit),
    ]
  }

  return nil
}

func serializeMetadata(_ metadata: [String: Any]?) -> AnyMap {
  let serialized = AnyMap()
  if let m = metadata {
    for item in m {
      if let bool = item.value as? Bool {
        serialized.setBoolean(key: item.key, value: bool)
      }

      if let str = item.value as? String {
        serialized.setString(key: item.key, value: str)
      }

      if let double = item.value as? Double {
        serialized.setDouble(key: item.key, value: double)
      }

      if let quantity = item.value as? HKQuantity {
        if let s = serializeUnknownQuantity(quantity: quantity) {
          serialized.setObject(key: item.key, value: s)
        }
      }

      if let dict = item.value as? [String: AnyValue] {
        serialized.setObject(key: item.key, value: dict)
      }
    }
  }
  return serialized
}

func serializeDevice(hkDevice: HKDevice?) -> Device? {
  guard let hkDevice = hkDevice else {
    return nil
  }

  return Device(
    name: hkDevice.name,
    firmwareVersion: hkDevice.firmwareVersion,
    hardwareVersion: hkDevice.hardwareVersion,
    localIdentifier: hkDevice.localIdentifier,
    manufacturer: hkDevice.manufacturer,
    model: hkDevice.model,
    softwareVersion: hkDevice.softwareVersion,
    udiDeviceIdentifier: hkDevice.udiDeviceIdentifier
  )
}

func serializeOperatingSystemVersion(_ version: OperatingSystemVersion) -> String {
  let versionString = "\(version.majorVersion).\(version.minorVersion).\(version.patchVersion)"

  return versionString
}

func serializeSourceRevision(_ hkSourceRevision: HKSourceRevision) -> SourceRevision {
  return SourceRevision(
    source: serializeSource(hkSourceRevision.source),
    version: hkSourceRevision.version,
    operatingSystemVersion: serializeOperatingSystemVersion(
      hkSourceRevision.operatingSystemVersion),
    productType: hkSourceRevision.productType
  )
}

func serializeSampleType(_ sampleType: HKSampleType) -> SampleType {
  return SampleType(
    identifier: sampleType.identifier,
    allowsRecalibrationForEstimates: sampleType.allowsRecalibrationForEstimates,
    isMinimumDurationRestricted: sampleType.isMinimumDurationRestricted,
    isMaximumDurationRestricted: sampleType.isMaximumDurationRestricted
  )
}
