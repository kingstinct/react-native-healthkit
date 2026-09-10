import type { Source } from '../specs/SourceProxy.nitro'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615483-sourcerevision Apple Docs }
 */
export interface SourceRevision {
  readonly source: Source
  readonly version?: string
  readonly operatingSystemVersion: string
  readonly productType?: string
}
