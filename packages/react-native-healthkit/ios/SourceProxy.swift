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
      print("SourceProxy does not support toJSON with key: \(key!)")
    }

    return Source(
      name: self.name,
      bundleIdentifier: self.bundleIdentifier
    )

  }

  private let source: HKSource

  let name: String

  let bundleIdentifier: String

  init(source: HKSource) {
    self.source = source
    self.name = source.name
    self.bundleIdentifier = source.bundleIdentifier
  }
}
