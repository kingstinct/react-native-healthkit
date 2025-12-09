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

func createSourcePredicate(_ sources: [HybridSourceProxySpec]?) -> NSPredicate? {
  if let sources = sources {

    let sourceSet = Set(sources.compactMap({ source in
      return (source as? SourceProxy)?.source
    }))
    if sourceSet.count > 0 {
      return HKQuery.predicateForObjects(from: sourceSet)
    }
  }
  return nil
}

func createDurationFilter(_ duration: WorkoutDurationPredicate?) -> NSPredicate? {
  if let duration = duration {
    if let predicateOperator = NSComparisonPredicate.Operator(rawValue: UInt(duration.predicateOperator.rawValue)) {
      return HKQuery.predicateForWorkouts(with: predicateOperator, duration: duration.durationInSeconds)
    } else {
      print("[react-native-healthkit] Unsupported operator in duration filter: \(duration.predicateOperator.rawValue)")
    }
  }
  return nil
}

func createWorkoutActivityTypeFilter(_ workoutActivityType: WorkoutActivityType?) -> NSPredicate? {
  if let workoutActivityType = workoutActivityType {
    if let workoutActivityType = HKWorkoutActivityType.init(rawValue: UInt(workoutActivityType.rawValue)) {
      return HKQuery.predicateForWorkouts(with: workoutActivityType)
    } else {
      print("[react-native-healthkit] Unsupported workout activity type in filter: \(workoutActivityType.rawValue)")
    }
  }
  return nil
}

func createPredicateForWorkoutBase(_ filter: FilterForWorkoutsBase?) -> NSPredicate? {
  if let filter = filter {
    let allFilters = [
      createMetadataPredicate(filter.metadata),
      createUUIDPredicate(filter.uuid),
      createUUIDsPredicate(uuids: filter.uuids),
      createDatePredicate(filter.date),
      createWorkoutActivityTypeFilter(filter.workoutActivityType),
      createDurationFilter(filter.duration),
      createSourcePredicate(filter.sources),
    ].compactMap { $0 }

    return allFilters.count > 1
      ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allFilters)
      : allFilters.first
  }
  return nil
}

func getPredicateForWorkoutBase(_ filter: FilterForWorkouts?) -> FilterForWorkoutsBase? {
  if let filter = filter {
    return FilterForWorkoutsBase(
      workoutActivityType: filter.workoutActivityType,
      duration: filter.duration,
      uuid: filter.uuid,
      uuids: filter.uuids,
      metadata: filter.metadata,
      date: filter.date,
      sources: filter.sources
    )
  }
  return nil
}

func createCompoundOrPredicateForWorkout(OR: [FilterForWorkoutsBase]?) -> NSPredicate? {
  if let OR = OR {
    let orPredicates = OR.compactMap({ filter in
      return createPredicateForWorkoutBase(filter)
    })

    let compoundOr = orPredicates.count > 1
      ? NSCompoundPredicate.init(orPredicateWithSubpredicates: orPredicates)
      : orPredicates.first

    if orPredicates.count < 2 {
      print("[react-native-healthkit] Workout filter OR clause contains less than 2 valid predicates.")
    }
    return compoundOr
  }

  return nil
}

func createNotPredicateForWorkout(NOT: [FilterForWorkoutsBase]?) -> NSPredicate? {
  if let NOT = NOT {
    let notPredicates = NOT.compactMap({ filter in
      if let pred = createPredicateForWorkoutBase(filter) {
        return NSCompoundPredicate.init(notPredicateWithSubpredicate: pred)
      }
      return nil
    })

    return notPredicates.count > 1
      ? NSCompoundPredicate.init(andPredicateWithSubpredicates: notPredicates)
      : notPredicates.first
  }

  return nil
}

func createAndPredicateForWorkout(AND: [FilterForWorkoutsBase]?) -> NSPredicate? {
  if let AND = AND {
    let andPredicates = AND.compactMap({ filter in
      return createPredicateForWorkoutBase(filter)
    })
    return andPredicates.count > 1
      ? NSCompoundPredicate.init(andPredicateWithSubpredicates: andPredicates)
      : andPredicates.first
  }
  return nil
}

func createPredicateForWorkout(_ filter: FilterForWorkouts?) -> NSPredicate? {
  if let filter = filter {
    let allPredicates = [
      createPredicateForWorkoutBase(
        getPredicateForWorkoutBase(filter)
      ),
      createCompoundOrPredicateForWorkout(OR: filter.OR),
      createNotPredicateForWorkout(NOT: filter.NOT),
      createAndPredicateForWorkout(AND: filter.AND)
    ].compactMap { $0 }

    return allPredicates.count > 1 ?
      NSCompoundPredicate.init(andPredicateWithSubpredicates: allPredicates) :
      allPredicates.first
  }
  return nil
}

struct AnchoredQueryResponse {
  var samples: [HKSample]
  var deletedSamples: [DeletedSample]
  var newAnchor: String
}

func sampleAnchoredQueryAsync(
  sampleType: HKSampleType,
  limit: Double,
  queryAnchor: String?,
  predicate: NSPredicate?
) async throws -> AnchoredQueryResponse {
  let queryAnchor = try deserializeHKQueryAnchor(base64String: queryAnchor)

  return try await withCheckedThrowingContinuation { continuation in
    let query = HKAnchoredObjectQuery(
      type: sampleType,
      predicate: predicate,
      anchor: queryAnchor,
      limit: getQueryLimit(limit)
    ) { (_: HKAnchoredObjectQuery, samples: [HKSample]?, deletedSamples: [HKDeletedObject]?, newAnchor:
          HKQueryAnchor?, error: Error?) in
      if let error = error {
        return continuation.resume(throwing: error)
      }

      if let samples = samples, let deletedSamples = deletedSamples, let newAnchor = serializeAnchor(anchor: newAnchor) {
        return continuation.resume(
          returning: AnchoredQueryResponse(
            samples: samples,
            deletedSamples: deletedSamples.map({ deletedSample in
              return serializeDeletedSample(sample: deletedSample)
            }),
            newAnchor: newAnchor
          )
        )
      }

      return continuation.resume(throwing: RuntimeError.error(withMessage: "[react-native-healthkit] Unexpected empty response"))
    }

    store.execute(query)
  }
}

func sampleQueryAsync(
  sampleType: HKSampleType,
  limit: Double,
  predicate: NSPredicate?,
  sortDescriptors: [NSSortDescriptor]?
) async throws -> [HKSample] {
  let limit = getQueryLimit(limit)
  return try await withCheckedThrowingContinuation { continuation in
    let q = HKSampleQuery(
      sampleType: sampleType,
      predicate: predicate,
      limit: limit,
      sortDescriptors: sortDescriptors,
    ) { (_: HKSampleQuery, samples: [HKSample]?, error: Error?) in
      if let error = error {
        return continuation.resume(throwing: error)
      }

      if let samples = samples {
        return continuation.resume(returning: samples)
      }

      return continuation.resume(throwing: RuntimeError.error(withMessage: "[react-native-healthkit] Unexpected empty response"))
    }

    store.execute(q)
  }
}

func saveAsync(sample: HKObject) async throws -> Bool {
  return try await withCheckedThrowingContinuation { continuation in
    store.save(sample) { (success: Bool, error: Error?) in
      if let error = error {
        continuation.resume(throwing: error)
      } else {
        continuation.resume(returning: success)
      }
    }
  }
}

func createDatePredicate(_ dateFilter: DateFilter?) -> NSPredicate? {
  if let dateFilter = dateFilter {
    let strictStartDate = dateFilter.strictStartDate ?? false
    let strictEndDate = dateFilter.strictEndDate ?? false

    let options: HKQueryOptions = strictStartDate && strictEndDate
    ? [.strictStartDate, .strictEndDate]
    : strictEndDate
    ? .strictEndDate
    : strictStartDate
    ? .strictStartDate
    : []

    return HKQuery.predicateForSamples(
      withStart: dateFilter.startDate,
      end: dateFilter.endDate,
      options: options
    )
  }
  return nil
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

func createUUIDPredicate(_ uuid: String?) -> NSPredicate? {
  if let uuidStr = uuid {
    do {
      let uuid = try initializeUUID(uuidStr)
      return HKQuery.predicateForObject(with: uuid)
    } catch {
      print(error.localizedDescription)
      return nil
    }
  }
  return nil
}

func getComparisonPredicateOperator(_ op: ComparisonPredicateOperator?) -> NSComparisonPredicate.Operator? {
  if let rawValue = op?.rawValue {
    if let op = NSComparisonPredicate.Operator.init(rawValue: UInt(rawValue)) {
        return op
    } else {
      print("[react-native-healthkit] Unsupported operator in metadata filter: \(rawValue)")
    }
  }
  return nil
}

func createMetadataPredicate(_ metadata: PredicateWithMetadataKey?) -> NSPredicate? {
  if let metadata = metadata {

    guard let valueVariant = metadata.value else {
      return HKQuery.predicateForObjects(withMetadataKey: metadata.withMetadataKey)
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

    if let operatorType = metadata.operatorType != nil
      ? getComparisonPredicateOperator(metadata.operatorType)
        : .equalTo {
      return HKQuery.predicateForObjects(
        withMetadataKey: metadata.withMetadataKey,
        operatorType: operatorType,
        value: actualValue
      )
    }

  }
  return nil
}

func createPredicateForSamplesBase(_ filter: FilterForSamplesBase?) -> NSPredicate? {
  if let filter = filter {
    let w = filter.workout as? WorkoutProxy

    let allFilters = [
      createUUIDPredicate(filter.uuid),
      createUUIDsPredicate(uuids: filter.uuids),
      createDatePredicate(filter.date),
      w?.workoutPredicate,
      createMetadataPredicate(filter.metadata),
      createSourcePredicate(filter.sources),
    ].compactMap { $0 }

    return allFilters.count > 1
      ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allFilters)
      : allFilters.first
  }
  return nil
}

func createAndPredicateForSamples(_ AND: [FilterForSamplesBase]?) -> NSPredicate? {
  if let filter = AND {
    let allFilters = filter.compactMap { createPredicateForSamplesBase($0) }

    return allFilters.count > 1
      ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allFilters)
      : allFilters.first
  }
  return nil
}

func createNotPredicateForSamples(NOT: [FilterForSamplesBase]?) -> NSPredicate? {
  if let filter = NOT {
    if let allFilters = createAndPredicateForSamples(filter) {
      return NSCompoundPredicate.init(notPredicateWithSubpredicate: allFilters)
    }
  }
  return nil
}

func createOrPredicateForSamples(OR: [FilterForSamplesBase]?) -> NSPredicate? {
  if let filter = OR {
    let allFilters = filter.compactMap({ createPredicateForSamplesBase($0) })

    if allFilters.count < 2 {
      print("[react-native-healthkit] Sample filter OR clause contains less than 2 valid predicates, which makes it redundant.")
    }

    return allFilters.count > 1
      ? NSCompoundPredicate.init(orPredicateWithSubpredicates: allFilters)
      : allFilters.first
  }
  return nil
}

func getPredicateForSamplesBase(_ filter: FilterForSamples?) -> FilterForSamplesBase? {
  if let filter = filter {
    return FilterForSamplesBase(
      uuid: filter.uuid,
      uuids: filter.uuids,
      metadata: filter.metadata,
      date: filter.date,
      workout: filter.workout,
      sources: filter.sources
    )
  }
  return nil
}

func createPredicateForSamples(_ filter: FilterForSamples?) -> NSPredicate? {
  if let filter = filter {
    let allPredicates = [
      createPredicateForSamplesBase(
        getPredicateForSamplesBase(filter)
      ),
      createOrPredicateForSamples(OR: filter.OR),
      createAndPredicateForSamples(filter.AND),
      createNotPredicateForSamples(NOT: filter.NOT)
    ].compactMap { $0 }

    return allPredicates.count > 1 ?
      NSCompoundPredicate.init(andPredicateWithSubpredicates: allPredicates) :
      allPredicates.first
  }
  return nil
}

func getSortDescriptors(ascending: Bool?) -> [NSSortDescriptor] {
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
      if let _ = HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: candidate)),
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
