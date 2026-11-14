// A call's `filter` as an NSPredicate, as react-native-healthkit builds it:
// a base filter's parts are ANDed; `anyOf` ORs base filters, `allOf` ANDs
// them; for samples `noneOf` is NOT(AND(…)), for workouts AND(NOT(each)).
// A filter naming sources (by bundle identifier) or a workout (by uuid)
// needs those objects first, which `Resolved` fetches once per call.
import Foundation
import HealthKit

#if os(iOS)
struct Resolved {
    var sources: [String: HKSource] = [:]
    var workouts: [String: HKWorkout] = [:]

    /// Every source and workout `filter` names, fetched from `store`.
    static func fetch(_ filter: [String: Any]?, type: HKSampleType, store: HKHealthStore) async throws -> Resolved {
        var out = Resolved()
        guard let filter else { return out }
        let parts = [filter] + ["anyOf", "allOf", "noneOf"].flatMap { Convert.records(filter, $0) }
        let bundles = Set(parts.flatMap { Convert.strings($0, "sourceBundleIdentifiers") })
        let workoutIds = Set(parts.compactMap { $0["workoutUuid"] as? String })
        if !bundles.isEmpty {
            let all: Set<HKSource> = try await withCheckedThrowingContinuation { c in
                store.execute(HKSourceQuery(sampleType: type, samplePredicate: nil) { _, sources, error in
                    if let error { c.resume(throwing: error) } else { c.resume(returning: sources ?? []) }
                })
            }
            for s in all where bundles.contains(s.bundleIdentifier) { out.sources[s.bundleIdentifier] = s }
        }
        if !workoutIds.isEmpty {
            let uuids = Set(workoutIds.compactMap(UUID.init(uuidString:)))
            let found: [HKSample] = try await withCheckedThrowingContinuation { c in
                store.execute(HKSampleQuery(sampleType: .workoutType(), predicate: HKQuery.predicateForObjects(with: uuids),
                                            limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
                    if let error { c.resume(throwing: error) } else { c.resume(returning: samples ?? []) }
                })
            }
            for case let w as HKWorkout in found { out.workouts[w.uuid.uuidString] = w }
        }
        return out
    }
}

enum Predicates {
    private static func and(_ ps: [NSPredicate]) -> NSPredicate? {
        ps.count > 1 ? NSCompoundPredicate(andPredicateWithSubpredicates: ps) : ps.first
    }

    private static func or(_ ps: [NSPredicate]) -> NSPredicate? {
        ps.count > 1 ? NSCompoundPredicate(orPredicateWithSubpredicates: ps) : ps.first
    }

    static func date(_ d: [String: Any]?) -> NSPredicate? {
        guard let d else { return nil }
        var options: HKQueryOptions = []
        if Convert.bool(d, "strictStartDate") == true { options.insert(.strictStartDate) }
        if Convert.bool(d, "strictEndDate") == true { options.insert(.strictEndDate) }
        return HKQuery.predicateForSamples(
            withStart: Convert.optionalNumber(d, "startDate").map(Convert.date),
            end: Convert.optionalNumber(d, "endDate").map(Convert.date), options: options)
    }

    static func metadata(_ m: [String: Any]?) throws -> NSPredicate? {
        guard let m, let key = m["withMetadataKey"] as? String else { return nil }
        guard let value = Convert.metadataValue(m) else { return HKQuery.predicateForObjects(withMetadataKey: key) }
        let raw = Convert.optionalNumber(m, "operatorType").map { UInt($0) } ?? NSComparisonPredicate.Operator.equalTo.rawValue
        guard let op = NSComparisonPredicate.Operator(rawValue: raw) else {
            throw Failure.type("`operatorType` \(raw) is not an NSComparisonPredicate.Operator")
        }
        return HKQuery.predicateForObjects(withMetadataKey: key, operatorType: op, value: value)
    }

    /// One base filter's parts, ANDed.
    static func base(_ f: [String: Any], _ resolved: Resolved, workouts: Bool) throws -> NSPredicate? {
        var parts: [NSPredicate] = []
        if let id = f["uuid"] as? String {
            guard let uuid = UUID(uuidString: id) else { throw Failure.type("`uuid` \(id) is not a UUID") }
            parts.append(HKQuery.predicateForObject(with: uuid))
        }
        if f["uuids"] is [Any] {
            parts.append(HKQuery.predicateForObjects(with: Set(Convert.strings(f, "uuids").compactMap(UUID.init(uuidString:)))))
        }
        if let p = date(Convert.record(f, "date")) { parts.append(p) }
        if let p = try metadata(Convert.record(f, "metadata")) { parts.append(p) }
        if let id = f["workoutUuid"] as? String {
            guard let w = resolved.workouts[id] else { throw Failure("NotFoundError", "no workout \(id)") }
            parts.append(HKQuery.predicateForObjects(from: w))
        }
        if f["sourceBundleIdentifiers"] is [Any] {
            let sources = Set(Convert.strings(f, "sourceBundleIdentifiers").compactMap { resolved.sources[$0] })
            // A filter naming only sources that wrote nothing matches nothing.
            parts.append(sources.isEmpty ? NSPredicate(value: false) : HKQuery.predicateForObjects(from: sources))
        }
        if workouts {
            if let raw = Convert.optionalNumber(f, "workoutActivityType") {
                guard let type = HKWorkoutActivityType(rawValue: UInt(raw)) else {
                    throw Failure.type("`workoutActivityType` \(raw) is not an HKWorkoutActivityType")
                }
                parts.append(HKQuery.predicateForWorkouts(with: type))
            }
            if let d = Convert.record(f, "duration") {
                let raw = UInt(try Convert.number(d, "predicateOperator"))
                guard let op = NSComparisonPredicate.Operator(rawValue: raw) else {
                    throw Failure.type("`predicateOperator` \(raw) is not an NSComparisonPredicate.Operator")
                }
                parts.append(HKQuery.predicateForWorkouts(with: op, duration: try Convert.number(d, "durationInSeconds")))
            }
        }
        return and(parts)
    }

    /// A whole filter: its own parts and its anyOf, allOf and noneOf.
    static func filter(_ f: [String: Any]?, _ resolved: Resolved, workouts: Bool = false) throws -> NSPredicate? {
        guard let f else { return nil }
        var parts: [NSPredicate] = []
        if let p = try base(f, resolved, workouts: workouts) { parts.append(p) }
        if f["anyOf"] is [Any], let p = or(try Convert.records(f, "anyOf").compactMap { try base($0, resolved, workouts: workouts) }) {
            parts.append(p)
        }
        if f["allOf"] is [Any], let p = and(try Convert.records(f, "allOf").compactMap { try base($0, resolved, workouts: workouts) }) {
            parts.append(p)
        }
        if f["noneOf"] is [Any] {
            let each = try Convert.records(f, "noneOf").compactMap { try base($0, resolved, workouts: workouts) }
            if workouts {
                if let p = and(each.map { NSCompoundPredicate(notPredicateWithSubpredicate: $0) }) { parts.append(p) }
            } else if let all = and(each) {
                parts.append(NSCompoundPredicate(notPredicateWithSubpredicate: all))
            }
        }
        return and(parts)
    }

    /// The predicate for `args["filter"]` over `type`, its objects fetched.
    static func of(_ args: [String: Any], type: HKSampleType, store: HKHealthStore, workouts: Bool = false) async throws -> NSPredicate? {
        let f = Convert.record(args, "filter")
        let resolved = try await Resolved.fetch(f, type: type, store: store)
        return try filter(f, resolved, workouts: workouts)
    }
}
#endif
