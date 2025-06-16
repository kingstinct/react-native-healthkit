import type { SourceProxy } from '../specs/SourceProxy.nitro'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615483-sourcerevision Apple Docs }
 */
export interface SourceRevision {
  readonly source?: SourceProxy
  readonly version?: string
  readonly operatingSystemVersion?: string | null
  readonly productType?: string | null
}
