// HealthKit's types by the identifier strings the interface takes, which are
// HealthKit's own raw values (`HKQuantityTypeIdentifierStepCount`), as
// @kingstinct/react-native-healthkit takes them.
import Foundation
import HealthKit

#if os(iOS)
enum Identifiers {
    static let workout = "HKWorkoutTypeIdentifier"
    static let workoutRoute = "HKWorkoutRouteTypeIdentifier"
    static let heartbeatSeries = "HKDataTypeIdentifierHeartbeatSeries"
    static let audiogram = "HKAudiogramSampleType"
    static let electrocardiogram = "HKElectrocardiogramType"
    static let stateOfMind = "HKDataTypeStateOfMind"
    static let activitySummary = "HKActivitySummaryTypeIdentifier"
    static let visionPrescription = "HKVisionPrescriptionTypeIdentifier"
    static let userAnnotatedMedication = "HKUserAnnotatedMedicationTypeIdentifier"
    static let medicationDoseEvent = "HKMedicationDoseEventTypeIdentifierMedicationDoseEvent"

    /// Any object type an identifier names, or nil for one this OS lacks.
    static func objectType(_ id: String) -> HKObjectType? {
        if id.hasPrefix("HKCharacteristicTypeIdentifier") {
            return HKObjectType.characteristicType(forIdentifier: HKCharacteristicTypeIdentifier(rawValue: id))
        }
        if id == activitySummary { return HKObjectType.activitySummaryType() }
        if id == visionPrescription { return HKObjectType.visionPrescriptionType() }
        if id == userAnnotatedMedication {
            #if compiler(>=6.2)
            if #available(iOS 26.0, *) { return HKObjectType.userAnnotatedMedicationType() }
            #endif
            return nil
        }
        return sampleType(id)
    }

    /// A sample type: quantity, category, correlation or one of the fixed ones.
    static func sampleType(_ id: String) -> HKSampleType? {
        if id.hasPrefix("HKQuantityTypeIdentifier") {
            return HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: id))
        }
        if id.hasPrefix("HKCategoryTypeIdentifier") {
            return HKObjectType.categoryType(forIdentifier: HKCategoryTypeIdentifier(rawValue: id))
        }
        if id.hasPrefix("HKCorrelationTypeIdentifier") {
            return HKObjectType.correlationType(forIdentifier: HKCorrelationTypeIdentifier(rawValue: id))
        }
        switch id {
        case workout: return HKObjectType.workoutType()
        case workoutRoute: return HKSeriesType.workoutRoute()
        case heartbeatSeries: return HKSeriesType.heartbeat()
        case audiogram: return HKObjectType.audiogramSampleType()
        case electrocardiogram: return HKObjectType.electrocardiogramType()
        case stateOfMind:
            if #available(iOS 18.0, *) { return HKObjectType.stateOfMindType() }
            return nil
        case medicationDoseEvent:
            #if compiler(>=6.2)
            if #available(iOS 26.0, *) { return HKObjectType.medicationDoseEventType() }
            #endif
            return nil
        default:
            return nil
        }
    }

    static func quantityType(_ id: String) -> HKQuantityType? {
        HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: id))
    }

    static func categoryType(_ id: String) -> HKCategoryType? {
        HKObjectType.categoryType(forIdentifier: HKCategoryTypeIdentifier(rawValue: id))
    }

    static func correlationType(_ id: String) -> HKCorrelationType? {
        HKObjectType.correlationType(forIdentifier: HKCorrelationTypeIdentifier(rawValue: id))
    }

    /// The identifier string an object type answers with.
    static func identifier(_ type: HKObjectType) -> String {
        if type is HKWorkoutType { return workout }
        if type == HKSeriesType.workoutRoute() { return workoutRoute }
        if type == HKSeriesType.heartbeat() { return heartbeatSeries }
        if type is HKAudiogramSampleType { return audiogram }
        if type is HKElectrocardiogramType { return electrocardiogram }
        if type is HKActivitySummaryType { return activitySummary }
        return type.identifier
    }

    /// The object types `ids` names; a type this OS lacks fails.
    static func objectTypes(_ ids: [String]) throws -> Set<HKObjectType> {
        Set(try ids.map { id in
            guard let t = objectType(id) else { throw Failure("NotSupportedError", "no type \(id) on this OS") }
            return t
        })
    }

    /// The sample types `ids` names; a type this OS lacks fails.
    static func sampleTypes(_ ids: [String]) throws -> Set<HKSampleType> {
        Set(try ids.map { id in
            guard let t = sampleType(id) else { throw Failure("NotSupportedError", "no type \(id) on this OS") }
            return t
        })
    }
}
#endif
