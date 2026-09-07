//
//  SourceProxy.swift
//  Pods
//
//  Created by Robert Herber on 2025-06-16.
//

import HealthKit
import NitroModules

class SourceProxy: HybridSourceProxySpec {
  func toJSON(key: String?) throws -> Source {
    if key != nil && key?.isEmpty != true {
      warnWithPrefix("SourceProxy does not support toJSON with key: \(key!)")
    }

    return Source(
      name: self.name,
      bundleIdentifier: self.bundleIdentifier
    )

  }

  let source: HKSource

  let name: String

  let bundleIdentifier: String

  init(source: HKSource) {
    self.source = source
    self.name = source.name
    self.bundleIdentifier = source.bundleIdentifier
  }

  /// Estimated heap footprint of the wrapped `HKSource` plus the two cached
  /// strings, reported to Nitro so the JS garbage collector accounts for the
  /// native memory held by each proxy. Nitro adds the instance's own size.
  var memorySize: Int {
    // HKSource object with its own name and bundle identifier strings, the
    // Swift copies of those strings, and Nitro's bridging overhead.
    return 128
      + 2 * estimateStringMemorySize(name)
      + 2 * estimateStringMemorySize(bundleIdentifier)
      + nitroHybridObjectOverheadBytes
  }
}
