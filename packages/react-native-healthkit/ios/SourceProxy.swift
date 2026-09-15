//
//  SourceProxy.swift
//  Pods
//
//  Created by Robert Herber on 2025-06-16.
//

import HealthKit
import NitroModules
import ReactNativeHealthkitCore

class SourceProxy: HybridSourceProxySpec {
  func toJSON(key: String?) throws -> Source {
    if key != nil && key?.isEmpty != true {
      warnWithPrefix("SourceProxy does not support toJSON with key: \(key!)")
    }

    return serializeSourceStruct(source)
  }

  let source: HKSource

  let name: String

  let bundleIdentifier: String

  init(source: HKSource) {
    self.source = source
    self.name = source.name
    self.bundleIdentifier = source.bundleIdentifier
    // HKSource object with its own name and bundle identifier strings, plus
    // the Swift copies of those strings. Computed once; Nitro reads it on
    // every conversion to JS.
    self.memorySize =
      128
      + 2 * estimateStringMemorySize(source.name)
      + 2 * estimateStringMemorySize(source.bundleIdentifier)
      + nitroHybridObjectOverheadBytes
  }

  /// Estimated heap footprint of the wrapped `HKSource`, reported to Nitro so
  /// the JS garbage collector accounts for the native memory held by each
  /// proxy. Nitro adds the Swift instance's own size on top.
  let memorySize: Int
}
