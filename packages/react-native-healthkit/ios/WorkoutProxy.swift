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

  let response = try await sampleAnchoredQueryAsync(
    sampleType: HKSeriesType.workoutRoute(),
    limit: Double(HKObjectQueryNoLimit),
    queryAnchor: nil,
    predicate: workoutPredicate
  )

  guard let routes = response.samples as? [HKWorkoutRoute] else {
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
          throwing: runtimeErrorWithPrefix("Unexpected empty response")
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
    throw runtimeErrorWithPrefix("Unexpected empty response")
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
        HKMetadataKeySyncIdentifier: routeMetadata.isString(key: "HKMetadataKeySyncIdentifier")
          ? routeMetadata.getString(
            key: "HKMetadataKeySyncIdentifier"
          ) : nil,
        HKMetadataKeySyncVersion: routeMetadata.isDouble(key: "HKMetadataKeySyncVersion")
          ? routeMetadata.getDouble(
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
) async throws -> Bool {
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

class WorkoutProxy: HybridWorkoutProxySpec {
  // Return a Promise instead of directly returning the value; wrap async logic.
  func getStatistic(quantityType: QuantityTypeIdentifier, unitOverride: String?) throws -> Promise<
    QueryStatisticsResponse?
  > {
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

  func getAllStatistics() -> Promise<[String: QueryStatisticsResponse]> {
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
      warnWithPrefix("WorkoutProxy does not support toJSON with key: \(key)")
    }

    return WorkoutSample(
      workoutActivityType: self.workoutActivityType,
      duration: self.duration,
      events: self.events,
      activities: self.activities,
      metadataAverageMETs: self.metadataAverageMETs,
      metadataElevationAscended: self.metadataElevationAscended,
      metadataElevationDescended: self.metadataElevationDescended,
      metadataIndoorWorkout: self.metadataIndoorWorkout,
      metadataAverageSpeed: self.metadataAverageSpeed,
      metadataMaximumSpeed: self.metadataMaximumSpeed,
      sampleType: self.sampleType,
      startDate: self.startDate,
      endDate: self.endDate,
      hasUndeterminedDuration: self.hasUndeterminedDuration,
      metadataWeatherCondition: self.metadataWeatherCondition,
      metadataWeatherHumidity: self.metadataWeatherHumidity,
      metadataWeatherTemperature: self.metadataWeatherTemperature,
      metadataInsulinDeliveryReason: self.metadataInsulinDeliveryReason,
      metadataHeartRateMotionContext: self.metadataHeartRateMotionContext,
      uuid: self.uuid,
      sourceRevision: self.sourceRevision,
      device: self.device,
      metadata: self.metadata,
      metadataExternalUUID: self.metadataExternalUUID,
      metadataTimeZone: self.metadataTimeZone,
      metadataWasUserEntered: self.metadataWasUserEntered,
      metadataDeviceSerialNumber: self.metadataDeviceSerialNumber,
      metadataUdiDeviceIdentifier: self.metadataUdiDeviceIdentifier,
      metadataUdiProductionIdentifier: self.metadataUdiProductionIdentifier,
      metadataDigitalSignature: self.metadataDigitalSignature,
      metadataDeviceName: self.metadataDeviceName,
      metadataDeviceManufacturerName: self.metadataDeviceManufacturerName,
      metadataSyncIdentifier: self.metadataSyncIdentifier,
      metadataSyncVersion: self.metadataSyncVersion,
      metadataWasTakenInLab: self.metadataWasTakenInLab,
      metadataReferenceRangeLowerLimit: self.metadataReferenceRangeLowerLimit,
      metadataReferenceRangeUpperLimit: self.metadataReferenceRangeUpperLimit,
      metadataAlgorithmVersion: self.metadataAlgorithmVersion
    )
  }

  var workoutPredicate: NSPredicate {
    let predicate = HKQuery.predicateForObjects(from: self.workout)
    return predicate
  }

  var uuid: String {
    return workout.uuid.uuidString
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
    if let activityType = WorkoutActivityType.init(
      rawValue: Int32(workout.workoutActivityType.rawValue)
    ) {
      return activityType
    }

    warnWithPrefix(
      "Unknown workoutActivityType with rawValue: \(workout.workoutActivityType.rawValue), falling back to 'other'"
    )

    return WorkoutActivityType.other
  }

  var duration: Quantity {
    let quantity = HKQuantity(unit: .second(), doubleValue: workout.duration)

    let duration = serializeQuantityTyped(
      unit: .second(),
      quantity: quantity
    )

    return duration
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
    return serializeQuantityTyped(
      unit: HKUnit.kilocalorie(),
      quantityNullable: workout.totalEnergyBurned
    )
  }

  var totalSwimmingStrokeCount: Quantity? {
    return serializeQuantityTyped(
      unit: .count(),
      quantityNullable: workout.totalSwimmingStrokeCount
    )

  }

  var totalFlightsClimbed: Quantity? {
    if let hkTotalFlightsClimbed = workout.totalFlightsClimbed {
      return Quantity(
        unit: "count",
        quantity: hkTotalFlightsClimbed.doubleValue(for: HKUnit.count())
      )
    }
    return nil
  }

  var startDate: Date {
    return workout.startDate
  }

  var endDate: Date {
    return workout.endDate
  }

  var metadata: AnyMap {
    return serializeMetadata(workout.metadata)
  }

  var sourceRevision: SourceRevision {
    return serializeSourceRevision(workout.sourceRevision)
  }

  // BaseSample properties
  var sampleType: SampleType {
    return serializeSampleType(workout.sampleType)
  }

  var hasUndeterminedDuration: Bool {
    return workout.hasUndeterminedDuration
  }

  // Weather metadata
  var metadataWeatherCondition: WeatherCondition? {
    return serializeWeatherCondition(
      workout.metadata?[HKMetadataKeyWeatherCondition] as? HKWeatherCondition)
  }

  var metadataWeatherHumidity: Quantity? {
    return serializeUnknownQuantityTyped(
      quantity: workout.metadata?[HKMetadataKeyWeatherHumidity] as? HKQuantity)
  }

  var metadataWeatherTemperature: Quantity? {
    return serializeUnknownQuantityTyped(
      quantity: workout.metadata?[HKMetadataKeyWeatherTemperature] as? HKQuantity)
  }

  var metadataInsulinDeliveryReason: InsulinDeliveryReason? {
    return serializeInsulinDeliveryReason(
      workout.metadata?[HKMetadataKeyInsulinDeliveryReason] as? HKInsulinDeliveryReason)
  }

  var metadataHeartRateMotionContext: HeartRateMotionContext? {
    return serializeHeartRateMotionContext(
      workout.metadata?[HKMetadataKeyHeartRateMotionContext] as? HKHeartRateMotionContext)
  }

  // Workout-specific metadata
  var metadataAverageMETs: Quantity? {
    return serializeUnknownQuantityTyped(
      quantity: workout.metadata?[HKMetadataKeyAverageMETs] as? HKQuantity)
  }

  var metadataElevationAscended: Quantity? {
    return serializeUnknownQuantityTyped(
      quantity: workout.metadata?[HKMetadataKeyElevationAscended] as? HKQuantity)
  }

  var metadataElevationDescended: Quantity? {
    if #available(iOS 18.0, *) {
      return serializeUnknownQuantityTyped(
        quantity: workout.metadata?[HKMetadataKeyElevationDescended] as? HKQuantity)
    }
    return nil
  }

  var metadataIndoorWorkout: Bool? {
    return workout.metadata?[HKMetadataKeyIndoorWorkout] as? Bool
  }

  var metadataAverageSpeed: Quantity? {
    return serializeUnknownQuantityTyped(
      quantity: workout.metadata?[HKMetadataKeyAverageSpeed] as? HKQuantity)
  }

  var metadataMaximumSpeed: Quantity? {
    return serializeUnknownQuantityTyped(
      quantity: workout.metadata?[HKMetadataKeyMaximumSpeed] as? HKQuantity)
  }

  // BaseObject metadata
  var metadataExternalUUID: String? {
    return workout.metadata?[HKMetadataKeyExternalUUID] as? String
  }

  var metadataTimeZone: String? {
    return workout.metadata?[HKMetadataKeyTimeZone] as? String
  }

  var metadataWasUserEntered: Bool? {
    return workout.metadata?[HKMetadataKeyWasUserEntered] as? Bool
  }

  var metadataDeviceSerialNumber: String? {
    return workout.metadata?[HKMetadataKeyDeviceSerialNumber] as? String
  }

  var metadataUdiDeviceIdentifier: String? {
    return workout.metadata?[HKMetadataKeyUDIDeviceIdentifier] as? String
  }

  var metadataUdiProductionIdentifier: String? {
    return workout.metadata?[HKMetadataKeyUDIProductionIdentifier] as? String
  }

  var metadataDigitalSignature: String? {
    return workout.metadata?[HKMetadataKeyDigitalSignature] as? String
  }

  var metadataDeviceName: String? {
    return workout.metadata?[HKMetadataKeyDeviceName] as? String
  }

  var metadataDeviceManufacturerName: String? {
    return workout.metadata?[HKMetadataKeyDeviceManufacturerName] as? String
  }

  var metadataSyncIdentifier: String? {
    return workout.metadata?[HKMetadataKeySyncIdentifier] as? String
  }

  var metadataSyncVersion: Double? {
    return workout.metadata?[HKMetadataKeySyncVersion] as? Double
  }

  var metadataWasTakenInLab: Bool? {
    return workout.metadata?[HKMetadataKeyWasTakenInLab] as? Bool
  }

  var metadataReferenceRangeLowerLimit: Double? {
    return workout.metadata?[HKMetadataKeyReferenceRangeLowerLimit] as? Double
  }

  var metadataReferenceRangeUpperLimit: Double? {
    return workout.metadata?[HKMetadataKeyReferenceRangeUpperLimit] as? Double
  }

  var metadataAlgorithmVersion: Double? {
    return workout.metadata?[HKMetadataKeyAlgorithmVersion] as? Double
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
        warnWithPrefix(
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
        warnWithPrefix("Workout plans are only available on iOS 17.0 or later")
        return nil
      }
    }
  }

  func saveWorkoutRoute(locations: [LocationForSaving]) -> Promise<Bool> {
    return Promise.async {
      return try await saveWorkoutRouteInternal(workout: self.workout, locations: locations)
    }
  }

  func getWorkoutRoutes() -> Promise<[WorkoutRoute]> {
    return Promise.async {
      return try await getSerializedWorkoutLocations(workout: self.workout)
    }
  }
}
