//
//  Serializers.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit

let _dateFormatter = ISO8601DateFormatter()

func serializeQuantity(unit: HKUnit, quantity: HKQuantity?) -> [String: Any]? {
    guard let q = quantity else {
        return nil
    }

    return [
        "quantity": q.doubleValue(for: unit),
        "unit": unit.unitString
    ]
}

func serializeQuantitySample(sample: HKQuantitySample, unit: HKUnit) -> NSDictionary {
    let endDate = _dateFormatter.string(from: sample.endDate)
    let startDate = _dateFormatter.string(from: sample.startDate)

    let quantity = sample.quantity.doubleValue(for: unit)

    return [
        "uuid": sample.uuid.uuidString,
        "device": serializeDevice(_device: sample.device) as Any,
        "quantityType": sample.quantityType.identifier,
        "endDate": endDate,
        "startDate": startDate,
        "quantity": quantity,
        "unit": unit.unitString,
        "metadata": serializeMetadata(metadata: sample.metadata),
        "sourceRevision": serializeSourceRevision(_sourceRevision: sample.sourceRevision) as Any
    ]
}

func serializeDeletedSample(sample: HKDeletedObject) -> NSDictionary {
  return [
      "uuid": sample.uuid.uuidString,
      "metadata": serializeMetadata(metadata: sample.metadata)
  ]
}

func serializeCategorySample(sample: HKCategorySample) -> NSDictionary {
    let endDate = _dateFormatter.string(from: sample.endDate)
    let startDate = _dateFormatter.string(from: sample.startDate)

    return [
        "uuid": sample.uuid.uuidString,
        "device": serializeDevice(_device: sample.device) as Any,
        "categoryType": sample.categoryType.identifier,
        "endDate": endDate,
        "startDate": startDate,
        "value": sample.value,
        "metadata": serializeMetadata(metadata: sample.metadata),
        "sourceRevision": serializeSourceRevision(_sourceRevision: sample.sourceRevision) as Any
    ]
}

func serializeSource(source: HKSource) -> NSDictionary {

    return [
        "bundleIdentifier": source.bundleIdentifier,
        "name": source.name
    ]
}

func serializeUnknownQuantity(quantity: HKQuantity) -> [String: Any]? {
    if quantity.is(compatibleWith: HKUnit.percent()) {
        return serializeQuantity(unit: HKUnit.percent(), quantity: quantity)
    }

    if quantity.is(compatibleWith: HKUnit.second()) {
        return serializeQuantity(unit: HKUnit.second(), quantity: quantity)
    }

    if quantity.is(compatibleWith: HKUnit.kilocalorie()) {
        return serializeQuantity(unit: HKUnit.kilocalorie(), quantity: quantity)
    }

    if quantity.is(compatibleWith: HKUnit.count()) {
        return serializeQuantity(unit: HKUnit.count(), quantity: quantity)
    }

    if quantity.is(compatibleWith: HKUnit.meter()) {
        return serializeQuantity(unit: HKUnit.meter(), quantity: quantity)
    }

    if #available(iOS 11, *) {
        if quantity.is(compatibleWith: HKUnit.internationalUnit()) {
            return serializeQuantity(unit: HKUnit.internationalUnit(), quantity: quantity)
        }
    }

    if #available(iOS 13, *) {
        if quantity.is(compatibleWith: HKUnit.hertz()) {
            return serializeQuantity(unit: HKUnit.hertz(), quantity: quantity)
        }
        if quantity.is(compatibleWith: HKUnit.decibelHearingLevel()) {
            return serializeQuantity(unit: HKUnit.decibelHearingLevel(), quantity: quantity)
        }
    }

    if quantity.is(compatibleWith: SpeedUnit) {
        return serializeQuantity(unit: SpeedUnit, quantity: quantity)
    }

    if quantity.is(compatibleWith: METUnit) {
        return serializeQuantity(unit: METUnit, quantity: quantity)
    }

    return nil
}

func serializeMetadata(metadata: [String: Any]?) -> NSDictionary {
    let serialized: NSMutableDictionary = [:]
    if let m = metadata {
        for item in m {
            if let bool = item.value as? Bool {
                serialized.setValue(bool, forKey: item.key)
            }
            if let str = item.value as? String {
                serialized.setValue(str, forKey: item.key)
            }

            if let double = item.value as? Double {
                serialized.setValue(double, forKey: item.key)
            }
            if let quantity = item.value as? HKQuantity {
                if let s = serializeUnknownQuantity(quantity: quantity) {
                    serialized.setValue(s, forKey: item.key)
                }
            }
        }
    }
    return serialized
}

func serializeDevice(_device: HKDevice?) -> [String: String?]? {
    guard let device = _device else {
        return nil
    }

    return [
        "name": device.name,
        "firmwareVersion": device.firmwareVersion,
        "hardwareVersion": device.hardwareVersion,
        "localIdentifier": device.localIdentifier,
        "manufacturer": device.manufacturer,
        "model": device.model,
        "softwareVersion": device.softwareVersion,
        "udiDeviceIdentifier": device.udiDeviceIdentifier
    ]
}

func serializeOperatingSystemVersion(_version: OperatingSystemVersion?) -> String? {
    guard let version = _version else {
        return nil
    }

    let versionString = "\(version.majorVersion).\(version.minorVersion).\(version.patchVersion)"

    return versionString
}

func serializeSourceRevision(_sourceRevision: HKSourceRevision?) -> [String: Any?]? {
    guard let sourceRevision = _sourceRevision else {
        return nil
    }

    var dict = [
        "source": [
            "name": sourceRevision.source.name,
            "bundleIdentifier": sourceRevision.source.bundleIdentifier
        ],
        "version": sourceRevision.version as Any
    ] as [String: Any]

    if #available(iOS 11, *) {
        dict["operatingSystemVersion"] = serializeOperatingSystemVersion(_version: sourceRevision.operatingSystemVersion)
        dict["productType"] = sourceRevision.productType
    }

    return dict
}

func deserializeHKQueryAnchor(anchor: String) -> HKQueryAnchor? {
    return anchor.isEmpty ? nil : base64StringToHKQueryAnchor(base64String: anchor)
}

func serializeAnchor(anchor: HKQueryAnchor?) -> String? {
  guard let anch = anchor else {
    return nil
  }

  let data = NSKeyedArchiver.archivedData(withRootObject: anch)
  let encoded = data.base64EncodedString()

  return encoded
}

func serializeStatistics(stats: HKStatistics, unit: HKUnit) -> [String: Any?] {
    var dic = [String: Any?]()
    dic.updateValue(_dateFormatter.string(from: stats.startDate), forKey: "startDate")
    dic.updateValue(_dateFormatter.string(from: stats.endDate), forKey: "endDate")

    if let averageQuantity = stats.averageQuantity() {
        dic.updateValue(serializeQuantity(unit: unit, quantity: averageQuantity), forKey: "averageQuantity")
    }
    if let maximumQuantity = stats.maximumQuantity() {
        dic.updateValue(serializeQuantity(unit: unit, quantity: maximumQuantity), forKey: "maximumQuantity")
    }
    if let minimumQuantity = stats.minimumQuantity() {
        dic.updateValue(serializeQuantity(unit: unit, quantity: minimumQuantity), forKey: "minimumQuantity")
    }
    if let sumQuantity = stats.sumQuantity() {
        dic.updateValue(serializeQuantity(unit: unit, quantity: sumQuantity), forKey: "sumQuantity")
    }
    if #available(iOS 12, *) {
        if let mostRecent = stats.mostRecentQuantity() {
            dic.updateValue(serializeQuantity(unit: unit, quantity: mostRecent), forKey: "mostRecentQuantity")
        }

        if let mostRecentDateInterval = stats.mostRecentQuantityDateInterval() {
            dic.updateValue([
                "start": _dateFormatter.string(from: mostRecentDateInterval.start),
                "end": _dateFormatter.string(from: mostRecentDateInterval.end)
            ], forKey: "mostRecentQuantityDateInterval")
        }
    }
    if #available(iOS 13, *) {
        let durationUnit = HKUnit.second()
        if let duration = stats.duration() {
            dic.updateValue(serializeQuantity(unit: durationUnit, quantity: duration), forKey: "duration")
        }
    }

    return dic
}

func serializeActivitySummary(
    summary: HKActivitySummary,
    energyUnit: HKUnit,
    timeUnit: HKUnit,
    calendar: Calendar
) -> [String: Any?] {
    guard let startDate = summary.dateComponents(for: calendar).date else {
        fatalError("Should not fail")
    }
    var dic = [String: Any?]()
    dic.updateValue(_dateFormatter.string(from: startDate), forKey: "startDate")
    dic.updateValue(
        serializeQuantity(unit: energyUnit, quantity: summary.activeEnergyBurned),
        forKey: "activeEnergyBurned"
    )
    dic.updateValue(
        serializeQuantity(unit: energyUnit, quantity: summary.activeEnergyBurnedGoal),
        forKey: "activeEnergyBurnedGoal"
    )
    if #available(iOS 14, *) {
        dic.updateValue(
            serializeQuantity(unit: timeUnit, quantity: summary.appleMoveTime),
            forKey: "appleMoveTime"
        )
        dic.updateValue(
            serializeQuantity(unit: timeUnit, quantity: summary.appleMoveTimeGoal),
            forKey: "appleMoveTimeGoal"
        )
    }
    dic.updateValue(
        serializeQuantity(unit: timeUnit, quantity: summary.appleExerciseTime),
        forKey: "appleExerciseTime"
    )
    dic.updateValue(
        serializeQuantity(unit: timeUnit, quantity: summary.appleExerciseTimeGoal),
        forKey: "appleExerciseTimeGoal"
    )
    if #available(iOS 16, *) {
        dic.updateValue(
            serializeQuantity(unit: timeUnit, quantity: summary.exerciseTimeGoal),
            forKey: "exerciseTimeGoal"
        )
    }
    dic.updateValue(
        serializeQuantity(unit: HKUnit.count(), quantity: summary.appleStandHours),
        forKey: "appleStandHours"
    )
    if #available(iOS 16, *) {
        dic.updateValue(
            serializeQuantity(unit: HKUnit.count(), quantity: summary.standHoursGoal),
            forKey: "standHoursGoal"
        )
    }
    dic.updateValue(
        serializeQuantity(unit: HKUnit.count(), quantity: summary.appleStandHoursGoal),
        forKey: "appleStandHoursGoal"
    )
    return dic
}

func serializeWorkout(workout: HKWorkout, energyUnit: HKUnit, distanceUnit: HKUnit) -> NSMutableDictionary {
    let endDate = _dateFormatter.string(from: workout.endDate)
    let startDate = _dateFormatter.string(from: workout.startDate)

    let dict: NSMutableDictionary = [
        "uuid": workout.uuid.uuidString,
        "device": serializeDevice(_device: workout.device) as Any,
        "duration": workout.duration,
        "totalDistance": serializeQuantity(unit: distanceUnit, quantity: workout.totalDistance) as Any,
        "totalEnergyBurned": serializeQuantity(unit: energyUnit, quantity: workout.totalEnergyBurned) as Any,
        "totalSwimmingStrokeCount": serializeQuantity(unit: HKUnit.count(), quantity: workout.totalSwimmingStrokeCount) as Any,
        "workoutActivityType": workout.workoutActivityType.rawValue,
        "startDate": startDate,
        "endDate": endDate,
        "metadata": serializeMetadata(metadata: workout.metadata),
        "sourceRevision": serializeSourceRevision(_sourceRevision: workout.sourceRevision) as Any
    ]

    // this is used for our laps functionality to get markers
    // https://developer.apple.com/documentation/healthkit/hkworkoutevent
    var eventArray: [[String: Any]] = []
    if let events = workout.workoutEvents {
        for event in events {
            let eventStartDate = _dateFormatter.string(from: event.dateInterval.start)
            let eventEndDate = _dateFormatter.string(from: event.dateInterval.end)
            let eventDict: [String: Any] = [
                "type": event.type.rawValue, // https://developer.apple.com/documentation/healthkit/hkworkouteventtype
                "startDate": eventStartDate,
                "endDate": eventEndDate
            ]
            eventArray.append(eventDict)
        }
    }
    dict["events"] = eventArray

    // also used for our laps functionality to get activities for custom workouts defined by the user
    // https://developer.apple.com/documentation/healthkit/hkworkout/1615340-init
    // it seems this might be depricated in the latest beta so this might need updating!
    var activitiesArray: [[String: Any]] = []
    if #available(iOS 16.0, *) {
        let activities: [HKWorkoutActivity] = workout.workoutActivities

        if !activities.isEmpty {
            for activity in activities {
                var activityStartDate = ""
                var activityEndDate = ""
                if let start = activity.startDate as Date? {
                    activityStartDate = _dateFormatter.string(from: start)
                }
                if let end = activity.endDate as Date? {
                    activityEndDate = _dateFormatter.string(from: end)
                }
                let activityDict: [String: Any] = [
                    "startDate": activityStartDate,
                    "endDate": activityEndDate,
                    "uuid": activity.uuid.uuidString,
                    "duration": activity.duration
                ]
                activitiesArray.append(activityDict)
            }
        }
    }
    dict["activities"] = activitiesArray

    if #available(iOS 11, *) {
        dict.setValue(serializeQuantity(unit: HKUnit.count(), quantity: workout.totalFlightsClimbed), forKey: "totalFlightsClimbed")
    }

    #if canImport(WorkoutKit)
    if #available(iOS 17.0, *) {
        Task {
            do {
                let workoutplan = try await workout.workoutPlan
                if let workoutplanId = workoutplan?.id {
                    dict["workoutPlanId"] = workoutplanId.uuidString
                }
            } catch {
                // reject(GENERIC_ERROR, error.localizedDescription, error) // COMMENTED because it fails to compile in XCode v15.x
            }
        }
    }
    #endif

    return dict
}
