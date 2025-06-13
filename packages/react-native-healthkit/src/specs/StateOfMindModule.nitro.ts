import type { HybridObject } from "react-native-nitro-modules";
import type { QueryOptionsWithSortOrder } from "../types/QueryOptions";
import type { StateOfMindSample } from "../types/StateOfMind";

export interface StateOfMindModule extends HybridObject<{ ios: "swift" }> {
	queryStateOfMindSamples(
		options?: QueryOptionsWithSortOrder,
	): Promise<readonly StateOfMindSample[]>;
}
