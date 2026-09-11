//
//  HealthRecordsSerializers.swift
//  ReactNativeHealthkitHealthRecords
//
//  Converts HealthKit clinical record objects into the Nitro structs that
//  cross the bridge.
//

import Foundation
import HealthKit
import NitroModules

let metadataDateFormatter: ISO8601DateFormatter = {
  let formatter = ISO8601DateFormatter()
  formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
  return formatter
}()

func serializeMetadata(_ metadata: [String: Any]?) -> AnyMap {
  let serialized = AnyMap()
  guard let metadata = metadata else {
    return serialized
  }

  for (key, value) in metadata {
    if let number = value as? NSNumber {
      if CFGetTypeID(number) == CFBooleanGetTypeID() {
        serialized.setBoolean(key: key, value: number.boolValue)
      } else {
        serialized.setDouble(key: key, value: number.doubleValue)
      }
      continue
    }

    if let string = value as? String {
      serialized.setString(key: key, value: string)
      continue
    }

    if let date = value as? Date {
      serialized.setString(key: key, value: metadataDateFormatter.string(from: date))
      continue
    }

    if let quantity = value as? HKQuantity {
      serialized.setString(key: key, value: quantity.description)
      continue
    }

    warnWithPrefix("serializeMetadata: dropping metadata key \(key) with unsupported value type")
  }

  return serialized
}

func serializeDeletedSample(sample: HKDeletedObject) -> DeletedSample {
  return DeletedSample(
    uuid: sample.uuid.uuidString,
    metadata: serializeMetadata(sample.metadata)
  )
}

func serializeSourceStruct(_ source: HKSource) -> Source {
  return Source(
    name: source.name,
    bundleIdentifier: source.bundleIdentifier
  )
}

func serializeOperatingSystemVersion(_ version: OperatingSystemVersion) -> String {
  return "\(version.majorVersion).\(version.minorVersion).\(version.patchVersion)"
}

func serializeSourceRevision(_ hkSourceRevision: HKSourceRevision) -> SourceRevision {
  return SourceRevision(
    source: serializeSourceStruct(hkSourceRevision.source),
    version: hkSourceRevision.version,
    operatingSystemVersion: serializeOperatingSystemVersion(
      hkSourceRevision.operatingSystemVersion),
    productType: hkSourceRevision.productType
  )
}

func serializeDevice(hkDevice: HKDevice?) -> Device? {
  guard let hkDevice = hkDevice else {
    return nil
  }

  return Device(
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

func serializeSampleType(_ sampleType: HKSampleType) -> SampleType {
  return SampleType(
    identifier: sampleType.identifier,
    allowsRecalibrationForEstimates: sampleType.allowsRecalibrationForEstimates,
    isMinimumDurationRestricted: sampleType.isMinimumDurationRestricted,
    isMaximumDurationRestricted: sampleType.isMaximumDurationRestricted
  )
}

func serializeFHIRVersion(_ version: HKFHIRVersion) -> FHIRVersion {
  return FHIRVersion(
    release: FHIRRelease(fromString: version.fhirRelease.rawValue) ?? .unknown,
    majorVersion: Double(version.majorVersion),
    minorVersion: Double(version.minorVersion),
    patchVersion: Double(version.patchVersion),
    stringRepresentation: version.stringRepresentation
  )
}

func serializeFHIRResource(_ resource: HKFHIRResource?) throws -> FHIRResource? {
  guard let resource = resource else {
    return nil
  }

  guard let data = String(data: resource.data, encoding: .utf8) else {
    throw runtimeErrorWithPrefix(
      "FHIR resource \(resource.identifier) does not contain valid UTF-8 JSON")
  }

  return FHIRResource(
    resourceType: resource.resourceType.rawValue,
    identifier: resource.identifier,
    sourceURL: resource.sourceURL?.absoluteString,
    data: data,
    fhirVersion: serializeFHIRVersion(resource.fhirVersion)
  )
}

func serializeClinicalRecord(_ record: HKClinicalRecord) throws -> ClinicalRecord {
  guard let clinicalType = ClinicalTypeIdentifier(fromString: record.clinicalType.identifier)
  else {
    throw runtimeErrorWithPrefix(
      "Unrecognized clinical type identifier: \(record.clinicalType.identifier)")
  }

  return ClinicalRecord(
    clinicalType: clinicalType,
    displayName: record.displayName,
    fhirResource: try serializeFHIRResource(record.fhirResource),
    sampleType: serializeSampleType(record.sampleType),
    startDate: record.startDate,
    endDate: record.endDate,
    hasUndeterminedDuration: record.hasUndeterminedDuration,
    uuid: record.uuid.uuidString,
    sourceRevision: serializeSourceRevision(record.sourceRevision),
    device: serializeDevice(hkDevice: record.device),
    metadata: serializeMetadata(record.metadata)
  )
}
