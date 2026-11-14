// Unit strings, checked before HealthKit sees them. `HKUnit(from:)` raises an
// Objective-C exception for a string it cannot parse, which Swift cannot
// catch, and a package is Swift alone: so a string is parsed here first, its
// every atom one HealthKit itself writes (the units its factories make, with
// each metric prefix), and refused when it is not.
import Foundation
import HealthKit

#if os(iOS)
enum Units {
    /// Every atom HealthKit writes in a unit string.
    static let atoms: Set<String> = {
        var out = Set<String>()
        let prefixes: [HKMetricPrefix] = [
            .none, .pico, .nano, .micro, .milli, .centi, .deci, .deca, .hecto, .kilo, .mega, .giga, .tera,
        ]
        var prefixed: [(HKMetricPrefix) -> HKUnit] = [
            HKUnit.gramUnit(with:), HKUnit.meterUnit(with:), HKUnit.literUnit(with:), HKUnit.pascalUnit(with:),
            HKUnit.secondUnit(with:), HKUnit.jouleUnit(with:), HKUnit.siemenUnit(with:), HKUnit.voltUnit(with:),
            HKUnit.hertzUnit(with:), HKUnit.wattUnit(with:),
        ]
        if #available(iOS 17.0, *) { prefixed.append(HKUnit.luxUnit(with:)) }
        for make in prefixed {
            for p in prefixes { out.insert(make(p).unitString) }
        }
        var plain: [HKUnit] = [
            .ounce(), .pound(), .stone(), .inch(), .foot(), .yard(), .mile(), .fluidOunceUS(), .fluidOunceImperial(),
            .pintUS(), .pintImperial(), .cupUS(), .cupImperial(), .millimeterOfMercury(), .centimeterOfWater(),
            .atmosphere(), .decibelAWeightedSoundPressureLevel(), .inchesOfMercury(), .minute(), .hour(), .day(),
            .kilocalorie(), .smallCalorie(), .largeCalorie(), .degreeCelsius(), .degreeFahrenheit(), .kelvin(),
            .count(), .percent(), .decibelHearingLevel(), .internationalUnit(), .degreeAngle(), .radianAngle(),
            .diopter(), .prismDiopter(),
        ]
        #if compiler(>=6)
        if #available(iOS 18.0, *) { plain.append(.appleEffortScore()) }
        #endif
        for unit in plain { out.insert(unit.unitString) }
        // The calorie's spellings HealthKit reads besides the ones it writes.
        out.formUnion(["cal", "Cal", "kcal"])
        return out
    }()

    /// The mole with a prefix and a molar mass: `mmol<180.1558800000541>`.
    private static let molePrefixes: Set<String> = ["", "p", "n", "mc", "m", "c", "d", "da", "h", "k", "M", "G", "T"]

    private static func isAtom(_ atom: String) -> Bool {
        if atoms.contains(atom) { return true }
        guard let open = atom.firstIndex(of: "<"), atom.hasSuffix(">") else { return false }
        let head = atom[..<open], mass = atom[atom.index(after: open)..<atom.index(before: atom.endIndex)]
        guard head.hasSuffix("mol"), molePrefixes.contains(String(head.dropLast(3))) else { return false }
        return Double(mass).map { $0 > 0 } ?? false
    }

    /// Whether `text` parses: atoms, each with an optional integer exponent
    /// (`^2`, `^-1`), joined by `/`, `*` or `·`, in balanced parentheses.
    static func isValid(_ text: String) -> Bool {
        let s = Array(text.replacingOccurrences(of: " ", with: ""))
        guard !s.isEmpty else { return false }
        var depth = 0, i = 0, expectAtom = true
        let operators: Set<Character> = ["/", "*", "·"]
        while i < s.count {
            let c = s[i]
            if c == "(" {
                guard expectAtom else { return false }
                depth += 1
                i += 1
                continue
            }
            if c == ")" {
                guard !expectAtom, depth > 0 else { return false }
                depth -= 1
                i += 1
                if i < s.count, s[i] == "^", let next = exponent(s, from: i) { i = next }
                continue
            }
            if operators.contains(c) {
                guard !expectAtom else { return false }
                expectAtom = true
                i += 1
                continue
            }
            guard expectAtom else { return false }
            var atom = ""
            var inMass = false
            while i < s.count {
                let d = s[i]
                if d == "<" { inMass = true }
                if d == ">" { inMass = false; atom.append(d); i += 1; continue }
                if !inMass && (operators.contains(d) || d == "(" || d == ")" || d == "^") { break }
                atom.append(d)
                i += 1
            }
            guard isAtom(atom) else { return false }
            if i < s.count, s[i] == "^" {
                guard let next = exponent(s, from: i) else { return false }
                i = next
            }
            expectAtom = false
        }
        return depth == 0 && !expectAtom
    }

    /// The index after `^n` at `from`, or nil.
    private static func exponent(_ s: [Character], from: Int) -> Int? {
        var i = from + 1
        if i < s.count, s[i] == "-" { i += 1 }
        let start = i
        while i < s.count, s[i].isNumber { i += 1 }
        return i > start ? i : nil
    }

    /// The unit `text` names, or nil where HealthKit could not parse it.
    static func parse(_ text: String) -> HKUnit? {
        isValid(text) ? HKUnit(from: text) : nil
    }

    static let speed = HKUnit(from: "m/s")
    static let met = HKUnit(from: "kcal/hr·kg")
    static let vo2Max = HKUnit(from: "ml/(kg*min)")

    /// A unit for a quantity of no known type (metadata, workout events):
    /// the first common one it is compatible with, as react-native-healthkit picks.
    static func guess(_ q: HKQuantity) -> HKUnit? {
        var candidates: [HKUnit] = [
            .percent(), .second(), .kilocalorie(), .count(), HKUnit(from: "count/min"), HKUnit(from: "count/s"),
            .meter(), .degreeCelsius(), .atmosphere(), .gram(), .liter(), .volt(), .hertz(),
            .decibelAWeightedSoundPressureLevel(), speed, met, vo2Max, .internationalUnit(), .decibelHearingLevel(),
            .watt(), .degreeAngle(),
        ]
        if #available(iOS 17.0, *) { candidates.append(.lux()) }
        #if compiler(>=6)
        if #available(iOS 18.0, *) { candidates.append(.appleEffortScore()) }
        #endif
        return candidates.first { q.is(compatibleWith: $0) }
    }
}
#endif
