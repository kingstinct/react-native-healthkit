import HealthKit
import NitroModules

// MARK: - Helpers

private func serializeSymptomsStatus(_ symptoms: HKElectrocardiogram.SymptomsStatus)
  -> ElectrocardiogramSymptomsStatus {
  switch symptoms {
  case .notSet: return ElectrocardiogramSymptomsStatus(fromString: "notSet")!
  case .none: return ElectrocardiogramSymptomsStatus(fromString: "none")!
  case .present: return ElectrocardiogramSymptomsStatus(fromString: "present")!
  @unknown default: return ElectrocardiogramSymptomsStatus(fromString: "notSet")!
  }
}

private func serializeECGSample(sample: HKElectrocardiogram, includeVoltages: Bool) async throws
  -> ElectrocardiogramSample {
  // Convert quantities
  let bpmUnit = HKUnit.count().unitDivided(by: .minute())
  let hzUnit = HKUnit.hertz()
  let avgHR = sample.averageHeartRate?.doubleValue(for: bpmUnit)
  let freqHz = sample.samplingFrequency?.doubleValue(for: hzUnit)

  // Optional: waveform
  let voltages: [ElectrocardiogramVoltage]? =
    includeVoltages
    ? try await getECGVoltages(sample: sample)
    : nil

  return ElectrocardiogramSample(
    classification: serializeClassification(sample.classification),
    symptomsStatus: serializeSymptomsStatus(sample.symptomsStatus),
    averageHeartRateBpm: avgHR,
    samplingFrequencyHz: freqHz,
    numberOfVoltageMeasurements: Double(sample.numberOfVoltageMeasurements),
    voltages: voltages,
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

func getECGVoltages(sample: HKElectrocardiogram) async throws -> [ElectrocardiogramVoltage] {
  try await withCheckedThrowingContinuation { continuation in
    var all: [ElectrocardiogramVoltage] = []
    all.reserveCapacity(sample.numberOfVoltageMeasurements)

    // Stream measurements
    let q = HKElectrocardiogramQuery(sample) { _, result in
      switch result {
      case .error(let error):
        continuation.resume(throwing: error)

      case .measurement(let m):
        // Lead I-like from Apple Watch
        if let v = m.quantity(for: .appleWatchSimilarToLeadI)?.doubleValue(for: .volt()) {
          let item = ElectrocardiogramVoltage(
            timeSinceSampleStart: m.timeSinceSampleStart,
            voltage: v,
            lead: ElectrocardiogramLead(fromString: "appleWatchSimilarToLeadI")!
          )
          all.append(item)
        }

      case .done:
        continuation.resume(returning: all)
      @unknown default:
        continuation.resume(
          throwing: runtimeErrorWithPrefix("HKElectrocardiogramQuery received unknown result type"))
      }
    }
    store.execute(q)
  }
}

func serializeClassification(_ classification: HKElectrocardiogram.Classification)
  -> ElectrocardiogramClassification {
  switch classification {
  case .notSet: return ElectrocardiogramClassification(fromString: "notSet")!
  case .sinusRhythm: return ElectrocardiogramClassification(fromString: "sinusRhythm")!
  case .atrialFibrillation:
    return ElectrocardiogramClassification(fromString: "atrialFibrillation")!
  case .inconclusiveLowHeartRate:
    return ElectrocardiogramClassification(fromString: "inconclusiveLowHeartRate")!
  case .inconclusiveHighHeartRate:
    return ElectrocardiogramClassification(fromString: "inconclusiveHighHeartRate")!
  case .inconclusivePoorReading:
    return ElectrocardiogramClassification(fromString: "inconclusivePoorReading")!
  case .inconclusiveOther: return ElectrocardiogramClassification(fromString: "inconclusiveOther")!
  case .unrecognized: return ElectrocardiogramClassification(fromString: "inconclusiveOther")!
  @unknown default: return ElectrocardiogramClassification(fromString: "inconclusiveOther")!
  }
}

@available(iOS 14.0, *)
class ElectrocardiogramModule: HybridElectrocardiogramModuleSpec {

  // Query (simple)
  func queryElectrocardiogramSamples(
    options: ECGQueryOptionsWithSortOrder
  ) -> Promise<[ElectrocardiogramSample]> {
    return Promise.async {
      let predicate = createPredicateForSamples(options.filter)
      let sortDescriptors = getSortDescriptors(ascending: options.ascending)
      let includeVoltages = options.includeVoltages ?? false
      let samples = try await sampleQueryAsync(
        sampleType: .electrocardiogramType(),
        limit: options.limit,
        predicate: predicate,
        sortDescriptors: sortDescriptors
      ).compactMap { sample in
        return sample as? HKElectrocardiogram
      }

      return try await withCheckedThrowingContinuation { continuation in
        Task {
          do {
            var out: [ElectrocardiogramSample] = []
            out.reserveCapacity(samples.count)
            for s in samples {
              let serialized = try await serializeECGSample(
                sample: s,
                includeVoltages: includeVoltages
              )
              out.append(serialized)
            }
            return continuation.resume(returning: out)
          } catch {
            return continuation.resume(throwing: error)
          }
        }
      }
    }
  }

  // Query (anchored)
  func queryElectrocardiogramSamplesWithAnchor(
    options: ECGQueryOptionsWithAnchor
  ) -> Promise<ElectrocardiogramSamplesWithAnchorResponse> {
    return Promise.async {
      let predicate = createPredicateForSamples(options.filter)
      let includeVoltages = options.includeVoltages

      let response = try await sampleAnchoredQueryAsync(
        sampleType: HKObjectType.electrocardiogramType(),
        limit: options.limit,
        queryAnchor: options.anchor,
        predicate: predicate
      )

      let typed = response.samples.compactMap { $0 as? HKElectrocardiogram }
      var out: [ElectrocardiogramSample] = []
      out.reserveCapacity(typed.count)
      for s in typed {
        let serialized = try await serializeECGSample(sample: s, includeVoltages: includeVoltages)
        out.append(serialized)
      }

      return ElectrocardiogramSamplesWithAnchorResponse(
        samples: out,
        deletedSamples: response.deletedSamples,
        newAnchor: response.newAnchor
      )
    }
  }
}
