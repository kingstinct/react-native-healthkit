/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615781-source Apple Docs }
 */
export interface Source {
	readonly name: string;
	readonly bundleIdentifier: string;
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkobject/1615483-sourcerevision Apple Docs }
 */
export interface SourceRevision {
	readonly source?: Source;
	readonly version?: string;
	readonly operatingSystemVersion?: string | null;
	readonly productType?: string | null;
}
