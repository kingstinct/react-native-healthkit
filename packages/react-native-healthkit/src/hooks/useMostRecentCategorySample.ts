import { useCallback, useState } from "react";

import useSubscribeToChanges from "./useSubscribeToChanges";
import getMostRecentCategorySample from "../utils/getMostRecentCategorySample";
import type { CategoryTypeIdentifier } from "../types/CategoryTypeIdentifier";
import type { CategorySampleTyped } from "../types/CategoryType";

/**
 * @returns the most recent sample for the given category type.
 */
export function useMostRecentCategorySample<T extends CategoryTypeIdentifier>(
	identifier: T,
) {
	const [category, setCategory] = useState<CategorySampleTyped<T>>();

	const updater = useCallback(() => {
		void getMostRecentCategorySample(identifier).then(setCategory);
	}, [identifier]);

	useSubscribeToChanges(identifier, updater);

	return category;
}

export default useMostRecentCategorySample;
