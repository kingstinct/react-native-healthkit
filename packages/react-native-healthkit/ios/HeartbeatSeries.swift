import HealthKit
import NitroModules

@available(iOS 13.0.0, *)
class HeartbeatSeries : HybridHeartbeatSeriesSpec {
    func queryHeartbeatSeriesSamples(
        from: Date,
        to: Date,
        limit: Double,
        ascending: Bool
    ) throws -> Promise<[HeartbeatSeriesSample]> {
        let predicate = createPredicate(from: from, to: to)
        let queryLimit = limitOrNilIfZero(limit: limit)
        
        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKSampleQuery(
                    sampleType: HKSeriesType.heartbeat(),
                    predicate: predicate,
                    limit: queryLimit,
                    sortDescriptors: [
                        NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending)
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
        from: Date,
        to: Date,
        limit: Double,
        anchor: String
    ) throws -> Promise<QueryHeartbeatSeriesSamplesResponseRaw> {
        let predicate = createPredicate(from: from, to: to)
        let queryLimit = limitOrNilIfZero(limit: limit)
        let queryAnchor = anchor.isEmpty ? nil : base64StringToHKQueryAnchor(base64String: anchor)
        
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
                        let response = QueryHeartbeatSeriesSamplesResponseRaw(
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
                            
                            let response = QueryHeartbeatSeriesSamplesResponseRaw(
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
    
    // MARK: - Helper Methods
    
    private func serializeHeartbeatSeriesSample(sample: HKHeartbeatSeriesSample) async throws -> HeartbeatSeriesSample {
        let heartbeats = try await getHeartbeatSeriesHeartbeats(sample: sample)
        
        return HeartbeatSeriesSample(
            uuid: sample.uuid.uuidString,
            device: serializeDevice(hkDevice: sample.device),
            start: sample.startDate,
            end: sample.endDate,
            heartbeats: heartbeats,
            metadata: serializeMetadata(sample.metadata),
            sourceRevision: serializeSourceRevision(sample.sourceRevision)
        )
    }
    
    private func getHeartbeatSeriesHeartbeats(sample: HKHeartbeatSeriesSample) async throws -> [HeartbeatRaw] {
        return try await withCheckedThrowingContinuation { continuation in
            var allBeats: [HeartbeatRaw] = []
            
            let query = HKHeartbeatSeriesQuery(heartbeatSeries: sample) { 
                (_: HKHeartbeatSeriesQuery, timeSinceSeriesStart: TimeInterval, precededByGap: Bool, done: Bool, error: Error?) in
                
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }
                
                let heartbeat = HeartbeatRaw(
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
