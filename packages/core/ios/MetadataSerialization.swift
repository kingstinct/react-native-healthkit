//
//  MetadataSerialization.swift
//  ReactNativeHealthkitCore
//
//  Converts HealthKit metadata dictionaries into the Nitro AnyMap that crosses
//  the bridge.
//

import Foundation
import HealthKit
import NitroModules

private let metadataDateFormatter: ISO8601DateFormatter = {
  let formatter = ISO8601DateFormatter()
  formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
  return formatter
}()

/// Package-specific knowledge about metadata values.
public struct MetadataSerializationOptions {
  /// NSNumber values under these keys are booleans even when stored as 0/1.
  public var isBooleanKey: (String) -> Bool
  /// NSNumber values under these keys are numbers even when stored as CFBoolean.
  public var isNumericKey: (String) -> Bool
  /// How to represent an `HKQuantity` value; nil drops the key.
  public var serializeQuantity: (HKQuantity) -> AnyValue?

  public init(
    isBooleanKey: @escaping (String) -> Bool = { _ in false },
    isNumericKey: @escaping (String) -> Bool = { _ in false },
    serializeQuantity: @escaping (HKQuantity) -> AnyValue? = { .string($0.description) }
  ) {
    self.isBooleanKey = isBooleanKey
    self.isNumericKey = isNumericKey
    self.serializeQuantity = serializeQuantity
  }

  public static let `default` = MetadataSerializationOptions()
}

public func serializeMetadata(
  _ metadata: [String: Any]?, options: MetadataSerializationOptions
) -> AnyMap {
  let serialized = AnyMap()
  guard let metadata = metadata else {
    return serialized
  }

  for (key, value) in metadata {
    if let number = value as? NSNumber {
      if options.isBooleanKey(key) {
        serialized.setBoolean(key: key, value: number.boolValue)
      } else if options.isNumericKey(key) {
        serialized.setDouble(key: key, value: number.doubleValue)
      } else if CFGetTypeID(number) == CFBooleanGetTypeID() {
        serialized.setBoolean(key: key, value: number.boolValue)
      } else {
        serialized.setDouble(key: key, value: number.doubleValue)
      }
      continue
    }

    if let string = value as? String {
      serialized.setString(key: key, value: string)
      continue
    }

    if let date = value as? Date {
      serialized.setString(key: key, value: metadataDateFormatter.string(from: date))
      continue
    }

    if let quantity = value as? HKQuantity {
      if let quantityValue = options.serializeQuantity(quantity) {
        setAnyValue(serialized, key: key, value: quantityValue)
      }
      continue
    }

    if let dict = value as? [String: AnyValue] {
      serialized.setObject(key: key, value: dict)
      continue
    }

    logWarningOnce(
      key: "serializeMetadata.unsupported.\(key)",
      """
      serializeMetadata: dropping metadata key \(key), unsupported value type \
      \(Swift.type(of: value)). Further samples carrying this key are dropped silently.
      """)
  }

  return serialized
}

private func setAnyValue(_ map: AnyMap, key: String, value: AnyValue) {
  switch value {
  case .null:
    map.setNull(key: key)
  case .number(let number):
    map.setDouble(key: key, value: number)
  case .bool(let bool):
    map.setBoolean(key: key, value: bool)
  case .int64(let int64):
    map.setInt64(key: key, value: int64)
  case .string(let string):
    map.setString(key: key, value: string)
  case .array(let array):
    map.setArray(key: key, value: array)
  case .object(let object):
    map.setObject(key: key, value: object)
  }
}

public func serializeOperatingSystemVersion(_ version: OperatingSystemVersion) -> String {
  return "\(version.majorVersion).\(version.minorVersion).\(version.patchVersion)"
}
