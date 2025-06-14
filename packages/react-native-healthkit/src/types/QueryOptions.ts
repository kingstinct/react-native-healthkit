type PredicateWithUUID = {
	readonly uuid: string;
};

type PredicateWithUUIDs = {
	readonly uuids: readonly string[];
};

type PredicateWithStartAndEnd = {
	readonly withStart?: Date;
	readonly end?: Date;
	readonly strictEndDate?: boolean;
	readonly strictStartDate?: boolean;
};

type PredicateWithMetadataKey = {
	readonly withMetadataKey: string;
};

export type PredicateForSamples =
	| PredicateWithUUID
	| PredicateWithUUIDs
	| PredicateWithMetadataKey
	| PredicateWithStartAndEnd;

/**
 * Generic options for querying.
 */
export interface GenericQueryOptions {
	filter?: PredicateForSamples;
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
