import HealthKit
import NitroModules

func serializeHeartbeatSeriesSample(sample: HKHeartbeatSeriesSample) async throws -> HeartbeatSeriesSample {
    let heartbeats = try await getHeartbeatSeriesHeartbeats(sample: sample)

    return HeartbeatSeriesSample(
        uuid: sample.uuid.uuidString,
        device: serializeDevice(hkDevice: sample.device),
        startDate: sample.startDate,
        endDate: sample.endDate,
        heartbeats: heartbeats,
        metadata: serializeMetadata(sample.metadata),
        sourceRevision: serializeSourceRevision(sample.sourceRevision)
    )
}

func getHeartbeatSeriesHeartbeats(sample: HKHeartbeatSeriesSample) async throws -> [Heartbeat] {
    return try await withCheckedThrowingContinuation { continuation in
        var allBeats: [Heartbeat] = []

        let query = HKHeartbeatSeriesQuery(heartbeatSeries: sample) {
            (_: HKHeartbeatSeriesQuery, timeSinceSeriesStart: TimeInterval, precededByGap: Bool, done: Bool, error: Error?) in

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
          let predicate = try createPredicate(options.filter)

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
            let predicate = try createPredicate(options.filter)

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
