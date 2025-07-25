import HealthKit
import NitroModules

@available(iOS 18.0, *)
func serializeStateOfMindSample(sample: HKStateOfMind) -> StateOfMindSample {
    // todo: warn if we get unknown labels??
    let associations = sample.associations.compactMap { association in
        if let association = StateOfMindAssociation(rawValue: Int32(association.rawValue)) {
            return association
        }
        print("[react-native-healthkit] Unknown StateOfMindAssociation raw value: \(association.rawValue)")

        return nil
    }

    // todo: warn if we get unknown labels??
    let labels = sample.labels.compactMap { label in
        if let label = StateOfMindLabel(rawValue: Int32(label.rawValue)) {
            return label
        }

        print("[react-native-healthkit] Unknown StateOfMindLabel raw value: \(label.rawValue)")
        return nil
    }

    return StateOfMindSample(
        uuid: sample.uuid.uuidString,
        device: serializeDevice(hkDevice: sample.device),
        startDate: sample.startDate,
        endDate: sample.endDate,
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

#if compiler(>=6)
class StateOfMindModule: HybridStateOfMindModuleSpec {
    func queryStateOfMindSamples(
        options: QueryOptionsWithSortOrder?
    ) throws -> Promise<[StateOfMindSample]> {
        if #available(iOS 18.0, *) {
            let predicate = try createPredicate(filter: options?.filter)
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
                            return continuation.resume(throwing: RuntimeError.error(withMessage: "[react-native-healthkit] Unexpected empty response"))
                        }

                        let serializedSamples = samples.map { sample -> StateOfMindSample in
                            return serializeStateOfMindSample(sample: sample)
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

    func saveStateOfMindSample(
        date: Date,
        kind: StateOfMindKind,
        valence: Double,
        labels: [StateOfMindLabel],
        associations: [StateOfMindAssociation],
        metadata: AnyMap?
    ) throws -> Promise<Bool> {
        if #available(iOS 18, *) {
            return Promise.async {
                try await withCheckedThrowingContinuation { continuation in
                    // Convert enum values to HKStateOfMind types
                    if let hkKind = HKStateOfMind.Kind.init(rawValue: Int(kind.rawValue)) {
                        let hkLabels = labels.compactMap {
                            if let label = HKStateOfMind.Label.init(rawValue: Int($0.rawValue)) {
                                return label
                            }
                            print("[react-native-healthkit] Unknown StateOfMindLabel raw value: \($0.rawValue)")
                            return nil
                        }
                        let hkAssociations = associations.compactMap {
                            if let association = HKStateOfMind.Association.init(rawValue: Int($0.rawValue)) {
                                return association
                            }
                            print("[react-native-healthkit] Unknown StateOfMindAssociation raw value: \($0.rawValue)")
                            return nil
                        }

                        let sample = HKStateOfMind(
                            date: date,
                            kind: hkKind,
                            valence: valence,
                            labels: hkLabels,
                            associations: hkAssociations,
                            metadata: anyMapToDictionary(metadata ?? AnyMap())
                        )

                        store.save(sample) { (success: Bool, error: Error?) in
                            if let error = error {
                                continuation.resume(throwing: error)
                            } else {
                                continuation.resume(returning: success)
                            }
                        }
                    }
                }
            }
        } else {
            throw RuntimeError.error(withMessage: "StateOfMind is only available on iOS 18 and later")
        }
    }
}
#else
// Fallback for older Xcode versions
class StateOfMind: HybridStateOfMindModuleSpec {
    func queryStateOfMindSamples(
        options: QueryOptionsWithSortOrder?
    ) throws -> Promise<[StateOfMindSample]> {
        throw RuntimeError.error(withMessage: "State of Mind features require iOS 18.0 or later and Xcode 16 or later to compile")
    }

    func saveStateOfMindSample(
        date: Date,
        kind: StateOfMindKind,
        valence: Double,
        labels: [StateOfMindLabel],
        associations: [StateOfMindAssociation],
        metadata: [String: Any]?
    ) throws -> Promise<Bool> {
        throw RuntimeError.error(withMessage: "State of Mind features require iOS 18.0 or later and Xcode 16 or later to compile")
    }
}
#endif
