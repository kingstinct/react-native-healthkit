//
//  WorkoutProxy.swift
//  Pods
//
//  Created by Robert Herber on 2025-06-07.
//

import HealthKit
import NitroModules
import CoreLocation

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


func serializeLocation(location: CLLocation, previousLocation: CLLocation?) -> WorkoutRouteLocation {
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


func saveWorkoutRouteInternal(workout: HKWorkout, locations: [LocationForSaving]) -> Promise<Bool> {
    return Promise.async {
        try await withCheckedThrowingContinuation { continuation in
            Task {
                do {
                    // create CLLocations and return if locations are empty
                    let clLocations = mapLocations(from: locations)
                    let routeBuilder = HKWorkoutRouteBuilder(healthStore: store, device: nil)
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

class WorkoutProxy : HybridWorkoutProxySpec {
    func saveWorkoutRoute(locations: [LocationForSaving]) throws -> Promise<Bool> {
        return saveWorkoutRouteInternal(workout: self.workout, locations: locations)
    }
    
    func getWorkoutRoutes() throws -> Promise<[WorkoutRoute]> {
        return Promise.async {
            return try await getSerializedWorkoutLocations(workout: self.workout)
        }
    }
    
    var workout: HKWorkout
    var sample: WorkoutSample
    init(workout: HKWorkout, sample: WorkoutSample){
        self.workout = workout
        self.sample = sample
    }
    
    func getWorkoutPlan() throws -> Promise<WorkoutPlan?> {
        return Promise.async {
            if #available(iOS 17.0.0, *) {
                return try await getWorkoutPlanInternal(workout: self.workout)
            } else {
                throw RuntimeError.error(withMessage: "Workout plans are only available on iOS 17.0 or later")
            }
        }
    }
}
