import { Core } from "..";
import type { SampleTypeIdentifier } from "../types/Shared";
import type { OnChangeCallbackArgs } from "../types/Subscriptons";

export const subscribeToChanges = (
	identifier: SampleTypeIdentifier,
	callback: (args: OnChangeCallbackArgs) => void,
) => {
	const queryId = Core.subscribeToObserverQuery(identifier, callback);

	return {
		remove: () => Core.unsubscribeQuery(queryId),
	};
};
