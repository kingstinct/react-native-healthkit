import HealthKit
import NitroModules

#if compiler(>=6)

@available(iOS 18.0, *)
func serializeStateOfMindSample(sample: HKStateOfMind) -> StateOfMindSample {
  // todo: warn if we get unknown labels??
  let associations = sample.associations.compactMap { association in
    if let association = StateOfMindAssociation(rawValue: Int32(association.rawValue)) {
      return association
    }

    warnWithPrefix("serializeStateOfMindSample: Unrecognized StateOfMindAssociation rawValue: \(association.rawValue)")

    return nil
  }

  // todo: warn if we get unknown labels??
  let labels = sample.labels.compactMap { label in
    if let label = StateOfMindLabel(rawValue: Int32(label.rawValue)) {
      return label
    }

    warnWithPrefix("serializeStateOfMindSample Unrecognized StateOfMindLabel rawValue: \(label.rawValue)")
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
    valenceClassification: StateOfMindValenceClassification(
      rawValue: Int32(sample.valenceClassification.rawValue))!,
    associations: associations,
    labels: labels
  )
}

class StateOfMindModule: HybridStateOfMindModuleSpec {
  func queryStateOfMindSamplesWithAnchor(options: QueryOptionsWithAnchor) -> Promise<
    StateOfMindSamplesWithAnchorResponse
  > {
    return Promise.async {
      if #available(iOS 18.0, *) {
        let predicate = createPredicateForSamples(options.filter)

        let response = try await sampleAnchoredQueryAsync(
          sampleType: .stateOfMindType(),
          limit: options.limit,
          queryAnchor: options.anchor,
          predicate: predicate
        )

        let samples = response.samples.compactMap { sample in
          if let sample = sample as? HKStateOfMind {
            return serializeStateOfMindSample(sample: sample)
          }
          return nil
        }

        return StateOfMindSamplesWithAnchorResponse(
          samples: samples,
          deletedSamples: response.deletedSamples,
          newAnchor: response.newAnchor
        )
      } else {
        throw runtimeErrorWithPrefix(
          "StateOfMind is only available on iOS 18 and later")
      }
    }
  }

  func queryStateOfMindSamples(
    options: QueryOptionsWithSortOrder
  ) -> Promise<[StateOfMindSample]> {
    return Promise.async {
      if #available(iOS 18.0, *) {
        let predicate = createPredicateForSamples(options.filter)

        return try await sampleQueryAsync(
          sampleType: .stateOfMindType(),
          limit: options.limit,
          predicate: predicate,
          sortDescriptors: getSortDescriptors(ascending: options.ascending)
        ).compactMap { sample in
          if let sample = sample as? HKStateOfMind {
            return serializeStateOfMindSample(sample: sample)
          }
          return nil
        }
      } else {
        throw runtimeErrorWithPrefix(
          "StateOfMind is only available on iOS 18 and later")
      }
    }
  }

  func saveStateOfMindSample(
    date: Date,
    kind: StateOfMindKind,
    valence: Double,
    labels: [StateOfMindLabel],
    associations: [StateOfMindAssociation],
    metadata: AnyMap?
  ) -> Promise<Bool> {

    return Promise.async {
      if #available(iOS 18, *) {
        // Convert enum values to HKStateOfMind types
        if let hkKind = HKStateOfMind.Kind.init(rawValue: Int(kind.rawValue)) {
          let hkLabels = labels.compactMap {
            if let label = HKStateOfMind.Label.init(rawValue: Int($0.rawValue)) {
              return label
            }
            warnWithPrefix("saveStateOfMindSample: Unknown StateOfMindLabel rawValue: \($0.rawValue), skipping")
            return nil
          }
          let hkAssociations = associations.compactMap {
            if let association = HKStateOfMind.Association.init(rawValue: Int($0.rawValue)) {
              return association
            }
            warnWithPrefix(
              "saveStateOfMindSample: Unknown StateOfMindAssociation rawValue: \($0.rawValue), skipping")
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

          return try await saveAsync(sample: sample)
        }
        throw runtimeErrorWithPrefix("saveStateOfMindSample: Unknown StateOfMindKind rawValue: \(kind.rawValue)")
      }
      throw runtimeErrorWithPrefix("saveStateOfMindSample is only available on iOS 18 and later")
    }

  }
}
#else
// Fallback for older Xcode versions
class StateOfMind: HybridStateOfMindModuleSpec {
  func queryStateOfMindSamples(
    options: QueryOptionsWithSortOrder
  ) -> Promise<[StateOfMindSample]> {
    throw runtimeErrorWithPrefix(
      "queryStateOfMindSamples requires iOS 18.0 or later and Xcode 16 or later to compile")
  }

  func saveStateOfMindSample(
    date: Date,
    kind: StateOfMindKind,
    valence: Double,
    labels: [StateOfMindLabel],
    associations: [StateOfMindAssociation],
    metadata: [String: Any]?
  ) -> Promise<Bool> {
    throw runtimeErrorWithPrefix(
      "saveStateOfMindSample requires iOS 18.0 or later and Xcode 16 or later to compile")
  }
}
#endif
