//
//  Constants.swift
//  kingstinct-react-native-healthkit
//
//  Created by Robert Herber on 2023-05-31.
//

import Foundation
import HealthKit

let INIT_ERROR = "HEALTHKIT_INIT_ERROR"
let INIT_ERROR_MESSAGE = "HealthKit not initialized"
let TYPE_IDENTIFIER_ERROR = "HEALTHKIT_TYPE_IDENTIFIER_NOT_RECOGNIZED_ERROR"
let QUERY_ERROR = "HEALTHKIT_QUERY_ERROR"
let GENERIC_ERROR = "HEALTHKIT_ERROR"

let HKCharacteristicTypeIdentifier_PREFIX = "HKCharacteristicTypeIdentifier"
let HKQuantityTypeIdentifier_PREFIX = "HKQuantityTypeIdentifier"
let HKCategoryTypeIdentifier_PREFIX = "HKCategoryTypeIdentifier"
let HKCorrelationTypeIdentifier_PREFIX = "HKCorrelationTypeIdentifier"
let HKActivitySummaryTypeIdentifier = "HKActivitySummaryTypeIdentifier"
let HKAudiogramTypeIdentifier = "HKAudiogramTypeIdentifier"
let HKWorkoutTypeIdentifier = "HKWorkoutTypeIdentifier"
let HKWorkoutRouteTypeIdentifier = "HKWorkoutRouteTypeIdentifier"
let HKDataTypeIdentifierHeartbeatSeries = "HKDataTypeIdentifierHeartbeatSeries"
let HKStateOfMindTypeIdentifier = "HKStateOfMindTypeIdentifier"
let HKElectrocardiogramType = "HKElectrocardiogramType"

let HKWorkoutActivityTypePropertyName = "activityType"
let HKWorkoutSessionLocationTypePropertyName = "locationType"

let SpeedUnit =  HKUnit(from: "m/s") // HKUnit.meter().unitDivided(by: HKUnit.second())
// Support for MET data: HKAverageMETs 8.24046 kcal/hr·kg
let METUnit = HKUnit(from: "kcal/hr·kg")

let DEFAULT_QUERY_LIMIT = 20
