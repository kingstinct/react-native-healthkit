import HealthKit
import CoreLocation
import NitroModules

#if canImport(WorkoutKit)
import WorkoutKit
#endif

func getWorkoutByID(
    workoutUUID: UUID
) async -> HKWorkout? {
    let workoutPredicate = HKQuery.predicateForObject(with: workoutUUID)
    
    let samples = try! await withCheckedThrowingContinuation {
        (continuation: CheckedContinuation<[HKSample], Error>) in
        let query = HKSampleQuery(
            sampleType: HKObjectType.workoutType(),
            predicate: workoutPredicate,
            limit: 1,
            sortDescriptors: nil
        ) { (_, results, error) in
            
            if let hasError = error {
                continuation.resume(throwing: hasError)
                return
            }
            
            guard let samples = results else {
                return continuation.resume(throwing: RuntimeError.error(withMessage: "Empty response"))
            }
            
            continuation.resume(returning: samples)
        }
        store.execute(query)
    }
    
    guard let workouts = samples as? [HKWorkout] else {
        return nil
    }
    
    return workouts.first ?? nil
}

/*func tryParseWeatherCondition(_ weatherCondition: Int?) -> WeatherCondition? {
    if let weatherCondition = weatherCondition {
        return WeatherCondition.init(rawValue: Int32(weatherCondition))
    }
    return nil
}

func deserializeWorkoutMetadata(_ metadata: WorkoutMetadata?) -> [String: Any]? {
    if let metadata = metadata {
        var dict = metadata.allMetadata != nil
        ? anyMapToDictionary(metadata.allMetadata!)
        : Dictionary<String, Any>()
        // todo (important): hmm, not sure about the typed props here
        // dict[""]
        return dict
    }
    return nil
}

func serializeWorkoutMetadata(_ metadata: [String: Any]?) -> WorkoutMetadata? {
    if let metadata = metadata {
        return WorkoutMetadata(
            // todo: figure out conversions here
            HKWeatherCondition: tryParseWeatherCondition(metadata["HKWeatherCondition"] as? Int),
            HKWeatherHumidity: serializeUnknownQuantityTyped(quantity: metadata["HKWeatherHumidity"] as? HKQuantity),
            HKWeatherTemperature: serializeUnknownQuantityTyped(quantity: metadata["HKWeatherTemperature"] as? HKQuantity),
            HKAverageMETs: serializeUnknownQuantityTyped(quantity: metadata["HKAverageMETs"] as? HKQuantity),
            HKElevationAscended: serializeUnknownQuantityTyped(quantity: metadata["HKElevationAscended"] as? HKQuantity),
            HKIndoorWorkout: metadata["HKIndoorWorkout"] as? Bool,
            HKExternalUUID: metadata["HKExternalUUID"] as? String,
            HKTimeZone: metadata["HKTimeZone"] as? String,
            HKWasUserEntered: metadata["HKWasUserEntered"] as? Bool,
            HKDeviceSerialNumber: metadata["HKDeviceSerialNumber"] as? String,
            HKUDIDeviceIdentifier: metadata["HKUDIDeviceIdentifier"] as? String,
            HKUDIProductionIdentifier: metadata["HKUDIProductionIdentifier"] as? String,
            HKDigitalSignature: metadata["HKDigitalSignature"] as? String,
            HKDeviceName: metadata["HKDeviceName"] as? String,
            HKDeviceManufacturerName: metadata["HKDeviceManufacturerName"] as? String,
            HKSyncIdentifier: metadata["HKSyncIdentifier"] as? String,
            HKSyncVersion: metadata["HKSyncVersion"] as? Double,
            HKWasTakenInLab: metadata["HKWasTakenInLab"] as? Bool,
            HKReferenceRangeLowerLimit: metadata["HKReferenceRangeLowerLimit"] as? Double,
            HKReferenceRangeUpperLimit: metadata["HKReferenceRangeUpperLimit"] as? Double,
            allMetadata: serializeAllMetadata(metadata)
        )
    }
    return nil
}*/

func mapWorkout(
    workout: HKWorkout,
    distanceUnit: HKUnit,
    energyUnit: HKUnit
) -> WorkoutSample {
    var device: Device? = nil
    if let hkDevice = workout.device {
        device = Device(
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
    var totalDistance: Quantity? = nil
    if let hkTotalDistance = workout.totalDistance {
        totalDistance = Quantity(
            unit: distanceUnit.unitString,
            quantity: hkTotalDistance.doubleValue(
                for: distanceUnit
            )
        )
    }
    
    /*
     "uuid": workout.uuid.uuidString,
     "device": serializeDevice(_device: workout.device) as Any,
     "duration": workout.duration,
     "totalDistance": serializeQuantity(unit: distanceUnit, quantity: workout.totalDistance)
     as Any,
     "totalEnergyBurned": serializeQuantity(unit: energyUnit, quantity: workout.totalEnergyBurned)
     as Any,
     "totalSwimmingStrokeCount": serializeQuantity(
     unit: HKUnit.count(), quantity: workout.totalSwimmingStrokeCount) as Any,
     "workoutActivityType": workout.workoutActivityType.rawValue,
     "startDate": startDate,
     "endDate": endDate,
     "metadata": serializeMetadata(metadata: workout.metadata),
     "sourceRevision": serializeSourceRevision(_sourceRevision: workout.sourceRevision) as Any
     ]*/
    
    // this is used for our laps functionality to get markers
    // https://developer.apple.com/documentation/healthkit/hkworkoutevent
    var workoutEvents: [WorkoutEvent] = []
    if let hkWorkoutEvents = workout.workoutEvents {
        workoutEvents = hkWorkoutEvents.compactMap { event in
            if let type = WorkoutEventType.init(
                rawValue: Int32(event.type.rawValue)
            ) {
                return WorkoutEvent(
                    type: type,
                    startDate: event.dateInterval.start,
                    endDate: event.dateInterval.end
                )
            }
            return nil
        }
    }
    
    
    
    // also used for our laps functionality to get activities for custom workouts defined by the user
    // https://developer.apple.com/documentation/healthkit/hkworkout/1615340-init
    // it seems this might be depricated in the latest beta so this might need updating!
    var activitiesArray: [WorkoutActivity] = []
    if #available(iOS 16.0, *) {
        let hkActivities = workout.workoutActivities
        
        activitiesArray = hkActivities.map { activity in
            return WorkoutActivity(
                startDate: activity.startDate,
                endDate: activity.endDate ?? activity.startDate,
                uuid: activity.uuid.uuidString,
                duration: activity.duration
            )
        }
    }
    
    var totalFlightsClimbed: Quantity?
    if #available(iOS 11, *) {
        if let hkTotalFlightsClimbed = workout.totalFlightsClimbed {
            totalFlightsClimbed = Quantity(
                unit: "count",
                quantity: hkTotalFlightsClimbed.doubleValue(for: HKUnit.count())
            )
        }
    }
    
    let workout = WorkoutSample.init(
        uuid: workout.uuid.uuidString,
        device: device,
        workoutActivityType: WorkoutActivityType.init(
            rawValue: Int32(workout.workoutActivityType.rawValue)
        )!,
        duration: serializeQuantityTyped(
            unit: .second(),
            quantity: HKQuantity(unit: .second(), doubleValue: workout.duration)
        )!,
        totalDistance: totalDistance,
        totalEnergyBurned: serializeQuantityTyped(unit: energyUnit, quantity: workout.totalEnergyBurned),
        totalSwimmingStrokeCount: serializeQuantityTyped(unit: .count(), quantity: workout.totalSwimmingStrokeCount),
        totalFlightsClimbed: totalFlightsClimbed,
        startDate: workout.startDate,
        endDate: workout.endDate,
        metadata: serializeMetadata(workout.metadata),
        sourceRevision: serializeSourceRevision(workout.sourceRevision),
        events: workoutEvents,
        activities: activitiesArray
    )
    
    return workout
}

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
            timestamp: timestamp,
        )
        
        return clLocation
    }
}

class WorkoutsModule : HybridWorkoutsModuleSpec {
    func queryWorkoutSamples(options: WorkoutQueryOptions) throws -> Promise<[HybridWorkoutProxySpec]> {
        let predicate = try createPredicateForWorkout(filter: options.filter)
        
        let limit = getQueryLimit(options.limit)
        
        return Promise.async {
            let energyUnit = try await getUnitToUse(unitOverride: options.energyUnit, quantityType: HKQuantityType(.activeEnergyBurned))
            
            let distanceUnit = try await getUnitToUse(unitOverride: options.distanceUnit, quantityType: HKQuantityType(.distanceWalkingRunning))
            
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
                            let sample = mapWorkout(
                                workout: workout,
                                distanceUnit: distanceUnit,
                                energyUnit: energyUnit
                            )
                            return WorkoutProxy.init(
                                workout: workout,
                                sample: sample
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
    
    func queryWorkoutByUUID(workoutUUID: String) throws -> Promise<HybridWorkoutProxySpec?> {
        let uuid = try initializeUUID(workoutUUID)
        
        return Promise.async {
            let workout = await getWorkoutByID(workoutUUID: uuid)
            
            if let workout = workout {
                let sample = mapWorkout(
                    workout: workout,
                    distanceUnit: HKUnit.meter(),
                    energyUnit: HKUnit.kilocalorie()
                )
                return WorkoutProxy(
                    workout: workout,
                    sample: sample
                )
            }
            return nil
        }
    }
    
    func saveWorkoutSample(
        workoutActivityType: WorkoutActivityType,
        quantities: [QuantitySampleForSaving],
        startDate: Date,
        endDate: Date,
        totals: WorkoutTotals,
        metadata: AnyMapHolder
    ) throws -> Promise<String> {
        
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
            let metadata = quantity.metadata
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
            try await withCheckedThrowingContinuation { continuation in
                // saving workout, samples and route
                store.save(workout) { (_: Bool, error: Error?) in
                    if let error = error {
                        return continuation.resume(throwing: error)
                    }
                    
                    if initializedSamples.isEmpty {
                        return continuation.resume(returning: workout.uuid.uuidString)
                    }
                    
                    store.add(initializedSamples, to: workout) { (_, error: Error?) in
                        if let error = error {
                            return continuation.resume(throwing: error)
                        }
                        return continuation.resume(returning: workout.uuid.uuidString)
                    }
                }
            }
        }
    }
    
    
    func startWatchAppWithWorkoutConfiguration(workoutConfiguration: WorkoutConfiguration) -> Promise<Bool>
    {
        let configuration = parseWorkoutConfiguration(workoutConfiguration)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                store.startWatchApp(with: configuration) { success, error in
                    if let error {
                        continuation.resume(throwing: error)
                    } else {
                        continuation.resume(returning: success)
                    }
                }
            }
        }
    }
    
    func queryWorkoutSamplesWithAnchor(options: WorkoutQueryOptionsWithAnchor) throws -> Promise<QueryWorkoutSamplesWithAnchorResponse> {
        let predicate = try createPredicateForWorkout(filter: options.filter)
        
        let limit = getQueryLimit(options.limit)
        
        let actualAnchor = try deserializeHKQueryAnchor(base64String: options.anchor)
        
        return Promise.async {
            let energyUnit = try await getUnitToUse(unitOverride: options.energyUnit, quantityType: HKQuantityType(.activeEnergyBurned))
            
            let distanceUnit = try await getUnitToUse(unitOverride: options.energyUnit, quantityType: HKQuantityType(.distanceWalkingRunning))
            
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
                            let sample = mapWorkout(
                                workout: workout,
                                distanceUnit: distanceUnit,
                                energyUnit: energyUnit
                            )
                            return WorkoutProxy.init(
                                workout: workout,
                                sample: sample
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
