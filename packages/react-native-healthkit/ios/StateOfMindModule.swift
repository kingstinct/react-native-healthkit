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

      warnWithPrefix(
        "serializeStateOfMindSample: Unrecognized StateOfMindAssociation rawValue: \(association.rawValue)"
      )

      return nil
    }

    // todo: warn if we get unknown labels??
    let labels = sample.labels.compactMap { label in
      if let label = StateOfMindLabel(rawValue: Int32(label.rawValue)) {
        return label
      }

      warnWithPrefix(
        "serializeStateOfMindSample Unrecognized StateOfMindLabel rawValue: \(label.rawValue)")
      return nil
    }

    return StateOfMindSample(
      valence: sample.valence,
      kind: StateOfMindKind(rawValue: Int32(sample.kind.rawValue))!,
      valenceClassification: StateOfMindValenceClassification(
        rawValue: Int32(sample.valenceClassification.rawValue))!,
      associations: associations,
      labels: labels,
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
              warnWithPrefix(
                "saveStateOfMindSample: Unknown StateOfMindLabel rawValue: \($0.rawValue), skipping"
              )
              return nil
            }
            let hkAssociations = associations.compactMap {
              if let association = HKStateOfMind.Association.init(rawValue: Int($0.rawValue)) {
                return association
              }
              warnWithPrefix(
                "saveStateOfMindSample: Unknown StateOfMindAssociation rawValue: \($0.rawValue), skipping"
              )
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

            let succeeded = try await saveAsync(sample: sample)

            return succeeded ? serializeStateOfMindSample(sample: sample) : nil
          }
          throw runtimeErrorWithPrefix(
            "saveStateOfMindSample: Unknown StateOfMindKind rawValue: \(kind.rawValue)")
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
