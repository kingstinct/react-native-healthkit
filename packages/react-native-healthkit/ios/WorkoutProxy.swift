//
//  WorkoutProxy.swift
//  Pods
//
//  Created by Robert Herber on 2025-06-07.
//

import CoreLocation
import HealthKit
import NitroModules

@available(iOS 17.0.0, *)
func getWorkoutPlanInternal(workout: HKWorkout) async throws -> WorkoutPlan? {
  let workoutPlan = try await workout.workoutPlan
  if let id = workoutPlan?.id.uuidString {
    if let activityType = workoutPlan?.workout.activity {
      let workoutPlan = WorkoutPlan(
        id: id,
        activityType: WorkoutActivityType.init(
          rawValue: Int32(activityType.rawValue)
        )!
      )

      return workoutPlan
    }
  }

  return nil
}

func getWorkoutRoutesInternal(
  workout: HKWorkout
) async throws -> [HKWorkoutRoute]? {
  let workoutPredicate = HKQuery.predicateForObjects(from: workout)
  let samples = try await withCheckedThrowingContinuation {
    (continuation: CheckedContinuation<[HKSample], Error>) in
    let query = HKAnchoredObjectQuery(
      type: HKSeriesType.workoutRoute(),
      predicate: workoutPredicate,
      anchor: nil,
      limit: HKObjectQueryNoLimit
    ) {
      (_, samples, _, _, error) in

      if let hasError = error {
        return continuation.resume(throwing: hasError)

      }

      guard let samples = samples else {
        return continuation.resume(
          throwing: RuntimeError.error(withMessage: "Empty response")
        )
      }

      continuation.resume(returning: samples)
    }
    store.execute(query)
  }

  guard let routes = samples as? [HKWorkoutRoute] else {
    return nil
  }

  return routes
}

func getRouteLocations(
  route: HKWorkoutRoute
) async -> [CLLocation] {
  let locations = try! await withCheckedThrowingContinuation {
    (continuation: CheckedContinuation<[CLLocation], Error>) in
    var allLocations: [CLLocation] = []

    let query = HKWorkoutRouteQuery(route: route) {
      (_, locationsOrNil, done, errorOrNil) in

      if let error = errorOrNil {
        continuation.resume(throwing: error)
        return
      }

      guard let currentLocationBatch = locationsOrNil else {
        return continuation.resume(
          throwing: RuntimeError.error(withMessage: "Empty response")
        )
      }

      allLocations.append(contentsOf: currentLocationBatch)

      if done {
        continuation.resume(returning: allLocations)
      }
    }

    store.execute(query)
  }

  return locations
}

func serializeLocation(location: CLLocation, previousLocation: CLLocation?)
  -> WorkoutRouteLocation {
  var distance: CLLocationDistance?
  if let previousLocation = previousLocation {
    distance = location.distance(from: previousLocation)
  } else {
    distance = nil
  }

  return WorkoutRouteLocation(
    altitude: location.altitude,
    course: location.course,
    date: location.timestamp,
    distance: distance,
    horizontalAccuracy: location.horizontalAccuracy,
    latitude: location.coordinate.latitude,
    longitude: location.coordinate.longitude,
    speed: location.speed,
    speedAccuracy: location.speedAccuracy,
    verticalAccuracy: location.verticalAccuracy
  )
}

func getSerializedWorkoutLocations(
  workout: HKWorkout
) async throws -> [WorkoutRoute] {
  let routes = try await getWorkoutRoutesInternal(
    workout: workout
  )

  var allRoutes: [WorkoutRoute] = []
  guard let _routes = routes else {
    throw RuntimeError.error(withMessage: "Unexpected empty response")
  }
  for route in _routes {
    let routeMetadata = serializeMetadata(
      route.metadata
    )

    let routeCLLocations = await getRouteLocations(
      route: route
    )

    let routeLocations = routeCLLocations.enumerated().map {
      (i, loc) in
      serializeLocation(
        location: loc,
        previousLocation: i == 0 ? nil : routeCLLocations[i - 1]
      )
    }

    allRoutes.append(
      WorkoutRoute(
        locations: routeLocations,
        HKMetadataKeySyncIdentifier: routeMetadata.isString(key: "HKMetadataKeySyncIdentifier") ?  routeMetadata.getString(
          key: "HKMetadataKeySyncIdentifier"
        ) : nil,
        HKMetadataKeySyncVersion: routeMetadata.isDouble(key: "HKMetadataKeySyncVersion") ? routeMetadata.getDouble(
          key: "HKMetadataKeySyncVersion"
        ) : nil
      )
    )
  }
  return allRoutes
}

func saveWorkoutRouteInternal(
  workout: HKWorkout,
  locations: [LocationForSaving]
) -> Promise<Bool> {
  return Promise.async {
    try await withCheckedThrowingContinuation { continuation in
      Task {
        do {
          // create CLLocations and return if locations are empty
          let clLocations = mapLocations(from: locations)
          let routeBuilder = HKWorkoutRouteBuilder(
            healthStore: store,
            device: nil
          )
          try await routeBuilder.insertRouteData(clLocations)
          try await routeBuilder.finishRoute(with: workout, metadata: nil)

          return continuation.resume(returning: true)
        } catch {
          return continuation.resume(throwing: error)
        }
      }

    }
  }
}

class WorkoutProxy: HybridWorkoutProxySpec {

  // Return a Promise instead of directly returning the value; wrap async logic.
  func getStatistic(quantityType: QuantityTypeIdentifier, unitOverride: String?) throws -> Promise<QueryStatisticsResponse?> {
    return Promise.async {
      if #available(iOS 16.0, *) {
        let type = try initializeQuantityType(quantityType.stringValue)
        if let stats = self.workout.statistics(for: type) {
          let unit = try await getUnitToUse(unitOverride: unitOverride, quantityType: type)
          return serializeStatistics(gottenStats: stats, unit: unit)
        }
      }
      return nil
    }
  }

  func getAllStatistics() throws -> Promise<[String: QueryStatisticsResponse]> {
    return Promise.async {
      var result: [String: QueryStatisticsResponse] = [:]
      if #available(iOS 16.0, *) {
        let statsMap = self.workout.allStatistics
        for (quantityType, stats) in statsMap {
          let unit = try await getUnitToUse(unitOverride: nil, quantityType: quantityType)
          let serialized = serializeStatistics(gottenStats: stats, unit: unit)
          result[quantityType.identifier] = serialized
        }
      }
      return result
    }
  }

  func toJSON(key: String?) throws -> WorkoutSample {
    if let key = key, !key.isEmpty {
      print("WorkoutProxy does not support toJSON with key: \(key)")
    }

    return WorkoutSample(
      uuid: self.uuid,
      device: self.device,
      workoutActivityType: self.workoutActivityType,
      duration: self.duration,
      startDate: self.startDate,
      endDate: self.endDate,
      metadata: self.metadata,
      sourceRevision: self.sourceRevision,
      events: self.events,
      activities: self.activities
    )
  }

  var workoutPredicate: NSPredicate {
    get {
      let predicate = HKQuery.predicateForObjects(from: self.workout)
      return predicate
    }
  }

  var uuid: String {
    get {
      return workout.uuid.uuidString
    }
  }

  var device: Device? {
    if let hkDevice = workout.device {
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
    return nil
  }

  var workoutActivityType: WorkoutActivityType {
    get {
      if let activityType = WorkoutActivityType.init(
        rawValue: Int32(workout.workoutActivityType.rawValue)
      ) {
        return activityType
      }

      print("Unknown workout activity type: \(workout.workoutActivityType.rawValue), falling back to 'other'")

      return WorkoutActivityType.other
    }
  }

  var duration: Quantity {
    get {
      let quantity = HKQuantity(unit: .second(), doubleValue: workout.duration)

      let duration = serializeQuantityTyped(
        unit: .second(),
        quantity: quantity
      )

      return duration
    }
  }

  var totalDistance: Quantity? {
    if let hkTotalDistance = workout.totalDistance {
      return Quantity(
        unit: "meters",
        quantity: hkTotalDistance.doubleValue(for: HKUnit.meter())
      )
    }
    return nil
  }

  var totalEnergyBurned: Quantity? {
    get {
      return serializeQuantityTyped(
        unit: HKUnit.kilocalorie(),
        quantityNullable: workout.totalEnergyBurned
      )
    }
  }

  var totalSwimmingStrokeCount: Quantity? {
    get {
    return serializeQuantityTyped(
      unit: .count(),
      quantityNullable: workout.totalSwimmingStrokeCount
    )
    }

  }

  var totalFlightsClimbed: Quantity? {
    if #available(iOS 11, *) {
      if let hkTotalFlightsClimbed = workout.totalFlightsClimbed {
        return Quantity(
          unit: "count",
          quantity: hkTotalFlightsClimbed.doubleValue(for: HKUnit.count())
        )
      }
    }
    return nil
  }

  var startDate: Date {
    get {
      return workout.startDate
    }
  }

  var endDate: Date {
    get {
      return workout.endDate
    }
  }

  var metadata: AnyMap? {
    get {
      return serializeMetadata(workout.metadata)
    }
  }

  var sourceRevision: SourceRevision? {
    get {
      return serializeSourceRevision(workout.sourceRevision)
    }
  }

  var events: [WorkoutEvent]? {
    if let hkWorkoutEvents = workout.workoutEvents {
      return hkWorkoutEvents.compactMap { event in
        if let type = WorkoutEventType.init(
          rawValue: Int32(event.type.rawValue)
        ) {
          return WorkoutEvent(
            type: type,
            startDate: event.dateInterval.start,
            endDate: event.dateInterval.end
          )
        }
        print(
          "Failed to initialize WorkoutEventType with rawValue: \(event.type.rawValue)"
        )
        return nil
      }
    }
    return nil
  }

  var activities: [WorkoutActivity]? {
    if #available(iOS 16.0, *) {
      let hkActivities = workout.workoutActivities

      return hkActivities.map { activity in
        return WorkoutActivity(
          startDate: activity.startDate,
          endDate: activity.endDate ?? activity.startDate,
          uuid: activity.uuid.uuidString,
          duration: activity.duration
        )
      }
    }
    return nil
  }

  private let workout: HKWorkout

  init(workout: HKWorkout) {
    self.workout = workout
  }

  func getWorkoutPlan() throws -> Promise<WorkoutPlan?> {
    return Promise.async {
      if #available(iOS 17.0.0, *) {
        return try await getWorkoutPlanInternal(workout: self.workout)
      } else {
        throw RuntimeError.error(
          withMessage: "Workout plans are only available on iOS 17.0 or later"
        )
      }
    }
  }

  func saveWorkoutRoute(locations: [LocationForSaving]) throws -> Promise<Bool> {
    return saveWorkoutRouteInternal(workout: self.workout, locations: locations)
  }

  func getWorkoutRoutes() throws -> Promise<[WorkoutRoute]> {
    return Promise.async {
      return try await getSerializedWorkoutLocations(workout: self.workout)
    }
  }
}
