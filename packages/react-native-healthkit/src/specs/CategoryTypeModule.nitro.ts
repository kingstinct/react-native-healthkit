import type { AnyMap, HybridObject } from "react-native-nitro-modules";

import type { CategoryTypeIdentifier } from "../types/CategoryTypeIdentifier";
import type {
	QueryOptionsWithAnchor,
	QueryOptionsWithSortOrder,
} from "../types/QueryOptions";
import type {
	CategorySample,
	CategoryValueForIdentifier,
	CategorySamplesWithAnchorResponse,
} from "../types/CategoryType";

export interface CategoryTypeModule extends HybridObject<{ ios: "swift" }> {
	saveCategorySample(
		identifier: CategoryTypeIdentifier,
		value: CategoryValueForIdentifier,
		start: Date,
		end: Date,
		metadata: AnyMap,
	): Promise<boolean>;

	queryCategorySamples(
		identifier: CategoryTypeIdentifier,
		options?: QueryOptionsWithSortOrder,
	): Promise<readonly CategorySample[]>;

	queryCategorySamplesWithAnchor(
		identifier: CategoryTypeIdentifier,
		options: QueryOptionsWithAnchor,
	): Promise<CategorySamplesWithAnchorResponse>;
}
