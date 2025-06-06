
/**
 * Generic options for querying.
 */
export interface GenericQueryOptions {
  readonly from?: Date;
  readonly to?: Date;
  readonly limit?: number;
};

export interface QueryOptionsWithAnchor extends GenericQueryOptions {
    readonly anchor?: string;
}

export interface QueryOptionsWithSortOrder extends GenericQueryOptions {
    readonly ascending?: boolean;
}

export interface QueryOptionsWithSortOrderAndUnit extends QueryOptionsWithSortOrder {
    readonly unit?: string;
}

export interface QueryOptionsWithAnchorAndUnit extends QueryOptionsWithAnchor {
    readonly unit?: string;
}
