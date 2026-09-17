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

/// Decodes a base64 keyed archive back into `type`.
///
/// Every failure throws. Returning nil for an archive that does not decode --
/// which an earlier version of this helper did -- is dangerous for the callers
/// here: a nil anchor makes an anchored query run unanchored and hand back the
/// entire data set as if it were new, so a sync client silently re-ingests
/// everything instead of seeing an error.
public func fromBase64<T: NSObject & NSSecureCoding>(
  base64String: String?, as type: T.Type
) throws -> T? {
  guard let base64String = base64String, !base64String.isEmpty else {
    return nil
  }

  guard let data = Data(base64Encoded: base64String) else {
    throw makeRuntimeError("Invalid base64 string: \(base64String)")
  }

  let decoded: T?
  do {
    decoded = try NSKeyedUnarchiver.unarchivedObject(ofClass: type, from: data)
  } catch {
    throw makeRuntimeError("Error recreating \(type) object: \(error.localizedDescription)")
  }

  guard let decoded = decoded else {
    throw makeRuntimeError("Error recreating \(type) object: archive held a different type")
  }

  return decoded
}

public func serializeAnchor(anchor: HKQueryAnchor?) -> String? {
  return toBase64(anchor)
}

public func deserializeHKQueryAnchor(base64String: String?) throws -> HKQueryAnchor? {
  return try fromBase64(base64String: base64String, as: HKQueryAnchor.self)
}
