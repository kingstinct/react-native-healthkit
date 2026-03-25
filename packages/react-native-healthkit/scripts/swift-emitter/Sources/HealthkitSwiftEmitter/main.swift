import Foundation
import SwiftSyntax
import SwiftSyntaxBuilder

enum ObjectType: String, Decodable {
  case common
  case sample
  case categorySample
  case quantitySample
  case workout
  case workoutEvent
}

enum MetadataValueKind: String, Decodable {
  case string
  case boolean
  case number
  case quantity
  case `enum`
}

struct MetadataKeySchema: Decodable {
  let rawKey: String
  let valueKind: MetadataValueKind
  let enumName: String?
  let objectTypes: [ObjectType]
  let identifiers: [String]
}

struct HealthkitSchema: Decodable {
  let metadataKeys: [MetadataKeySchema]
}

func uniqueMetadataKeys(_ keys: [MetadataKeySchema]) -> [MetadataKeySchema] {
  var seen = Set<String>()
  var deduped: [MetadataKeySchema] = []
  for key in keys {
    if seen.insert(key.rawKey).inserted {
      deduped.append(key)
    }
  }
  return deduped
}

func expression(for key: MetadataKeySchema) -> String {
  let rawKeyLiteral = "\"\(key.rawKey)\""
  switch key.valueKind {
  case .string:
    return "\(key.rawKey): metadataString(metadata, key: \(rawKeyLiteral))"
  case .boolean:
    return "\(key.rawKey): metadataBool(metadata, key: \(rawKeyLiteral))"
  case .number:
    return "\(key.rawKey): metadataNumber(metadata, key: \(rawKeyLiteral))"
  case .quantity:
    return "\(key.rawKey): metadataQuantity(metadata, key: \(rawKeyLiteral))"
  case .enum:
    if key.enumName == "WeatherCondition" {
      return "\(key.rawKey): serializeWeatherCondition(metadata?[\(rawKeyLiteral)] as? HKWeatherCondition)"
    }
    if key.enumName == "InsulinDeliveryReason" {
      return "\(key.rawKey): serializeInsulinDeliveryReason(metadata?[\(rawKeyLiteral)] as? HKInsulinDeliveryReason)"
    }
    if key.enumName == "HeartRateMotionContext" {
      return "\(key.rawKey): serializeHeartRateMotionContext(metadata?[\(rawKeyLiteral)] as? HKHeartRateMotionContext)"
    }
    return "\(key.rawKey): metadataEnum(metadata, key: \(rawKeyLiteral), type: \(key.enumName!).self)"
  }
}

func serializerFunction(typeName: String, keys: [MetadataKeySchema]) -> DeclSyntax {
  let args = keys.map { "    \(expression(for: $0))" }.joined(separator: ",\n")
  let checks = keys.map { "result.\($0.rawKey)" }.joined(separator: ", ")
  return DeclSyntax(
    """
    func serialize\(raw: typeName)(metadata: [String: Any]?) -> \(raw: typeName)? {
      let result = \(raw: typeName)(
    \(raw: args)
      )
      return hasKnownTypedMetadata([\(raw: checks)]) ? result : nil
    }
    """
  )
}

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
  fputs("Usage: HealthkitSwiftEmitter <schema-json> <output-swift>\n", stderr)
  exit(1)
}

let schemaPath = arguments[1]
let outputPath = arguments[2]

let decoder = JSONDecoder()
let schema = try decoder.decode(
  HealthkitSchema.self,
  from: Data(contentsOf: URL(fileURLWithPath: schemaPath))
)

let commonKeys = schema.metadataKeys.filter { $0.objectTypes.contains(.common) }
let sampleKeys = schema.metadataKeys.filter { $0.objectTypes.contains(.sample) }
let categoryKeys = schema.metadataKeys.filter { $0.objectTypes.contains(.categorySample) }
let quantityKeys = schema.metadataKeys.filter { $0.objectTypes.contains(.quantitySample) }
let quantityGlobalKeys = quantityKeys.filter { $0.identifiers.isEmpty }
let quantitySpecificKeys = quantityKeys.filter { !$0.identifiers.isEmpty }
let workoutKeys = schema.metadataKeys.filter { $0.objectTypes.contains(.workout) }
let workoutEventKeys = schema.metadataKeys.filter { $0.objectTypes.contains(.workoutEvent) }

let source = SourceFileSyntax {
  DeclSyntax("import Foundation")
  DeclSyntax("import HealthKit")
  DeclSyntax("import NitroModules")
  DeclSyntax(
    """
    func hasKnownTypedMetadata(_ values: [Any?]) -> Bool {
      values.contains { $0 != nil }
    }
    """
  )
  DeclSyntax(
    """
    func metadataString(_ metadata: [String: Any]?, key: String) -> String? {
      metadata?[key] as? String
    }
    """
  )
  DeclSyntax(
    """
    func metadataBool(_ metadata: [String: Any]?, key: String) -> Bool? {
      metadata?[key] as? Bool
    }
    """
  )
  DeclSyntax(
    """
    func metadataNumber(_ metadata: [String: Any]?, key: String) -> Double? {
      if let value = metadata?[key] as? NSNumber {
        return value.doubleValue
      }
      return metadata?[key] as? Double
    }
    """
  )
  DeclSyntax(
    """
    func metadataQuantity(_ metadata: [String: Any]?, key: String) -> Quantity? {
      serializeUnknownQuantityTyped(quantity: metadata?[key] as? HKQuantity)
    }
    """
  )
  DeclSyntax(
    """
    func metadataEnum<T: RawRepresentable>(_ metadata: [String: Any]?, key: String, type: T.Type) -> T?
    where T.RawValue == Int32 {
      guard let value = metadata?[key] as? NSNumber else {
        return nil
      }
      return T(rawValue: value.int32Value)
    }
    """
  )
  serializerFunction(
    typeName: "CategoryTypedMetadata",
    keys: uniqueMetadataKeys(categoryKeys + sampleKeys + commonKeys)
  )
  serializerFunction(
    typeName: "QuantityTypedMetadata",
    keys: uniqueMetadataKeys(quantityGlobalKeys + quantitySpecificKeys + sampleKeys + commonKeys)
  )
  serializerFunction(
    typeName: "WorkoutTypedMetadata",
    keys: uniqueMetadataKeys(workoutKeys + sampleKeys + commonKeys)
  )
  serializerFunction(
    typeName: "WorkoutEventTypedMetadata",
    keys: uniqueMetadataKeys(workoutEventKeys)
  )
}

try source.description.write(
  to: URL(fileURLWithPath: outputPath),
  atomically: true,
  encoding: .utf8
)
