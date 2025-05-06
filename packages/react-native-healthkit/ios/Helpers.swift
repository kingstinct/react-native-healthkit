//
//  Helpers.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit

func dateOrNilIfZero(date: Date) -> Date? {
    return date.timeIntervalSince1970 > 0 ? date : nil
}

func limitOrNilIfZero(limit: Int) -> Int {
    return limit == 0 ? HKObjectQueryNoLimit : limit
}

func createPredicate(from: Date?, to: Date?) -> NSPredicate? {
    if from != nil || to != nil {
        return HKQuery.predicateForSamples(
            withStart: from, end: to, options: [.strictEndDate, .strictStartDate])
    } else {
        return nil
    }
}

func getSortDescriptors(ascending: Bool) -> [NSSortDescriptor] {
    return [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending)]
}

func base64StringToHKQueryAnchor(base64String: String) -> HKQueryAnchor? {
    // Step 1: Decode the base64 string to a Data object
    guard let data = Data(base64Encoded: base64String) else {
        print("Error: Invalid base64 string")
        return nil
    }

    // Step 2: Use NSKeyedUnarchiver to unarchive the data and create an HKQueryAnchor object
    do {
        let unarchiver = try NSKeyedUnarchiver(forReadingFrom: data)
        unarchiver.requiresSecureCoding = true
        let anchor = try? NSKeyedUnarchiver.unarchiveTopLevelObjectWithData(data)

        return anchor as? HKQueryAnchor
    } catch {
        print("Error: Unable to unarchive HKQueryAnchor object: \(error)")
        return nil
    }
}

func sampleTypeFromString(typeIdentifier: String) -> HKSampleType? {
    if typeIdentifier.starts(with: HKQuantityTypeIdentifier_PREFIX) {
        let identifier = HKQuantityTypeIdentifier.init(rawValue: typeIdentifier)
        return HKSampleType.quantityType(forIdentifier: identifier) as HKSampleType?
    }

    if typeIdentifier.starts(with: HKCategoryTypeIdentifier_PREFIX) {
        let identifier = HKCategoryTypeIdentifier.init(rawValue: typeIdentifier)
        return HKSampleType.categoryType(forIdentifier: identifier) as HKSampleType?
    }

    if typeIdentifier.starts(with: HKCorrelationTypeIdentifier_PREFIX) {
        let identifier = HKCorrelationTypeIdentifier.init(rawValue: typeIdentifier)
        return HKSampleType.correlationType(forIdentifier: identifier) as HKSampleType?
    }

    if #available(iOS 13, *) {
        if typeIdentifier == HKAudiogramTypeIdentifier {
            return HKSampleType.audiogramSampleType()
        }
    }

    if typeIdentifier == HKWorkoutTypeIdentifier {
        return HKSampleType.workoutType()
    }

    if #available(iOS 11.0, *) {
        if typeIdentifier == HKWorkoutRouteTypeIdentifier {
            return HKObjectType.seriesType(forIdentifier: typeIdentifier)
        }
    }

    return nil
}

func objectTypesFromDictionary(typeIdentifiers: NSDictionary) -> Set<HKObjectType> {
    var share = Set<HKObjectType>()
    for item in typeIdentifiers {
        if item.value as! Bool {
            let objectType = objectTypeFromString(typeIdentifier: item.key as! String)
            if objectType != nil {
                share.insert(objectType!)
            }
        }
    }
    return share
}

func sampleTypesFromDictionary(typeIdentifiers: NSDictionary) -> Set<HKSampleType> {
    var share = Set<HKSampleType>()
    for item in typeIdentifiers {
        if item.value as! Bool {
            let sampleType = sampleTypeFromString(typeIdentifier: item.key as! String)
            if sampleType != nil {
                share.insert(sampleType!)
            }
        }
    }
    return share
}

func objectTypeFromString(typeIdentifier: String) -> HKObjectType? {
    if typeIdentifier.starts(with: HKCharacteristicTypeIdentifier_PREFIX) {
        let identifier = HKCharacteristicTypeIdentifier.init(rawValue: typeIdentifier)
        return HKObjectType.characteristicType(forIdentifier: identifier) as HKObjectType?
    }

    if typeIdentifier.starts(with: HKQuantityTypeIdentifier_PREFIX) {
        let identifier = HKQuantityTypeIdentifier.init(rawValue: typeIdentifier)
        return HKObjectType.quantityType(forIdentifier: identifier) as HKObjectType?
    }

    if typeIdentifier.starts(with: HKCategoryTypeIdentifier_PREFIX) {
        let identifier = HKCategoryTypeIdentifier.init(rawValue: typeIdentifier)
        return HKObjectType.categoryType(forIdentifier: identifier) as HKObjectType?
    }

    if typeIdentifier.starts(with: HKCorrelationTypeIdentifier_PREFIX) {
        let identifier = HKCorrelationTypeIdentifier.init(rawValue: typeIdentifier)
        return HKObjectType.correlationType(forIdentifier: identifier) as HKObjectType?
    }

    if typeIdentifier == HKActivitySummaryTypeIdentifier {
        return HKObjectType.activitySummaryType()
    }

    #if compiler(>=6)
        if #available(iOS 18, *) {
            if typeIdentifier == HKStateOfMindTypeIdentifier {
                return HKObjectType.stateOfMindType()
            }
        }
    #endif

    if #available(iOS 13, *) {
        if typeIdentifier == HKAudiogramTypeIdentifier {
            return HKObjectType.audiogramSampleType()
        }

        if typeIdentifier == HKDataTypeIdentifierHeartbeatSeries {
            return HKObjectType.seriesType(forIdentifier: typeIdentifier)
        }
    }

    if typeIdentifier == HKWorkoutTypeIdentifier {
        return HKObjectType.workoutType()
    }

    if #available(iOS 11.0, *) {
        if typeIdentifier == HKWorkoutRouteTypeIdentifier {
            return HKObjectType.seriesType(forIdentifier: typeIdentifier)
        }
    }

    return nil
}

func hkStatisticsOptionsFromOptions(_ options: NSArray) -> HKStatisticsOptions {
    var opts = HKStatisticsOptions()

    for o in options {
        guard let str = o as? String else { continue }

        switch str {
        case "cumulativeSum":
            opts.insert(.cumulativeSum)
        case "discreteAverage":
            opts.insert(.discreteAverage)
        case "discreteMax":
            opts.insert(.discreteMax)
        case "discreteMin":
            opts.insert(.discreteMin)
        case "discreteMostRecent":
            if #available(iOS 12, *) {
                opts.insert(.discreteMostRecent)
            }
        case "duration":
            if #available(iOS 13, *) {
                opts.insert(.duration)
            }
        case "mostRecent":
            if #available(iOS 13, *) {
                opts.insert(.mostRecent)
            }
        case "separateBySource":
            opts.insert(.separateBySource)
        default:
            continue
        }
    }

    return opts
}

func componentsFromInterval(_ interval: NSDictionary) -> DateComponents {
    let componentKeys: [String: WritableKeyPath<DateComponents, Int?>] = [
        "minute": \.minute,
        "hour": \.hour,
        "day": \.day,
        "month": \.month,
        "year": \.year
    ]

    var intervalComponents = DateComponents()
    for (key, keyPath) in componentKeys {
        if let value = interval[key] as? Int {
            intervalComponents[keyPath: keyPath] = value
        }
    }
    return intervalComponents
}

func serializeQuantityIfExists(unit: HKUnit, quantity: HKQuantity?) -> [String: Any]? {
    guard let quantity = quantity else { return nil }
    return serializeQuantity(unit: unit, quantity: quantity)
}

func serializeStatisticIfExists(unit: HKUnit, quantity: HKQuantity?, stats: HKStatistics)
    -> [String: Any]? {
    guard let quantity = quantity else { return nil }
    return serializeStatistic(unit: unit, quantity: quantity, stats: stats)
}

func parseWorkoutConfiguration(_ dict: NSDictionary) -> HKWorkoutConfiguration {
    let configuration = HKWorkoutConfiguration()

    if let activityTypeRaw = dict[HKWorkoutActivityTypePropertyName] as? UInt,
        let activityType = HKWorkoutActivityType(rawValue: activityTypeRaw) {
        configuration.activityType = activityType
    }

    if let locationTypeRaw = dict[HKWorkoutSessionLocationTypePropertyName] as? Int,
        let locationType = HKWorkoutSessionLocationType(rawValue: locationTypeRaw) {
        configuration.locationType = locationType
    }

    return configuration
}
