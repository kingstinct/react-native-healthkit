//
//  PredicateHelpers.swift
//  Pods
//
//  Created by Robert Herber on 2025-12-10.
//

import HealthKit
import ReactNativeHealthkitCore

func createSourcePredicate(_ sources: [HybridSourceProxySpec]?) -> NSPredicate? {
  if let sources = sources {

    let sourceSet = Set(
      sources.compactMap({ source in
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
    if let predicateOperator = NSComparisonPredicate.Operator(
      rawValue: UInt(duration.predicateOperator.rawValue)) {
      return HKQuery.predicateForWorkouts(
        with: predicateOperator, duration: duration.durationInSeconds)
    } else {
      warnWithPrefix(
        "Unsupported operator in duration filter: \(duration.predicateOperator.rawValue)")
    }
  }
  return nil
}

func createWorkoutActivityTypeFilter(_ workoutActivityType: WorkoutActivityType?) -> NSPredicate? {
  if let workoutActivityType = workoutActivityType {
    if let workoutActivityType = HKWorkoutActivityType.init(
      rawValue: UInt(workoutActivityType.rawValue)) {
      return HKQuery.predicateForWorkouts(with: workoutActivityType)
    } else {
      warnWithPrefix("Unsupported workout activity type in filter: \(workoutActivityType.rawValue)")
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
      metadata: filter.metadata,
      uuid: filter.uuid,
      sources: filter.sources,
      uuids: filter.uuids,
      date: filter.date,
    )
  }
  return nil
}

func createCompoundOrPredicateForWorkout(OR: [FilterForWorkoutsBase]?) -> NSPredicate? {
  if let OR = OR {
    let orPredicates = OR.compactMap({ filter in
      return createPredicateForWorkoutBase(filter)
    })

    let compoundOr =
      orPredicates.count > 1
      ? NSCompoundPredicate.init(orPredicateWithSubpredicates: orPredicates)
      : orPredicates.first

    if orPredicates.count < 2 {
      warnWithPrefix("Workout filter OR clause contains less than 2 valid predicates.")
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
      createAndPredicateForWorkout(AND: filter.AND),
    ].compactMap { $0 }

    return allPredicates.count > 1
      ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allPredicates) : allPredicates.first
  }
  return nil
}

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
      warnWithPrefix(
        "Sample filter OR clause contains less than 2 valid predicates, which makes it redundant.")
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
      createNotPredicateForSamples(NOT: filter.NOT),
    ].compactMap { $0 }

    return allPredicates.count > 1
      ? NSCompoundPredicate.init(andPredicateWithSubpredicates: allPredicates) : allPredicates.first
  }
  return nil
}
