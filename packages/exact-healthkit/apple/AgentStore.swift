// The agent's Health store: what the package answers under Exact's agent,
// where it makes no `HKHealthStore`. It starts from `fixture/health.json`
// (or the fixture file the agent's `store` word names) and keeps what the
// app saves and deletes, so a drive reads its own writes back. It holds
// quantity, category and workout samples and the characteristics; every
// other read answers empty. Units convert with HealthKit's own `HKQuantity`,
// which needs no store.
//
// A type the runner says the person did not share (`shared=false`) reads
// as HealthKit reads it: only the samples this app wrote.
import Foundation
import HealthKit

#if os(iOS)
final class AgentStore: Backend {
    private static let fixtures = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
        .appendingPathComponent("fixture")
    static let appBundle = Bundle.main.bundleIdentifier ?? "app"

    /// A sample: its record as the interface answers it, and when it was written.
    private struct Entry {
        var record: [String: Any]
        var kind: String
        var revision: Int
    }

    private var entries: [Entry] = []
    private var deleted: [(uuid: String, revision: Int)] = []
    private var revision = 0
    private var characteristics: [String: Any] = [:]
    private let lock = NSLock()
    /// Permission states the runner told, by name, and its facts.
    var told: [String: String] = [:]
    var facts: [String: [String: Any]] = [:]

    init() { _ = load("health.json") }

    /// Loads a fixture: inline JSON (`{…}`), or a file of the package's
    /// `fixture/`; `health.json` falls back to the copy compiled in, since a
    /// simulator app may not read the package's files. False where there is none.
    func load(_ name: String) -> Bool {
        let text = name.trimmingCharacters(in: .whitespaces)
        var data: Data?
        if text.hasPrefix("{") {
            data = Data(text.utf8)
        } else if !text.contains("/") {
            data = (try? Data(contentsOf: Self.fixtures.appendingPathComponent(text)))
                ?? (text == "health.json" ? Data(Tables.defaultFixture.utf8) : nil)
        }
        guard let data, let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return false }
        lock.lock()
        defer { lock.unlock() }
        entries = []
        deleted = []
        revision = 0
        characteristics = json["characteristics"] as? [String: Any] ?? [:]
        let source = ["name": "Health", "bundleIdentifier": "com.apple.Health"]
        for q in json["quantities"] as? [[String: Any]] ?? [] {
            guard let id = q["identifier"] as? String, let unit = q["unit"] as? String,
                  let value = (q["quantity"] as? NSNumber)?.doubleValue,
                  let start = Self.time(q["startDate"]) else { continue }
            let end = Self.time(q["endDate"]) ?? start
            var r = Self.base(id, start, end, q["uuid"] as? String, source: q["source"] as? [String: Any] ?? source)
            r["quantityType"] = id
            r["quantity"] = value
            r["unit"] = unit
            add(r, "quantity")
        }
        for c in json["categories"] as? [[String: Any]] ?? [] {
            guard let id = c["identifier"] as? String, let value = (c["value"] as? NSNumber)?.doubleValue,
                  let start = Self.time(c["startDate"]) else { continue }
            var r = Self.base(id, start, Self.time(c["endDate"]) ?? start, c["uuid"] as? String, source: c["source"] as? [String: Any] ?? source)
            r["categoryType"] = id
            r["value"] = value
            add(r, "category")
        }
        for w in json["workouts"] as? [[String: Any]] ?? [] {
            guard let type = (w["workoutActivityType"] as? NSNumber)?.doubleValue, let start = Self.time(w["startDate"]),
                  let end = Self.time(w["endDate"]) else { continue }
            var r = Self.base(Identifiers.workout, start, end, w["uuid"] as? String, source: w["source"] as? [String: Any] ?? source)
            Self.fillWorkout(&r, type, start, end, energy: (w["totalEnergyBurned"] as? NSNumber)?.doubleValue,
                             distance: (w["totalDistance"] as? NSNumber)?.doubleValue)
            add(r, "workout")
        }
        return true
    }

    /// A date written as ms or as ISO 8601.
    static func time(_ value: Any?) -> Double? {
        if let n = value as? NSNumber { return n.doubleValue }
        guard let s = value as? String else { return nil }
        let f = ISO8601DateFormatter()
        for options: ISO8601DateFormatter.Options in [[.withInternetDateTime, .withFractionalSeconds], [.withInternetDateTime], [.withFullDate]] {
            f.formatOptions = options
            if let d = f.date(from: s) { return Convert.ms(d) }
        }
        return nil
    }

    private static func base(_ id: String, _ start: Double, _ end: Double, _ uuid: String?, source: [String: Any]) -> [String: Any] {
        [
            "uuid": uuid ?? UUID().uuidString,
            "sourceRevision": ["source": source, "version": NSNull(), "operatingSystemVersion": "26.0.0", "productType": NSNull()],
            "device": NSNull(), "metadata": [[String: Any]](),
            "sampleType": ["identifier": id, "allowsRecalibrationForEstimates": false,
                           "isMinimumDurationRestricted": false, "isMaximumDurationRestricted": false],
            "startDate": start, "endDate": end, "hasUndeterminedDuration": false,
        ]
    }

    private static func fillWorkout(_ r: inout [String: Any], _ type: Double, _ start: Double, _ end: Double, energy: Double?, distance: Double?) {
        r["workoutActivityType"] = type
        r["duration"] = ["unit": "s", "quantity": (end - start) / 1000]
        r["totalEnergyBurned"] = energy.map { ["unit": "kcal", "quantity": $0] as Any } ?? NSNull()
        r["totalDistance"] = distance.map { ["unit": "m", "quantity": $0] as Any } ?? NSNull()
        r["totalSwimmingStrokeCount"] = NSNull()
        r["totalFlightsClimbed"] = NSNull()
        r["events"] = [[String: Any]]()
        r["activities"] = [[String: Any]]()
    }

    private func add(_ record: [String: Any], _ kind: String) {
        revision += 1
        entries.append(Entry(record: record, kind: kind, revision: revision))
    }

    // MARK: answering

    private static func identifier(_ r: [String: Any]) -> String {
        (r["sampleType"] as? [String: Any])?["identifier"] as? String ?? ""
    }

    private func shared(_ id: String) -> Bool {
        (facts["healthkit.read.\(id)"]?["shared"] as? Bool) ?? (told["healthkit.read.\(id)"] != "denied")
    }

    private func since(_ id: String) -> Double? {
        facts["healthkit.read.\(id)"]?["since"] as? Double
    }

    /// The samples of `id` a read sees: those the app wrote, and the rest
    /// where the person shared the type; none before the limited window.
    private func visible(_ kind: String, _ id: String, _ filter: [String: Any]?) -> [Entry] {
        let shared = self.shared(id), since = self.since(id)
        return entries.filter { e in
            guard e.kind == kind, Self.identifier(e.record) == id else { return false }
            let mine = ((e.record["sourceRevision"] as? [String: Any])?["source"] as? [String: Any])?["bundleIdentifier"] as? String == Self.appBundle
            guard mine || shared else { return false }
            if let since, (e.record["endDate"] as? Double ?? 0) < since { return false }
            return AgentFilter.matches(e.record, filter)
        }
    }

    private func sorted(_ list: [Entry], _ args: [String: Any]) -> [[String: Any]] {
        let ascending = Convert.bool(args, "ascending") ?? false
        let records = list.map(\.record).sorted {
            let (a, b) = ($0["startDate"] as? Double ?? 0, $1["startDate"] as? Double ?? 0)
            return ascending ? a < b : a > b
        }
        let limit = Convert.limit(args)
        return limit == HKObjectQueryNoLimit ? records : Array(records.prefix(limit))
    }

    private func anchoredPage(_ list: [Entry], _ args: [String: Any], key: String = "samples",
                              _ map: ([String: Any]) -> [String: Any] = { $0 }) -> [String: Any] {
        let after = Int(Convert.optionalString(args, "anchor") ?? "") ?? 0
        var page = list.filter { $0.revision > after }.sorted { $0.revision < $1.revision }
        let limit = Convert.limit(args)
        if limit != HKObjectQueryNoLimit { page = Array(page.prefix(limit)) }
        let last = page.last?.revision ?? max(after, revision)
        let gone = deleted.filter { $0.revision > after && $0.revision <= last }
        return [key: page.map { map($0.record) }, "deletedSamples": gone.map { ["uuid": $0.uuid, "metadata": [[String: Any]]()] },
                "newAnchor": String(last)]
    }

    /// A quantity record in `unit`, converted by HealthKit's own arithmetic.
    private static func inUnit(_ r: [String: Any], _ unit: HKUnit) -> [String: Any] {
        guard let from = (r["unit"] as? String).flatMap(Units.parse), let value = r["quantity"] as? Double,
              from.unitString != unit.unitString, HKQuantity(unit: from, doubleValue: 0).is(compatibleWith: unit) else { return r }
        var out = r
        out["quantity"] = HKQuantity(unit: from, doubleValue: value).doubleValue(for: unit)
        out["unit"] = unit.unitString
        return out
    }

    private func unit(_ args: [String: Any], _ id: String) throws -> HKUnit {
        if let text = Convert.optionalString(args, "unit") { return try Convert.unit(text) }
        return Tables.canonicalUnits[id].flatMap(Units.parse) ?? .count()
    }

    func answer(_ name: String, _ args: [String: Any]) async throws -> Any {
        try lock.withLock { try answerNow(name, args) }
    }

    private func answerNow(_ name: String, _ args: [String: Any]) throws -> Any {
        switch name {
        case "isHealthDataAvailable", "isProtectedDataAvailable": return true
        case "isObjectTypeAvailable": return Identifiers.objectType(try Convert.string(args, "identifier")) != nil
        case "areObjectTypesAvailable":
            return Convert.strings(args, "identifiers").map { ["identifier": $0, "available": Identifiers.objectType($0) != nil] }
        case "authorizationStatusFor":
            let id = try Convert.string(args, "identifier")
            switch told["healthkit.share.\(id)"] {
            case "granted", "unknown": return 2.0
            case "denied": return 1.0
            default: return 0.0
            }
        case "getRequestStatusForAuthorization":
            let names = Convert.strings(args, "toShare").map { "healthkit.share.\($0)" } + Convert.strings(args, "toRead").map { "healthkit.read.\($0)" }
            return names.contains { (told[$0] ?? "prompt") == "prompt" } ? 1.0 : 2.0
        case "getEarliestAuthorizedSampleDates":
            return Convert.strings(args, "identifiers").map { ["identifier": $0, "date": since($0).map { $0 as Any } ?? NSNull()] }
        case "getPreferredUnits":
            return Convert.strings(args, "identifiers").compactMap { id in Tables.canonicalUnits[id].map { ["typeIdentifier": id, "unit": $0] } }
        case "currentAppSource": return ["name": Bundle.main.object(forInfoDictionaryKey: "CFBundleName") as? String ?? "App", "bundleIdentifier": Self.appBundle]
        case "requestAuthorization", "requestMedicationsAuthorization": return true
        case "requestPerObjectReadAuthorization": return NSNull()
        // A characteristic the person did not share reads as not set, as HealthKit answers it.
        case "getBiologicalSex": return characteristic("BiologicalSex", "biologicalSex")
        case "getBloodType": return characteristic("BloodType", "bloodType")
        case "getFitzpatrickSkinType": return characteristic("FitzpatrickSkinType", "fitzpatrickSkinType")
        case "getWheelchairUse": return characteristic("WheelchairUse", "wheelchairUse")
        case "getDateOfBirth":
            guard shared("HKCharacteristicTypeIdentifierDateOfBirth") else { return NSNull() }
            return Self.time(characteristics["dateOfBirth"]) ?? NSNull()
        case "isQuantityCompatibleWithUnit":
            guard let type = Identifiers.quantityType(try Convert.string(args, "identifier")),
                  let unit = Units.parse(try Convert.string(args, "unit")) else { return false }
            return type.is(compatibleWith: unit)
        case "querySources":
            let id = try Convert.string(args, "identifier")
            var seen: [String: [String: Any]] = [:]
            for e in entries where Self.identifier(e.record) == id {
                if let s = (e.record["sourceRevision"] as? [String: Any])?["source"] as? [String: Any], let b = s["bundleIdentifier"] as? String {
                    seen[b] = s
                }
            }
            return seen.keys.sorted().compactMap { seen[$0] }
        case "queryQuantitySamples":
            let id = try Convert.string(args, "identifier"), unit = try unit(args, id)
            return sorted(visible("quantity", id, Convert.record(args, "filter")), args).map { Self.inUnit($0, unit) }
        case "queryQuantitySamplesWithAnchor":
            let id = try Convert.string(args, "identifier"), unit = try unit(args, id)
            return anchoredPage(visible("quantity", id, Convert.record(args, "filter")), args) { Self.inUnit($0, unit) }
        case "queryStatisticsForQuantity", "queryStatisticsForQuantitySeparateBySource",
             "queryStatisticsCollectionForQuantity", "queryStatisticsCollectionForQuantitySeparateBySource":
            return try statistics(name, args)
        case "queryCategorySamples":
            return sorted(visible("category", try Convert.string(args, "identifier"), Convert.record(args, "filter")), args)
        case "queryCategorySamplesWithAnchor":
            return anchoredPage(visible("category", try Convert.string(args, "identifier"), Convert.record(args, "filter")), args)
        case "queryWorkoutSamples":
            return sorted(visible("workout", Identifiers.workout, Convert.record(args, "filter")), args)
        case "queryWorkoutSamplesWithAnchor":
            return anchoredPage(visible("workout", Identifiers.workout, Convert.record(args, "filter")), args, key: "workouts")
        case "queryCorrelationSamples", "queryHeartbeatSeriesSamples", "queryElectrocardiogramSamples", "queryStateOfMindSamples",
             "queryMedications", "queryMedicationEvents", "queryActivitySummary", "getWorkoutRoutes", "getAllWorkoutStatistics":
            return [[String: Any]]()
        case "queryCorrelationSamplesWithAnchor":
            return anchoredPage([], args, key: "correlations")
        case "queryHeartbeatSeriesSamplesWithAnchor", "queryElectrocardiogramSamplesWithAnchor", "queryStateOfMindSamplesWithAnchor",
             "queryMedicationEventsWithAnchor":
            return anchoredPage([], args)
        case "getWorkoutPlan", "getWorkoutStatistic": return NSNull()
        case "saveQuantitySample":
            let id = try Convert.string(args, "identifier")
            guard Writes.isShareable(id), Identifiers.quantityType(id) != nil else { throw Failure.type("\(id) cannot be written") }
            let unit = try Convert.unit(try Convert.string(args, "unit"))
            var r = Self.base(id, try Convert.number(args, "startDate"), try Convert.number(args, "endDate"), nil, source: Self.mine)
            r["quantityType"] = id
            r["quantity"] = try Convert.number(args, "value")
            r["unit"] = unit.unitString
            r["metadata"] = args["metadata"] as? [[String: Any]] ?? []
            add(r, "quantity")
            return r
        case "saveCategorySample":
            let id = try Convert.string(args, "identifier")
            guard Writes.isShareable(id), Identifiers.categoryType(id) != nil else { throw Failure.type("\(id) cannot be written") }
            var r = Self.base(id, try Convert.number(args, "startDate"), try Convert.number(args, "endDate"), nil, source: Self.mine)
            r["categoryType"] = id
            r["value"] = try Convert.number(args, "value")
            r["metadata"] = args["metadata"] as? [[String: Any]] ?? []
            add(r, "category")
            return r
        case "saveWorkoutSample":
            let start = try Convert.number(args, "startDate"), end = try Convert.number(args, "endDate")
            var r = Self.base(Identifiers.workout, start, end, nil, source: Self.mine)
            let totals = Convert.record(args, "totals") ?? [:]
            Self.fillWorkout(&r, try Convert.number(args, "workoutActivityType"), start, end,
                             energy: Convert.optionalNumber(totals, "energyBurned"), distance: Convert.optionalNumber(totals, "distance"))
            r["metadata"] = args["metadata"] as? [[String: Any]] ?? []
            add(r, "workout")
            return r
        case "deleteObjects":
            let id = try Convert.string(args, "identifier")
            let filter = Convert.record(args, "filter")
            let gone = entries.filter { Self.identifier($0.record) == id && AgentFilter.matches($0.record, filter) }
            entries.removeAll { e in gone.contains { $0.revision == e.revision } }
            for e in gone {
                revision += 1
                deleted.append((e.record["uuid"] as? String ?? "", revision))
            }
            return Double(gone.count)
        case "saveCorrelationSample", "saveStateOfMindSample": return NSNull()
        case "saveWorkoutRoute", "startWatchAppWithWorkoutConfiguration": return true
        default: throw Failure("NotSupportedError", "\(name) is not a name of this package")
        }
    }

    private func characteristic(_ type: String, _ key: String) -> Double {
        guard shared("HKCharacteristicTypeIdentifier\(type)") else { return 0 }
        return (characteristics[key] as? NSNumber)?.doubleValue ?? 0
    }

    private static var mine: [String: Any] {
        ["name": Bundle.main.object(forInfoDictionaryKey: "CFBundleName") as? String ?? "App", "bundleIdentifier": appBundle]
    }

    // MARK: statistics

    private func statistics(_ name: String, _ args: [String: Any]) throws -> Any {
        let id = try Convert.string(args, "identifier")
        guard let type = Identifiers.quantityType(id) else { throw Failure("NotSupportedError", "no quantity type \(id)") }
        let unit = try unit(args, id)
        let words = Set(Convert.strings(args, "statistics"))
        let samples = visible("quantity", id, Convert.record(args, "filter")).map { Self.inUnit($0.record, unit) }
        let separate = name.hasSuffix("SeparateBySource"), collection = name.contains("Collection")
        let cumulative = type.aggregationStyle == .cumulative
        let source = { (r: [String: Any]) -> [String: Any] in
            ((r["sourceRevision"] as? [String: Any])?["source"] as? [String: Any]) ?? [:]
        }
        func stats(_ list: [[String: Any]], _ from: Double?, _ to: Double?, by: [String: Any]?) -> [String: Any] {
            let values = list.compactMap { $0["quantity"] as? Double }
            let q = { (v: Double?) -> Any in v.map { ["unit": unit.unitString, "quantity": $0] as Any } ?? NSNull() }
            let recent = list.max { ($0["endDate"] as? Double ?? 0) < ($1["endDate"] as? Double ?? 0) }
            var out: [String: Any] = [
                "sumQuantity": q(words.contains("cumulativeSum") && cumulative && !values.isEmpty ? values.reduce(0, +) : nil),
                "averageQuantity": q(words.contains("discreteAverage") && !cumulative && !values.isEmpty
                                     ? values.reduce(0, +) / Double(values.count) : nil),
                "minimumQuantity": q(words.contains("discreteMin") && !cumulative ? values.min() : nil),
                "maximumQuantity": q(words.contains("discreteMax") && !cumulative ? values.max() : nil),
                "mostRecentQuantity": q(words.contains("mostRecent") ? recent?["quantity"] as? Double : nil),
                "mostRecentQuantityDateInterval": words.contains("mostRecent") && recent != nil
                    ? ["from": recent?["startDate"] ?? 0, "to": recent?["endDate"] ?? 0] : NSNull(),
                "duration": words.contains("duration") && !list.isEmpty
                    ? ["unit": "s", "quantity": list.reduce(0.0) { $0 + (($1["endDate"] as? Double ?? 0) - ($1["startDate"] as? Double ?? 0)) / 1000 }]
                    : NSNull(),
                "startDate": Convert.opt(from ?? list.compactMap { $0["startDate"] as? Double }.min()),
                "endDate": Convert.opt(to ?? list.compactMap { $0["endDate"] as? Double }.max()),
            ]
            if let by { out["source"] = by } else {
                var seen: [String: [String: Any]] = [:]
                for r in list { let s = source(r); seen[s["bundleIdentifier"] as? String ?? ""] = s }
                out["sources"] = seen.keys.sorted().compactMap { seen[$0] }
            }
            return out
        }
        func bySource(_ list: [[String: Any]], _ from: Double?, _ to: Double?) -> [[String: Any]] {
            var groups: [String: [[String: Any]]] = [:]
            for r in list { groups[source(r)["bundleIdentifier"] as? String ?? "", default: []].append(r) }
            return groups.keys.sorted().compactMap { k in groups[k].map { stats($0, from, to, by: source($0[0])) } }
        }
        guard collection else {
            if separate { return samples.isEmpty ? [[String: Any]]() : bySource(samples, nil, nil) }
            return samples.isEmpty ? Convert.emptyStatistics() : stats(samples, nil, nil, by: nil)
        }
        // Intervals from the anchor, over the samples' span; only those holding a sample.
        let anchor = try Convert.number(args, "anchorDate")
        let i = Convert.record(args, "intervalComponents") ?? [:]
        var step = DateComponents()
        step.minute = Convert.optionalNumber(i, "minute").map { Int($0) }
        step.hour = Convert.optionalNumber(i, "hour").map { Int($0) }
        step.day = Convert.optionalNumber(i, "day").map { Int($0) }
        step.month = Convert.optionalNumber(i, "month").map { Int($0) }
        step.year = Convert.optionalNumber(i, "year").map { Int($0) }
        let starts = samples.compactMap { $0["startDate"] as? Double }
        guard let first = starts.min(), let last = starts.max() else { return [[String: Any]]() }
        let calendar = Calendar.current
        var at = Convert.date(anchor)
        var guardCount = 0
        while Convert.ms(at) > first, let back = calendar.date(byAdding: step.negated, to: at), guardCount < 10_000 {
            at = back
            guardCount += 1
        }
        var out: [[String: Any]] = []
        while Convert.ms(at) <= last, let next = calendar.date(byAdding: step, to: at), guardCount < 20_000 {
            let (from, to) = (Convert.ms(at), Convert.ms(next))
            let inside = samples.filter { ($0["startDate"] as? Double ?? 0) >= from && ($0["startDate"] as? Double ?? 0) < to }
            if !inside.isEmpty { out += separate ? bySource(inside, from, to) : [stats(inside, from, to, by: nil)] }
            at = next
            guardCount += 1
        }
        return out
    }
}

private extension DateComponents {
    var negated: DateComponents {
        var c = DateComponents()
        c.minute = minute.map { -$0 }
        c.hour = hour.map { -$0 }
        c.day = day.map { -$0 }
        c.month = month.map { -$0 }
        c.year = year.map { -$0 }
        return c
    }
}

/// A `filter` over the agent's records: uuids, dates, sources, metadata
/// keys and workout types, with anyOf, allOf and noneOf.
enum AgentFilter {
    static func matches(_ r: [String: Any], _ f: [String: Any]?) -> Bool {
        guard let f else { return true }
        guard base(r, f) else { return false }
        if f["anyOf"] is [Any], !Convert.records(f, "anyOf").contains(where: { base(r, $0) }) { return false }
        if f["allOf"] is [Any], !Convert.records(f, "allOf").allSatisfy({ base(r, $0) }) { return false }
        if f["noneOf"] is [Any], Convert.records(f, "noneOf").contains(where: { base(r, $0) }) { return false }
        return true
    }

    static func base(_ r: [String: Any], _ f: [String: Any]) -> Bool {
        let uuid = r["uuid"] as? String ?? "", start = r["startDate"] as? Double ?? 0, end = r["endDate"] as? Double ?? 0
        if let id = f["uuid"] as? String, id.lowercased() != uuid.lowercased() { return false }
        if f["uuids"] is [Any], !Convert.strings(f, "uuids").map({ $0.lowercased() }).contains(uuid.lowercased()) { return false }
        if let d = Convert.record(f, "date") {
            let strictStart = Convert.bool(d, "strictStartDate") == true, strictEnd = Convert.bool(d, "strictEndDate") == true
            if let s = Convert.optionalNumber(d, "startDate"), strictStart ? start < s : end <= s { return false }
            if let e = Convert.optionalNumber(d, "endDate"), strictEnd ? end > e : start >= e { return false }
        }
        if f["sourceBundleIdentifiers"] is [Any] {
            let b = ((r["sourceRevision"] as? [String: Any])?["source"] as? [String: Any])?["bundleIdentifier"] as? String ?? ""
            if !Convert.strings(f, "sourceBundleIdentifiers").contains(b) { return false }
        }
        if let m = Convert.record(f, "metadata"), let key = m["withMetadataKey"] as? String {
            let entries = r["metadata"] as? [[String: Any]] ?? []
            if !entries.contains(where: { $0["key"] as? String == key }) { return false }
        }
        if let t = Convert.optionalNumber(f, "workoutActivityType"), r["workoutActivityType"] as? Double != t { return false }
        return true
    }
}
#endif
