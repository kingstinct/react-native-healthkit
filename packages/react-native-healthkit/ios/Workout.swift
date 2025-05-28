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
          fatalError("workout samples unexpectedly nil")
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
  ) async -> [HKWorkoutRoute]? {
    guard let workout = await getWorkoutByID(store: store, workoutUUID: workoutUUID) else {
      return nil
    }

    let workoutPredicate = HKQuery.predicateForObjects(from: workout)
    let samples = try! await withCheckedThrowingContinuation {
      (continuation: CheckedContinuation<[HKSample], Error>) in
      let query = HKAnchoredObjectQuery(
        type: HKSeriesType.workoutRoute(),
        predicate: workoutPredicate,
        anchor: nil,
        limit: HKObjectQueryNoLimit
      ) {
        (_, samples, _, _, error) in

        if let hasError = error {
          continuation.resume(throwing: hasError)
          return
        }

        guard let samples = samples else {
          fatalError("workoutRoute samples unexpectedly nil")
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
          fatalError("routeLocations unexpectedly nil")
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
    timestamp: location.timestamp.timeIntervalSince1970,
    horizontalAccuracy: location.horizontalAccuracy,
    speedAccuracy: location.speedAccuracy,
    verticalAccuracy: location.verticalAccuracy,
    distance: distance
  )
}

func getSerializedWorkoutLocations(
    store: HKHealthStore,
    workoutUUID: UUID
  ) async -> [WorkoutRoute] {
    let routes = await getWorkoutRoutes(
      store: store,
      workoutUUID: workoutUUID
    )

    var allRoutes: [WorkoutRoute] = []
    guard let _routes = routes else {
      return []
    }
    for route in _routes {
      let routeMetadata =
        serializeMetadata(
          metadata: route.metadata
        ) as! [String: Any]
        
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
        
        allRoutes.append(WorkoutRoute(
            locations: routeLocations,
            HKMetadataKeySyncIdentifier: routeMetadata["HKMetadataKeySyncIdentifier"] as? String,
            HKMetadataKeySyncVersion: routeMetadata["HKMetadataKeySyncVersion"] as? Double
        ))

      // allRoutes.append(routeInfos.merging(routeMetadata) { (current, _) in current })
    }
    return allRoutes
  }

@available(iOS 17.0.0, *)
func getWorkoutPlan(workout: HKWorkout) async -> WorkoutPlan? {
    #if canImport(WorkoutKit)
    do {
        
    
    let workoutPlan = try await workout.workoutPlan
        if let id = workoutPlan?.id.uuidString {
            if let activityType = workoutPlan?.workout.activity {
                var dict = WorkoutPlan(id: id, activityType: Double(activityType.rawValue))
                
                return dict
            }
        }
    
        return nil
    }
    catch{
        return nil
    }
    #else
      return nil
    #endif
  }

func mapWorkout(
  workout: HKWorkout,
  distanceUnit: HKUnit,
  energyUnit: HKUnit
) -> WorkoutRaw {
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
        totalDistance = QuantityRaw(unit: distanceUnit.unitString, quantity: hkTotalDistance.doubleValue(for: distanceUnit)
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
            if let type = WorkoutEventType.init(rawValue: Int32(event.type.rawValue)) {
                return WorkoutEvent(
                    type: type,
                    startTimestamp: event.dateInterval.start.timeIntervalSince1970,
                    endTimestamp: event.dateInterval.end.timeIntervalSince1970
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
                startTimestamp: activity.startDate.timeIntervalSince1970,
                endTimestamp: activity.endDate?.timeIntervalSince1970 ?? activity.startDate.timeIntervalSince1970,
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
    
    var workoutPlanId: String?
    if #available(iOS 17, *) {
        // todo
        // workoutPlanId = workout.workoutPlan?.id.uuidString
    }
    
    let workout = WorkoutRaw.init(
        uuid: workout.uuid.uuidString,
        device: device,
        workoutActivityType: WorkoutActivityType.init(
            rawValue: Int32(workout.workoutActivityType.rawValue)
        )!,
        duration: workout.duration,
        totalDistance: totalDistance,
        // todo
        totalEnergyBurned: nil,
        totalSwimmingStrokeCount: nil,
        totalFlightsClimbed: totalFlightsClimbed,
        startTimestamp: workout.startDate.timeIntervalSince1970,
        endTimestamp: workout.endDate.timeIntervalSince1970,
        metadata: GenericMetadata(),
        sourceRevision: nil,
        events: workoutEvents,
        activities: activitiesArray,
        workoutPlanId: workoutPlanId
    )
    
    return workout
}

struct EmptyResponseError: Error, LocalizedError {
    var errorDescription: String? {
        return "[react-native-healthkit] The response was unexpectedly empty"
    }
}

struct GenericHealthkitError: Error, LocalizedError {
    var errorDescription: String? {
        return "[react-native-healthkit] Generic error"
    }
}

class Workout : HybridWorkoutSpec {
    func startWatchAppWithWorkoutConfiguration(workoutConfiguration: WorkoutConfiguration) -> Promise<Bool>
    {
        let configuration = parseWorkoutConfiguration(workoutConfiguration)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                
                store.startWatchApp(with: configuration) { success, error in
                    if let error {
                        //fatalError(INIT_ERROR)
                        continuation.resume(throwing: error)
                        // reject(INIT_ERROR, INIT_ERROR_MESSAGE, error)
                    }
                    
                    continuation.resume(returning: success)
                }
            }
        }
    }
    
    func saveWorkoutSample(typeIdentifier: Double, quantities: [QuantitySampleRawForSaving], startTimestamp: Double, endTimestamp: Double, totals: WorkoutTotals, metadata: AnyMapHolder) throws -> Promise<String?> {
        return Promise.resolved(withResult: nil)
    }
    
    func saveWorkoutRoute(workoutUUID: String, locations: [CLLocationRawForSaving]) -> Promise<Bool> {
        return Promise.resolved(withResult: false as Bool)
    }
    
    func queryWorkoutSamplesWithAnchor(energyUnit: String, distanceUnit: String, fromTimestamp: Double, toTimestamp: Double, limit: Double, anchor: String?) throws -> Promise<QueryWorkoutSamplesWithAnchorResponseRaw> {
            let from = dateOrNilIfZero(fromTimestamp)
            let to = dateOrNilIfZero(toTimestamp)

            let predicate = createPredicate(
                from: from,
                to: to
            )

            let limit = limitOrNilIfZero(limit: limit)

            let energyUnit = HKUnit.init(from: energyUnit)
            let distanceUnit = HKUnit.init(from: distanceUnit)

            var actualAnchor: HKQueryAnchor? = nil
            if let anchor = anchor {
                actualAnchor = deserializeHKQueryAnchor(anchor: anchor)
            }
        
            return Promise.async {
                return try await withCheckedThrowingContinuation { continuation in
                    let q = HKAnchoredObjectQuery(
                      type: .workoutType(), predicate: predicate, anchor: actualAnchor, limit: limit
                    ) {
                      (
                        _: HKAnchoredObjectQuery,
                        s: [HKSample]?,
                        deletedSamples: [HKDeletedObject]?,
                        newAnchor: HKQueryAnchor?,
                        error: Error?
                      ) in
                      guard let err = error else {
                        guard let samples = s else {
                          return continuation.resume(throwing: EmptyResponseError())
                        }
                          
                      guard let newAnchor = newAnchor else {
                        return continuation.resume(throwing: EmptyResponseError())
                      }

                        
                          let arr = samples.compactMap { s in
                              if let w = s as? HKWorkout {
                                  return mapWorkout(
                                    workout: w,
                                    distanceUnit: distanceUnit,
                                    energyUnit: energyUnit
                                  )
                              }
                              return nil
                          }
                          
                          let deletedSamples = deletedSamples?.map({ sample in
                              return serializeDeletedSample(sample: sample)
                            }) ?? []
                          
                          let returnValue = QueryWorkoutSamplesWithAnchorResponseRaw(
                            samples: arr,
                            deletedSamples: deletedSamples,
                            newAnchor: serializeAnchor(anchor: newAnchor)
                        )
                        return continuation.resume(returning: returnValue)
                      }
                      continuation.resume(throwing: err)
                      // reject(GENERIC_ERROR, err.localizedDescription, err)
                    }

                    store.execute(q)
                }
            }
    }
    
    func getWorkoutPlanById(workoutUUID: String) -> Promise<WorkoutPlan?> {
      #if canImport(WorkoutKit)
        return Promise.async {
          if let uuid = UUID(uuidString: workoutUUID) {
            let workout = await getWorkoutByID(store: store, workoutUUID: uuid)
            if let workout {
                if #available(iOS 17.0.0, *) {
                    let workoutPlan = await getWorkoutPlan(workout: workout)
                    return workoutPlan
                } else {
                    return nil
                }
            } else {
              fatalError("No workout found")
              // return reject(GENERIC_ERROR, "No workout found", nil)
            }
          } else {
            fatalError("Invalid UUID")
            // return reject(GENERIC_ERROR, "Invalid UUID", nil)
          }
        }
      #else
        return Promise.resolved(withResult: nil)
      #endif
    }
    
    
    func getWorkoutRoutes(workoutUUID: String) -> Promise<[WorkoutRoute]> {
        guard let _workoutUUID = UUID(uuidString: workoutUUID) else {
            fatalError("INVALID_UUID_ERROR")
//          return reject("INVALID_UUID_ERROR", "Invalid UUID received", nil)
        }

        return Promise.async {
          
            let locations = await getSerializedWorkoutLocations(store: store, workoutUUID: _workoutUUID)
            return locations
          
        }
    }
}

