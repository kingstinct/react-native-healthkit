import HealthKit
import NitroModules

func getHeartbeatSeriesByID(
    seriesUUID: UUID
) async -> HKHeartbeatSeriesSample? {
    let seriesPredicate = HKQuery.predicateForObject(with: seriesUUID)

    let samples = try! await withCheckedThrowingContinuation {
        (continuation: CheckedContinuation<[HKSample], Error>) in
        let query = HKSampleQuery(
            sampleType: HKSeriesType.heartbeat(),
            predicate: seriesPredicate,
            limit: 1,
            sortDescriptors: nil
        ) { (_, results, error) in

            if let hasError = error {
                continuation.resume(throwing: hasError)
                return
            }

            guard let samples = results else {
                return continuation.resume(throwing: RuntimeError.error(withMessage: "Empty response"))
            }

            continuation.resume(returning: samples)
        }
        store.execute(query)
    }

    guard let heartbeatSeries = samples as? [HKHeartbeatSeriesSample] else {
        return nil
    }

    return heartbeatSeries.first ?? nil
}

@available(iOS 13.0.0, *)
class HeartbeatSeriesModule: HybridHeartbeatSeriesModuleSpec {
    func queryHeartbeatSeriesSamples(
        options: QueryOptionsWithSortOrder?
    ) throws -> Promise<[HeartbeatSeriesSample]> {
        let predicate = try createPredicate(filter: options?.filter)
        let queryLimit = getQueryLimit(options?.limit)

        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKSampleQuery(
                    sampleType: HKSeriesType.heartbeat(),
                    predicate: predicate,
                    limit: queryLimit,
                    sortDescriptors: [
                        NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: options?.ascending ?? false)
                    ]
                ) { (_: HKSampleQuery, samples: [HKSample]?, error: Error?) in
                    if let error = error {
                        continuation.resume(throwing: error)
                        return
                    }

                    guard let samples = samples else {
                        continuation.resume(returning: [])
                        return
                    }

                    Task {
                        do {
                            var serializedSamples: [HeartbeatSeriesSample] = []

                            for sample in samples {
                                guard let heartbeatSample = sample as? HKHeartbeatSeriesSample else { continue }

                                let serialized = try await self.serializeHeartbeatSeriesSample(sample: heartbeatSample)
                                serializedSamples.append(serialized)
                            }

                            continuation.resume(returning: serializedSamples)
                        } catch {
                            continuation.resume(throwing: error)
                        }
                    }
                }

                store.execute(query)
            }
        }
    }

    func queryHeartbeatSeriesSamplesWithAnchor(
        options: QueryOptionsWithAnchor
    ) throws -> Promise<HeartbeatSeriesSamplesWithAnchorResponse> {
        let predicate = try createPredicate(filter: options.filter)
        let queryLimit = getQueryLimit(options.limit)
        let queryAnchor = try deserializeHKQueryAnchor(base64String: options.anchor)

        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKAnchoredObjectQuery(
                    type: HKSeriesType.heartbeat(),
                    predicate: predicate,
                    anchor: queryAnchor,
                    limit: queryLimit
                ) { (_: HKAnchoredObjectQuery, samples: [HKSample]?, deletedSamples: [HKDeletedObject]?, newAnchor: HKQueryAnchor?, error: Error?) in
                    if let error = error {
                        continuation.resume(throwing: error)
                        return
                    }

                    guard let samples = samples else {
                        let response = HeartbeatSeriesSamplesWithAnchorResponse(
                            samples: [],
                            deletedSamples: deletedSamples?.map { serializeDeletedSample(sample: $0) } ?? [],
                            newAnchor: serializeAnchor(anchor: newAnchor) ?? ""
                        )
                        continuation.resume(returning: response)
                        return
                    }

                    Task {
                        do {
                            var serializedSamples: [HeartbeatSeriesSample] = []

                            for sample in samples {
                                guard let heartbeatSample = sample as? HKHeartbeatSeriesSample else { continue }
                                let serialized = try await self.serializeHeartbeatSeriesSample(sample: heartbeatSample)
                                serializedSamples.append(serialized)
                            }

                            let response = HeartbeatSeriesSamplesWithAnchorResponse(
                                samples: serializedSamples,
                                deletedSamples: deletedSamples?.map { serializeDeletedSample(sample: $0) } ?? [],
                                newAnchor: serializeAnchor(anchor: newAnchor) ?? ""
                            )

                            continuation.resume(returning: response)
                        } catch {
                            continuation.resume(throwing: error)
                        }
                    }
                }

                store.execute(query)
            }
        }
    }

    private func serializeHeartbeatSeriesSample(sample: HKHeartbeatSeriesSample) async throws -> HeartbeatSeriesSample {
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

    private func getHeartbeatSeriesHeartbeats(sample: HKHeartbeatSeriesSample) async throws -> [Heartbeat] {
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
}
