//
//  Helpers.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit
import NitroModules

func dateOrNilIfZero(_ timestamp: Double?) -> Date? {
    if let timestamp = timestamp {
        if timestamp == 0 {
           return nil
        }
        return Date.init(timeIntervalSince1970: timestamp)
    }
    return nil

}

func getQueryLimit(_ limit: Double) -> Int {
  if limit == .infinity || limit <= 0 || limit == .nan || limit == .signalingNaN {
      return HKObjectQueryNoLimit
  }

  return Int(limit)
}

func createPredicateForWorkout(filter: FilterForWorkouts?) throws -> NSPredicate? {
  if let filter = filter {

  let metadataFilters = try filter.metadata?.compactMap({ metadataKey in
    return try createMetadataPredicate(metadataKey: metadataKey)
  }) ?? []

  let otherFilters = [
    createUUIDsPredicate(uuids: filter.uuids),
    createDatePredicate(startDate: filter.startDate, endDate: filter.endDate, strictStartDate: filter.strictStartDate, strictEndDate: filter.strictEndDate),
    filter.workoutActivityType != nil ? HKQuery.predicateForWorkouts(with: HKWorkoutActivityType.init(rawValue: UInt(filter.workoutActivityType!.rawValue))!) : nil,
    filter.duration != nil ? HKQuery.predicateForWorkouts(with: NSComparisonPredicate.Operator(rawValue: UInt(filter.duration!.predicateOperator.rawValue))!, duration: filter.duration!.durationInSeconds) : nil,
  ].compactMap { $0 }

  let allFilters = otherFilters + metadataFilters

  return allFilters.count > 1
    ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allFilters)
    : allFilters.first
  }
  return nil
}

func createDatePredicate(startDate: Date?, endDate: Date?, strictStartDate: Bool?, strictEndDate: Bool?) -> NSPredicate? {
  if startDate == nil && endDate == nil {
    return nil
  }

    let strictStartDate = strictStartDate ?? false
    let strictEndDate = strictEndDate ?? false

    let options: HKQueryOptions = strictStartDate && strictEndDate
        ? [.strictStartDate, .strictEndDate]
        : strictEndDate
            ? .strictEndDate
            : strictStartDate
                ? .strictStartDate
                : []

    return HKQuery.predicateForSamples(
        withStart: startDate,
        end: endDate,
        options: options
    )
}

func createUUIDsPredicate(uuids: [String]?) -> NSPredicate? {
  if let uuids = uuids {
    let uuids = uuids.compactMap { uuidStr -> UUID? in
        do {
            let uuid = try initializeUUID(uuidStr)
            return uuid
        } catch {
            print(error.localizedDescription)
            return nil
        }
    }
    return HKQuery.predicateForObjects(with: Set(uuids))
  }
  return nil
}

func createMetadataPredicate(metadataKey: PredicateWithMetadataKey?) throws -> NSPredicate? {
  if let metadataKey = metadataKey {

    guard let valueVariant = metadataKey.value else {
        return HKQuery.predicateForObjects(withMetadataKey: metadataKey.withMetadataKey)
    }

    let actualValue: Any

    switch valueVariant {
      case .first(let boolValue):
          actualValue = NSNumber(value: boolValue ? 1 : 0)
      case .second(let stringValue):
          actualValue = stringValue
      case .third(let doubleValue):
          actualValue = NSNumber(value: doubleValue)
      case .fourth(let dateValue):
          actualValue = dateValue
    }

    let operatorType: NSComparisonPredicate.Operator

    if let operatorTypeValue = metadataKey.operatorType {
        switch operatorTypeValue {
          case PredicateWithMetadataOperator.equalto:
              operatorType = .equalTo
          case PredicateWithMetadataOperator.notequalto:
              operatorType = .notEqualTo
          case PredicateWithMetadataOperator.greaterthan:
              operatorType = .greaterThan
          case PredicateWithMetadataOperator.lessthan:
              operatorType = .lessThan
          default:
              throw RuntimeError.error(withMessage: "Unsupported operator: \(operatorTypeValue)")
        }
    } else {
        operatorType = .equalTo
    }

    return HKQuery.predicateForObjects(
        withMetadataKey: metadataKey.withMetadataKey,
        operatorType: operatorType,
        value: actualValue
    )
  }
  return nil
}

func createPredicate(filter: FilterForSamples?) throws -> NSPredicate? {
  if let filter = filter {
    let metadataFilters = try filter.metadata?.compactMap({ metadataKey in
      return try createMetadataPredicate(metadataKey: metadataKey)
    }) ?? []

    let w = filter.workout as? WorkoutProxy
    let otherFilters = [
      createUUIDsPredicate(uuids: filter.uuids),
      createDatePredicate(startDate: filter.startDate, endDate: filter.endDate, strictStartDate: filter.strictStartDate, strictEndDate: filter.strictEndDate),
      w?.workoutPredicate,
    ].compactMap { $0 }

    let allFilters = otherFilters + metadataFilters

    return allFilters.count > 1
      ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allFilters)
      : allFilters.first

  }
  return nil
}

func getSortDescriptors(ascending: Bool?) -> [NSSortDescriptor] {
    return [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending ?? false)]
}

func getSortDescsdsdriptors(ascending: Bool?) -> [NSSortDescriptor] {
    return [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending ?? false)]
}

func deserializeHKQueryAnchor(base64String: String?) throws -> HKQueryAnchor? {
    if let base64String = base64String {
        if base64String.isEmpty {
            return nil
        }

        // Step 1: Decode the base64 string to a Data object
        guard let data = Data(base64Encoded: base64String) else {
            throw RuntimeError.error(withMessage: "[react-native-healthkit] Invalid base64 string: \(base64String)")
        }

        // Step 2: Use NSKeyedUnarchiver to unarchive the data and create an HKQueryAnchor object
        do {
            let unarchiver = try NSKeyedUnarchiver(forReadingFrom: data)
            unarchiver.requiresSecureCoding = true
            let anchor = try? NSKeyedUnarchiver.unarchiveTopLevelObjectWithData(data)

            return anchor as? HKQueryAnchor
        } catch {
            throw RuntimeError.error(withMessage: "[react-native-healthkit] Error recreating HKQueryAnchor object: \(error.localizedDescription)")
        }
    }
    return nil
}

func initializeCategoryType(_ identifier: String) throws -> HKCategoryType {
    let identifier = HKCategoryTypeIdentifier(rawValue: identifier)
    if let sampleType = HKSampleType.categoryType(forIdentifier: identifier) {
        return sampleType
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Failed to initialize unrecognized categoryType with identifier \(identifier)")
}

func initializeWorkoutActivityType(_ typeIdentifier: UInt) throws -> HKWorkoutActivityType {
    if let type = HKWorkoutActivityType.init(rawValue: typeIdentifier) {
        return type
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Failed to initialize unrecognized quantityType with identifier \(typeIdentifier)")
}

func initializeQuantityType(_ identifier: String) throws -> HKQuantityType {
    let identifier = HKQuantityTypeIdentifier(rawValue: identifier)

    if let sampleType = HKSampleType.quantityType(forIdentifier: identifier) {
        return sampleType
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Failed to initialize unrecognized quantityType with identifier \(identifier)")
}

func initializeCorrelationType(_ identifier: String) throws -> HKCorrelationType {
    let identifier = HKCorrelationTypeIdentifier(rawValue: identifier)

    if let sampleType = HKSampleType.correlationType(forIdentifier: identifier) {
        return sampleType
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Failed to initialize unrecognized correlationType with identifier \(identifier)")
}

func initializeSeriesType(_ identifier: String) throws -> HKSeriesType {
    if let seriesType = HKObjectType.seriesType(forIdentifier: identifier) {
        return seriesType
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Failed to initialize unrecognized seriesType with identifier \(identifier)")
}

func sampleTypeFrom(sampleTypeIdentifier: SampleTypeIdentifier) throws -> HKSampleType {
    if let sampleType = try sampleTypeFromStringNullable(typeIdentifier: sampleTypeIdentifier.stringValue) {
        return sampleType
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Failed to initialize unrecognized sampleType with identifier \(sampleTypeIdentifier.stringValue)")
}

func sampleTypeFrom(sampleTypeIdentifierWriteable: SampleTypeIdentifierWriteable) throws -> HKSampleType {
    if let sampleType = try sampleTypeFromStringNullable(typeIdentifier: sampleTypeIdentifierWriteable.stringValue) {
        return sampleType
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Failed to initialize unrecognized sampleType with identifier \(sampleTypeIdentifierWriteable.stringValue)")
}

private func sampleTypeFromStringNullable(typeIdentifier: String) throws -> HKSampleType? {
    if typeIdentifier.starts(with: HKQuantityTypeIdentifier_PREFIX) {
        return try initializeQuantityType(typeIdentifier)
    }

    if typeIdentifier.starts(with: HKCategoryTypeIdentifier_PREFIX) {
        return try initializeCategoryType(typeIdentifier)
    }

    if typeIdentifier.starts(with: HKCorrelationTypeIdentifier_PREFIX) {
        return try initializeCorrelationType(typeIdentifier)
    }

    if typeIdentifier == HKWorkoutTypeIdentifier {
        return HKSampleType.workoutType()
    }

    if #available(iOS 11.0, *) {
        if typeIdentifier == HKWorkoutRouteTypeIdentifier {
            return try initializeSeriesType(typeIdentifier)
        }
    }

    if #available(iOS 13, *) {
        if typeIdentifier == HKAudiogramTypeIdentifier {
            return HKObjectType.audiogramSampleType()
        }

        if typeIdentifier == HKDataTypeIdentifierHeartbeatSeries {
            return try initializeSeriesType(typeIdentifier)
        }

        if typeIdentifier == HKAudiogramTypeIdentifier {
            return HKSampleType.audiogramSampleType()
        }
    }

    if #available(iOS 14, *) {
        if typeIdentifier == HKElectrocardiogramType {
            return HKSampleType.electrocardiogramType()
        }
    }

    #if compiler(>=6)
        if #available(iOS 18, *) {
            if typeIdentifier == HKStateOfMindTypeIdentifier {
                return HKObjectType.stateOfMindType()
            }
        }
    #endif

    return nil
}

func objectTypesFromArray(typeIdentifiers: [ObjectTypeIdentifier]) -> Set<HKObjectType> {
    var share = Set<HKObjectType>()
    for typeIdentifier in typeIdentifiers {
        do {
            let objectType = try objectTypeFrom(objectTypeIdentifier: typeIdentifier)
            share.insert(objectType)
        } catch {
            print(error.localizedDescription)
        }
    }
    return share
}

func initializeUUID(_ uuidString: String) throws -> UUID {
    if let uuid = UUID(uuidString: uuidString) {
       return uuid
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Got invalid UUID: \(uuidString)")
}

func sampleTypesFromArray(typeIdentifiers: [SampleTypeIdentifier]) -> Set<HKSampleType> {
    return Set(typeIdentifiers.compactMap { typeIdentifier in
        do {
            let sampleType = try sampleTypeFrom(sampleTypeIdentifier: typeIdentifier)
            return sampleType
        } catch {
            print(error.localizedDescription)
        }
        return nil
    })
}

func sampleTypesFromArray(typeIdentifiersWriteable: [SampleTypeIdentifierWriteable]) -> Set<HKSampleType> {
    return Set(typeIdentifiersWriteable.compactMap { typeIdentifier in
        do {
            let sampleType = try sampleTypeFrom(sampleTypeIdentifierWriteable: typeIdentifier)
            return sampleType
        } catch {
            print(error.localizedDescription)
        }
        return nil
    })
}

// objectType is wider than sampleType, so it uses it under the hood
func objectTypeFrom(objectTypeIdentifier: ObjectTypeIdentifier) throws -> HKObjectType {
    let typeIdentifier = objectTypeIdentifier.stringValue
    if let sampleType = try sampleTypeFromStringNullable(typeIdentifier: typeIdentifier) {
        return sampleType
    }

    if typeIdentifier.starts(with: HKCharacteristicTypeIdentifier_PREFIX) {
        let identifier = HKCharacteristicTypeIdentifier.init(rawValue: typeIdentifier)
        if let type = HKObjectType.characteristicType(forIdentifier: identifier) as HKObjectType? {
            return type
        }
    }

    if typeIdentifier == HKActivitySummaryTypeIdentifier {
        return HKObjectType.activitySummaryType()
    }

    throw RuntimeError.error(withMessage: "[react-native-healthkit] Failed initializing unrecognized objectType identifier " + typeIdentifier)
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

func parseWorkoutConfiguration(_ config: WorkoutConfiguration) -> HKWorkoutConfiguration {
    let configuration = HKWorkoutConfiguration()

    if let activityType = HKWorkoutActivityType(rawValue: UInt(config.activityType.rawValue)) {
      configuration.activityType = activityType
    }

    if let locationTypeRaw = config.locationType,
       let locationType = HKWorkoutSessionLocationType(rawValue: Int(locationTypeRaw.rawValue)) {
        configuration.locationType = locationType
    }

    return configuration
}

// Returns all available HKQuantityTypeIdentifier raw values as an array of String
func allQuantityTypeIdentifiers() -> [String] {
    let allIdentifiers: [HKQuantityTypeIdentifier] = [
        .bodyMassIndex,
        .bodyFatPercentage,
        .height,
        .bodyMass,
        .leanBodyMass,
        .waistCircumference,
        .stepCount,
        .distanceWalkingRunning,
        .distanceCycling,
        .distanceWheelchair,
        .basalEnergyBurned,
        .activeEnergyBurned,
        .flightsClimbed,
        .nikeFuel,
        .appleExerciseTime,
        .pushCount,
        .distanceSwimming,
        .swimmingStrokeCount,
        .vo2Max,
        .distanceDownhillSnowSports,
        .appleStandTime,
        .walkingSpeed,
        .walkingDoubleSupportPercentage,
        .walkingAsymmetryPercentage,
        .walkingStepLength,
        .sixMinuteWalkTestDistance,
        .stairAscentSpeed,
        .stairDescentSpeed,
        .heartRate,
        .bodyTemperature,
        .basalBodyTemperature,
        .bloodPressureSystolic,
        .bloodPressureDiastolic,
        .respiratoryRate,
        .restingHeartRate,
        .walkingHeartRateAverage,
        .heartRateVariabilitySDNN,
        .oxygenSaturation,
        .peripheralPerfusionIndex,
        .bloodGlucose,
        .numberOfTimesFallen,
        .electrodermalActivity,
        .inhalerUsage,
        .insulinDelivery,
        .bloodAlcoholContent,
        .forcedVitalCapacity,
        .forcedExpiratoryVolume1,
        .peakExpiratoryFlowRate,
        .environmentalAudioExposure,
        .headphoneAudioExposure,
        .dietaryFatTotal,
        .dietaryFatPolyunsaturated,
        .dietaryFatMonounsaturated,
        .dietaryFatSaturated,
        .dietaryCholesterol,
        .dietarySodium,
        .dietaryCarbohydrates,
        .dietaryFiber,
        .dietarySugar,
        .dietaryEnergyConsumed,
        .dietaryProtein,
        .dietaryVitaminA,
        .dietaryVitaminB6,
        .dietaryVitaminB12,
        .dietaryVitaminC,
        .dietaryVitaminD,
        .dietaryVitaminE,
        .dietaryVitaminK,
        .dietaryCalcium,
        .dietaryIron,
        .dietaryThiamin,
        .dietaryRiboflavin,
        .dietaryNiacin,
        .dietaryFolate,
        .dietaryBiotin,
        .dietaryPantothenicAcid,
        .dietaryPhosphorus,
        .dietaryIodine,
        .dietaryMagnesium,
        .dietaryZinc,
        .dietarySelenium,
        .dietaryCopper,
        .dietaryManganese,
        .dietaryChromium,
        .dietaryMolybdenum,
        .dietaryChloride,
        .dietaryPotassium,
        .dietaryCaffeine,
        .dietaryWater,
        .uvExposure
        // Add more identifiers as needed for your iOS version
    ]
    let supported = allIdentifiers.compactMap { identifier in
        HKObjectType.quantityType(forIdentifier: identifier) != nil ? identifier.rawValue : nil
    }
    let missing = allIdentifiers.filter { HKObjectType.quantityType(forIdentifier: $0) == nil }
    if !missing.isEmpty {
        print("[react-native-healthkit] Warning: The following HKQuantityTypeIdentifiers are not available on this iOS version: \(missing.map { $0.rawValue })")
    }
    // --- New logic: Warn if any available identifier is not in the hardcoded list ---
    // Try common HealthKit identifier strings (brute-force, as Apple does not provide a list)
    let knownPrefixes = [
        "HKQuantityTypeIdentifier",
        "HKQuantityTypeIdentifierDietary",
        "HKQuantityTypeIdentifierEnvironmental",
        "HKQuantityTypeIdentifierBlood",
        "HKQuantityTypeIdentifierBody",
        "HKQuantityTypeIdentifierDistance",
        "HKQuantityTypeIdentifierHeart",
        "HKQuantityTypeIdentifierRespiratory",
        "HKQuantityTypeIdentifierWalking",
        "HKQuantityTypeIdentifierSwimming",
        "HKQuantityTypeIdentifierApple"
    ]
    var foundButNotListed: [String] = []
    // Try all possible identifier strings (brute-force for demonstration, not exhaustive)
    for codePoint in 0..<300 {
        for prefix in knownPrefixes {
            let candidate = prefix + String(codePoint)
            if let type = HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: candidate)),
               !allIdentifiers.contains(where: { $0.rawValue == candidate }) {
                foundButNotListed.append(candidate)
            }
        }
    }
    if !foundButNotListed.isEmpty {
        print("[react-native-healthkit] Warning: The following HKQuantityTypeIdentifiers are available on this iOS version but NOT included in the hardcoded list: \(foundButNotListed)")
    }
    return supported
}
