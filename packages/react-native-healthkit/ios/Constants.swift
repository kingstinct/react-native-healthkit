//
//  Constants.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit
import ReactNativeHealthkitCore

let logPrefix = "[react-native-healthkit]"

/// Namespaces this package's persisted background-delivery types in the shared
/// BackgroundDeliveryManager. The id matches the UserDefaults keys used before
/// the manager moved to ReactNativeHealthkitCore, so existing installs keep
/// their configuration.
let backgroundDeliveryScope = BackgroundDeliveryScope(id: "com.kingstinct.healthkit")

let INIT_ERROR = "HEALTHKIT_INIT_ERROR"
let INIT_ERROR_MESSAGE = "HealthKit not initialized"
let TYPE_IDENTIFIER_ERROR = "HEALTHKIT_TYPE_IDENTIFIER_NOT_RECOGNIZED_ERROR"
let QUERY_ERROR = "HEALTHKIT_QUERY_ERROR"
let GENERIC_ERROR = "HEALTHKIT_ERROR"

let HKActivitySummaryTypeIdentifier = "HKActivitySummaryTypeIdentifier"

let HKWorkoutActivityTypePropertyName = "activityType"
let HKWorkoutSessionLocationTypePropertyName = "locationType"

let SpeedUnit =  HKUnit(from: "m/s") // HKUnit.meter().unitDivided(by: HKUnit.second())
// Support for MET data: HKAverageMETs 8.24046 kcal/hr·kg
let METUnit = HKUnit(from: "kcal/hr·kg")

let DEFAULT_QUERY_LIMIT = 20
