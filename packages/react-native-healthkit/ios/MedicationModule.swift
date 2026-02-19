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
  func deserializeHKMedicationConceptIdentifier(base64String: String?) throws
    -> HKHealthConceptIdentifier? {
    return try fromBase64(base64String: base64String) as? HKHealthConceptIdentifier
  }

  @available(iOS 26.0, *)
  func getLogStatus(_ logStatus: HKMedicationDoseEvent.LogStatus) throws
    -> MedicationDoseEventLogStatus {
    if let rawValue = Int32(exactly: logStatus.rawValue) {
      if let logStatus = MedicationDoseEventLogStatus.init(rawValue: rawValue) {
        return logStatus
      }
      throw runtimeErrorWithPrefix(
        "Unable to convert HKMedicationDoseEvent.LogStatus with \(rawValue) to MedicationDoseEventLogStatus"
      )
    }
    throw runtimeErrorWithPrefix(
      "Unable to convert HKMedicationDoseEvent.LogStatus to MedicationDoseEventLogStatus")
  }

  @available(iOS 26.0, *)
  func getScheduleType(_ scheduleType: HKMedicationDoseEvent.ScheduleType) throws
    -> MedicationDoseEventScheduleType {
    if let rawValue = Int32(exactly: scheduleType.rawValue) {
      if let scheduleType = MedicationDoseEventScheduleType.init(rawValue: rawValue) {
        return scheduleType
      }
      throw runtimeErrorWithPrefix(
        "Unable to convert HKMedicationDoseEvent.ScheduleType with \(rawValue) to MedicationDoseEventScheduleType"
      )
    }
    throw runtimeErrorWithPrefix(
      "Unable to convert HKMedicationDoseEvent.ScheduleType to MedicationDoseEventScheduleType")
  }

  @available(iOS 26.0, *)
  func buildMedicationNameLookup() async -> [HKHealthConceptIdentifier: String] {
    var lookup: [HKHealthConceptIdentifier: String] = [:]
    do {
      let q = HKUserAnnotatedMedicationQueryDescriptor()
      let medications = try await q.result(for: store)
      for med in medications {
        lookup[med.medication.identifier] = med.medication.displayText
      }
    } catch {
      warnWithPrefix("Failed to build medication name lookup: \(error.localizedDescription)")
    }
    return lookup
  }

  @available(iOS 26.0, *)
  func serializeMedicationEvent(
    sample: HKMedicationDoseEvent,
    medicationNameLookup: [HKHealthConceptIdentifier: String] = [:]
  ) throws -> MedicationDoseEvent {
    let displayText = medicationNameLookup[sample.medicationConceptIdentifier]
    return MedicationDoseEvent(
      scheduleType: try getScheduleType(sample.scheduleType),
      medicationConceptIdentifier: try serializeMedicationConceptIdentifier(
        sample.medicationConceptIdentifier),
      medicationDisplayText: displayText,
      scheduledDate: sample.scheduledDate,
      scheduledDoseQuantity: sample.scheduledDoseQuantity,
      doseQuantity: sample.doseQuantity,
      logStatus: try getLogStatus(sample.logStatus),
      unit: sample.unit.unitString,
      sampleType: serializeSampleType(sample.sampleType),
      startDate: sample.startDate,
      endDate: sample.endDate,
      hasUndeterminedDuration: sample.hasUndeterminedDuration,

      metadataWeatherCondition: serializeWeatherCondition(
        sample.metadata?[HKMetadataKeyWeatherCondition] as? HKWeatherCondition),
      metadataWeatherHumidity: serializeUnknownQuantityTyped(
        quantity: sample.metadata?[HKMetadataKeyWeatherHumidity] as? HKQuantity),
      metadataWeatherTemperature: serializeUnknownQuantityTyped(
        quantity: sample.metadata?[HKMetadataKeyWeatherTemperature] as? HKQuantity),
      metadataInsulinDeliveryReason: serializeInsulinDeliveryReason(
        sample.metadata?[HKMetadataKeyInsulinDeliveryReason] as? HKInsulinDeliveryReason),
      metadataHeartRateMotionContext: serializeHeartRateMotionContext(
        sample.metadata?[HKMetadataKeyHeartRateMotionContext] as? HKHeartRateMotionContext),

      uuid: sample.uuid.uuidString,
      sourceRevision: serializeSourceRevision(sample.sourceRevision),
      device: serializeDevice(hkDevice: sample.device),
      metadata: serializeMetadata(sample.metadata),

      metadataExternalUUID: sample.metadata?[HKMetadataKeyExternalUUID] as? String,
      metadataTimeZone: sample.metadata?[HKMetadataKeyTimeZone] as? String,
      metadataWasUserEntered: sample.metadata?[HKMetadataKeyWasUserEntered] as? Bool,
      metadataDeviceSerialNumber: sample.metadata?[HKMetadataKeyDeviceSerialNumber] as? String,
      metadataUdiDeviceIdentifier: sample.metadata?[HKMetadataKeyUDIDeviceIdentifier] as? String,
      metadataUdiProductionIdentifier: sample.metadata?[HKMetadataKeyUDIProductionIdentifier]
        as? String,
      metadataDigitalSignature: sample.metadata?[HKMetadataKeyDigitalSignature] as? String,
      metadataDeviceName: sample.metadata?[HKMetadataKeyDeviceName] as? String,
      metadataDeviceManufacturerName: sample.metadata?[HKMetadataKeyDeviceManufacturerName]
        as? String,
      metadataSyncIdentifier: sample.metadata?[HKMetadataKeySyncIdentifier] as? String,
      metadataSyncVersion: sample.metadata?[HKMetadataKeySyncVersion] as? Double,
      metadataWasTakenInLab: sample.metadata?[HKMetadataKeyWasTakenInLab] as? Bool,
      metadataReferenceRangeLowerLimit: sample.metadata?[HKMetadataKeyReferenceRangeLowerLimit]
        as? Double,
      metadataReferenceRangeUpperLimit: sample.metadata?[HKMetadataKeyReferenceRangeUpperLimit]
        as? Double,
      metadataAlgorithmVersion: sample.metadata?[HKMetadataKeyAlgorithmVersion] as? Double
    )
  }

  @available(iOS 26.0, *)
  func serializeMedicationConceptIdentifier(_ identifier: HKHealthConceptIdentifier) throws
    -> String {
    if let base64String = toBase64(identifier) {
      return base64String
    }
    throw runtimeErrorWithPrefix("Unable to serialize HKHealthConceptIdentifier")
  }

  @available(iOS 26.0, *)
  func getGeneralForm(hkGeneralForm: HKMedicationGeneralForm) throws -> GeneralForm {
    if let generalForm = GeneralForm.init(fromString: hkGeneralForm.rawValue) {
      return generalForm
    }
    throw runtimeErrorWithPrefix(
      "Unable to convert HKMedicationGeneralForm with \(hkGeneralForm.rawValue) to GeneralForm, no matching value found"
    )
  }

  @available(iOS 26.0, *)
  func serializeMedication(medication: HKUserAnnotatedMedication) throws -> UserAnnotatedMedication {
    return UserAnnotatedMedication(
      isArchived: medication.isArchived,
      hasSchedule: medication.hasSchedule,
      nickname: medication.nickname,
      medication: MedicationConcept(
        identifier: try serializeMedicationConceptIdentifier(medication.medication.identifier),
        displayText: medication.medication.displayText,
        generalForm: try getGeneralForm(hkGeneralForm: medication.medication.generalForm),
        relatedCodings: medication.medication.relatedCodings.map({ c in
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
            return try serializeMedication(medication: medication)
          })
        }
        warnWithPrefix(
          "queryMedications is only available on iOS 26 and above")
        return []
      }
    }

    func queryMedicationEvents(options: QueryOptionsWithSortOrder) -> Promise<[MedicationDoseEvent]> {
      return Promise.async {
        if #available(iOS 26.0, *) {
          let predicate = createPredicateForSamples(options.filter)

          let doseEvents = try await sampleQueryAsync(
            sampleType: HKSeriesType.medicationDoseEventType(),
            limit: options.limit,
            predicate: predicate,
            sortDescriptors: getSortDescriptors(ascending: options.ascending)
          )

          let nameLookup = await buildMedicationNameLookup()

          return try doseEvents.compactMap({ sample in
            if let event = sample as? HKMedicationDoseEvent {
              return try serializeMedicationEvent(sample: event, medicationNameLookup: nameLookup)
            }
            return nil
          })
        }
        warnWithPrefix("queryMedicationEvents is only available on iOS 26 and above")
        return []
      }
    }

    func requestMedicationsAuthorization() -> Promise<Bool> {
      return Promise.async {
        if #available(iOS 26.0, *) {
          try await store.requestPerObjectReadAuthorization(
            for: .userAnnotatedMedicationType(), predicate: nil)
          return true
        } else {
          warnWithPrefix(
            "requestMedicationsAuthorization is only available on iOS 26 and above"
          )
          return false
        }
      }
    }

    func queryMedicationEventsWithAnchor(options: QueryOptionsWithAnchor) -> Promise<
      MedicationDoseEventsWithAnchorResponse
    > {
      return Promise.async {
        if #available(iOS 26.0, *) {
          let predicate = createPredicateForSamples(options.filter)

          let response = try await sampleAnchoredQueryAsync(
            sampleType: HKSeriesType.medicationDoseEventType(),
            limit: options.limit,
            queryAnchor: options.anchor,
            predicate: predicate
          )

          let nameLookup = await buildMedicationNameLookup()

          let serializedSamples = try response.samples.compactMap { s in
            if let sample = s as? HKMedicationDoseEvent {
              return try serializeMedicationEvent(sample: sample, medicationNameLookup: nameLookup)
            }
            return nil
          }

          return MedicationDoseEventsWithAnchorResponse(
            samples: serializedSamples,
            deletedSamples: response.deletedSamples,
            newAnchor: response.newAnchor
          )
        }
        throw runtimeErrorWithPrefix("queryMedicationEventsWithAnchor requires iOS 26.0 or later")
      }
    }
  }

#else
  class MedicationModule: HybridMedicationModuleSpec {
    func queryMedications() -> Promise<[UserAnnotatedMedication]> {
      return Promise.async {
        throw runtimeErrorWithPrefix("queryMedications needs to be built with XCode 26.0 or later")
      }
    }

    func queryMedicationEvents(options: QueryOptionsWithSortOrder) -> Promise<[MedicationDoseEvent]> {
      return Promise.async {
        throw runtimeErrorWithPrefix(
          "queryMedicationEvents needs to be built with XCode 26.0 or later")
      }
    }

    func requestMedicationsAuthorization() -> Promise<Bool> {
      return Promise.async {
        throw runtimeErrorWithPrefix(
          "requestMedicationsAuthorization needs to be built with XCode 26.0 or later")
      }
    }

    func queryMedicationEventsWithAnchor(options: QueryOptionsWithAnchor)
      -> Promise<MedicationDoseEventsWithAnchorResponse> {
      return Promise.async {
        throw runtimeErrorWithPrefix(
          "queryMedicationEventsWithAnchor needs to be built with XCode 26.0 or later")
      }
    }

  }

#endif
