//
//  HealthRecordsHelpers.swift
//  ReactNativeHealthkitHealthRecords
//
//  Helpers specific to clinical records: type resolution and predicate
//  builders. The store, queries, anchors and generic predicates come from
//  ReactNativeHealthkitCore.
//

import Foundation
import HealthKit
import NitroModules
import ReactNativeHealthkitCore

let logPrefix = "[react-native-healthkit/health-records]"

/// Namespaces this package's persisted background-delivery types in the shared
/// BackgroundDeliveryManager. The id matches the UserDefaults keys used before
/// the manager moved to ReactNativeHealthkitCore, so existing installs keep
/// their configuration.
let backgroundDeliveryScope = BackgroundDeliveryScope(id: "com.kingstinct.healthkit.healthrecords")

func runtimeErrorWithPrefix(_ withMessage: String) -> Error {
  return makeRuntimeError(withMessage, prefix: logPrefix)
}

func warnWithPrefix(_ withMessage: String) {
  logWarning(withMessage, prefix: logPrefix)
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

// MARK: - Queries

/// Anchored query results come back with raw HKDeletedObjects; this package
/// serializes them into its own DeletedSample struct.
extension AnchoredQueryResponse {
  var deletedSamples: [DeletedSample] {
    return deletedObjects.map { serializeDeletedSample(sample: $0) }
  }
}

// MARK: - Predicates

// The generated filter structs adopt the core protocols so the shared
// predicate builders in ReactNativeHealthkitCore can read them.
extension DateFilter: DateFilterConvertible {}

extension PredicateWithMetadataKey: MetadataPredicateConvertible {
  public var operatorRawValue: Int? {
    guard let operatorType = operatorType else {
      return nil
    }
    return Int(operatorType.rawValue)
  }

  public var metadataValue: Any? {
    switch value {
    case .first(let boolValue):
      return NSNumber(value: boolValue ? 1 : 0)
    case .second(let stringValue):
      return stringValue
    case .third(let doubleValue):
      return NSNumber(value: doubleValue)
    case .fourth(let dateValue):
      return dateValue
    case nil:
      return nil
    }
  }
}

func createFHIRResourceTypePredicate(_ resourceType: FHIRResourceType?) -> NSPredicate? {
  guard let resourceType = resourceType else {
    return nil
  }

  return HKQuery.predicateForClinicalRecords(
    withFHIRResourceType: HKFHIRResourceType(rawValue: resourceType.stringValue))
}

func createPredicateForClinicalRecordsBase(_ filter: FilterForClinicalRecordsBase?) -> NSPredicate? {
  guard let filter = filter else {
    return nil
  }

  return andPredicate([
    createUUIDPredicate(filter.uuid),
    createUUIDsPredicate(uuids: filter.uuids),
    createDatePredicate(filter.date),
    createMetadataPredicate(filter.metadata),
    createFHIRResourceTypePredicate(filter.fhirResourceType),
  ])
}

func createAndPredicateForClinicalRecords(_ AND: [FilterForClinicalRecordsBase]?) -> NSPredicate? {
  guard let filter = AND else {
    return nil
  }

  return andPredicate(filter.map { createPredicateForClinicalRecordsBase($0) })
}

/// `NOT: [A, B]` excludes records matching A and records matching B, i.e.
/// `NOT A AND NOT B`. Each entry is negated on its own and the negations are
/// combined with AND.
func createNotPredicateForClinicalRecords(NOT: [FilterForClinicalRecordsBase]?) -> NSPredicate? {
  guard let filter = NOT else {
    return nil
  }

  return andPredicate(
    filter.map { entry -> NSPredicate? in
      if let predicate = createPredicateForClinicalRecordsBase(entry) {
        return NSCompoundPredicate(notPredicateWithSubpredicate: predicate)
      }
      return nil
    })
}

func createOrPredicateForClinicalRecords(OR: [FilterForClinicalRecordsBase]?) -> NSPredicate? {
  guard let filter = OR else {
    return nil
  }

  let allFilters = filter.compactMap { createPredicateForClinicalRecordsBase($0) }

  if allFilters.count < 2 {
    warnWithPrefix(
      "Clinical record filter OR clause contains less than 2 valid predicates, which makes it redundant."
    )
  }

  return orPredicate(allFilters)
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

  return andPredicate([
    createPredicateForClinicalRecordsBase(base),
    createOrPredicateForClinicalRecords(OR: filter.OR),
    createAndPredicateForClinicalRecords(filter.AND),
    createNotPredicateForClinicalRecords(NOT: filter.NOT),
  ])
}
