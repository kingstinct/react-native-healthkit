//
//  Serializers.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit
import NitroModules

func serializeQuantityTyped(unit: HKUnit, quantity: HKQuantity?) -> Quantity? {
    guard let q = quantity else {
        return nil
    }
    
    return Quantity(
        unit: unit.unitString,
        quantity: q.doubleValue(for: unit)
    )
}

func serializeQuantitySample(sample: HKQuantitySample, unit: HKUnit) throws -> QuantitySample {
    if let quantityType = QuantityTypeIdentifier(fromString: sample.quantityType.identifier) {
        return QuantitySample(
            uuid: sample.uuid.uuidString,
            device: serializeDevice(hkDevice: sample.device),
            quantityType: quantityType,
            startDate: sample.startDate,
            endDate: sample.endDate,
            quantity: sample.quantity.doubleValue(for: unit),
            unit: unit.unitString,
            metadata: serializeMetadata(sample.metadata),
            sourceRevision: serializeSourceRevision(sample.sourceRevision),
        )
    }
    throw RuntimeError.error(withMessage: "[react-native-healthkit] Unable to recognize quantityType: \(sample.quantityType.identifier)")
}

func serializeDeletedSample(sample: HKDeletedObject) -> DeletedSample {
  return DeletedSample(
    uuid: sample.uuid.uuidString,
    metadata: serializeMetadata(sample.metadata)
  )
}


func serializeCategorySample(sample: HKCategorySample) -> CategorySample {
    return CategorySample(
        uuid: sample.uuid.uuidString,
        device: serializeDevice(hkDevice: sample.device),
        categoryType: CategoryTypeIdentifier(fromString: sample.categoryType.identifier)!,
        startDate: sample.startDate,
        endDate: sample.endDate,
        value: Double(sample.value),
        metadata: serializeMetadata(sample.metadata),
        sourceRevision: serializeSourceRevision(sample.sourceRevision)
    )
}

func serializeSource(_ source: HKSource) -> margelo.nitro.healthkit.Source {
    return margelo.nitro.healthkit.Source(
        name: source.name,
        bundleIdentifier: source.bundleIdentifier
    )
}


func getUnitForQuantityType(quantityType: HKQuantityType) -> HKUnit? {
    if quantityType.is(compatibleWith: HKUnit.percent()) {
        return HKUnit.percent()
    }

    if quantityType.is(compatibleWith: HKUnit.second()) {
        return HKUnit.second()
    }

    if quantityType.is(compatibleWith: HKUnit.kilocalorie()) {
        return HKUnit.kilocalorie()
    }

    if quantityType.is(compatibleWith: HKUnit.count()) {
        return HKUnit.count()
    }

    if quantityType.is(compatibleWith: HKUnit.meter()) {
        return HKUnit.meter()
    }
    
    if quantityType.is(compatibleWith: SpeedUnit) {
        return SpeedUnit
    }

    if quantityType.is(compatibleWith: METUnit) {
        return METUnit
    }

    if #available(iOS 11, *) {
        if quantityType.is(compatibleWith: HKUnit.internationalUnit()) {
            return HKUnit.internationalUnit()
        }
    }

    if #available(iOS 13, *) {
        if quantityType.is(compatibleWith: HKUnit.hertz()) {
            return HKUnit.hertz()
        }
        if quantityType.is(compatibleWith: HKUnit.decibelHearingLevel()) {
            return HKUnit.decibelHearingLevel()
        }
    }

    if #available(iOS 17.0, *) {
        if quantityType.is(compatibleWith: HKUnit.lux()) {
            return HKUnit.lux()
        }
    }

#if compiler(>=6)
    if #available(iOS 18.0, *) {
        if quantityType.is(compatibleWith: HKUnit.appleEffortScore()) {
            return HKUnit.appleEffortScore()
        }
    }
#endif


    return nil
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

    if #available(iOS 11, *) {
        if quantity.is(compatibleWith: HKUnit.internationalUnit()) {
            return serializeQuantityTyped(unit: HKUnit.internationalUnit(), quantity: quantity)
        }
    }

    if #available(iOS 13, *) {
        if quantity.is(compatibleWith: HKUnit.hertz()) {
            return serializeQuantityTyped(unit: HKUnit.hertz(), quantity: quantity)
        }
        if quantity.is(compatibleWith: HKUnit.decibelHearingLevel()) {
            return serializeQuantityTyped(unit: HKUnit.decibelHearingLevel(), quantity: quantity)
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

    if quantity.is(compatibleWith: SpeedUnit) {
        return serializeQuantityTyped(unit: SpeedUnit, quantity: quantity)
    }

    if quantity.is(compatibleWith: METUnit) {
        return serializeQuantityTyped(unit: METUnit, quantity: quantity)
    }

    return nil
}

func serializeUnknownQuantity(quantity: HKQuantity) -> Dictionary<String, AnyValue>? {
    if let quantityTyped = serializeUnknownQuantityTyped(quantity: quantity) {
        return [
            "quantity": AnyValue.number(quantityTyped.quantity),
            "unit": AnyValue.string(quantityTyped.unit)
        ]
    }
    
    return nil
}

func serializeMetadata(_ metadata: [String: Any]?) -> AnyMapHolder {
    let serialized = AnyMapHolder()
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
            
            if let dict = item.value as? Dictionary<String, AnyValue> {
                serialized.setObject(key: item.key, value: dict)
            }
        }
    }
    return serialized
}

/*func serializeGenericMetadata(_ metadata: [String: Any]?) -> GenericMetadata? {
    if let metadata = metadata {
        return GenericMetadata(
            HKExternalUUID: metadata["HKExternalUUID"] as? String,
            HKTimeZone: metadata["HKTimeZone"] as? String,
            HKWasUserEntered: metadata["HKWasUserEntered"] as? Bool,
            HKDeviceSerialNumber: metadata["HKDeviceSerialNumber"] as? String,
            HKUDIDeviceIdentifier: metadata["HKUDIDeviceIdentifier"] as? String,
            HKUDIProductionIdentifier: metadata["HKUDIProductionIdentifier"] as? String,
            HKDigitalSignature: metadata["HKDigitalSignature"] as? String,
            HKDeviceName: metadata["HKDeviceName"] as? String,
            HKDeviceManufacturerName: metadata["HKDeviceManufacturerName"] as? String,
            HKSyncIdentifier: metadata["HKSyncIdentifier"] as? String,
            HKSyncVersion: metadata["HKSyncVersion"] as? Double,
            HKWasTakenInLab: metadata["HKWasTakenInLab"] as? Bool,
            HKReferenceRangeLowerLimit: metadata["HKReferenceRangeLowerLimit"] as? Double,
            HKReferenceRangeUpperLimit: metadata["HKReferenceRangeUpperLimit"] as? Double,
            allMetadata: serializeAllMetadata(metadata)
        )
    }
    return nil
}*/

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

func serializeOperatingSystemVersion(_ version: OperatingSystemVersion?) -> String? {
    guard let version = version else {
        return nil
    }

    let versionString = "\(version.majorVersion).\(version.minorVersion).\(version.patchVersion)"

    return versionString
}

func serializeSourceRevision(_ hkSourceRevision: HKSourceRevision?) -> SourceRevision? {
    guard let hkSourceRevision = hkSourceRevision else {
        return nil
    }

    
    if #available(iOS 11, *) {
        return SourceRevision(
            source: serializeSource(hkSourceRevision.source),
            version: hkSourceRevision.version,
            operatingSystemVersion: serializeOperatingSystemVersion( hkSourceRevision.operatingSystemVersion),
            productType: hkSourceRevision.productType
        )
    }
    
    return SourceRevision(
        source: serializeSource(hkSourceRevision.source),
        version: hkSourceRevision.version,
        operatingSystemVersion: nil,
        productType: nil
    )
}

func serializeAnchor(anchor: HKQueryAnchor?) -> String? {
    if let anchor = anchor {
      let data = NSKeyedArchiver.archivedData(withRootObject: anchor)
      let encoded = data.base64EncodedString()

      return encoded
    } else {
        return nil
    }
}
