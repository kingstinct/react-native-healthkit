import HealthKit
import NitroModules

// MARK: - Helpers

func getElectrocardiogramByID(
    seriesUUID: UUID
) async -> HKElectrocardiogram? {
    let predicate = HKQuery.predicateForObject(with: seriesUUID)

    let samples = try? await withCheckedThrowingContinuation { (continuation: CheckedContinuation<[HKSample], Error>) in
        let query = HKSampleQuery(
            sampleType: HKObjectType.electrocardiogramType(),
            predicate: predicate,
            limit: 1,
            sortDescriptors: nil
        ) { _, results, error in
            if let error { continuation.resume(throwing: error); return }
            guard let results else {
                continuation.resume(throwing: RuntimeError.error(withMessage: "Empty response"))
                return
            }
            continuation.resume(returning: results)
        }
        store.execute(query)
    }

    return (samples as? [HKElectrocardiogram])?.first
}

@available(iOS 14.0, *)
class ElectrocardiogramModule: HybridElectrocardiogramModuleSpec {

    // Query (simple)
    func queryElectrocardiogramSamples(
        options: ECGQueryOptionsWithSortOrder?
    ) throws -> Promise<[ElectrocardiogramSample]> {
        let predicate = try createPredicate(filter: options?.filter)
        let queryLimit = getQueryLimit(options?.limit)
        let ascending = options?.ascending ?? false
        let includeVoltages = options?.includeVoltages ?? false

        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKSampleQuery(
                    sampleType: HKObjectType.electrocardiogramType(),
                    predicate: predicate,
                    limit: queryLimit,
                    sortDescriptors: [
                        NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: ascending)
                    ]
                ) { _, samples, error in
                    if let error { continuation.resume(throwing: error); return }
                    guard let samples = samples as? [HKElectrocardiogram], !samples.isEmpty else {
                        continuation.resume(returning: [])
                        return
                    }

                    Task {
                        do {
                            var out: [ElectrocardiogramSample] = []
                            out.reserveCapacity(samples.count)
                            for s in samples {
                                let serialized = try await self.serializeECGSample(sample: s, includeVoltages: includeVoltages)
                                out.append(serialized)
                            }
                            continuation.resume(returning: out)
                        } catch {
                            continuation.resume(throwing: error)
                        }
                    }
                }
                store.execute(query)
            }
        }
    }

    // Query (anchored)
    func queryElectrocardiogramSamplesWithAnchor(
        options: ECGQueryOptionsWithAnchor
    ) throws -> Promise<ElectrocardiogramSamplesWithAnchorResponse> {
        let predicate = try createPredicate(filter: options.filter)
        let queryLimit = getQueryLimit(options.limit)
        let queryAnchor = try deserializeHKQueryAnchor(base64String: options.anchor)
        let includeVoltages = options.includeVoltages

        return Promise.async {
            try await withCheckedThrowingContinuation { continuation in
                let query = HKAnchoredObjectQuery(
                    type: HKObjectType.electrocardiogramType(),
                    predicate: predicate,
                    anchor: queryAnchor,
                    limit: queryLimit
                ) { _, samples, deleted, newAnchor, error in
                    if let error { continuation.resume(throwing: error); return }

                    Task {
                        do {
                            let typed = (samples as? [HKElectrocardiogram]) ?? []
                            var out: [ElectrocardiogramSample] = []
                            out.reserveCapacity(typed.count)
                            for s in typed {
                                let serialized = try await self.serializeECGSample(sample: s, includeVoltages: includeVoltages)
                                out.append(serialized)
                            }

                            let response = ElectrocardiogramSamplesWithAnchorResponse(
                                samples: out,
                                deletedSamples: (deleted ?? []).map { serializeDeletedSample(sample: $0) },
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

    // MARK: - Serialization

    private func serializeECGSample(sample: HKElectrocardiogram, includeVoltages: Bool) async throws -> ElectrocardiogramSample {
        // Convert quantities
        let bpmUnit = HKUnit.count().unitDivided(by: .minute())
        let hzUnit  = HKUnit.hertz()
        let avgHR   = sample.averageHeartRate?.doubleValue(for: bpmUnit)
        let freqHz  = sample.samplingFrequency?.doubleValue(for: hzUnit)

        // Optional: waveform
        let voltages: [ElectrocardiogramVoltage]? = includeVoltages
            ? try await getECGVoltages(sample: sample)
            : nil

        // Algorithm version is stored in metadata under HKAppleECGAlgorithmVersion
        let algorithmVersion = sample.metadata?[HKMetadataKeyAlgorithmVersion] as? String

        return ElectrocardiogramSample(
            uuid: sample.uuid.uuidString,
            device: serializeDevice(hkDevice: sample.device),
            startDate: sample.startDate,
            endDate: sample.endDate,
            classification: serializeClassification(sample.classification),
            symptomsStatus: serializeSymptomsStatus(sample.symptomsStatus),
            averageHeartRateBpm: avgHR,
            samplingFrequencyHz: freqHz,
            numberOfVoltageMeasurements: Double(sample.numberOfVoltageMeasurements),
            algorithmVersion: algorithmVersion,
            voltages: voltages,
            metadata: serializeMetadata(sample.metadata),
            sourceRevision: serializeSourceRevision(sample.sourceRevision)
        )
    }

    private func getECGVoltages(sample: HKElectrocardiogram) async throws -> [ElectrocardiogramVoltage] {
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
                  continuation.resume(throwing: RuntimeError.error(withMessage: "HKElectrocardiogramQuery received unknown result type"))
                }
            }
            store.execute(q)
        }
    }

    // MARK: - Enum mappers

    private func serializeClassification(_ classification: HKElectrocardiogram.Classification) -> ElectrocardiogramClassification {
        switch classification {
            case .notSet:                      return ElectrocardiogramClassification(fromString: "notSet")!
            case .sinusRhythm:                 return ElectrocardiogramClassification(fromString: "sinusRhythm")!
            case .atrialFibrillation:          return ElectrocardiogramClassification(fromString: "atrialFibrillation")!
            case .inconclusiveLowHeartRate:    return ElectrocardiogramClassification(fromString: "inconclusiveLowHeartRate")!
            case .inconclusiveHighHeartRate:   return ElectrocardiogramClassification(fromString: "inconclusiveHighHeartRate")!
            case .inconclusivePoorReading:     return ElectrocardiogramClassification(fromString: "inconclusivePoorReading")!
            case .inconclusiveOther:           return ElectrocardiogramClassification(fromString: "inconclusiveOther")!
            @unknown default:                  return ElectrocardiogramClassification(fromString: "inconclusiveOther")!
        }
    }

    private func serializeSymptomsStatus(_ symptoms: HKElectrocardiogram.SymptomsStatus) -> ElectrocardiogramSymptomsStatus {
        switch symptoms {
            case .notSet:  return ElectrocardiogramSymptomsStatus(fromString: "notSet")!
            case .none:    return ElectrocardiogramSymptomsStatus(fromString: "none")!
            case .present: return ElectrocardiogramSymptomsStatus(fromString: "present")!
            @unknown default: return ElectrocardiogramSymptomsStatus(fromString: "notSet")!
        }
    }
}
