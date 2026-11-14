// HealthKit's objects as the interface's shapes, and the shapes calls pass
// as HealthKit's objects. Dates are ms since the epoch both ways; an absent
// option is `NSNull()`.
import CoreLocation
import Foundation
import HealthKit

#if os(iOS)
/// A call's failure, replied as `{"error", "message"}`.
struct Failure: Error {
    let code: String
    let message: String

    init(_ code: String, _ message: String) {
        self.code = code
        self.message = message
    }

    static func type(_ message: String) -> Failure { Failure("TypeError", message) }

    var reply: [String: Any] { ["error": code, "message": message] }

    /// HealthKit's error as the platform error a reader expects.
    static func from(_ error: Error) -> Failure {
        if let failure = error as? Failure { return failure }
        let ns = error as NSError
        guard ns.domain == HKError.errorDomain, let code = HKError.Code(rawValue: ns.code) else {
            return Failure("NotReadableError", error.localizedDescription)
        }
        switch code {
        case .errorAuthorizationDenied, .errorAuthorizationNotDetermined:
            return Failure("NotAllowedError", error.localizedDescription)
        case .errorHealthDataUnavailable, .errorHealthDataRestricted:
            return Failure("NotSupportedError", error.localizedDescription)
        case .errorDatabaseInaccessible:
            return Failure("NotReadableError", "the Health store is locked")
        case .errorInvalidArgument:
            return Failure("TypeError", error.localizedDescription)
        case .errorUserCanceled:
            return Failure("AbortError", error.localizedDescription)
        default:
            return Failure("NotReadableError", error.localizedDescription)
        }
    }
}

enum Convert {
    // MARK: values

    static func ms(_ date: Date) -> Double { date.timeIntervalSince1970 * 1000 }
    static func date(_ ms: Double) -> Date { Date(timeIntervalSince1970: ms / 1000) }
    static func opt(_ value: Any?) -> Any { value ?? NSNull() }

    static func quantity(_ q: HKQuantity?, _ unit: HKUnit) -> Any {
        guard let q, q.is(compatibleWith: unit) else { return NSNull() }
        return ["unit": unit.unitString, "quantity": q.doubleValue(for: unit)]
    }

    // MARK: reading arguments

    static func string(_ args: [String: Any], _ key: String) throws -> String {
        guard let s = args[key] as? String else { throw Failure.type("`\(key)` is a string") }
        return s
    }

    static func number(_ args: [String: Any], _ key: String) throws -> Double {
        guard let n = (args[key] as? NSNumber)?.doubleValue else { throw Failure.type("`\(key)` is a number") }
        return n
    }

    static func optionalNumber(_ args: [String: Any], _ key: String) -> Double? {
        (args[key] as? NSNumber)?.doubleValue
    }

    static func optionalString(_ args: [String: Any], _ key: String) -> String? {
        args[key] as? String
    }

    static func bool(_ args: [String: Any], _ key: String) -> Bool? {
        (args[key] as? NSNumber)?.boolValue
    }

    static func strings(_ args: [String: Any], _ key: String) -> [String] {
        (args[key] as? [Any] ?? []).compactMap { $0 as? String }
    }

    static func records(_ args: [String: Any], _ key: String) -> [[String: Any]] {
        (args[key] as? [Any] ?? []).compactMap { $0 as? [String: Any] }
    }

    static func record(_ args: [String: Any], _ key: String) -> [String: Any]? {
        args[key] as? [String: Any]
    }

    /// `limit`: 0 or less reads every sample, as react-native-healthkit's does.
    static func limit(_ args: [String: Any]) -> Int {
        let n = Int(optionalNumber(args, "limit") ?? 0)
        return n > 0 ? n : HKObjectQueryNoLimit
    }

    static func unit(_ text: String) throws -> HKUnit {
        guard let unit = Units.parse(text) else { throw Failure.type("`\(text)` is not a unit HealthKit reads") }
        return unit
    }

    // MARK: metadata

    private static let isoDate: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()

    /// HealthKit's metadata as entries, by key; a value of no kind the
    /// interface carries is left out.
    static func metadata(_ metadata: [String: Any]?) -> [[String: Any]] {
        guard let metadata else { return [] }
        return metadata.keys.sorted().compactMap { key -> [String: Any]? in
            var entry: [String: Any] = [
                "key": key, "stringValue": NSNull(), "numberValue": NSNull(), "boolValue": NSNull(),
                "dateValue": NSNull(), "quantityValue": NSNull(),
            ]
            switch metadata[key] {
            case let n as NSNumber:
                let flag = Tables.booleanMetadataKeys.contains(key)
                    || (!Tables.numericMetadataKeys.contains(key) && CFGetTypeID(n) == CFBooleanGetTypeID())
                if flag { entry["boolValue"] = n.boolValue } else { entry["numberValue"] = n.doubleValue }
            case let s as String:
                entry["stringValue"] = s
            case let d as Date:
                entry["dateValue"] = ms(d)
            case let q as HKQuantity:
                guard let unit = Units.guess(q) else { return nil }
                entry["quantityValue"] = quantity(q, unit)
            default:
                return nil
            }
            return entry
        }
    }

    /// Entries as HealthKit's metadata; nil for none.
    static func metadata(entries: [[String: Any]]?) throws -> [String: Any]? {
        guard let entries, !entries.isEmpty else { return nil }
        var out: [String: Any] = [:]
        for e in entries {
            guard let key = e["key"] as? String else { throw Failure.type("a metadata entry has a `key`") }
            if let s = e["stringValue"] as? String {
                out[key] = s
            } else if let b = e["boolValue"] as? NSNumber {
                out[key] = NSNumber(value: b.boolValue)
            } else if let n = e["numberValue"] as? NSNumber {
                out[key] = NSNumber(value: n.doubleValue)
            } else if let d = e["dateValue"] as? NSNumber {
                out[key] = date(d.doubleValue)
            } else if let q = e["quantityValue"] as? [String: Any], let u = q["unit"] as? String,
                      let v = (q["quantity"] as? NSNumber)?.doubleValue {
                out[key] = HKQuantity(unit: try unit(u), doubleValue: v)
            } else {
                throw Failure.type("metadata `\(key)` has a value")
            }
        }
        return out
    }

    static func metadataValue(_ entry: [String: Any]) -> Any? {
        if let s = entry["stringValue"] as? String { return s }
        if let b = entry["boolValue"] as? NSNumber { return NSNumber(value: b.boolValue ? 1 : 0) }
        if let n = entry["numberValue"] as? NSNumber { return NSNumber(value: n.doubleValue) }
        if let d = entry["dateValue"] as? NSNumber { return date(d.doubleValue) }
        return nil
    }

    // MARK: objects

    static func source(_ s: HKSource) -> [String: Any] {
        ["name": s.name, "bundleIdentifier": s.bundleIdentifier]
    }

    static func sourceRevision(_ r: HKSourceRevision) -> [String: Any] {
        let v = r.operatingSystemVersion
        return [
            "source": source(r.source), "version": opt(r.version),
            "operatingSystemVersion": "\(v.majorVersion).\(v.minorVersion).\(v.patchVersion)",
            "productType": opt(r.productType),
        ]
    }

    static func device(_ d: HKDevice?) -> Any {
        guard let d else { return NSNull() }
        return [
            "name": opt(d.name), "firmwareVersion": opt(d.firmwareVersion), "hardwareVersion": opt(d.hardwareVersion),
            "localIdentifier": opt(d.localIdentifier), "manufacturer": opt(d.manufacturer), "model": opt(d.model),
            "softwareVersion": opt(d.softwareVersion), "udiDeviceIdentifier": opt(d.udiDeviceIdentifier),
        ]
    }

    static func sampleType(_ t: HKSampleType) -> [String: Any] {
        [
            "identifier": Identifiers.identifier(t),
            "allowsRecalibrationForEstimates": t.allowsRecalibrationForEstimates,
            "isMinimumDurationRestricted": t.isMinimumDurationRestricted,
            "isMaximumDurationRestricted": t.isMaximumDurationRestricted,
        ]
    }

    /// The fields every sample answers with.
    static func base(_ s: HKSample) -> [String: Any] {
        [
            "uuid": s.uuid.uuidString, "sourceRevision": sourceRevision(s.sourceRevision), "device": device(s.device),
            "metadata": metadata(s.metadata), "sampleType": sampleType(s.sampleType), "startDate": ms(s.startDate),
            "endDate": ms(s.endDate), "hasUndeterminedDuration": s.hasUndeterminedDuration,
        ]
    }

    static func deleted(_ d: HKDeletedObject) -> [String: Any] {
        ["uuid": d.uuid.uuidString, "metadata": metadata(d.metadata)]
    }

    static func quantitySample(_ s: HKQuantitySample, _ unit: HKUnit) -> [String: Any] {
        var out = base(s)
        out["quantityType"] = s.quantityType.identifier
        out["quantity"] = s.quantity.doubleValue(for: unit)
        out["unit"] = unit.unitString
        return out
    }

    static func categorySample(_ s: HKCategorySample) -> [String: Any] {
        var out = base(s)
        out["categoryType"] = s.categoryType.identifier
        out["value"] = Double(s.value)
        return out
    }

    // MARK: statistics

    static func statistics(_ s: HKStatistics, _ unit: HKUnit, source: HKSource? = nil) -> [String: Any] {
        let interval = source.map { s.mostRecentQuantityDateInterval(for: $0) } ?? s.mostRecentQuantityDateInterval()
        var out: [String: Any] = [
            "averageQuantity": quantity(source.map { s.averageQuantity(for: $0) } ?? s.averageQuantity(), unit),
            "maximumQuantity": quantity(source.map { s.maximumQuantity(for: $0) } ?? s.maximumQuantity(), unit),
            "minimumQuantity": quantity(source.map { s.minimumQuantity(for: $0) } ?? s.minimumQuantity(), unit),
            "sumQuantity": quantity(source.map { s.sumQuantity(for: $0) } ?? s.sumQuantity(), unit),
            "mostRecentQuantity": quantity(source.map { s.mostRecentQuantity(for: $0) } ?? s.mostRecentQuantity(), unit),
            "mostRecentQuantityDateInterval": interval.map { ["from": ms($0.start), "to": ms($0.end)] } ?? NSNull(),
            "duration": quantity(source.map { s.duration(for: $0) } ?? s.duration(), .second()),
            "startDate": ms(s.startDate), "endDate": ms(s.endDate),
        ]
        if let source {
            out["source"] = self.source(source)
        } else {
            out["sources"] = (s.sources ?? []).map(self.source)
        }
        return out
    }

    static func emptyStatistics() -> [String: Any] {
        [
            "averageQuantity": NSNull(), "maximumQuantity": NSNull(), "minimumQuantity": NSNull(),
            "sumQuantity": NSNull(), "mostRecentQuantity": NSNull(), "mostRecentQuantityDateInterval": NSNull(),
            "duration": NSNull(), "startDate": NSNull(), "endDate": NSNull(), "sources": [[String: Any]](),
        ]
    }

    // MARK: workouts

    static func workout(_ w: HKWorkout) -> [String: Any] {
        var out = base(w)
        out["workoutActivityType"] = Double(w.workoutActivityType.rawValue)
        out["duration"] = ["unit": "s", "quantity": w.duration]
        let distanceType: HKQuantityTypeIdentifier
        switch w.workoutActivityType {
        case .cycling: distanceType = .distanceCycling
        case .swimming: distanceType = .distanceSwimming
        case .wheelchairRunPace, .wheelchairWalkPace: distanceType = .distanceWheelchair
        case .downhillSkiing, .snowboarding, .crossCountrySkiing: distanceType = .distanceDownhillSnowSports
        default: distanceType = .distanceWalkingRunning
        }
        let energy = w.statistics(for: HKQuantityType(.activeEnergyBurned))?.sumQuantity()
        let distance = w.statistics(for: HKQuantityType(distanceType))?.sumQuantity()
        let strokes = w.statistics(for: HKQuantityType(.swimmingStrokeCount))?.sumQuantity()
        let flights = w.statistics(for: HKQuantityType(.flightsClimbed))?.sumQuantity()
        out["totalEnergyBurned"] = quantity(energy ?? w.totalEnergyBurned, .kilocalorie())
        out["totalDistance"] = quantity(distance ?? w.totalDistance, .meter())
        out["totalSwimmingStrokeCount"] = quantity(strokes ?? w.totalSwimmingStrokeCount, .count())
        out["totalFlightsClimbed"] = quantity(flights ?? w.totalFlightsClimbed, .count())
        out["events"] = (w.workoutEvents ?? []).map { e -> [String: Any] in
            [
                "type": Double(e.type.rawValue), "startDate": ms(e.dateInterval.start),
                "endDate": ms(e.dateInterval.end), "metadata": metadata(e.metadata),
            ]
        }
        out["activities"] = w.workoutActivities.map { a -> [String: Any] in
            [
                "uuid": a.uuid.uuidString, "startDate": ms(a.startDate), "endDate": ms(a.endDate ?? a.startDate),
                "duration": a.duration, "activityType": Double(a.workoutConfiguration.activityType.rawValue),
                "locationType": Double(a.workoutConfiguration.locationType.rawValue), "metadata": metadata(a.metadata),
            ]
        }
        return out
    }

    static func location(_ l: CLLocation, previous: CLLocation?) -> [String: Any] {
        [
            "altitude": l.altitude, "course": l.course, "date": ms(l.timestamp),
            "distance": previous.map { l.distance(from: $0) } ?? NSNull(),
            "horizontalAccuracy": l.horizontalAccuracy, "latitude": l.coordinate.latitude,
            "longitude": l.coordinate.longitude, "speed": l.speed, "speedAccuracy": l.speedAccuracy,
            "verticalAccuracy": l.verticalAccuracy,
        ]
    }

    static func clLocation(_ r: [String: Any]) throws -> CLLocation {
        func n(_ k: String) throws -> Double { try number(r, k) }
        return CLLocation(
            coordinate: CLLocationCoordinate2D(latitude: try n("latitude"), longitude: try n("longitude")),
            altitude: try n("altitude"), horizontalAccuracy: try n("horizontalAccuracy"),
            verticalAccuracy: try n("verticalAccuracy"), course: try n("course"), speed: try n("speed"),
            timestamp: date(try n("date"))
        )
    }

    // MARK: the rest

    static func electrocardiogram(_ e: HKElectrocardiogram, voltages: [[String: Any]]?) -> [String: Any] {
        var out = base(e)
        let classification: String
        switch e.classification {
        case .notSet: classification = "notSet"
        case .sinusRhythm: classification = "sinusRhythm"
        case .atrialFibrillation: classification = "atrialFibrillation"
        case .inconclusiveLowHeartRate: classification = "inconclusiveLowHeartRate"
        case .inconclusiveHighHeartRate: classification = "inconclusiveHighHeartRate"
        case .inconclusivePoorReading: classification = "inconclusivePoorReading"
        case .inconclusiveOther: classification = "inconclusiveOther"
        case .unrecognized: classification = "unrecognized"
        @unknown default: classification = "inconclusiveOther"
        }
        let symptoms: String
        switch e.symptomsStatus {
        case .none: symptoms = "none"
        case .present: symptoms = "present"
        default: symptoms = "notSet"
        }
        out["classification"] = classification
        out["symptomsStatus"] = symptoms
        out["averageHeartRateBpm"] = opt(e.averageHeartRate?.doubleValue(for: HKUnit.count().unitDivided(by: .minute())))
        out["samplingFrequencyHz"] = opt(e.samplingFrequency?.doubleValue(for: .hertz()))
        out["numberOfVoltageMeasurements"] = Double(e.numberOfVoltageMeasurements)
        out["voltages"] = opt(voltages)
        return out
    }

    static func heartbeatSeries(_ s: HKHeartbeatSeriesSample, beats: [[String: Any]]) -> [String: Any] {
        var out = base(s)
        out["heartbeats"] = beats
        return out
    }

    static func activitySummary(_ s: HKActivitySummary) -> [String: Any] {
        let c = s.dateComponents(for: Calendar.current)
        var out: [String: Any] = [
            "dateComponents": [
                "era": opt(c.era.map(Double.init)), "year": opt(c.year.map(Double.init)),
                "month": opt(c.month.map(Double.init)), "day": opt(c.day.map(Double.init)),
            ],
            "activityMoveMode": Double(s.activityMoveMode.rawValue),
            "activeEnergyBurned": quantity(s.activeEnergyBurned, .kilocalorie()),
            "activeEnergyBurnedGoal": quantity(s.activeEnergyBurnedGoal, .kilocalorie()),
            "appleExerciseTime": quantity(s.appleExerciseTime, .minute()),
            "appleExerciseTimeGoal": quantity(s.appleExerciseTimeGoal, .minute()),
            "appleStandHours": quantity(s.appleStandHours, .count()),
            "appleStandHoursGoal": quantity(s.appleStandHoursGoal, .count()),
            "appleMoveTime": quantity(s.appleMoveTime, .minute()),
            "appleMoveTimeGoal": quantity(s.appleMoveTimeGoal, .minute()),
            "isPaused": NSNull(),
        ]
        #if compiler(>=6)
        if #available(iOS 18.0, *) { out["isPaused"] = s.isPaused }
        #endif
        return out
    }

    @available(iOS 18.0, *)
    static func stateOfMind(_ s: HKStateOfMind) -> [String: Any] {
        var out = base(s)
        out["valence"] = s.valence
        out["kind"] = Double(s.kind.rawValue)
        out["valenceClassification"] = Double(s.valenceClassification.rawValue)
        out["associations"] = s.associations.map { Double($0.rawValue) }
        out["labels"] = s.labels.map { Double($0.rawValue) }
        return out
    }

    /// A secure archive of `object`, base64: an anchor or a concept id.
    static func archive(_ object: NSObject & NSSecureCoding) -> String? {
        (try? NSKeyedArchiver.archivedData(withRootObject: object, requiringSecureCoding: true))?.base64EncodedString()
    }

    static func unarchive<T: NSObject & NSSecureCoding>(_ text: String?, as: T.Type) throws -> T? {
        guard let text, !text.isEmpty else { return nil }
        guard let data = Data(base64Encoded: text),
              let object = try? NSKeyedUnarchiver.unarchivedObject(ofClass: T.self, from: data)
        else { throw Failure.type("`anchor` is not one this package answered") }
        return object
    }
}
#endif
