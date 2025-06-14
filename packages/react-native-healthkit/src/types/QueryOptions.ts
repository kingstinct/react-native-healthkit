type PredicateWithUUID = {
	readonly uuid: string;
};

type PredicateWithUUIDs = {
	readonly uuids: readonly string[];
};

type PredicateWithStartAndEnd = {
	readonly startDate?: Date;
	readonly endDate?: Date;
	readonly strictEndDate?: boolean;
	readonly strictStartDate?: boolean;
};

type PredicateWithMetadataKey = {
	readonly withMetadataKey: string;
};

export type FilterForSamplesAnd = {
	AND: PredicateForSamples[];
};

export type FilterForSamplesOr = {
	OR: PredicateForSamples[];
};

export type FilterForSamples =
	| PredicateForSamples
	| FilterForSamplesAnd
	| FilterForSamplesOr;

export type PredicateForSamples =
	| PredicateWithUUID
	| PredicateWithUUIDs
	| PredicateWithMetadataKey
	| PredicateWithStartAndEnd;

/**
 * Generic options for querying.
 */
export interface GenericQueryOptions {
	filter?: FilterForSamples;
	readonly limit?: number;
}

export interface QueryOptionsWithAnchor extends GenericQueryOptions {
	readonly anchor?: string;
}

export interface QueryOptionsWithSortOrder extends GenericQueryOptions {
	readonly ascending?: boolean;
}

export interface QueryOptionsWithSortOrderAndUnit
	extends QueryOptionsWithSortOrder {
	readonly unit?: string;
}

export interface QueryOptionsWithAnchorAndUnit extends QueryOptionsWithAnchor {
	readonly unit?: string;
}
