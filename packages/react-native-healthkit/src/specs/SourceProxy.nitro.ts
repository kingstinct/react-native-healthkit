import type { Source } from '@react-native-healthkit/core'
import type { HybridObject } from 'react-native-nitro-modules'

export type { Source }

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615781-source Apple Docs }
 */
export interface SourceProxy extends HybridObject<{ ios: 'swift' }>, Source {
  toJSON(key?: string): Source
}
