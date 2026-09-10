//
//  HealthRecordsHelpers.swift
//  ReactNativeHealthkitHealthRecords
//
//  Shared helpers for the health records module: the HealthKit store, error
//  and logging helpers, async query wrappers and predicate builders.
//

import Foundation
import HealthKit
import NitroModules

let store = HKHealthStore.init()

func runtimeErrorWithPrefix(_ withMessage: String) -> Error {
  return RuntimeError.error(withMessage: "[react-native-healthkit/health-records] \(withMessage)")
}

func warnWithPrefix(_ withMessage: String) {
  print("[react-native-healthkit/health-records] \(withMessage)")
}

// MARK: - Types

func clinicalTypeFrom(_ identifier: ClinicalTypeIdentifier) throws -> HKClinicalType {
  let hkIdentifier = HKClinicalTypeIdentifier(rawValue: identifier.stringValue)
  if let clinicalType = HKObjectType.clinicalType(forIdentifier: hkIdentifier) {
    return clinicalType
  }

  throw runtimeErrorWithPrefix(
    "Failed to initialize clinical type with identifier \(identifier.stringValue); it may not be available on this OS version"
  )
}

func clinicalTypesFromArray(_ identifiers: [ClinicalTypeIdentifier]) -> Set<HKClinicalType> {
  return Set(
    identifiers.compactMap { identifier in
      do {
        return try clinicalTypeFrom(identifier)
      } catch {
        warnWithPrefix("clinicalTypesFromArray: \(error.localizedDescription)")
        return nil
      }
    })
}

func initializeUUID(_ uuidString: String) throws -> UUID {
  if let uuid = UUID(uuidString: uuidString) {
    return uuid
  }

  throw runtimeErrorWithPrefix("Got invalid UUID: \(uuidString)")
}

// MARK: - Anchors

func toBase64(_ data: Any?) -> String? {
  guard
    let archivedData = try? NSKeyedArchiver.archivedData(
      withRootObject: data, requiringSecureCoding: true)
  else {
    return nil
  }

  return archivedData.base64EncodedString()
}

func deserializeHKQueryAnchor(base64String: String?) throws -> HKQueryAnchor? {
  guard let base64String = base64String, !base64String.isEmpty else {
    return nil
  }

  guard let data = Data(base64Encoded: base64String) else {
    throw runtimeErrorWithPrefix("Invalid base64 string: \(base64String)")
  }

  do {
    return try NSKeyedUnarchiver.unarchivedObject(ofClass: HKQueryAnchor.self, from: data)
  } catch {
    throw runtimeErrorWithPrefix(
      "Error recreating HKQueryAnchor object: \(error.localizedDescription)")
  }
}

// MARK: - Queries

func getQueryLimit(_ limit: Double) -> Int {
  if limit == .infinity || limit <= 0 || limit.isNaN {
    return HKObjectQueryNoLimit
  }

  return Int(limit)
}

func getSortDescriptors(ascending: Bool?) -> [NSSortDescriptor] {
  return [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending ?? false)]
}

func sampleQueryAsync(
  sampleType: HKSampleType,
  limit: Double,
  predicate: NSPredicate?,
  sortDescriptors: [NSSortDescriptor]?
) async throws -> [HKSample] {
  let limit = getQueryLimit(limit)
  return try await withCheckedThrowingContinuation { continuation in
    let query = HKSampleQuery(
      sampleType: sampleType,
      predicate: predicate,
      limit: limit,
      sortDescriptors: sortDescriptors
    ) { (_: HKSampleQuery, samples: [HKSample]?, error: Error?) in
      DispatchQueue.main.async {
        if let error = error {
          return continuation.resume(throwing: error)
        }

        if let samples = samples {
          return continuation.resume(returning: samples)
        }

        return continuation.resume(
          throwing: runtimeErrorWithPrefix("Unexpected empty response"))
      }
    }

    store.execute(query)
  }
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
    ) {
      (
        _: HKAnchoredObjectQuery, samples: [HKSample]?, deletedSamples: [HKDeletedObject]?,
        newAnchor: HKQueryAnchor?, error: Error?
      ) in
      DispatchQueue.main.async {
        if let error = error {
          return continuation.resume(throwing: error)
        }

        if let samples = samples, let deletedSamples = deletedSamples,
          let newAnchor = toBase64(newAnchor) {
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

        return continuation.resume(
          throwing: runtimeErrorWithPrefix("Unexpected empty response"))
      }
    }

    store.execute(query)
  }
}

// MARK: - Predicates

func createDatePredicate(_ dateFilter: DateFilter?) -> NSPredicate? {
  guard let dateFilter = dateFilter else {
    return nil
  }

  let strictStartDate = dateFilter.strictStartDate ?? false
  let strictEndDate = dateFilter.strictEndDate ?? false

  var options: HKQueryOptions = []
  if strictStartDate {
    options.insert(.strictStartDate)
  }
  if strictEndDate {
    options.insert(.strictEndDate)
  }

  return HKQuery.predicateForSamples(
    withStart: dateFilter.startDate,
    end: dateFilter.endDate,
    options: options
  )
}

func createUUIDsPredicate(uuids: [String]?) -> NSPredicate? {
  guard let uuids = uuids else {
    return nil
  }

  let parsed = uuids.compactMap { uuidStr -> UUID? in
    do {
      return try initializeUUID(uuidStr)
    } catch {
      warnWithPrefix(error.localizedDescription)
      return nil
    }
  }
  return HKQuery.predicateForObjects(with: Set(parsed))
}

func createUUIDPredicate(_ uuid: String?) -> NSPredicate? {
  guard let uuidStr = uuid else {
    return nil
  }

  do {
    let uuid = try initializeUUID(uuidStr)
    return HKQuery.predicateForObject(with: uuid)
  } catch {
    warnWithPrefix("createUUIDPredicate: \(error.localizedDescription)")
    return nil
  }
}

func createFHIRResourceTypePredicate(_ resourceType: FHIRResourceType?) -> NSPredicate? {
  guard let resourceType = resourceType else {
    return nil
  }

  return HKQuery.predicateForClinicalRecords(
    withFHIRResourceType: HKFHIRResourceType(rawValue: resourceType.stringValue))
}

func getComparisonPredicateOperator(_ op: ComparisonPredicateOperator?) -> NSComparisonPredicate
  .Operator? {
  guard let rawValue = op?.rawValue else {
    return nil
  }

  if let op = NSComparisonPredicate.Operator.init(rawValue: UInt(rawValue)) {
    return op
  }

  warnWithPrefix(
    "getComparisonPredicateOperator: Unsupported operator in metadata filter: \(rawValue)")
  return nil
}

func createMetadataPredicate(_ metadata: PredicateWithMetadataKey?) -> NSPredicate? {
  guard let metadata = metadata else {
    return nil
  }

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

  let operatorType =
    metadata.operatorType != nil
    ? getComparisonPredicateOperator(metadata.operatorType)
    : .equalTo

  if let operatorType = operatorType {
    return HKQuery.predicateForObjects(
      withMetadataKey: metadata.withMetadataKey,
      operatorType: operatorType,
      value: actualValue
    )
  }

  return nil
}

func createPredicateForClinicalRecordsBase(_ filter: FilterForClinicalRecordsBase?) -> NSPredicate? {
  guard let filter = filter else {
    return nil
  }

  let allFilters = [
    createUUIDPredicate(filter.uuid),
    createUUIDsPredicate(uuids: filter.uuids),
    createDatePredicate(filter.date),
    createMetadataPredicate(filter.metadata),
    createFHIRResourceTypePredicate(filter.fhirResourceType),
  ].compactMap { $0 }

  return allFilters.count > 1
    ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allFilters)
    : allFilters.first
}

func createAndPredicateForClinicalRecords(_ AND: [FilterForClinicalRecordsBase]?) -> NSPredicate? {
  guard let filter = AND else {
    return nil
  }

  let allFilters = filter.compactMap { createPredicateForClinicalRecordsBase($0) }

  return allFilters.count > 1
    ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allFilters)
    : allFilters.first
}

func createNotPredicateForClinicalRecords(NOT: [FilterForClinicalRecordsBase]?) -> NSPredicate? {
  guard let filter = NOT else {
    return nil
  }

  if let allFilters = createAndPredicateForClinicalRecords(filter) {
    return NSCompoundPredicate.init(notPredicateWithSubpredicate: allFilters)
  }
  return nil
}

func createOrPredicateForClinicalRecords(OR: [FilterForClinicalRecordsBase]?) -> NSPredicate? {
  guard let filter = OR else {
    return nil
  }

  let allFilters = filter.compactMap({ createPredicateForClinicalRecordsBase($0) })

  if allFilters.count < 2 {
    warnWithPrefix(
      "Clinical record filter OR clause contains less than 2 valid predicates, which makes it redundant."
    )
  }

  return allFilters.count > 1
    ? NSCompoundPredicate.init(orPredicateWithSubpredicates: allFilters)
    : allFilters.first
}

func createPredicateForClinicalRecords(_ filter: FilterForClinicalRecords?) -> NSPredicate? {
  guard let filter = filter else {
    return nil
  }

  let base = FilterForClinicalRecordsBase(
    uuid: filter.uuid,
    uuids: filter.uuids,
    metadata: filter.metadata,
    date: filter.date,
    fhirResourceType: filter.fhirResourceType
  )

  let allPredicates = [
    createPredicateForClinicalRecordsBase(base),
    createOrPredicateForClinicalRecords(OR: filter.OR),
    createAndPredicateForClinicalRecords(filter.AND),
    createNotPredicateForClinicalRecords(NOT: filter.NOT),
  ].compactMap { $0 }

  return allPredicates.count > 1
    ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allPredicates)
    : allPredicates.first
}
