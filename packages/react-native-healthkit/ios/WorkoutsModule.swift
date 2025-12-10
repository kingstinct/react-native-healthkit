import CoreLocation
import HealthKit
import NitroModules

#if canImport(WorkoutKit)
import WorkoutKit
#endif

func mapLocations(from locations: [LocationForSaving]) -> [CLLocation] {
  return locations.compactMap { location in
    let latitude = location.latitude
    let longitude = location.longitude
    let altitude = location.altitude
    let horizontalAccuracy = location.horizontalAccuracy
    let verticalAccuracy = location.verticalAccuracy
    let course = location.course
    let speed = location.speed
    let timestamp = location.date

    let clLocation = CLLocation(
      coordinate: CLLocationCoordinate2D(
        latitude: latitude,
        longitude: longitude
      ),
      altitude: altitude,
      horizontalAccuracy: horizontalAccuracy,
      verticalAccuracy: verticalAccuracy,
      course: course,
      speed: speed,
      timestamp: timestamp
    )

    return clLocation
  }
}

class WorkoutsModule: HybridWorkoutsModuleSpec {
  func startWatchAppWithWorkoutConfiguration(workoutConfiguration: WorkoutConfiguration) -> Promise<
    Bool
  > {
    let configuration = parseWorkoutConfiguration(workoutConfiguration)

    return Promise.async {
      try await withCheckedThrowingContinuation { continuation in
        store.startWatchApp(with: configuration) { success, error in
          if let error {
            continuation.resume(
              throwing: error
            )
          }

          continuation.resume(returning: success)
        }
      }
    }
  }

  func queryWorkoutSamples(options: WorkoutQueryOptions) -> Promise<[HybridWorkoutProxySpec]> {
    return Promise.async {
      let predicate = createPredicateForWorkout(options.filter)
      return try await sampleQueryAsync(
        sampleType: .workoutType(),
        limit: options.limit,
        predicate: predicate,
        sortDescriptors: getSortDescriptors(ascending: options.ascending)
      ).compactMap { s in
        if let workout = s as? HKWorkout {
          return WorkoutProxy.init(
            workout: workout
          )
        }
        return nil
      }

    }
  }

  func saveWorkoutSample(
    workoutActivityType: WorkoutActivityType,
    quantities: [QuantitySampleForSaving],
    startDate: Date,
    endDate: Date,
    totals: WorkoutTotals?,
    metadata: AnyMap?
  ) -> Promise<HybridWorkoutProxySpec> {
    return Promise.async {
      let type = try initializeWorkoutActivityType(UInt(workoutActivityType.rawValue))

      // ensure that start date is before end date
      if startDate > endDate {
        throw runtimeErrorWithPrefix("endDate must not be less than startDate")
      }

      let metadataDeserialized = metadata != nil ? anyMapToDictionary(metadata!) : nil

      var totalEnergyBurned: HKQuantity?
      var totalDistance: HKQuantity?
      var totalSwimmingStrokeCount: HKQuantity?
      var totalFlightsClimbed: HKQuantity?
      // generating quantity samples
      let initializedSamples = try quantities.map { quantity in
        let type = try initializeQuantityType(quantity.quantityType.stringValue)
        let unitStr = quantity.unit
        let quantityVal = quantity.quantity
        let quantityStart = quantity.startDate
        let quantityEnd = quantity.endDate
        let unit = HKUnit.init(from: unitStr)
        let quantity = HKQuantity.init(unit: unit, doubleValue: quantityVal)

        if quantity.is(compatibleWith: HKUnit.kilocalorie()) {
          totalEnergyBurned = quantity
        }

        if quantity.is(compatibleWith: HKUnit.meter()) {
          totalDistance = quantity
        }

        if type.identifier == HKWorkoutSortIdentifierTotalSwimmingStrokeCount {
          totalSwimmingStrokeCount = quantity
        }

        if type.identifier == HKWorkoutSortIdentifierTotalFlightsClimbed {
          totalFlightsClimbed = quantity
        }

        return HKQuantitySample.init(
          type: type,
          quantity: quantity,
          start: quantityStart,
          end: quantityEnd,
          metadata: metadataDeserialized
        )
      }

      // if totals are provided override samples
      let rawTotalDistance = totals?.distance ?? 0.0
      let rawTotalEnergy = totals?.energyBurned ?? 0.0

      if rawTotalDistance != 0.0 {
        totalDistance = HKQuantity(unit: .meter(), doubleValue: rawTotalDistance)
      }
      if rawTotalEnergy != 0.0 {
        totalEnergyBurned = HKQuantity(unit: .kilocalorie(), doubleValue: rawTotalEnergy)
      }

      // creating workout
      var workout: HKWorkout?

      if totalSwimmingStrokeCount != nil {
        workout = HKWorkout.init(
          activityType: type,
          start: startDate,
          end: endDate,
          workoutEvents: nil,
          totalEnergyBurned: totalEnergyBurned,
          totalDistance: totalDistance,
          totalSwimmingStrokeCount: totalSwimmingStrokeCount,
          device: nil,
          metadata: metadataDeserialized
        )
      } else {
        if #available(iOS 11, *) {
          if let totalFlightsClimbed = totalFlightsClimbed {
            workout = HKWorkout.init(
              activityType: type,
              start: startDate,
              end: endDate,
              workoutEvents: nil,
              totalEnergyBurned: totalEnergyBurned,
              totalDistance: totalDistance,
              totalFlightsClimbed: totalFlightsClimbed,
              device: nil,
              metadata: metadataDeserialized
            )
          }
        }
      }

      if workout == nil {
        workout = HKWorkout.init(
          activityType: type,
          start: startDate,
          end: endDate,
          workoutEvents: nil,
          totalEnergyBurned: totalEnergyBurned,
          totalDistance: totalDistance,
          metadata: metadataDeserialized
        )
      }

      guard let workout = workout else {
        throw runtimeErrorWithPrefix("Could not create workout")
      }
      try await withCheckedThrowingContinuation({ continuation in
        // saving workout, samples and route
        store.save(workout) { (_: Bool, error: Error?) in
          if let error = error {
            return continuation.resume(throwing: error)
          } else if !initializedSamples.isEmpty {
            store.add(initializedSamples, to: workout) { (_, error: Error?) in
              if let error = error {
                return continuation.resume(throwing: error)
              }
              return continuation.resume()
            }
          } else {
            return continuation.resume()
          }

        }
      }) as Void

      return WorkoutProxy.init(
        workout: workout
      )
    }
  }

  func queryWorkoutSamplesWithAnchor(options: WorkoutQueryOptionsWithAnchor) -> Promise<
    QueryWorkoutSamplesWithAnchorResponse
  > {
    return Promise.async {
      let predicate = createPredicateForWorkout(options.filter)

      let response = try await sampleAnchoredQueryAsync(
        sampleType: .workoutType(),
        limit: options.limit,
        queryAnchor: options.anchor,
        predicate: predicate
      )

      let workoutProxies = response.samples.compactMap { s in
        if let workout = s as? HKWorkout {
          return WorkoutProxy.init(
            workout: workout
          )
        }
        return nil
      }

      return QueryWorkoutSamplesWithAnchorResponse(
        workouts: workoutProxies,
        deletedSamples: response.deletedSamples,
        newAnchor: response.newAnchor
      )
    }
  }
}
