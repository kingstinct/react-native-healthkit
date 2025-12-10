import HealthKit
import NitroModules

func serializeHeartbeatSeriesSample(sample: HKHeartbeatSeriesSample) async throws
  -> HeartbeatSeriesSample {
  let heartbeats = try await getHeartbeatSeriesHeartbeats(sample: sample)

  return HeartbeatSeriesSample(
    heartbeats: heartbeats,
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

func getHeartbeatSeriesHeartbeats(sample: HKHeartbeatSeriesSample) async throws -> [Heartbeat] {
  return try await withCheckedThrowingContinuation { continuation in
    var allBeats: [Heartbeat] = []

    let query = HKHeartbeatSeriesQuery(heartbeatSeries: sample) {
      (
        _: HKHeartbeatSeriesQuery, timeSinceSeriesStart: TimeInterval, precededByGap: Bool,
        done: Bool, error: Error?
      ) in

      if let error = error {
        continuation.resume(throwing: error)
        return
      }

      let heartbeat = Heartbeat(
        timeSinceSeriesStart: timeSinceSeriesStart,
        precededByGap: precededByGap
      )

      allBeats.append(heartbeat)

      if done {
        continuation.resume(returning: allBeats)
      }
    }

    store.execute(query)
  }
}

@available(iOS 13.0.0, *)
class HeartbeatSeriesModule: HybridHeartbeatSeriesModuleSpec {
  func queryHeartbeatSeriesSamples(
    options: QueryOptionsWithSortOrder
  ) -> Promise<[HeartbeatSeriesSample]> {

    return Promise.async {
      let predicate = createPredicateForSamples(options.filter)

      let samples = try await sampleQueryAsync(
        sampleType: HKSeriesType.heartbeat(),
        limit: options.limit,
        predicate: predicate,
        sortDescriptors: getSortDescriptors(ascending: options.ascending)
      )
      var serializedSamples: [HeartbeatSeriesSample] = []

      for sample in samples {
        guard let heartbeatSample = sample as? HKHeartbeatSeriesSample else { continue }

        let serialized = try await serializeHeartbeatSeriesSample(sample: heartbeatSample)
        serializedSamples.append(serialized)
      }

      return serializedSamples
    }
  }

  func queryHeartbeatSeriesSamplesWithAnchor(
    options: QueryOptionsWithAnchor
  ) -> Promise<HeartbeatSeriesSamplesWithAnchorResponse> {
    return Promise.async {
      let predicate = createPredicateForSamples(options.filter)

      let response = try await sampleAnchoredQueryAsync(
        sampleType: HKSeriesType.heartbeat(),
        limit: options.limit,
        queryAnchor: options.anchor,
        predicate: predicate
      )

      var serializedSamples: [HeartbeatSeriesSample] = []

      for sample in response.samples {
        guard let heartbeatSample = sample as? HKHeartbeatSeriesSample else { continue }
        let serialized = try await serializeHeartbeatSeriesSample(sample: heartbeatSample)
        serializedSamples.append(serialized)
      }

      return HeartbeatSeriesSamplesWithAnchorResponse(
        samples: serializedSamples,
        deletedSamples: response.deletedSamples,
        newAnchor: response.newAnchor
      )
    }
  }

}
