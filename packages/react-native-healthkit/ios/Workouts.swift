import HealthKit
import CoreLocation
import NitroModules

#if canImport(WorkoutKit)
import WorkoutKit
#endif

func getWorkoutByID(
    store: HKHealthStore,
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

func getWorkoutRoutes(
    store: HKHealthStore,
    workoutUUID: UUID
) async throws -> [HKWorkoutRoute]? {
    guard let workout = await getWorkoutByID(store: store, workoutUUID: workoutUUID) else {
        return nil
    }
    
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
                return continuation.resume(throwing: RuntimeError.error(withMessage: "Empty response"))
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
    store: HKHealthStore,
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
                return continuation.resume(throwing: RuntimeError.error(withMessage: "Empty response"))
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


func serializeLocation(location: CLLocation, previousLocation: CLLocation?) -> WorkoutLocation {
    var distance: CLLocationDistance?
    if let previousLocation = previousLocation {
        distance = location.distance(from: previousLocation)
    } else {
        distance = nil
    }
    return WorkoutLocation(
        longitude: location.coordinate.longitude,
        latitude: location.coordinate.latitude,
        altitude: location.altitude,
        speed: location.speed,
        date: location.timestamp,
        horizontalAccuracy: location.horizontalAccuracy,
        speedAccuracy: location.speedAccuracy,
        verticalAccuracy: location.verticalAccuracy,
        distance: distance
    )
}

func getSerializedWorkoutLocations(
    store: HKHealthStore,
    workoutUUID: UUID
) async throws -> [WorkoutRoute] {
    let routes = try await getWorkoutRoutes(
        store: store,
        workoutUUID: workoutUUID
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
            store: store,
            route: route
        )
        
        let routeLocations = routeCLLocations.enumerated().map {
            (i, loc) in
            serializeLocation(
                location: loc,
                previousLocation: i == 0 ? nil : routeCLLocations[i - 1]
            )
        }
        // let routeInfos: WorkoutRoute = ["locations": routeLocations]
        
        allRoutes.append(
            WorkoutRoute(
                locations: routeLocations,
                HKMetadataKeySyncIdentifier: routeMetadata.getString(key: "HKMetadataKeySyncIdentifier"),
                HKMetadataKeySyncVersion: routeMetadata.getDouble(key: "HKMetadataKeySyncVersion")
            )
        )
    }
    return allRoutes
}

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
    var totalDistance: QuantityRaw? = nil
    if let hkTotalDistance = workout.totalDistance {
        totalDistance = QuantityRaw(
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
                    start: event.dateInterval.start,
                    end: event.dateInterval.end
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
                start: activity.startDate,
                end: activity.endDate ?? activity.startDate,
                uuid: activity.uuid.uuidString,
                duration: activity.duration
            )
        }
    }
    
    var totalFlightsClimbed: QuantityRaw?
    if #available(iOS 11, *) {
        if let hkTotalFlightsClimbed = workout.totalFlightsClimbed {
            totalFlightsClimbed = QuantityRaw(
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
        // todo
        totalEnergyBurned: nil,
        totalSwimmingStrokeCount: nil,
        totalFlightsClimbed: totalFlightsClimbed,
        start: workout.startDate,
        end: workout.endDate,
        metadata: serializeMetadata(workout.metadata),
        sourceRevision: nil,
        events: workoutEvents,
        activities: activitiesArray
    )
    
    return workout
}

func getPreferredUnits(
    quantityTypes: Set<HKQuantityType>
) -> Promise<[HKQuantityType: HKUnit]> {
    return Promise.async {
        try await withCheckedThrowingContinuation { continuation in
            store.preferredUnits(for: quantityTypes) {
                (typePerUnits: [HKQuantityType: HKUnit], _: Error?) in
                
                continuation.resume(returning: typePerUnits)
            }
        }
    }

  
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
            timestamp: timestamp
        )
        
        return clLocation
    }
}

class WorkoutsModule : HybridWorkoutsModuleSpec {
    func queryWorkoutByUUID(workoutUUID: String) throws -> Promise<WorkoutSample?> {
        if let uuid = UUID(uuidString: workoutUUID) {
            return Promise.async {
                let workout = await getWorkoutByID(store: store, workoutUUID: uuid)
                
                if let workout = workout {
                    return mapWorkout(workout: workout, distanceUnit: HKUnit.meter(),
                        energyUnit: HKUnit.kilocalorie()
                    )
                }
                return nil
            }
        }
        return Promise.resolved(withResult: nil)
    }
    
    func saveWorkoutSample(workoutActivityType: WorkoutActivityType, quantities: [QuantitySampleForSaving], start: Date?, end: Date?, totals: WorkoutTotals, metadata: AnyMapHolder) throws -> Promise<String?> {
        return Promise.resolved(withResult: nil)
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
    
    func saveWorkoutRoute(workoutUUID: String, locations: [LocationForSaving]) -> Promise<Bool> {
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                Task {
                    if let uuid = UUID(uuidString: workoutUUID) {
                        do {
                            let workout = await getWorkoutByID(store: store, workoutUUID: uuid)
                            if let workout {
                                // create CLLocations and return if locations are empty
                                let clLocations = mapLocations(from: locations)
                                let routeBuilder = HKWorkoutRouteBuilder(healthStore: store, device: nil)
                                try await routeBuilder.insertRouteData(clLocations)
                                try await routeBuilder.finishRoute(with: workout, metadata: nil)
                                
                                return continuation.resume(returning: true)
                            } else {
                                return continuation.resume(throwing: RuntimeError.error(withMessage: "No workout found"))
                            }
                        } catch {
                            return continuation.resume(throwing: error)
                        }
                    } else {
                        return continuation.resume(throwing: RuntimeError.error(withMessage: "Invalid UUID"))
                    }
                }
            }
        }
    }
    
    func queryWorkoutSamplesWithAnchor(energyUnit: String, distanceUnit: String, from: Date?, to: Date?, limit: Double, anchor: String?) throws -> Promise<QueryWorkoutSamplesWithAnchorResponse> {
        let predicate = createPredicate(
            from: from,
            to: to
        )
        
        let limit = limitOrNilIfZero(limit: limit)
        
        var actualAnchor: HKQueryAnchor? = nil
        if let anchor = anchor {
            actualAnchor = deserializeHKQueryAnchor(anchor: anchor)
        }
        
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
                    guard let err = error else {
                        guard let samples = s, let newAnchor = newAnchor else {
                            return continuation.resume(
                                throwing: RuntimeError.error(
                                    withMessage: "Empty response"
                                )
                            )
                        }
                        
                        let energyUnit = HKUnit.init(from: energyUnit)
                        let distanceUnit = HKUnit.init(from: distanceUnit)
                        
                        let arr = samples.compactMap { s in
                            if let workout = s as? HKWorkout {
                                return mapWorkout(
                                    workout: workout,
                                    distanceUnit: distanceUnit,
                                    energyUnit: energyUnit
                                )
                            }
                            return nil
                        }
                        
                        let deletedSamples = deletedSamples?.map({ sample in
                            return serializeDeletedSample(sample: sample)
                        }) ?? []
                        
                        let returnValue = QueryWorkoutSamplesWithAnchorResponse(
                            samples: arr,
                            deletedSamples: deletedSamples,
                            newAnchor: serializeAnchor(anchor: newAnchor)
                        )
                        return continuation.resume(returning: returnValue)
                        
                    }
                    continuation.resume(throwing: err)
                }
                
                store.execute(q)
            }
        }
    }
    
    func getWorkoutPlan(workoutUUID: String) -> Promise<WorkoutPlan?> {
        return Promise.async {
            if let uuid = UUID(uuidString: workoutUUID) {
                let workout = await getWorkoutByID(
                    store: store,
                    workoutUUID: uuid
                )
                if let workout {
                    if #available(iOS 17.0.0, *) {
                        let workoutPlan = try await getWorkoutPlanInternal(workout: workout)
                        return workoutPlan
                    } else {
                        throw RuntimeError.error(withMessage: "Workout Plans requires iOS 17+")
                    }
                } else {
                    throw RuntimeError.error(withMessage: "No workout found with id \(workoutUUID)")
                }
            } else {
                throw RuntimeError.error(withMessage: "Invalid UUID")
            }
        }
    }
    
    
    func getWorkoutRoutes(workoutUUID: String) -> Promise<[WorkoutRoute]> {
        guard let _workoutUUID = UUID(uuidString: workoutUUID) else {
            return Promise.rejected(withError: RuntimeError.error(withMessage: "Invalid UUID"))
        }
        
        return Promise.async {
            let locations = try await getSerializedWorkoutLocations(
                store: store,
                workoutUUID: _workoutUUID
            )
            return locations
            
        }
    }
}

