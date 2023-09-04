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
        return HKQuery.predicateForSamples(withStart: from, end: to, options: [.strictEndDate, .strictStartDate])
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
