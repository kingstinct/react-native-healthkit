import HealthKit
import CoreLocation
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
    func startWatchAppWithWorkoutConfiguration(workoutConfiguration: WorkoutConfiguration) throws -> Promise<Bool> {
        let configuration = parseWorkoutConfiguration(workoutConfiguration)

        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.startWatchApp(with: configuration) { success, error in
                  if let error {
                      continuation.resume(throwing: RuntimeError.error(withMessage: error.localizedDescription))
                  }

                  continuation.resume(returning: success)
                }
            }
        }
    }

    func queryWorkoutSamples(options: WorkoutQueryOptions) throws -> Promise<[HybridWorkoutProxySpec]> {
        let predicate = try createPredicateForWorkout(filter: options.filter)

        let limit = getQueryLimit(options.limit)

        return Promise.async {
            return try await withCheckedThrowingContinuation { continuation in
                let q = HKSampleQuery(
                    sampleType: .workoutType(),
                    predicate: predicate,
                    limit: limit,
                    sortDescriptors: getSortDescriptors(ascending: options.ascending ?? true)
                ) { (_: HKSampleQuery, samples: [HKSample]?, error: Error?) in
                    if let error = error {
                        return continuation.resume(throwing: error)
                    }

                    guard let samples = samples else {
                        return continuation.resume(throwing: RuntimeError.error(withMessage: "Empty response"))
                    }

                    let workoutProxies = samples.compactMap { s in
                        if let workout = s as? HKWorkout {
                            return WorkoutProxy.init(
                                workout: workout
                            )
                        }
                        return nil
                    }

                    return continuation.resume(returning: workoutProxies)
                }

                store.execute(q)
            }
        }
    }

    func saveWorkoutSample(
        workoutActivityType: WorkoutActivityType,
        quantities: [QuantitySampleForSaving],
        startDate: Date,
        endDate: Date,
        totals: WorkoutTotals,
        metadata: AnyMap
    ) throws -> Promise<HybridWorkoutProxySpec> {

        let type = try initializeWorkoutActivityType(UInt(workoutActivityType.rawValue))

        // if start and end both exist,  ensure that start date is before end date
        if let startDate = startDate as Date?, let endDate = endDate as Date? {
            if startDate > endDate {
                throw RuntimeError.error(withMessage: "endDate must not be less than startDate")
            }
        }

        let metadataDeserialized = anyMapToDictionary(metadata)

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
        let rawTotalDistance = totals.distance ?? 0.0
        let rawTotalEnergy = totals.energyBurned ?? 0.0

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
                if totalFlightsClimbed != nil {
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
            throw RuntimeError.error(withMessage: "Could not create workout")
        }

        return Promise.async {
            try await withCheckedThrowingContinuation({ continuation in
                // saving workout, samples and route
                store.save(workout) { (_: Bool, error: Error?) in
                    if let error = error {
                        return continuation.resume(throwing: error)
                    }
                    if !initializedSamples.isEmpty {
                        store.add(initializedSamples, to: workout) { (_, error: Error?) in
                            if let error = error {
                                return continuation.resume(throwing: error)
                            }
                        }
                    }
                    return continuation.resume()
                }
            }) as Void

            return WorkoutProxy.init(
                workout: workout
            )
        }
    }

    func queryWorkoutSamplesWithAnchor(options: WorkoutQueryOptionsWithAnchor) throws -> Promise<QueryWorkoutSamplesWithAnchorResponse> {
        let predicate = try createPredicateForWorkout(filter: options.filter)

        let limit = getQueryLimit(options.limit)

        let actualAnchor = try deserializeHKQueryAnchor(base64String: options.anchor)

        return Promise.async {

            return try await withCheckedThrowingContinuation { continuation in
                let q = HKAnchoredObjectQuery(
                    type: .workoutType(),
                    predicate: predicate,
                    anchor: actualAnchor,
                    limit: limit
                ) {
                    (
                        _: HKAnchoredObjectQuery,
                        s: [HKSample]?,
                        deletedSamples: [HKDeletedObject]?,
                        newAnchor: HKQueryAnchor?,
                        error: Error?
                    ) in
                    if let error = error {
                        return continuation.resume(throwing: error)
                    }

                    guard let samples = s, let newAnchor = newAnchor else {
                        return continuation.resume(
                            throwing: RuntimeError.error(
                                withMessage: "Empty response"
                            )
                        )
                    }

                    let workoutProxies = samples.compactMap { s in
                        if let workout = s as? HKWorkout {
                            return WorkoutProxy.init(
                                workout: workout,
                            )
                        }
                        return nil
                    }

                    let deletedSamples = deletedSamples?.map({ sample in
                        return serializeDeletedSample(sample: sample)
                    }) ?? []

                    let returnValue = QueryWorkoutSamplesWithAnchorResponse(
                        workouts: workoutProxies,
                        deletedSamples: deletedSamples,
                        newAnchor: serializeAnchor(anchor: newAnchor)!
                    )

                    return continuation.resume(returning: returnValue)
                }

                store.execute(q)
            }
        }
    }
}
