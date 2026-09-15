//
//  Anchors.swift
//  ReactNativeHealthkitCore
//
//  HKQueryAnchor (and other NSSecureCoding objects) travel to JS as base64
//  keyed-archive strings.
//

import Foundation
import HealthKit

public func toBase64(_ data: Any?) -> String? {
  guard let data = data,
    let archivedData = try? NSKeyedArchiver.archivedData(
      withRootObject: data, requiringSecureCoding: true)
  else {
    return nil
  }

  return archivedData.base64EncodedString()
}

public func fromBase64(base64String: String?) throws -> Any? {
  guard let base64String = base64String, !base64String.isEmpty else {
    return nil
  }

  guard let data = Data(base64Encoded: base64String) else {
    throw makeRuntimeError("Invalid base64 string: \(base64String)")
  }

  do {
    let unarchiver = try NSKeyedUnarchiver(forReadingFrom: data)
    unarchiver.requiresSecureCoding = true
    return try? NSKeyedUnarchiver.unarchiveTopLevelObjectWithData(data)
  } catch {
    throw makeRuntimeError("Error recreating archived object: \(error.localizedDescription)")
  }
}

public func serializeAnchor(anchor: HKQueryAnchor?) -> String? {
  return toBase64(anchor)
}

public func deserializeHKQueryAnchor(base64String: String?) throws -> HKQueryAnchor? {
  return try fromBase64(base64String: base64String) as? HKQueryAnchor
}
