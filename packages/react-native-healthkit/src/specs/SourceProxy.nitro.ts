import type { HybridObject } from 'react-native-nitro-modules'

interface Source {
  readonly name: string
  readonly bundleIdentifier: string
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615781-source Apple Docs }
 */
export interface SourceProxy extends HybridObject<{ ios: 'swift' }>, Source {
  toJSON(key?: string): Source
}
