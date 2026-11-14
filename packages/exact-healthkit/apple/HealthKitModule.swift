// @kingstinct/exact-healthkit on iOS: every name of the interface, answered
// through one `HKHealthStore` (`Live`), or under the agent from its store
// (`AgentStore`), which the package is its own substitute for.
//
// - A live read starts one `HKObserverQuery` per sample type it reads; a
//   change re-asks every reader of that type, at most four times a second.
//   The query stops when the type's last reader is released.
// - A return to the foreground, and an answered authorization request,
//   re-ask the status reads: a person may have changed access in Settings.
// - `HealthKitModule.hatch` is given the store once, when it is made, for
//   what the interface does not carry.
import ExactPackage
import Foundation
import HealthKit
import UIKit

#if os(iOS)
public final class HealthKitModule: ExactPackage {
    /// The app's access hatch: given the store once, when it is made.
    public static var hatch: ((HKHealthStore) -> Void)?

    /// The topic prefix the runner names this package's reads by.
    private static let topic = "exact-healthkit"

    /// The reads that answer from the authorization state, re-asked when it may have changed.
    private static let statusNames = [
        "authorizationStatusFor", "getRequestStatusForAuthorization", "getEarliestAuthorizedSampleDates",
        "getPreferredUnits", "queryMedications", "isProtectedDataAvailable",
    ]

    /// The type each fixed read reads; the others read their `identifier`.
    private static let fixedTypes: [String: String] = [
        "queryWorkoutSamples": Identifiers.workout, "queryWorkoutSamplesWithAnchor": Identifiers.workout,
        "getWorkoutRoutes": Identifiers.workoutRoute, "getWorkoutPlan": Identifiers.workout,
        "getWorkoutStatistic": Identifiers.workout, "getAllWorkoutStatistics": Identifiers.workout,
        "queryHeartbeatSeriesSamples": Identifiers.heartbeatSeries,
        "queryHeartbeatSeriesSamplesWithAnchor": Identifiers.heartbeatSeries,
        "queryElectrocardiogramSamples": Identifiers.electrocardiogram,
        "queryElectrocardiogramSamplesWithAnchor": Identifiers.electrocardiogram,
        "queryStateOfMindSamples": Identifiers.stateOfMind, "queryStateOfMindSamplesWithAnchor": Identifiers.stateOfMind,
        "queryMedicationEvents": Identifiers.medicationDoseEvent,
        "queryMedicationEventsWithAnchor": Identifiers.medicationDoseEvent,
    ]

    /// The reads that take an `identifier` of a sample type.
    private static let identifiedReads: Set<String> = [
        "querySources", "queryQuantitySamples", "queryQuantitySamplesWithAnchor", "queryStatisticsForQuantity",
        "queryStatisticsCollectionForQuantity", "queryStatisticsForQuantitySeparateBySource",
        "queryStatisticsCollectionForQuantitySeparateBySource", "queryCategorySamples", "queryCategorySamplesWithAnchor",
        "queryCorrelationSamples", "queryCorrelationSamplesWithAnchor",
    ]

    /// The sends that change what reads answer.
    private static let writes: Set<String> = [
        "saveQuantitySample", "saveCategorySample", "saveCorrelationSample", "saveWorkoutSample", "saveWorkoutRoute",
        "saveStateOfMindSample", "deleteObjects",
    ]

    private let context: ExactPackageContext
    private lazy var store: HKHealthStore = {
        let s = HKHealthStore()
        Self.hatch?(s)
        return s
    }()
    private lazy var live = Live(store: store)
    private lazy var agentStore = AgentStore()
    private var backend: Backend { context.agent ? agentStore : live }

    /// Each observed type's query and the reads that read it.
    private var observers: [String: (query: HKObserverQuery, names: Set<String>)] = [:]
    /// Reads asked under the agent, re-asked after a write there.
    private var agentReads: Set<String> = []
    private var pending: Set<String> = []
    private var announcing = false
    private var shown = true
    private var protectedData: [NSObjectProtocol] = []

    public init(context: ExactPackageContext) { self.context = context }

    public func later(_ name: String, _ args: [String: Any], preferred: Any?, reply: @escaping ([String: Any]) -> Void) {
        let main: ([String: Any]) -> Void = { out in DispatchQueue.main.async { reply(out) } }
        let available = context.agent || HKHealthStore.isHealthDataAvailable()
        guard available || ["isHealthDataAvailable", "isObjectTypeAvailable", "areObjectTypesAvailable"].contains(name) else {
            return main(["error": "NotSupportedError", "message": "Health data is not available on this device"])
        }
        observe(name, args)
        let backend = self.backend, context = self.context
        let after: () -> Void = { [weak self] in self?.answered(name) }
        Task {
            do {
                let value = try await backend.answer(name, args)
                main(Self.wrap(value))
                DispatchQueue.main.async(execute: after)
            } catch {
                context.log("healthkit: \(name) failed: \(error)")
                main(Failure.from(error).reply)
            }
        }
    }

    /// An answer as the runner takes it: an object as it is, anything else boxed.
    private static func wrap(_ value: Any) -> [String: Any] {
        if let object = value as? [String: Any] { return object }
        return ["exact:answer": value]
    }

    /// After a send: the reads it may have changed are asked again.
    private func answered(_ name: String) {
        if name == "requestAuthorization" || name == "requestPerObjectReadAuthorization" || name == "requestMedicationsAuthorization" {
            announce(Set(Self.statusNames).union(observers.values.flatMap(\.names)).union(agentReads))
        } else if context.agent, Self.writes.contains(name) {
            // The agent's store has no observer queries: a write re-asks every read it served.
            announce(agentReads)
        }
    }

    // MARK: change

    /// Start what tells a live read `name` that its answer changed.
    private func observe(_ name: String, _ args: [String: Any]) {
        if name == "isProtectedDataAvailable", protectedData.isEmpty, !context.agent {
            let center = NotificationCenter.default
            for n in [UIApplication.protectedDataDidBecomeAvailableNotification, UIApplication.protectedDataWillBecomeUnavailableNotification] {
                protectedData.append(center.addObserver(forName: n, object: nil, queue: .main) { [weak self] _ in
                    self?.announce(["isProtectedDataAvailable"])
                })
            }
        }
        let id = Self.fixedTypes[name] ?? (Self.identifiedReads.contains(name) ? args["identifier"] as? String : nil)
        guard let id else { return }
        if context.agent {
            agentReads.insert(name)
            return
        }
        if let observer = observers[id] {
            observers[id] = (observer.query, observer.names.union([name]))
            return
        }
        guard let type = Identifiers.sampleType(id) else { return }
        let query = HKObserverQuery(sampleType: type, predicate: nil) { [weak self] _, completion, error in
            completion()
            guard error == nil else { return }
            DispatchQueue.main.async {
                guard let self, let names = self.observers[id]?.names else { return }
                self.announce(names)
            }
        }
        observers[id] = (query, [name])
        store.execute(query)
    }

    /// Re-ask every reader of `names`, coalesced to four times a second.
    private func announce(_ names: Set<String>) {
        pending.formUnion(names)
        guard !announcing else { return }
        announcing = true
        _ = context.after(250, coalescing: true) { [weak self] in
            guard let self else { return }
            self.announcing = false
            let names = self.pending
            self.pending = []
            for name in names.sorted() { self.context.changed("\(Self.topic).\(name)") }
        }
    }

    public func release(_ name: String) {
        agentReads.remove(name)
        for (id, observer) in observers where observer.names.contains(name) {
            let names = observer.names.subtracting([name])
            if names.isEmpty {
                store.stop(observer.query)
                observers[id] = nil
            } else {
                observers[id] = (observer.query, names)
            }
        }
        if name == "isProtectedDataAvailable" {
            protectedData.forEach(NotificationCenter.default.removeObserver)
            protectedData = []
        }
    }

    public func foreground(_ shown: Bool) {
        defer { self.shown = shown }
        if shown, !self.shown { announce(Set(Self.statusNames)) }
    }

    public func destroy(_ done: @escaping () -> Void) {
        for observer in observers.values { store.stop(observer.query) }
        observers = [:]
        protectedData.forEach(NotificationCenter.default.removeObserver)
        protectedData = []
        done()
    }

    // MARK: the agent

    public func permissions(_ states: [String: String]) {
        agentStore.told = states
        announce(Set(Self.statusNames))
    }

    public func preferred(_ values: [String: Any]) {
        guard context.agent else { return }
        agentStore.facts = (values["facts"] as? [String: Any] ?? [:]).compactMapValues { $0 as? [String: Any] }
        if let name = values["store"] as? String {
            let inline = name.trimmingCharacters(in: .whitespaces).hasPrefix("{")
            let file = inline ? name : (name as NSString).lastPathComponent
            let label = inline ? "inline" : file
            context.log(agentStore.load(file) ? "healthkit: store \(label)" : "healthkit: no fixture \(label)")
        }
        // On the next turn: the drive's clock says when readers ask again.
        DispatchQueue.main.async { [self] in
            for name in agentReads.union(Self.statusNames).sorted() { context.changed("\(Self.topic).\(name)") }
        }
    }
}
#else
/// Off iOS (the Mac's HealthKit holds no person's data): every name refused.
public final class HealthKitModule: ExactPackage {
    private let context: ExactPackageContext

    public init(context: ExactPackageContext) { self.context = context }

    public func later(_ name: String, _ args: [String: Any], preferred: Any?, reply: @escaping ([String: Any]) -> Void) {
        if name == "isHealthDataAvailable" { return reply(["exact:answer": false]) }
        reply(["error": "NotSupportedError", "message": "HealthKit is read on iOS only"])
    }
}
#endif
