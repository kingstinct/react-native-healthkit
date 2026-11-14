// The reads, against HealthKit: each name's answer from its keyword
// arguments, as react-native-healthkit's function of the same name answers.
import CoreLocation
import Foundation
import HealthKit
import UIKit
import WorkoutKit

#if os(iOS)
/// What answers the names: HealthKit, or the agent's store.
protocol Backend: AnyObject {
    func answer(_ name: String, _ args: [String: Any]) async throws -> Any
}

final class Live: Backend {
    let store: HKHealthStore
    /// Preferred units, kept until a call asks again with `forceUpdate`.
    private var unitCache: [HKQuantityType: HKUnit] = [:]
    private let unitLock = NSLock()

    init(store: HKHealthStore) { self.store = store }

    func answer(_ name: String, _ args: [String: Any]) async throws -> Any {
        switch name {
        case "isHealthDataAvailable": return HKHealthStore.isHealthDataAvailable()
        case "isProtectedDataAvailable": return await MainActor.run { UIApplication.shared.isProtectedDataAvailable }
        case "isObjectTypeAvailable": return Identifiers.objectType(try Convert.string(args, "identifier")) != nil
        case "areObjectTypesAvailable":
            return Convert.strings(args, "identifiers").map { ["identifier": $0, "available": Identifiers.objectType($0) != nil] }
        case "authorizationStatusFor": return try authorizationStatus(args)
        case "getRequestStatusForAuthorization": return try await requestStatus(args)
        case "getEarliestAuthorizedSampleDates": return try await earliestDates(args)
        case "getPreferredUnits": return try await preferredUnits(args)
        case "currentAppSource": return Convert.source(HKSource.default())
        case "requestAuthorization": return try await requestAuthorization(args)
        case "requestPerObjectReadAuthorization": return try await requestPerObject(args)
        case "requestMedicationsAuthorization": return try await requestMedications()
        case "getBiologicalSex": return Double(try store.biologicalSex().biologicalSex.rawValue)
        case "getBloodType": return Double(try store.bloodType().bloodType.rawValue)
        case "getFitzpatrickSkinType": return Double(try store.fitzpatrickSkinType().skinType.rawValue)
        case "getWheelchairUse": return Double(try store.wheelchairUse().wheelchairUse.rawValue)
        case "getDateOfBirth":
            let c = try store.dateOfBirthComponents()
            return Calendar.current.date(from: c).map(Convert.ms) ?? NSNull()
        case "querySources": return try await sources(args)
        case "queryQuantitySamples": return try await quantitySamples(args)
        case "queryQuantitySamplesWithAnchor": return try await quantitySamplesWithAnchor(args)
        case "queryStatisticsForQuantity": return try await statistics(args, separate: false)
        case "queryStatisticsForQuantitySeparateBySource": return try await statistics(args, separate: true)
        case "queryStatisticsCollectionForQuantity": return try await collection(args, separate: false)
        case "queryStatisticsCollectionForQuantitySeparateBySource": return try await collection(args, separate: true)
        case "isQuantityCompatibleWithUnit":
            guard let type = Identifiers.quantityType(try Convert.string(args, "identifier")) else { return false }
            guard let unit = Units.parse(try Convert.string(args, "unit")) else { return false }
            return type.is(compatibleWith: unit)
        case "queryCategorySamples":
            return try await samples(args, type: try categoryType(args)).compactMap { ($0 as? HKCategorySample).map(Convert.categorySample) }
        case "queryCategorySamplesWithAnchor":
            return try await anchored(args, type: try categoryType(args)) { ($0 as? HKCategorySample).map(Convert.categorySample) }
        case "queryCorrelationSamples":
            let type = try correlationType(args)
            return try await correlations(try await samples(args, type: type))
        case "queryCorrelationSamplesWithAnchor":
            let type = try correlationType(args)
            let r = try await anchoredRaw(args, type: type)
            return ["correlations": try await correlations(r.samples), "deletedSamples": r.deleted, "newAnchor": r.anchor]
        case "queryWorkoutSamples":
            return try await samples(args, type: .workoutType(), workouts: true).compactMap { ($0 as? HKWorkout).map(Convert.workout) }
        case "queryWorkoutSamplesWithAnchor":
            let r = try await anchoredRaw(args, type: .workoutType(), workouts: true)
            return ["workouts": r.samples.compactMap { ($0 as? HKWorkout).map(Convert.workout) }, "deletedSamples": r.deleted, "newAnchor": r.anchor]
        case "getWorkoutRoutes": return try await routes(try await workout(args))
        case "getWorkoutPlan": return try await plan(try await workout(args))
        case "getWorkoutStatistic": return try await workoutStatistic(args)
        case "getAllWorkoutStatistics": return try await allWorkoutStatistics(args)
        case "queryHeartbeatSeriesSamples":
            return try await heartbeats(try await samples(args, type: HKSeriesType.heartbeat()))
        case "queryHeartbeatSeriesSamplesWithAnchor":
            let r = try await anchoredRaw(args, type: HKSeriesType.heartbeat())
            return ["samples": try await heartbeats(r.samples), "deletedSamples": r.deleted, "newAnchor": r.anchor]
        case "queryElectrocardiogramSamples":
            return try await electrocardiograms(try await samples(args, type: .electrocardiogramType()), voltages: Convert.bool(args, "includeVoltages") == true)
        case "queryElectrocardiogramSamplesWithAnchor":
            let r = try await anchoredRaw(args, type: .electrocardiogramType())
            return ["samples": try await electrocardiograms(r.samples, voltages: Convert.bool(args, "includeVoltages") == true),
                    "deletedSamples": r.deleted, "newAnchor": r.anchor]
        case "queryStateOfMindSamples", "queryStateOfMindSamplesWithAnchor":
            guard #available(iOS 18.0, *) else { throw Failure("NotSupportedError", "State of mind needs iOS 18") }
            if name == "queryStateOfMindSamples" {
                return try await samples(args, type: .stateOfMindType()).compactMap { ($0 as? HKStateOfMind).map(Convert.stateOfMind) }
            }
            return try await anchored(args, type: .stateOfMindType()) { ($0 as? HKStateOfMind).map(Convert.stateOfMind) }
        case "queryMedications", "queryMedicationEvents", "queryMedicationEventsWithAnchor":
            return try await medications(name, args)
        case "queryActivitySummary": return try await activitySummaries(args)
        case "saveQuantitySample": return try await saveQuantity(args)
        case "saveCategorySample": return try await saveCategory(args)
        case "saveCorrelationSample": return try await saveCorrelation(args)
        case "saveWorkoutSample": return try await saveWorkout(args)
        case "saveWorkoutRoute": return try await saveRoute(args)
        case "saveStateOfMindSample": return try await saveStateOfMind(args)
        case "startWatchAppWithWorkoutConfiguration": return try await startWatchApp(args)
        case "deleteObjects": return try await deleteObjects(args)
        default: throw Failure("NotSupportedError", "\(name) is not a name of this package")
        }
    }

    // MARK: types

    func quantityType(_ args: [String: Any]) throws -> HKQuantityType {
        let id = try Convert.string(args, "identifier")
        guard let t = Identifiers.quantityType(id) else { throw Failure("NotSupportedError", "no quantity type \(id) on this OS") }
        return t
    }

    func categoryType(_ args: [String: Any]) throws -> HKCategoryType {
        let id = try Convert.string(args, "identifier")
        guard let t = Identifiers.categoryType(id) else { throw Failure("NotSupportedError", "no category type \(id) on this OS") }
        return t
    }

    func correlationType(_ args: [String: Any]) throws -> HKCorrelationType {
        let id = try Convert.string(args, "identifier")
        guard let t = Identifiers.correlationType(id) else { throw Failure("NotSupportedError", "no correlation type \(id) on this OS") }
        return t
    }

    /// The unit a call names, checked against the type, or the person's
    /// preferred unit for it.
    func unit(_ args: [String: Any], key: String = "unit", for type: HKQuantityType) async throws -> HKUnit {
        if let text = Convert.optionalString(args, key) {
            let unit = try Convert.unit(text)
            guard type.is(compatibleWith: unit) else { throw Failure.type("\(text) is no unit of \(type.identifier)") }
            return unit
        }
        if let unit = try await preferred([type], force: false)[type] { return unit }
        throw Failure.type("name a `unit` for \(type.identifier)")
    }

    func preferred(_ types: [HKQuantityType], force: Bool) async throws -> [HKQuantityType: HKUnit] {
        if !force {
            let cached = unitLock.withLock { unitCache.filter { types.contains($0.key) } }
            if cached.count == Set(types).count { return cached }
        }
        let units: [HKQuantityType: HKUnit] = try await withCheckedThrowingContinuation { c in
            store.preferredUnits(for: Set(types)) { units, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: units) }
            }
        }
        unitLock.withLock { for (t, u) in units { unitCache[t] = u } }
        return units
    }

    // MARK: status

    func authorizationStatus(_ args: [String: Any]) throws -> Double {
        let id = try Convert.string(args, "identifier")
        guard let type = Identifiers.objectType(id) else { throw Failure("NotSupportedError", "no type \(id) on this OS") }
        return Double(store.authorizationStatus(for: type).rawValue)
    }

    func shareAndRead(_ args: [String: Any]) throws -> (Set<HKSampleType>, Set<HKObjectType>) {
        let shareIds = Convert.strings(args, "toShare"), readIds = Convert.strings(args, "toRead")
        if let readOnly = shareIds.first(where: { !Writes.isShareable($0) }) {
            throw Failure.type("\(readOnly) cannot be shared: HealthKit lets no app write it")
        }
        return (try Identifiers.sampleTypes(shareIds), try Identifiers.objectTypes(readIds))
    }

    func requestStatus(_ args: [String: Any]) async throws -> Double {
        let (share, read) = try shareAndRead(args)
        if share.isEmpty && read.isEmpty { return Double(HKAuthorizationRequestStatus.unnecessary.rawValue) }
        let status: HKAuthorizationRequestStatus = try await withCheckedThrowingContinuation { c in
            store.getRequestStatusForAuthorization(toShare: share, read: read) { status, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: status) }
            }
        }
        return Double(status.rawValue)
    }

    func earliestDates(_ args: [String: Any]) async throws -> [[String: Any]] {
        let ids = Convert.strings(args, "identifiers")
        var dates: [String: Double] = [:]
        #if compiler(>=6.4)
        if #available(iOS 27.0, *) {
            let types = Dictionary(ids.compactMap { id in Identifiers.objectType(id).map { (id, $0) } }, uniquingKeysWith: { a, _ in a })
            if !types.isEmpty {
                let found = try await store.earliestAuthorizedSampleDate(for: Set(types.values))
                for (id, type) in types { if let d = found[type] { dates[id] = Convert.ms(d) } }
            }
        }
        #endif
        return ids.map { ["identifier": $0, "date": dates[$0].map { $0 as Any } ?? NSNull()] }
    }

    func preferredUnits(_ args: [String: Any]) async throws -> [[String: Any]] {
        let types = Convert.strings(args, "identifiers").compactMap(Identifiers.quantityType)
        guard !types.isEmpty else { return [] }
        let units = try await preferred(types, force: Convert.bool(args, "forceUpdate") == true)
        return units.map { ["typeIdentifier": $0.key.identifier, "unit": $0.value.unitString] }.sorted {
            ($0["typeIdentifier"] as? String ?? "") < ($1["typeIdentifier"] as? String ?? "")
        }
    }

    // MARK: samples

    func samples(_ args: [String: Any], type: HKSampleType, workouts: Bool = false) async throws -> [HKSample] {
        let predicate = try await Predicates.of(args, type: type, store: store, workouts: workouts)
        let sort = [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: Convert.bool(args, "ascending") ?? false)]
        return try await withCheckedThrowingContinuation { c in
            store.execute(HKSampleQuery(sampleType: type, predicate: predicate, limit: Convert.limit(args), sortDescriptors: sort) { _, samples, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: samples ?? []) }
            })
        }
    }

    struct AnchoredPage {
        let samples: [HKSample]
        let deleted: [[String: Any]]
        let anchor: String
    }

    func anchoredRaw(_ args: [String: Any], type: HKSampleType, workouts: Bool = false) async throws -> AnchoredPage {
        let predicate = try await Predicates.of(args, type: type, store: store, workouts: workouts)
        let anchor = try Convert.unarchive(Convert.optionalString(args, "anchor"), as: HKQueryAnchor.self)
        return try await withCheckedThrowingContinuation { c in
            store.execute(HKAnchoredObjectQuery(type: type, predicate: predicate, anchor: anchor, limit: Convert.limit(args)) { _, samples, deleted, newAnchor, error in
                if let error { return c.resume(throwing: error) }
                c.resume(returning: AnchoredPage(samples: samples ?? [], deleted: (deleted ?? []).map(Convert.deleted),
                                                 anchor: newAnchor.flatMap(Convert.archive) ?? ""))
            })
        }
    }

    func anchored(_ args: [String: Any], type: HKSampleType, _ each: (HKSample) -> [String: Any]?) async throws -> [String: Any] {
        let r = try await anchoredRaw(args, type: type)
        return ["samples": r.samples.compactMap(each), "deletedSamples": r.deleted, "newAnchor": r.anchor]
    }

    func sources(_ args: [String: Any]) async throws -> [[String: Any]] {
        let id = try Convert.string(args, "identifier")
        guard let type = Identifiers.sampleType(id) else { throw Failure("NotSupportedError", "no sample type \(id) on this OS") }
        let predicate = try await Predicates.of(args, type: type, store: store)
        let found: Set<HKSource> = try await withCheckedThrowingContinuation { c in
            store.execute(HKSourceQuery(sampleType: type, samplePredicate: predicate) { _, sources, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: sources ?? []) }
            })
        }
        return found.sorted { $0.bundleIdentifier < $1.bundleIdentifier }.map(Convert.source)
    }

    // MARK: quantities

    func quantitySamples(_ args: [String: Any]) async throws -> [[String: Any]] {
        let type = try quantityType(args)
        let unit = try await unit(args, for: type)
        return try await samples(args, type: type).compactMap { ($0 as? HKQuantitySample).map { Convert.quantitySample($0, unit) } }
    }

    func quantitySamplesWithAnchor(_ args: [String: Any]) async throws -> [String: Any] {
        let type = try quantityType(args)
        let unit = try await unit(args, for: type)
        return try await anchored(args, type: type) { ($0 as? HKQuantitySample).map { Convert.quantitySample($0, unit) } }
    }

    static func options(_ words: [String], _ type: HKQuantityType, separate: Bool) -> HKStatisticsOptions {
        var out: HKStatisticsOptions = separate ? [.separateBySource] : []
        let cumulative = type.aggregationStyle == .cumulative
        for w in words {
            switch w {
            case "cumulativeSum" where cumulative: out.insert(.cumulativeSum)
            case "discreteAverage" where !cumulative: out.insert(.discreteAverage)
            case "discreteMax" where !cumulative: out.insert(.discreteMax)
            case "discreteMin" where !cumulative: out.insert(.discreteMin)
            case "duration": out.insert(.duration)
            case "mostRecent": out.insert(.mostRecent)
            default: break
            }
        }
        return out
    }

    func statistics(_ args: [String: Any], separate: Bool) async throws -> Any {
        let type = try quantityType(args)
        let unit = try await unit(args, for: type)
        let predicate = try await Predicates.of(args, type: type, store: store)
        let options = Self.options(Convert.strings(args, "statistics"), type, separate: separate)
        let stats: HKStatistics? = try await withCheckedThrowingContinuation { c in
            store.execute(HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: options) { _, stats, error in
                if let error = error as NSError?, error.domain == HKError.errorDomain, error.code == HKError.Code.errorNoData.rawValue {
                    return c.resume(returning: nil)
                }
                if let error { c.resume(throwing: error) } else { c.resume(returning: stats) }
            })
        }
        if separate {
            guard let stats else { return [[String: Any]]() }
            return (stats.sources ?? []).map { Convert.statistics(stats, unit, source: $0) }
        }
        return stats.map { Convert.statistics($0, unit) } ?? Convert.emptyStatistics()
    }

    func collection(_ args: [String: Any], separate: Bool) async throws -> [[String: Any]] {
        let type = try quantityType(args)
        let unit = try await unit(args, for: type)
        let predicate = try await Predicates.of(args, type: type, store: store)
        let options = Self.options(Convert.strings(args, "statistics"), type, separate: separate)
        let anchor = Convert.date(try Convert.number(args, "anchorDate"))
        let i = Convert.record(args, "intervalComponents") ?? [:]
        var components = DateComponents()
        components.minute = Convert.optionalNumber(i, "minute").map { Int($0) }
        components.hour = Convert.optionalNumber(i, "hour").map { Int($0) }
        components.day = Convert.optionalNumber(i, "day").map { Int($0) }
        components.month = Convert.optionalNumber(i, "month").map { Int($0) }
        components.year = Convert.optionalNumber(i, "year").map { Int($0) }
        let collection: HKStatisticsCollection? = try await withCheckedThrowingContinuation { c in
            let q = HKStatisticsCollectionQuery(quantityType: type, quantitySamplePredicate: predicate, options: options,
                                                anchorDate: anchor, intervalComponents: components)
            q.initialResultsHandler = { _, collection, error in
                if let error = error as NSError?, error.domain == HKError.errorDomain, error.code == HKError.Code.errorNoData.rawValue {
                    return c.resume(returning: nil)
                }
                if let error { c.resume(throwing: error) } else { c.resume(returning: collection) }
            }
            store.execute(q)
        }
        let all = collection?.statistics() ?? []
        if separate {
            return all.flatMap { s in (s.sources ?? []).map { Convert.statistics(s, unit, source: $0) } }
        }
        return all.map { Convert.statistics($0, unit) }
    }

    // MARK: correlations

    func correlations(_ found: [HKSample]) async throws -> [[String: Any]] {
        var out: [[String: Any]] = []
        for case let c as HKCorrelation in found {
            var quantities: [[String: Any]] = [], categories: [[String: Any]] = []
            for object in c.objects {
                if let q = object as? HKQuantitySample {
                    let unit = try await preferred([q.quantityType], force: false)[q.quantityType] ?? .count()
                    quantities.append(Convert.quantitySample(q, unit))
                } else if let s = object as? HKCategorySample {
                    categories.append(Convert.categorySample(s))
                }
            }
            var entry = Convert.base(c)
            entry["correlationType"] = c.correlationType.identifier
            entry["quantitySamples"] = quantities
            entry["categorySamples"] = categories
            out.append(entry)
        }
        return out
    }

    // MARK: workouts

    func workout(_ args: [String: Any]) async throws -> HKWorkout {
        let id = try Convert.string(args, "workoutUuid")
        guard let uuid = UUID(uuidString: id) else { throw Failure.type("`workoutUuid` \(id) is not a UUID") }
        let found: [HKSample] = try await withCheckedThrowingContinuation { c in
            store.execute(HKSampleQuery(sampleType: .workoutType(), predicate: HKQuery.predicateForObject(with: uuid),
                                        limit: 1, sortDescriptors: nil) { _, samples, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: samples ?? []) }
            })
        }
        guard let w = found.first as? HKWorkout else { throw Failure("NotFoundError", "no workout \(id)") }
        return w
    }

    func routes(_ w: HKWorkout) async throws -> [[String: Any]] {
        let found: [HKSample] = try await withCheckedThrowingContinuation { c in
            store.execute(HKSampleQuery(sampleType: HKSeriesType.workoutRoute(), predicate: HKQuery.predicateForObjects(from: w),
                                        limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: samples ?? []) }
            })
        }
        var out: [[String: Any]] = []
        for case let route as HKWorkoutRoute in found {
            let locations: [CLLocation] = try await withCheckedThrowingContinuation { c in
                var all: [CLLocation] = [], finished = false
                store.execute(HKWorkoutRouteQuery(route: route) { _, batch, done, error in
                    guard !finished else { return }
                    if let error { finished = true; return c.resume(throwing: error) }
                    all.append(contentsOf: batch ?? [])
                    if done { finished = true; c.resume(returning: all) }
                })
            }
            let meta = route.metadata ?? [:]
            out.append([
                "uuid": route.uuid.uuidString,
                "locations": locations.enumerated().map { i, l in Convert.location(l, previous: i == 0 ? nil : locations[i - 1]) },
                "syncIdentifier": Convert.opt(meta[HKMetadataKeySyncIdentifier] as? String),
                "syncVersion": Convert.opt((meta[HKMetadataKeySyncVersion] as? NSNumber)?.doubleValue),
            ])
        }
        return out
    }

    func plan(_ w: HKWorkout) async throws -> Any {
        guard let plan = try await w.workoutPlan else { return NSNull() }
        return ["id": plan.id.uuidString, "activityType": Double(plan.workout.activity.rawValue)]
    }

    func workoutStatistic(_ args: [String: Any]) async throws -> Any {
        let w = try await workout(args)
        let id = try Convert.string(args, "quantityType")
        guard let type = Identifiers.quantityType(id) else { throw Failure("NotSupportedError", "no quantity type \(id) on this OS") }
        guard let stats = w.statistics(for: type) else { return NSNull() }
        return Convert.statistics(stats, try await unit(args, for: type))
    }

    func allWorkoutStatistics(_ args: [String: Any]) async throws -> [[String: Any]] {
        let w = try await workout(args)
        let all = w.allStatistics
        let units = try await preferred(Array(all.keys), force: false)
        return all.keys.sorted { $0.identifier < $1.identifier }.compactMap { type in
            guard let stats = all[type], let unit = units[type] else { return nil }
            return ["quantityType": type.identifier, "statistics": Convert.statistics(stats, unit)]
        }
    }

    // MARK: series

    func heartbeats(_ found: [HKSample]) async throws -> [[String: Any]] {
        var out: [[String: Any]] = []
        for case let series as HKHeartbeatSeriesSample in found {
            let beats: [[String: Any]] = try await withCheckedThrowingContinuation { c in
                var all: [[String: Any]] = [], finished = false
                store.execute(HKHeartbeatSeriesQuery(heartbeatSeries: series) { _, time, gap, done, error in
                    guard !finished else { return }
                    if let error { finished = true; return c.resume(throwing: error) }
                    all.append(["timeSinceSeriesStart": time, "precededByGap": gap])
                    if done { finished = true; c.resume(returning: all) }
                })
            }
            out.append(Convert.heartbeatSeries(series, beats: beats))
        }
        return out
    }

    func electrocardiograms(_ found: [HKSample], voltages: Bool) async throws -> [[String: Any]] {
        var out: [[String: Any]] = []
        for case let ecg as HKElectrocardiogram in found {
            var measured: [[String: Any]]?
            if voltages {
                measured = try await withCheckedThrowingContinuation { c in
                    var all: [[String: Any]] = [], finished = false
                    store.execute(HKElectrocardiogramQuery(ecg) { _, result in
                        guard !finished else { return }
                        switch result {
                        case .measurement(let m):
                            if let v = m.quantity(for: .appleWatchSimilarToLeadI)?.doubleValue(for: .volt()) {
                                all.append(["timeSinceSampleStart": m.timeSinceSampleStart, "voltage": v, "lead": "appleWatchSimilarToLeadI"])
                            }
                        case .done:
                            finished = true
                            c.resume(returning: all)
                        case .error(let error):
                            finished = true
                            c.resume(throwing: error)
                        @unknown default:
                            break
                        }
                    })
                }
            }
            out.append(Convert.electrocardiogram(ecg, voltages: measured))
        }
        return out
    }

    // MARK: activity summaries

    func activitySummaries(_ args: [String: Any]) async throws -> [[String: Any]] {
        var predicate: NSPredicate?
        if let d = Convert.record(Convert.record(args, "filter") ?? [:], "date") {
            let calendar = Calendar.current, units: Set<Calendar.Component> = [.era, .year, .month, .day]
            var start = Convert.optionalNumber(d, "startDate").map { calendar.dateComponents(units, from: Convert.date($0)) }
            var end = Convert.optionalNumber(d, "endDate").map { calendar.dateComponents(units, from: Convert.date($0)) }
            start?.calendar = calendar
            end?.calendar = calendar
            if let start, let end {
                predicate = HKQuery.predicate(forActivitySummariesBetweenStart: start, end: end)
            } else if let day = start ?? end {
                predicate = HKQuery.predicateForActivitySummary(with: day)
            }
        }
        let found: [HKActivitySummary] = try await withCheckedThrowingContinuation { c in
            store.execute(HKActivitySummaryQuery(predicate: predicate) { _, summaries, error in
                if let error { c.resume(throwing: error) } else { c.resume(returning: summaries ?? []) }
            })
        }
        return found.map(Convert.activitySummary)
    }

    // MARK: medications

    func medications(_ name: String, _ args: [String: Any]) async throws -> Any {
        #if compiler(>=6.2)
        if #available(iOS 26.0, *) {
            let meds = try await HKUserAnnotatedMedicationQueryDescriptor().result(for: store)
            if name == "queryMedications" { return meds.map(Self.medication) }
            var names: [String: (String, String?)] = [:]
            for m in meds {
                if let id = Convert.archive(m.medication.identifier) { names[id] = (m.medication.displayText, m.nickname) }
            }
            let type = HKObjectType.medicationDoseEventType()
            let each: (HKSample) -> [String: Any]? = { s in (s as? HKMedicationDoseEvent).map { Self.doseEvent($0, names) } }
            if name == "queryMedicationEvents" { return try await samples(args, type: type).compactMap(each) }
            return try await anchored(args, type: type, each)
        }
        #endif
        throw Failure("NotSupportedError", "Medications need iOS 26")
    }

    #if compiler(>=6.2)
    @available(iOS 26.0, *)
    static func medication(_ m: HKUserAnnotatedMedication) -> [String: Any] {
        [
            "isArchived": m.isArchived, "hasSchedule": m.hasSchedule, "nickname": Convert.opt(m.nickname),
            "medication": [
                "identifier": Convert.archive(m.medication.identifier) ?? "",
                "displayText": m.medication.displayText,
                "generalForm": m.medication.generalForm.rawValue,
                "relatedCodings": m.medication.relatedCodings.map { ["system": $0.system, "code": $0.code, "version": Convert.opt($0.version)] },
            ] as [String: Any],
        ]
    }

    @available(iOS 26.0, *)
    static func doseEvent(_ e: HKMedicationDoseEvent, _ names: [String: (String, String?)]) -> [String: Any] {
        let id = Convert.archive(e.medicationConceptIdentifier) ?? ""
        var out = Convert.base(e)
        out["scheduleType"] = Double(e.scheduleType.rawValue)
        out["medicationConceptIdentifier"] = id
        out["medicationDisplayText"] = Convert.opt(names[id]?.0)
        out["scheduledDate"] = Convert.opt(e.scheduledDate.map(Convert.ms))
        out["scheduledDoseQuantity"] = Convert.opt(e.scheduledDoseQuantity)
        out["doseQuantity"] = Convert.opt(e.doseQuantity)
        out["logStatus"] = Double(e.logStatus.rawValue)
        out["unit"] = e.unit.unitString
        if let nickname = names[id]?.1, var meta = out["metadata"] as? [[String: Any]] {
            meta.append(["key": "HKMedicationNickname", "stringValue": nickname, "numberValue": NSNull(), "boolValue": NSNull(),
                         "dateValue": NSNull(), "quantityValue": NSNull()])
            out["metadata"] = meta
        }
        return out
    }
    #endif
}
#endif
