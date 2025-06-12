import { Platform } from "react-native";

import {
	HKAuthorizationRequestStatus,
	HKAuthorizationStatus,
	HKBiologicalSex,
	HKBloodType,
	HKFitzpatrickSkinType,
	HKUnits,
	HKWheelchairUse,
} from "./native-types";

import type ReactNativeHealthkit from "./index.ios";
import type { QueryCategorySamplesFn } from "./utils/queryCategorySamples";
import type { QueryQuantitySamplesFn } from "./utils/queryQuantitySamples";

const notAvailableError = `[@kingstinct/react-native-healthkit] Platform "${
	Platform.OS
}" not supported`;

let hasWarned = false;

function UnavailableFn<T = unknown>(retVal: T) {
	return () => {
		if (!hasWarned) {
			// eslint-disable-next-line no-console
			console.warn(notAvailableError);
			hasWarned = true;
		}
		return retVal;
	};
}

const authorizationStatusFor = UnavailableFn(
	Promise.resolve(HKAuthorizationStatus.notDetermined),
);
const availableQuantityTypes = UnavailableFn([]);
const disableAllBackgroundDelivery = UnavailableFn(Promise.resolve(false));
const disableBackgroundDelivery = UnavailableFn(Promise.resolve(false));
const enableBackgroundDelivery = UnavailableFn(Promise.resolve(false));
const getBiologicalSex = UnavailableFn(Promise.resolve(HKBiologicalSex.notSet));
const getBloodType = UnavailableFn(Promise.resolve(HKBloodType.notSet));
const getDateOfBirth = UnavailableFn(Promise.resolve(new Date(0)));
const getFitzpatrickSkinType = UnavailableFn(
	Promise.resolve(HKFitzpatrickSkinType.notSet),
);
const getMostRecentCategorySample = UnavailableFn(Promise.resolve(null));
const getMostRecentQuantitySample = UnavailableFn(Promise.resolve(null));
const getMostRecentWorkout = UnavailableFn(Promise.resolve(null));
const getPreferredUnit = UnavailableFn(Promise.resolve(HKUnits.Count));
const getPreferredUnits = UnavailableFn(Promise.resolve([]));
const getRequestStatusForAuthorization = UnavailableFn(
	Promise.resolve(HKAuthorizationRequestStatus.unknown),
);
const getWheelchairUse = UnavailableFn(Promise.resolve(HKWheelchairUse.notSet));
const getWorkoutRoutes = UnavailableFn(Promise.resolve([]));
const isHealthDataAvailable = async () => Promise.resolve(false);
const useSources = UnavailableFn(null);
const useStatisticsForQuantity = UnavailableFn(null);
const queryCategorySamples = UnavailableFn(
	Promise.resolve([]),
) as unknown as QueryCategorySamplesFn;
const queryCategorySamplesWithAnchor = UnavailableFn(
	Promise.resolve({
		samples: [],
		deletedSamples: [],
		newAnchor: "",
	}),
);
const queryCorrelationSamples = UnavailableFn(Promise.resolve([]));
const queryHeartbeatSeriesSamples = UnavailableFn(Promise.resolve([]));
const queryHeartbeatSeriesSamplesWithAnchor = UnavailableFn(
	Promise.resolve({
		samples: [],
		deletedSamples: [],
		newAnchor: "",
	}),
);
const queryQuantitySamples = UnavailableFn(
	Promise.resolve([]),
) as unknown as QueryQuantitySamplesFn;
const queryQuantitySamplesWithAnchor = UnavailableFn(
	Promise.resolve({
		samples: [],
		deletedSamples: [],
		newAnchor: "",
	}),
);
const queryStatisticsForQuantity = UnavailableFn(
	Promise.resolve({
		averageQuantity: undefined,
		maximumQuantity: undefined,
		minimumQuantity: undefined,
		sumQuantity: undefined,
		mostRecentQuantity: undefined,
		mostRecentQuantityDateInterval: undefined,
		duration: undefined,
	}),
);
const queryStatisticsCollectionForQuantity = UnavailableFn(
	Promise.resolve([
		{
			averageQuantity: undefined,
			maximumQuantity: undefined,
			minimumQuantity: undefined,
			sumQuantity: undefined,
			mostRecentQuantity: undefined,
			mostRecentQuantityDateInterval: undefined,
			duration: undefined,
		},
	]),
);
const queryWorkouts = UnavailableFn(Promise.resolve([]));
const queryWorkoutSamples = UnavailableFn(Promise.resolve([]));
const queryWorkoutSamplesWithAnchor = UnavailableFn(
	Promise.resolve({
		samples: [],
		deletedSamples: [],
		newAnchor: "",
	}),
);
const querySources = UnavailableFn(Promise.resolve([]));
const requestAuthorization = UnavailableFn(Promise.resolve(false));
const deleteQuantitySample = UnavailableFn(Promise.resolve(false));
const deleteSamples = UnavailableFn(Promise.resolve(false));
const deleteWorkoutSample = UnavailableFn(Promise.resolve(false));
const getWorkoutPlanById = UnavailableFn(Promise.resolve(null));
const saveCategorySample = UnavailableFn(Promise.resolve(false));
const saveStateOfMindSample = UnavailableFn(Promise.resolve(false));
const saveCorrelationSample = UnavailableFn(Promise.resolve(false));
const saveQuantitySample = UnavailableFn(Promise.resolve(false));
const saveWorkoutSample = UnavailableFn(Promise.resolve(null));
const saveWorkoutRoute = UnavailableFn(Promise.resolve(false));
const subscribeToChanges = UnavailableFn(
	Promise.resolve(async () => Promise.resolve(false)),
);
const startWatchApp = UnavailableFn(async () => Promise.resolve(false));
const workoutSessionMirroringStartHandler = UnavailableFn(
	Promise.resolve(false),
);
const useMostRecentCategorySample = UnavailableFn(null);
const useMostRecentQuantitySample = UnavailableFn(null);
const useMostRecentWorkout = UnavailableFn(null);
const useSubscribeToChanges = UnavailableFn([null, () => null]);
const useHealthkitAuthorization = UnavailableFn([
	null,
	async () => Promise.resolve(HKAuthorizationRequestStatus.unknown),
] as const);
const useIsHealthDataAvailable = () => false;
const isProtectedDataAvailable = async () => Promise.resolve(false);
const queryStateOfMindSamples = UnavailableFn(Promise.resolve([]));

const Healthkit: typeof ReactNativeHealthkit = {
	authorizationStatusFor,
	availableQuantityTypes,
	deleteQuantitySample,
	deleteSamples,
	deleteWorkoutSample,
	disableAllBackgroundDelivery,
	disableBackgroundDelivery,
	enableBackgroundDelivery,
	getBiologicalSex,
	getBloodType,
	getDateOfBirth,
	getFitzpatrickSkinType,
	getMostRecentCategorySample,
	getMostRecentQuantitySample,
	getMostRecentWorkout,
	getPreferredUnit,
	getPreferredUnits,
	getRequestStatusForAuthorization,
	getWheelchairUse,
	getWorkoutPlanById,
	getWorkoutRoutes,
	isHealthDataAvailable,
	isProtectedDataAvailable,
	queryCategorySamples,
	queryCategorySamplesWithAnchor,
	queryCorrelationSamples,
	queryHeartbeatSeriesSamples,
	queryHeartbeatSeriesSamplesWithAnchor,
	queryQuantitySamples,
	queryQuantitySamplesWithAnchor,
	querySources,
	queryStatisticsForQuantity,
	queryStatisticsCollectionForQuantity,
	queryWorkouts,
	queryWorkoutSamples,
	queryWorkoutSamplesWithAnchor,
	requestAuthorization,
	saveStateOfMindSample,
	saveCategorySample,
	saveCorrelationSample,
	saveQuantitySample,
	saveWorkoutRoute,
	saveWorkoutSample,
	subscribeToChanges,
	startWatchApp,
	workoutSessionMirroringStartHandler,
	queryStateOfMindSamples,
};

export {
	authorizationStatusFor,
	availableQuantityTypes,
	deleteQuantitySample,
	deleteSamples,
	deleteWorkoutSample,
	disableAllBackgroundDelivery,
	disableBackgroundDelivery,
	enableBackgroundDelivery,
	getBiologicalSex,
	getBloodType,
	getDateOfBirth,
	getFitzpatrickSkinType,
	getMostRecentCategorySample,
	getMostRecentQuantitySample,
	getMostRecentWorkout,
	getPreferredUnit,
	getPreferredUnits,
	getRequestStatusForAuthorization,
	getWheelchairUse,
	getWorkoutPlanById,
	getWorkoutRoutes,
	isHealthDataAvailable,
	isProtectedDataAvailable,
	queryCategorySamples,
	queryCategorySamplesWithAnchor,
	queryCorrelationSamples,
	queryHeartbeatSeriesSamples,
	queryHeartbeatSeriesSamplesWithAnchor,
	queryQuantitySamples,
	queryQuantitySamplesWithAnchor,
	querySources,
	queryStatisticsForQuantity,
	queryStatisticsCollectionForQuantity,
	queryWorkouts,
	queryWorkoutSamples,
	queryWorkoutSamplesWithAnchor,
	requestAuthorization,
	saveCategorySample,
	saveStateOfMindSample,
	saveCorrelationSample,
	saveQuantitySample,
	saveWorkoutRoute,
	saveWorkoutSample,
	subscribeToChanges,
	startWatchApp,
	workoutSessionMirroringStartHandler,
	useHealthkitAuthorization,
	useIsHealthDataAvailable,
	useMostRecentCategorySample,
	useMostRecentQuantitySample,
	useMostRecentWorkout,
	useSources,
	useStatisticsForQuantity,
	useSubscribeToChanges,
	queryStateOfMindSamples,
};

export * from "./types";

export default Healthkit;
