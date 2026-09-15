//
//  Predicates.swift
//  ReactNativeHealthkitCore
//
//  Predicate builders for the filter shapes both packages share. The
//  Nitro-generated filter structs live in each package's own module, so they
//  adopt the protocols below instead of being referenced here directly.
//

import Foundation
import HealthKit

/// Adopted by each package's generated `DateFilter` struct.
public protocol DateFilterConvertible {
  var startDate: Date? { get }
  var endDate: Date? { get }
  var strictStartDate: Bool? { get }
  var strictEndDate: Bool? { get }
}

/// Adopted by each package's generated `PredicateWithMetadataKey` struct.
public protocol MetadataPredicateConvertible {
  var withMetadataKey: String { get }
  /// Raw value of `ComparisonPredicateOperator`; matches `NSComparisonPredicate.Operator`.
  var operatorRawValue: Int? { get }
  /// The value to compare against, already converted to a Foundation type.
  var metadataValue: Any? { get }
}

public func createDatePredicate(_ dateFilter: (any DateFilterConvertible)?) -> NSPredicate? {
  guard let dateFilter = dateFilter else {
    return nil
  }

  var options: HKQueryOptions = []
  if dateFilter.strictStartDate ?? false {
    options.insert(.strictStartDate)
  }
  if dateFilter.strictEndDate ?? false {
    options.insert(.strictEndDate)
  }

  return HKQuery.predicateForSamples(
    withStart: dateFilter.startDate,
    end: dateFilter.endDate,
    options: options
  )
}

public func createUUIDsPredicate(uuids: [String]?) -> NSPredicate? {
  guard let uuids = uuids else {
    return nil
  }

  let parsed = uuids.compactMap { uuidStr -> UUID? in
    do {
      return try initializeUUID(uuidStr)
    } catch {
      logWarning(error.localizedDescription)
      return nil
    }
  }
  return HKQuery.predicateForObjects(with: Set(parsed))
}

public func createUUIDPredicate(_ uuid: String?) -> NSPredicate? {
  guard let uuidStr = uuid else {
    return nil
  }

  do {
    let uuid = try initializeUUID(uuidStr)
    return HKQuery.predicateForObject(with: uuid)
  } catch {
    logWarning("createUUIDPredicate: \(error.localizedDescription)")
    return nil
  }
}

func comparisonPredicateOperator(fromRawValue rawValue: Int?) -> NSComparisonPredicate.Operator? {
  guard let rawValue = rawValue else {
    return nil
  }

  if let op = NSComparisonPredicate.Operator(rawValue: UInt(rawValue)) {
    return op
  }

  logWarning("Unsupported operator in metadata filter: \(rawValue)")
  return nil
}

public func createMetadataPredicate(_ metadata: (any MetadataPredicateConvertible)?) -> NSPredicate? {
  guard let metadata = metadata else {
    return nil
  }

  guard let value = metadata.metadataValue else {
    return HKQuery.predicateForObjects(withMetadataKey: metadata.withMetadataKey)
  }

  let operatorType =
    metadata.operatorRawValue != nil
    ? comparisonPredicateOperator(fromRawValue: metadata.operatorRawValue)
    : .equalTo

  guard let operatorType = operatorType else {
    return nil
  }

  return HKQuery.predicateForObjects(
    withMetadataKey: metadata.withMetadataKey,
    operatorType: operatorType,
    value: value
  )
}

/// ANDs the non-nil predicates; a single predicate is returned as-is.
public func andPredicate(_ predicates: [NSPredicate?]) -> NSPredicate? {
  let all = predicates.compactMap { $0 }
  return all.count > 1 ? NSCompoundPredicate(andPredicateWithSubpredicates: all) : all.first
}

/// ORs the non-nil predicates; a single predicate is returned as-is.
public func orPredicate(_ predicates: [NSPredicate?]) -> NSPredicate? {
  let all = predicates.compactMap { $0 }
  return all.count > 1 ? NSCompoundPredicate(orPredicateWithSubpredicates: all) : all.first
}
