//
//  MedicationModule.swift
//  Pods
//
//  Created by Robert Herber on 2025-12-10.
//

import HealthKit
import NitroModules

#if compiler(>=6.2)

@available(iOS 26.0, *)
func deserializeHKMedicationConceptIdentifier(base64String: String?) throws -> HKHealthConceptIdentifier? {
  return try fromBase64(base64String: base64String) as? HKHealthConceptIdentifier
}

@available(iOS 26.0, *)
func getLogStatus(_ logStatus: HKMedicationDoseEvent.LogStatus) throws -> MedicationDoseEventLogStatus {
  if let rawValue = Int32(exactly: logStatus.rawValue) {
    if let logStatus = MedicationDoseEventLogStatus.init(rawValue: rawValue) {
      return logStatus
    }
    throw RuntimeError.error(withMessage: "Unable to convert HKMedicationDoseEvent.LogStatus with \(rawValue) to MedicationDoseEventLogStatus")
  }
  throw RuntimeError.error(withMessage: "Unable to convert HKMedicationDoseEvent.LogStatus to MedicationDoseEventLogStatus")
}

@available(iOS 26.0, *)
func getScheduleType(_ scheduleType: HKMedicationDoseEvent.ScheduleType) throws -> MedicationDoseEventScheduleType {
  if let rawValue = Int32(exactly: scheduleType.rawValue) {
    if let scheduleType = MedicationDoseEventScheduleType.init(rawValue: rawValue) {
      return scheduleType
    }
    throw RuntimeError.error(withMessage: "Unable to convert HKMedicationDoseEvent.ScheduleType with \(rawValue) to MedicationDoseEventScheduleType")
  }
  throw RuntimeError.error(withMessage: "Unable to convert HKMedicationDoseEvent.ScheduleType to MedicationDoseEventScheduleType")
}

@available(iOS 26.0, *)
func serializeMedicationEvent(sample: HKMedicationDoseEvent) throws -> MedicationDoseEvent {
  return MedicationDoseEvent(
    uuid: sample.uuid.uuidString,
    device: serializeDevice(hkDevice: sample.device),
    startDate: sample.startDate,
    endDate: sample.endDate,
    metadata: serializeMetadata(sample.metadata),
    sourceRevision: serializeSourceRevision(sample.sourceRevision),
    scheduleType: try getScheduleType(sample.scheduleType),
    medicationConceptIdentifier: try serializeMedicationConceptIdentifier(sample.medicationConceptIdentifier),
    scheduledDate: sample.scheduledDate,
    scheduledDoseQuantity: sample.scheduledDoseQuantity,
    doseQuantity: sample.doseQuantity,
    logStatus: try getLogStatus(sample.logStatus),
    unit: sample.unit.unitString
  )
}

@available(iOS 26.0, *)
func serializeMedicationConceptIdentifier(_ identifier: HKHealthConceptIdentifier) throws -> String {
  if let base64String = toBase64(identifier) {
    return base64String
  }
  throw RuntimeError.error(withMessage: "[react-native-healthkit] Unable to serialize HKHealthConceptIdentifier")
}

@available(iOS 26.0, *)
func serializeMedication(sample: HKUserAnnotatedMedication) throws -> UserAnnotatedMedication {
  return UserAnnotatedMedication(
    isArchived: sample.isArchived,
    hasSchedule: sample.hasSchedule,
    nickname: sample.nickname,
    medication: MedicationConcept(
      identifier: try serializeMedicationConceptIdentifier(sample.medication.identifier),
      displayText: sample.medication.displayText,
      generalForm: GeneralForm.init(fromString: sample.medication.generalForm.rawValue)!,
      relatedCodings: sample.medication.relatedCodings.map({ c in
        return RelatedCoding(system: c.system, code: c.code, version: c.version)
      })
    ),
  )
}

class MedicationModule: HybridMedicationModuleSpec {
  func queryMedications() -> Promise<[UserAnnotatedMedication]> {
    return Promise.async {
      if #available(iOS 26.0, *) {
        let q = HKUserAnnotatedMedicationQueryDescriptor()

        let medications = try await q.result(for: store)

        return try medications.compactMap({ medication in
          return try serializeMedication(sample: medication)
        })
      } else {
        throw RuntimeError.error(withMessage: "iOS 26.0 or later is required")
      }
    }
  }

  func queryMedicationEvents(options: QueryOptionsWithSortOrder) -> Promise<[MedicationDoseEvent]> {
    return Promise.async {
      if #available(iOS 26.0, *) {
        let predicate = createPredicateForSamples(options.filter)

        let samples = try await sampleQueryAsync(
          sampleType: HKSeriesType.medicationDoseEventType(),
          limit: options.limit,
          predicate: predicate,
          sortDescriptors: getSortDescriptors(ascending: options.ascending)
        )

        return try samples.compactMap({ sample in
          if let event = sample as? HKMedicationDoseEvent {
            return try serializeMedicationEvent(sample: event)
          }
          return nil
        })
      }
      throw RuntimeError.error(withMessage: "iOS 26.0 or later is required")
    }
  }

  func requestMedicationsAuthorization() -> Promise<Bool> {
    return Promise.async {
      if #available(iOS 26.0, *) {
        try await store.requestPerObjectReadAuthorization(for: .userAnnotatedMedicationType(), predicate: nil)
        return true
      } else {
        print("[react-native-healthkit] userAnnotatedMedicationType is only available on iOS 26 and above")
        return false
      }
    }
  }

  func queryMedicationEventsWithAnchor(options: QueryOptionsWithAnchor) -> Promise<MedicationDoseEventsWithAnchorResponse> {
    return Promise.async {
      if #available(iOS 26.0, *) {
        let predicate = createPredicateForSamples(options.filter)

        let response = try await sampleAnchoredQueryAsync(
          sampleType: HKSeriesType.medicationDoseEventType(),
          limit: options.limit,
          queryAnchor: options.anchor,
          predicate: predicate
        )

        let serializedSamples = try response.samples.compactMap { s in
          if let sample = s as? HKMedicationDoseEvent {
            return try serializeMedicationEvent(sample: sample)
          }
          return nil
        }

        return MedicationDoseEventsWithAnchorResponse(
          samples: serializedSamples,
          deletedSamples: response.deletedSamples,
          newAnchor: response.newAnchor
        )
      }
      throw RuntimeError.error(withMessage: "iOS 26.0 or later is required")
    }
  }

}

#else
class MedicationModule: HybridMedicationModuleSpec {
  func queryMedications() -> Promise<[UserAnnotatedMedication]> {
    return Promise.async {
      if #available(iOS 26.0, *) {
        let q = HKUserAnnotatedMedicationQueryDescriptor()

        let medications = try await q.result(for: store)

        return try medications.compactMap({ medication in
          return try serializeMedication(sample: medication)
        })
      } else {
        throw RuntimeError.error(withMessage: "iOS 26.0 or later is required")
      }
    }
  }

  func queryMedicationEvents(options: QueryOptionsWithSortOrder) -> Promise<[MedicationDoseEvent]> {

      return Promise.async {
        throw RuntimeError.error(withMessage: "[react-native-healthkit] Medication needs to be built with XCode 26.0")
      }

  }

  func requestMedicationsAuthorization() -> Promise<Bool> {
    return Promise.async {

        throw RuntimeError.error(withMessage: "[react-native-healthkit] Medication needs to be built with XCode 26.0")

    }
  }

  func queryMedicationEventsWithAnchor(options: QueryOptionsWithAnchor) -> NitroModules.Promise<MedicationDoseEventsWithAnchorResponse> {
    return Promise.async {
      throw RuntimeError.error(withMessage: "[react-native-healthkit] Medication needs to be built with XCode 26.0")
    }
  }

}

#endif
