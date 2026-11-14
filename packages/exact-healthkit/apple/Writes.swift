// The sends, against HealthKit: authorization, saves and deletes.
import CoreLocation
import Foundation
import HealthKit

#if os(iOS)
enum Writes {
    /// Whether an app may ask to share `id`: HealthKit raises for a type no
    /// app writes, an exception Swift cannot catch, so it is refused first.
    static func isShareable(_ id: String) -> Bool {
        guard Identifiers.sampleType(id) != nil, !Tables.readOnly.contains(id) else { return false }
        return ![Identifiers.electrocardiogram, Identifiers.medicationDoseEvent].contains(id)
    }
}

extension Live {
    // MARK: authorization

    func requestAuthorization(_ args: [String: Any]) async throws -> Bool {
        let (share, read) = try shareAndRead(args)
        guard !share.isEmpty || !read.isEmpty else { throw Failure.type("name a type in `toShare` or `toRead`") }
        return try await withCheckedThrowingContinuation { c in
            store.requestAuthorization(toShare: share, read: read) { ok, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: ok) }
            }
        }
    }

    func requestPerObject(_ args: [String: Any]) async throws -> Any {
        let id = try Convert.string(args, "identifier")
        guard [Identifiers.visionPrescription, Identifiers.userAnnotatedMedication].contains(id),
              let type = Identifiers.objectType(id)
        else { throw Failure.type("\(id) takes no per-object authorization") }
        try await store.requestPerObjectReadAuthorization(for: type, predicate: nil)
        return NSNull()
    }

    func requestMedications() async throws -> Bool {
        #if compiler(>=6.2)
        if #available(iOS 26.0, *) {
            try await store.requestPerObjectReadAuthorization(for: HKObjectType.userAnnotatedMedicationType(), predicate: nil)
            return true
        }
        #endif
        throw Failure("NotSupportedError", "Medications need iOS 26")
    }

    // MARK: saving

    private func save(_ objects: [HKObject]) async throws {
        try await withCheckedThrowingContinuation { (c: CheckedContinuation<Void, Error>) in
            store.save(objects) { _, error in
                if let error { c.resume(throwing: error) } else { c.resume() }
            }
        }
    }

    /// The stored copy of `sample`: the object an app makes has no source
    /// revision until HealthKit stores it, so a save answers what it reads back.
    func stored<T: HKSample>(_ sample: T) async throws -> T {
        let found: [HKSample] = try await withCheckedThrowingContinuation { c in
            store.execute(HKSampleQuery(sampleType: sample.sampleType, predicate: HKQuery.predicateForObject(with: sample.uuid),
                                        limit: 1, sortDescriptors: nil) { _, samples, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: samples ?? []) }
            })
        }
        return found.first as? T ?? sample
    }

    private func dates(_ args: [String: Any]) throws -> (Date, Date) {
        let start = Convert.date(try Convert.number(args, "startDate")), end = Convert.date(try Convert.number(args, "endDate"))
        guard start <= end else { throw Failure.type("`endDate` is before `startDate`") }
        return (start, end)
    }

    private func shareable(_ id: String) throws {
        guard Writes.isShareable(id) else { throw Failure.type("\(id) cannot be written: HealthKit lets no app write it") }
    }

    func quantitySample(_ r: [String: Any], metadata outer: [String: Any]? = nil) throws -> HKQuantitySample {
        let id = try Convert.string(r, r["quantityType"] != nil ? "quantityType" : "identifier")
        try shareable(id)
        guard let type = Identifiers.quantityType(id) else { throw Failure("NotSupportedError", "no quantity type \(id) on this OS") }
        let unitText = try Convert.string(r, "unit")
        let unit = try Convert.unit(unitText)
        guard type.is(compatibleWith: unit) else { throw Failure.type("\(unitText) is no unit of \(id)") }
        let value = try Convert.number(r, r["quantity"] != nil ? "quantity" : "value")
        let (start, end) = try dates(r)
        let metadata = try Convert.metadata(entries: r["metadata"] as? [[String: Any]]) ?? outer
        return HKQuantitySample(type: type, quantity: HKQuantity(unit: unit, doubleValue: value), start: start, end: end, metadata: metadata)
    }

    func categorySample(_ r: [String: Any]) throws -> HKCategorySample {
        let id = try Convert.string(r, r["categoryType"] != nil ? "categoryType" : "identifier")
        try shareable(id)
        guard let type = Identifiers.categoryType(id) else { throw Failure("NotSupportedError", "no category type \(id) on this OS") }
        let (start, end) = try dates(r)
        return HKCategorySample(type: type, value: Int(try Convert.number(r, "value")), start: start, end: end,
                                metadata: try Convert.metadata(entries: r["metadata"] as? [[String: Any]]))
    }

    func saveQuantity(_ args: [String: Any]) async throws -> Any {
        let sample = try quantitySample(args)
        try await save([sample])
        return Convert.quantitySample(try await stored(sample), try Convert.unit(try Convert.string(args, "unit")))
    }

    func saveCategory(_ args: [String: Any]) async throws -> Any {
        let sample = try categorySample(args)
        try await save([sample])
        return Convert.categorySample(try await stored(sample))
    }

    func saveCorrelation(_ args: [String: Any]) async throws -> Any {
        let id = try Convert.string(args, "identifier")
        guard let type = Identifiers.correlationType(id) else { throw Failure("NotSupportedError", "no correlation type \(id) on this OS") }
        let quantities = try Convert.records(args, "quantitySamples").map { try quantitySample($0) }
        let categories = try Convert.records(args, "categorySamples").map { try categorySample($0) }
        let objects = Set<HKSample>(quantities as [HKSample] + categories as [HKSample])
        guard !objects.isEmpty else { throw Failure.type("a correlation holds at least one sample") }
        let (start, end) = try dates(args)
        let correlation = HKCorrelation(type: type, start: start, end: end, objects: objects,
                                        metadata: try Convert.metadata(entries: args["metadata"] as? [[String: Any]]))
        try await save([correlation])
        return try await correlations([try await stored(correlation)]).first ?? NSNull()
    }

    func saveWorkout(_ args: [String: Any]) async throws -> Any {
        let raw = try Convert.number(args, "workoutActivityType")
        guard let activity = HKWorkoutActivityType(rawValue: UInt(raw)) else {
            throw Failure.type("`workoutActivityType` \(raw) is not an HKWorkoutActivityType")
        }
        let (start, end) = try dates(args)
        let metadata = try Convert.metadata(entries: args["metadata"] as? [[String: Any]])
        let samples = try Convert.records(args, "quantities").map { try quantitySample($0, metadata: metadata) }
        let configuration = HKWorkoutConfiguration()
        configuration.activityType = activity
        let builder = HKWorkoutBuilder(healthStore: store, configuration: configuration, device: .local())
        try await builder.beginCollection(at: start)
        if !samples.isEmpty { try await builder.addSamples(samples) }
        // Totals with no samples of their own become one sample each over the workout.
        let totals = Convert.record(args, "totals") ?? [:]
        var extra: [HKSample] = []
        if let meters = Convert.optionalNumber(totals, "distance"), meters != 0,
           !samples.contains(where: { $0.quantity.is(compatibleWith: .meter()) }) {
            let type = HKQuantityType(Self.distanceType(activity))
            extra.append(HKQuantitySample(type: type, quantity: HKQuantity(unit: .meter(), doubleValue: meters), start: start, end: end))
        }
        if let kcal = Convert.optionalNumber(totals, "energyBurned"), kcal != 0,
           !samples.contains(where: { $0.quantity.is(compatibleWith: .kilocalorie()) }) {
            extra.append(HKQuantitySample(type: HKQuantityType(.activeEnergyBurned), quantity: HKQuantity(unit: .kilocalorie(), doubleValue: kcal),
                                          start: start, end: end))
        }
        if !extra.isEmpty { try await builder.addSamples(extra) }
        if let metadata { try await builder.addMetadata(metadata) }
        try await builder.endCollection(at: end)
        guard let workout = try await builder.finishWorkout() else { throw Failure("NotReadableError", "HealthKit saved no workout") }
        return Convert.workout(workout)
    }

    static func distanceType(_ activity: HKWorkoutActivityType) -> HKQuantityTypeIdentifier {
        switch activity {
        case .cycling: return .distanceCycling
        case .swimming: return .distanceSwimming
        case .wheelchairRunPace, .wheelchairWalkPace: return .distanceWheelchair
        case .downhillSkiing, .snowboarding, .crossCountrySkiing: return .distanceDownhillSnowSports
        default: return .distanceWalkingRunning
        }
    }

    func saveRoute(_ args: [String: Any]) async throws -> Bool {
        let w = try await workout(args)
        let locations = try Convert.records(args, "locations").map(Convert.clLocation)
        let builder = HKWorkoutRouteBuilder(healthStore: store, device: nil)
        try await builder.insertRouteData(locations)
        _ = try await builder.finishRoute(with: w, metadata: nil)
        return true
    }

    func saveStateOfMind(_ args: [String: Any]) async throws -> Any {
        #if compiler(>=6)
        if #available(iOS 18.0, *) {
            guard let kind = HKStateOfMind.Kind(rawValue: Int(try Convert.number(args, "kind"))) else {
                throw Failure.type("`kind` is an HKStateOfMind.Kind")
            }
            let labels = (args["labels"] as? [Any] ?? []).compactMap { ($0 as? NSNumber).flatMap { HKStateOfMind.Label(rawValue: $0.intValue) } }
            let associations = (args["associations"] as? [Any] ?? []).compactMap {
                ($0 as? NSNumber).flatMap { HKStateOfMind.Association(rawValue: $0.intValue) }
            }
            let sample = HKStateOfMind(date: Convert.date(try Convert.number(args, "date")), kind: kind,
                                       valence: try Convert.number(args, "valence"), labels: labels, associations: associations,
                                       metadata: try Convert.metadata(entries: args["metadata"] as? [[String: Any]]))
            try await save([sample])
            return Convert.stateOfMind(try await stored(sample))
        }
        #endif
        throw Failure("NotSupportedError", "State of mind needs iOS 18")
    }

    func startWatchApp(_ args: [String: Any]) async throws -> Bool {
        guard let c = Convert.record(args, "workoutConfiguration") else { throw Failure.type("`workoutConfiguration` is a record") }
        let configuration = HKWorkoutConfiguration()
        let raw = try Convert.number(c, "activityType")
        guard let activity = HKWorkoutActivityType(rawValue: UInt(raw)) else {
            throw Failure.type("`activityType` \(raw) is not an HKWorkoutActivityType")
        }
        configuration.activityType = activity
        if let l = Convert.optionalNumber(c, "locationType"), let location = HKWorkoutSessionLocationType(rawValue: Int(l)) {
            configuration.locationType = location
        }
        return try await withCheckedThrowingContinuation { cont in
            store.startWatchApp(with: configuration) { ok, error in
                if let error { cont.resume(throwing: error) } else { cont.resume(returning: ok) }
            }
        }
    }

    // MARK: deleting

    func deleteObjects(_ args: [String: Any]) async throws -> Double {
        let id = try Convert.string(args, "identifier")
        guard let type = Identifiers.sampleType(id) else { throw Failure("NotSupportedError", "no sample type \(id) on this OS") }
        guard let predicate = try await Predicates.of(args, type: type, store: store) else {
            throw Failure.type("a delete names a `filter`")
        }
        return try await withCheckedThrowingContinuation { c in
            store.deleteObjects(of: type, predicate: predicate) { _, count, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: Double(count)) }
            }
        }
    }
}
#endif
