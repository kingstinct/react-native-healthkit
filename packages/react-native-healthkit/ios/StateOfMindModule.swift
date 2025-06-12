import HealthKit
import NitroModules

#if compiler(>=6)
class StateOfMindModule : HybridStateOfMindModuleSpec {
    func querySamples(
        options: QueryOptionsWithSortOrder?
    ) throws -> Promise<[StateOfMindSample]> {
        if #available(iOS 18.0, *) {
            let predicate = createPredicate(from: options?.from, to: options?.to)
            let queryLimit = getQueryLimit(options?.limit)
            
            return Promise.async {
                try await withCheckedThrowingContinuation { continuation in
                    let type = HKStateOfMindType.stateOfMindType()
                    
                    let query = HKSampleQuery(
                        sampleType: type,
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
                        
                        guard let samples = samples as? [HKStateOfMind] else {
                            continuation.resume(returning: [])
                            return
                        }
                        
                        let serializedSamples = samples.map { sample -> StateOfMindSample in
                            return self.serializeStateOfMindSample(sample: sample)
                        }
                        
                        continuation.resume(returning: serializedSamples)
                    }
                    
                    store.execute(query)
                }
            }
        } else {
            throw RuntimeError.error(withMessage: "StateOfMind is only available on iOS 18 and later")
        }
    }
    
    // MARK: - Helper Methods
    @available(iOS 18.0, *)
    private func serializeStateOfMindSample(sample: HKStateOfMind) -> StateOfMindSample {
        // todo: warn if we get unknown labels??
        let associations = sample.associations.compactMap { association in
            return StateOfMindAssociation(rawValue: Int32(association.rawValue))
        }
        
        // todo: warn if we get unknown labels??
        let labels = sample.labels.compactMap { label in
            return StateOfMindLabel(rawValue: Int32(label.rawValue))
        }
        
        return StateOfMindSample(
            uuid: sample.uuid.uuidString,
            device: serializeDevice(hkDevice: sample.device),
            start: sample.startDate,
            end: sample.endDate,
            metadata: serializeMetadata(sample.metadata),
            sourceRevision: serializeSourceRevision(sample.sourceRevision),
            valence: sample.valence,
            // todo: handle better?
            kind: StateOfMindKind(rawValue: Int32(sample.kind.rawValue))!,
            // todo: handle better?
            valenceClassification: StateOfMindValenceClassification(rawValue: Int32(sample.valenceClassification.rawValue))!,
            associations: associations,
            labels: labels
        )
    }
}
#else
// Fallback for older Xcode versions
class StateOfMind : HybridStateOfMindSpec {
    func querySamples(
        from: Date?,
        to: Date?,
        limit: Double,
        ascending: Bool
    ) throws -> Promise<[StateOfMindSample]> {
        throw RuntimeError.error(withMessage: "State of Mind features require iOS 18.0 or later and Xcode 16 or later to compile")
    }
}
#endif
