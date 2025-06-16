//
//  SourceProxy.swift
//  Pods
//
//  Created by Robert Herber on 2025-06-16.
//

import HealthKit
import NitroModules

class SourceProxy : HybridSourceProxySpec {
  func toJSON() throws -> Source {
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
}
