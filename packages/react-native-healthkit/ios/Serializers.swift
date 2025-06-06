//
//  Serializers.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit
import NitroModules

let _dateFormatter = ISO8601DateFormatter()

func serializeQuantity(unit: HKUnit, quantity: HKQuantity?) -> Dictionary<String, AnyValue>? {
    guard let q = quantity else {
        return nil
    }
    return [
        "quantity": AnyValue.number( q.doubleValue(for: unit)),
        "unit": AnyValue.string( unit.unitString)
    ]
}

func serializeQuantityTyped(unit: HKUnit, quantity: HKQuantity?) -> Quantity? {
    guard let q = quantity else {
        return nil
    }
    
    return Quantity(
        unit: unit.unitString,
        quantity: q.doubleValue(for: unit)
    )
}

func serializeQuantitySample(sample: HKQuantitySample, unit: HKUnit) -> QuantitySample {
    return QuantitySample(
        uuid: sample.uuid.uuidString,
        device: serializeDevice(hkDevice: sample.device),
        // todo: handle unknowns
        quantityType: QuantityTypeIdentifier(fromString: sample.quantityType.identifier)!,
        start: sample.startDate,
        end: sample.endDate,
        quantity: sample.quantity.doubleValue(for: unit),
        unit: unit.unitString,
        metadata: serializeMetadata(sample.metadata),
        sourceRevision: serializeSourceRevision(sample.sourceRevision),
    )
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
        start: sample.startDate,
        end: sample.endDate,
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

func serializeUnknownQuantity(quantity: HKQuantity) -> Dictionary<String, AnyValue>? {
    if quantity.is(compatibleWith: HKUnit.percent()) {
        return serializeQuantity(unit: HKUnit.percent(), quantity: quantity)
    }

    if quantity.is(compatibleWith: HKUnit.second()) {
        return serializeQuantity(unit: HKUnit.second(), quantity: quantity)
    }

    if quantity.is(compatibleWith: HKUnit.kilocalorie()) {
        return serializeQuantity(unit: HKUnit.kilocalorie(), quantity: quantity)
    }

    if quantity.is(compatibleWith: HKUnit.count()) {
        return serializeQuantity(unit: HKUnit.count(), quantity: quantity)
    }

    if quantity.is(compatibleWith: HKUnit.meter()) {
        return serializeQuantity(unit: HKUnit.meter(), quantity: quantity)
    }

    if #available(iOS 11, *) {
        if quantity.is(compatibleWith: HKUnit.internationalUnit()) {
            return serializeQuantity(unit: HKUnit.internationalUnit(), quantity: quantity)
        }
    }

    if #available(iOS 13, *) {
        if quantity.is(compatibleWith: HKUnit.hertz()) {
            return serializeQuantity(unit: HKUnit.hertz(), quantity: quantity)
        }
        if quantity.is(compatibleWith: HKUnit.decibelHearingLevel()) {
            return serializeQuantity(unit: HKUnit.decibelHearingLevel(), quantity: quantity)
        }
    }

    if #available(iOS 17.0, *) {
        if quantity.is(compatibleWith: HKUnit.lux()) {
            return serializeQuantity(unit: HKUnit.lux(), quantity: quantity)
        }
    }

#if compiler(>=6)
    if #available(iOS 18.0, *) {
        if quantity.is(compatibleWith: HKUnit.appleEffortScore()) {
            return serializeQuantity(unit: HKUnit.appleEffortScore(), quantity: quantity)
        }
    }
#endif

    if quantity.is(compatibleWith: SpeedUnit) {
        return serializeQuantity(unit: SpeedUnit, quantity: quantity)
    }

    if quantity.is(compatibleWith: METUnit) {
        return serializeQuantity(unit: METUnit, quantity: quantity)
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

func serializeStatistic(unit: HKUnit, quantity: HKQuantity?, stats: HKStatistics?) -> [String: Any]? {
    guard let q = quantity, let stats = stats else {
        return nil
    }

    let endDate = _dateFormatter.string(from: stats.endDate)
    let startDate = _dateFormatter.string(from: stats.startDate)
    let quantityType = stats.quantityType.identifier

    return [
        "quantityType": quantityType,
        "startDate": startDate,
        "endDate": endDate,
        "quantity": q.doubleValue(for: unit),
        "unit": unit.unitString
    ]
}
