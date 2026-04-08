import { Platform } from 'react-native'
import useHealthkitAuthorization from './hooks/useHealthkitAuthorization'
import { useIsHealthDataAvailable } from './hooks/useIsHealthDataAvailable'
import useMostRecentCategorySample from './hooks/useMostRecentCategorySample'
import useMostRecentQuantitySample from './hooks/useMostRecentQuantitySample'
import useMostRecentWorkout from './hooks/useMostRecentWorkout'
import useSources from './hooks/useSources'
import useStatisticsForQuantity from './hooks/useStatisticsForQuantity'
import useSubscribeToCategorySamples from './hooks/useSubscribeToCategorySamples'
import useSubscribeToChanges from './hooks/useSubscribeToChanges'
import useSubscribeToQuantitySamples from './hooks/useSubscribeToQuantitySamples'
import {
  CategoryTypes,
  Characteristics,
  Core,
  CorrelationTypes,
  Electrocardiograms,
  HeartbeatSeries,
  Medication,
  QuantityTypes,
  StateOfMind,
  Workouts,
} from './modules'
import type {
  CorrelationSampleTyped,
  QueryCorrelationSamplesWithAnchorResponseTyped,
} from './types/CorrelationType'
import type {
  ElectrocardiogramSamplesWithAnchorResponseTyped,
  ElectrocardiogramSampleTyped,
} from './types/ElectrocardiogramSample'
import type {
  HeartbeatSeriesSamplesWithAnchorResponseTyped,
  HeartbeatSeriesSampleTyped,
} from './types/HeartbeatSeries'
import type {
  MedicationDoseEventsWithAnchorResponseTyped,
  MedicationDoseEventTyped,
} from './types/Medication'
import type { QuantityTypeIdentifier } from './types/QuantityTypeIdentifier'
import type {
  StateOfMindSamplesWithAnchorResponseTyped,
  StateOfMindSampleTyped,
} from './types/StateOfMind'
import type {
  QueryWorkoutSamplesWithAnchorResponseTyped,
  WorkoutProxyTyped,
} from './types/Workouts'
import getMostRecentCategorySample from './utils/getMostRecentCategorySample'
import getMostRecentQuantitySample from './utils/getMostRecentQuantitySample'
import getMostRecentWorkout from './utils/getMostRecentWorkout'
import getPreferredUnit from './utils/getPreferredUnit'
import { subscribeToCategorySamples } from './utils/subscribeToCategorySamples'
import { subscribeToChanges } from './utils/subscribeToChanges'
import { subscribeToQuantitySamples } from './utils/subscribeToQuantitySamples'

export * from './types'

const currentMajorVersionIOS =
  Platform.OS === 'ios' ? Number.parseInt(Platform.Version, 10) : 0

/**
 * Quantity types that are not available before iOS 17
 */
type QuantityTypesIOS17Plus =
  | 'HKQuantityTypeIdentifierCyclingCadence'
  | 'HKQuantityTypeIdentifierCyclingFunctionalThresholdPower'
  | 'HKQuantityTypeIdentifierCyclingPower'
  | 'HKQuantityTypeIdentifierCyclingSpeed'
  | 'HKQuantityTypeIdentifierPhysicalEffort'
  | 'HKQuantityTypeIdentifierTimeInDaylight'

/**
 * Available quantity types for iOS versions before iOS 17
 */
export type AvailableQuantityTypesBeforeIOS17 = Exclude<
  QuantityTypeIdentifier,
  QuantityTypesIOS17Plus
>

export {
  getMostRecentCategorySample,
  getMostRecentQuantitySample,
  getMostRecentWorkout,
  getPreferredUnit,
  subscribeToCategorySamples,
  subscribeToChanges,
  subscribeToQuantitySamples,
  useHealthkitAuthorization,
  useIsHealthDataAvailable,
  useMostRecentCategorySample,
  useMostRecentQuantitySample,
  useMostRecentWorkout,
  useSources,
  useStatisticsForQuantity,
  useSubscribeToCategorySamples,
  useSubscribeToChanges,
  useSubscribeToQuantitySamples,
}

/**
 * Available quantity types for iOS 17 and later (all quantity types)
 */
export type AvailableQuantityTypesIOS17Plus = QuantityTypeIdentifier

/**
 * Get available quantity types based on iOS version
 * @param majorVersionIOS - iOS major version number (defaults to current iOS version)
 * @returns Available quantity types for the given iOS version
 */
export type AvailableQuantityTypes<
  T extends number = typeof currentMajorVersionIOS,
> = T extends 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25
  ? AvailableQuantityTypesIOS17Plus
  : AvailableQuantityTypesBeforeIOS17

type BoundMethod<
  TMethod,
  TReturn = TMethod extends (...args: infer _Args) => infer TResult
    ? TResult
    : never,
> = (
  ...args: TMethod extends (...args: infer TArgs) => unknown ? TArgs : never
) => TReturn

function bindRetypedMethod<TModule, TMethod, TReturn>(
  module: TModule,
  method: TMethod,
): BoundMethod<TMethod, TReturn> {
  return (
    method as TMethod extends (...args: infer TArgs) => infer TResult
      ? (...args: TArgs) => TResult
      : never
  ).bind(module) as BoundMethod<TMethod, TReturn>
}

const CorrelationTypeBindings = {
  queryCorrelationSamples: bindRetypedMethod<
    typeof CorrelationTypes,
    typeof CorrelationTypes.queryCorrelationSamples,
    Promise<readonly CorrelationSampleTyped[]>
  >(CorrelationTypes, CorrelationTypes.queryCorrelationSamples),
  queryCorrelationSamplesWithAnchor: bindRetypedMethod<
    typeof CorrelationTypes,
    typeof CorrelationTypes.queryCorrelationSamplesWithAnchor,
    Promise<QueryCorrelationSamplesWithAnchorResponseTyped>
  >(CorrelationTypes, CorrelationTypes.queryCorrelationSamplesWithAnchor),
  saveCorrelationSample: bindRetypedMethod<
    typeof CorrelationTypes,
    typeof CorrelationTypes.saveCorrelationSample,
    Promise<CorrelationSampleTyped | undefined>
  >(CorrelationTypes, CorrelationTypes.saveCorrelationSample),
} satisfies {
  queryCorrelationSamples: BoundMethod<
    typeof CorrelationTypes.queryCorrelationSamples,
    Promise<readonly CorrelationSampleTyped[]>
  >
  queryCorrelationSamplesWithAnchor: BoundMethod<
    typeof CorrelationTypes.queryCorrelationSamplesWithAnchor,
    Promise<QueryCorrelationSamplesWithAnchorResponseTyped>
  >
  saveCorrelationSample: BoundMethod<
    typeof CorrelationTypes.saveCorrelationSample,
    Promise<CorrelationSampleTyped | undefined>
  >
}

const HeartbeatSeriesBindings = {
  queryHeartbeatSeriesSamples: bindRetypedMethod<
    typeof HeartbeatSeries,
    typeof HeartbeatSeries.queryHeartbeatSeriesSamples,
    Promise<readonly HeartbeatSeriesSampleTyped[]>
  >(HeartbeatSeries, HeartbeatSeries.queryHeartbeatSeriesSamples),
  queryHeartbeatSeriesSamplesWithAnchor: bindRetypedMethod<
    typeof HeartbeatSeries,
    typeof HeartbeatSeries.queryHeartbeatSeriesSamplesWithAnchor,
    Promise<HeartbeatSeriesSamplesWithAnchorResponseTyped>
  >(HeartbeatSeries, HeartbeatSeries.queryHeartbeatSeriesSamplesWithAnchor),
} satisfies {
  queryHeartbeatSeriesSamples: BoundMethod<
    typeof HeartbeatSeries.queryHeartbeatSeriesSamples,
    Promise<readonly HeartbeatSeriesSampleTyped[]>
  >
  queryHeartbeatSeriesSamplesWithAnchor: BoundMethod<
    typeof HeartbeatSeries.queryHeartbeatSeriesSamplesWithAnchor,
    Promise<HeartbeatSeriesSamplesWithAnchorResponseTyped>
  >
}

const ElectrocardiogramBindings = {
  queryElectrocardiogramSamples: bindRetypedMethod<
    typeof Electrocardiograms,
    typeof Electrocardiograms.queryElectrocardiogramSamples,
    Promise<readonly ElectrocardiogramSampleTyped[]>
  >(Electrocardiograms, Electrocardiograms.queryElectrocardiogramSamples),
  queryElectrocardiogramSamplesWithAnchor: bindRetypedMethod<
    typeof Electrocardiograms,
    typeof Electrocardiograms.queryElectrocardiogramSamplesWithAnchor,
    Promise<ElectrocardiogramSamplesWithAnchorResponseTyped>
  >(
    Electrocardiograms,
    Electrocardiograms.queryElectrocardiogramSamplesWithAnchor,
  ),
} satisfies {
  queryElectrocardiogramSamples: BoundMethod<
    typeof Electrocardiograms.queryElectrocardiogramSamples,
    Promise<readonly ElectrocardiogramSampleTyped[]>
  >
  queryElectrocardiogramSamplesWithAnchor: BoundMethod<
    typeof Electrocardiograms.queryElectrocardiogramSamplesWithAnchor,
    Promise<ElectrocardiogramSamplesWithAnchorResponseTyped>
  >
}

const WorkoutBindings = {
  queryWorkoutSamples: bindRetypedMethod<
    typeof Workouts,
    typeof Workouts.queryWorkoutSamples,
    Promise<readonly WorkoutProxyTyped[]>
  >(Workouts, Workouts.queryWorkoutSamples),
  queryWorkoutSamplesWithAnchor: bindRetypedMethod<
    typeof Workouts,
    typeof Workouts.queryWorkoutSamplesWithAnchor,
    Promise<QueryWorkoutSamplesWithAnchorResponseTyped>
  >(Workouts, Workouts.queryWorkoutSamplesWithAnchor),
  saveWorkoutSample: bindRetypedMethod<
    typeof Workouts,
    typeof Workouts.saveWorkoutSample,
    Promise<WorkoutProxyTyped>
  >(Workouts, Workouts.saveWorkoutSample),
} satisfies {
  queryWorkoutSamples: BoundMethod<
    typeof Workouts.queryWorkoutSamples,
    Promise<readonly WorkoutProxyTyped[]>
  >
  queryWorkoutSamplesWithAnchor: BoundMethod<
    typeof Workouts.queryWorkoutSamplesWithAnchor,
    Promise<QueryWorkoutSamplesWithAnchorResponseTyped>
  >
  saveWorkoutSample: BoundMethod<
    typeof Workouts.saveWorkoutSample,
    Promise<WorkoutProxyTyped>
  >
}

const StateOfMindBindings = {
  queryStateOfMindSamples: bindRetypedMethod<
    typeof StateOfMind,
    typeof StateOfMind.queryStateOfMindSamples,
    Promise<readonly StateOfMindSampleTyped[]>
  >(StateOfMind, StateOfMind.queryStateOfMindSamples),
  queryStateOfMindSamplesWithAnchor: bindRetypedMethod<
    typeof StateOfMind,
    typeof StateOfMind.queryStateOfMindSamplesWithAnchor,
    Promise<StateOfMindSamplesWithAnchorResponseTyped>
  >(StateOfMind, StateOfMind.queryStateOfMindSamplesWithAnchor),
  saveStateOfMindSample: bindRetypedMethod<
    typeof StateOfMind,
    typeof StateOfMind.saveStateOfMindSample,
    Promise<StateOfMindSampleTyped | undefined>
  >(StateOfMind, StateOfMind.saveStateOfMindSample),
} satisfies {
  queryStateOfMindSamples: BoundMethod<
    typeof StateOfMind.queryStateOfMindSamples,
    Promise<readonly StateOfMindSampleTyped[]>
  >
  queryStateOfMindSamplesWithAnchor: BoundMethod<
    typeof StateOfMind.queryStateOfMindSamplesWithAnchor,
    Promise<StateOfMindSamplesWithAnchorResponseTyped>
  >
  saveStateOfMindSample: BoundMethod<
    typeof StateOfMind.saveStateOfMindSample,
    Promise<StateOfMindSampleTyped | undefined>
  >
}

const MedicationBindings = {
  queryMedicationEvents: bindRetypedMethod<
    typeof Medication,
    typeof Medication.queryMedicationEvents,
    Promise<readonly MedicationDoseEventTyped[]>
  >(Medication, Medication.queryMedicationEvents),
  queryMedicationEventsWithAnchor: bindRetypedMethod<
    typeof Medication,
    typeof Medication.queryMedicationEventsWithAnchor,
    Promise<MedicationDoseEventsWithAnchorResponseTyped>
  >(Medication, Medication.queryMedicationEventsWithAnchor),
} satisfies {
  queryMedicationEvents: BoundMethod<
    typeof Medication.queryMedicationEvents,
    Promise<readonly MedicationDoseEventTyped[]>
  >
  queryMedicationEventsWithAnchor: BoundMethod<
    typeof Medication.queryMedicationEventsWithAnchor,
    Promise<MedicationDoseEventsWithAnchorResponseTyped>
  >
}

// Named exports - all functions bound to their respective modules
export const authorizationStatusFor = Core.authorizationStatusFor.bind(Core)
export const requestPerObjectReadAuthorization =
  Core.requestPerObjectReadAuthorization.bind(Core)
export const disableAllBackgroundDelivery =
  Core.disableAllBackgroundDelivery.bind(Core)
export const disableBackgroundDelivery =
  Core.disableBackgroundDelivery.bind(Core)
export const enableBackgroundDelivery = Core.enableBackgroundDelivery.bind(Core)
export const getBiologicalSex =
  Characteristics.getBiologicalSex.bind(Characteristics)
export const getBloodType = Characteristics.getBloodType.bind(Characteristics)
export const getDateOfBirth =
  Characteristics.getDateOfBirth.bind(Characteristics)
export const getFitzpatrickSkinType =
  Characteristics.getFitzpatrickSkinType.bind(Characteristics)
export const getPreferredUnits = Core.getPreferredUnits.bind(Core)
export const getRequestStatusForAuthorization =
  Core.getRequestStatusForAuthorization.bind(Core)
export const getWheelchairUse =
  Characteristics.getWheelchairUse.bind(Characteristics)
export const isHealthDataAvailable = Core.isHealthDataAvailable.bind(Core)
export const isHealthDataAvailableAsync =
  Core.isHealthDataAvailableAsync.bind(Core)
export const queryCategorySamples =
  CategoryTypes.queryCategorySamples.bind(CategoryTypes)
export const queryCategorySamplesWithAnchor =
  CategoryTypes.queryCategorySamplesWithAnchor.bind(CategoryTypes)
export const queryCorrelationSamples =
  CorrelationTypeBindings.queryCorrelationSamples
export const queryCorrelationSamplesWithAnchor =
  CorrelationTypeBindings.queryCorrelationSamplesWithAnchor
export const queryHeartbeatSeriesSamples =
  HeartbeatSeriesBindings.queryHeartbeatSeriesSamples
export const queryHeartbeatSeriesSamplesWithAnchor =
  HeartbeatSeriesBindings.queryHeartbeatSeriesSamplesWithAnchor
export const queryElectrocardiogramSamples =
  ElectrocardiogramBindings.queryElectrocardiogramSamples
export const queryElectrocardiogramSamplesWithAnchor =
  ElectrocardiogramBindings.queryElectrocardiogramSamplesWithAnchor
export const queryQuantitySamples =
  QuantityTypes.queryQuantitySamples.bind(QuantityTypes)
export const queryQuantitySamplesWithAnchor =
  QuantityTypes.queryQuantitySamplesWithAnchor.bind(QuantityTypes)
export const queryStatisticsForQuantity =
  QuantityTypes.queryStatisticsForQuantity.bind(QuantityTypes)
export const queryStatisticsCollectionForQuantity =
  QuantityTypes.queryStatisticsCollectionForQuantity.bind(QuantityTypes)
export const queryStatisticsForQuantitySeparateBySource =
  QuantityTypes.queryStatisticsForQuantitySeparateBySource.bind(QuantityTypes)
export const queryStatisticsCollectionForQuantitySeparateBySource =
  QuantityTypes.queryStatisticsCollectionForQuantitySeparateBySource.bind(
    QuantityTypes,
  )
export const queryWorkoutSamples = WorkoutBindings.queryWorkoutSamples
export const queryWorkoutSamplesWithAnchor =
  WorkoutBindings.queryWorkoutSamplesWithAnchor
export const querySources = Core.querySources.bind(Core)
export const requestAuthorization = Core.requestAuthorization.bind(Core)
export const deleteObjects = Core.deleteObjects.bind(Core)
export const saveCategorySample =
  CategoryTypes.saveCategorySample.bind(CategoryTypes)
export const saveCorrelationSample =
  CorrelationTypeBindings.saveCorrelationSample
export const saveQuantitySample =
  QuantityTypes.saveQuantitySample.bind(QuantityTypes)
export const saveWorkoutSample = WorkoutBindings.saveWorkoutSample
export const startWatchApp =
  Workouts.startWatchAppWithWorkoutConfiguration.bind(Workouts)
export const isProtectedDataAvailable = Core.isProtectedDataAvailable.bind(Core)
export const queryStateOfMindSamples =
  StateOfMindBindings.queryStateOfMindSamples
export const queryStateOfMindSamplesWithAnchor =
  StateOfMindBindings.queryStateOfMindSamplesWithAnchor
export const saveStateOfMindSample = StateOfMindBindings.saveStateOfMindSample
export const isQuantityCompatibleWithUnit =
  QuantityTypes.isQuantityCompatibleWithUnit.bind(QuantityTypes)

export const isObjectTypeAvailable = Core.isObjectTypeAvailable.bind(Core)
export const isObjectTypeAvailableAsync =
  Core.isObjectTypeAvailableAsync.bind(Core)
export const areObjectTypesAvailable = Core.areObjectTypesAvailable.bind(Core)
export const areObjectTypesAvailableAsync =
  Core.areObjectTypesAvailableAsync.bind(Core)
export const requestMedicationsAuthorization =
  Medication.requestMedicationsAuthorization.bind(Medication)

export const queryMedications = Medication.queryMedications.bind(Medication)
export const queryMedicationEvents = MedicationBindings.queryMedicationEvents
export const queryMedicationEventsWithAnchor =
  MedicationBindings.queryMedicationEventsWithAnchor

export const currentAppSource = Core.currentAppSource.bind(Core)

export const getBiologicalSexAsync =
  Characteristics.getBiologicalSexAsync.bind(Characteristics)
export const getBloodTypeAsync =
  Characteristics.getBloodTypeAsync.bind(Characteristics)
export const getDateOfBirthAsync =
  Characteristics.getDateOfBirthAsync.bind(Characteristics)
export const getFitzpatrickSkinTypeAsync =
  Characteristics.getFitzpatrickSkinTypeAsync.bind(Characteristics)
export const getWheelchairUseAsync =
  Characteristics.getWheelchairUseAsync.bind(Characteristics)

export default {
  authorizationStatusFor,
  isObjectTypeAvailable,
  isObjectTypeAvailableAsync,
  areObjectTypesAvailable,
  areObjectTypesAvailableAsync,
  isQuantityCompatibleWithUnit,
  disableAllBackgroundDelivery,
  disableBackgroundDelivery,
  enableBackgroundDelivery,
  getBiologicalSex,
  getBloodType,
  getDateOfBirth,
  getFitzpatrickSkinType,
  getBiologicalSexAsync,
  getBloodTypeAsync,
  getDateOfBirthAsync,
  getFitzpatrickSkinTypeAsync,
  getWheelchairUseAsync,
  getMostRecentCategorySample,
  getMostRecentQuantitySample,
  getMostRecentWorkout,
  getPreferredUnits,
  getPreferredUnit,
  getRequestStatusForAuthorization,
  getWheelchairUse,
  isHealthDataAvailable,
  isHealthDataAvailableAsync,
  queryCategorySamples,
  queryCategorySamplesWithAnchor,
  queryCorrelationSamples,
  queryCorrelationSamplesWithAnchor,
  queryHeartbeatSeriesSamples,
  queryHeartbeatSeriesSamplesWithAnchor,
  queryElectrocardiogramSamples,
  queryElectrocardiogramSamplesWithAnchor,
  queryQuantitySamples,
  queryQuantitySamplesWithAnchor,
  queryStatisticsForQuantity,
  queryStatisticsCollectionForQuantity,
  queryStatisticsForQuantitySeparateBySource,
  queryStatisticsCollectionForQuantitySeparateBySource,
  queryWorkoutSamples,
  queryWorkoutSamplesWithAnchor,
  querySources,
  requestAuthorization,
  requestPerObjectReadAuthorization,
  deleteObjects,
  saveCategorySample,
  saveCorrelationSample,
  saveQuantitySample,
  saveWorkoutSample,
  subscribeToChanges,
  subscribeToQuantitySamples,
  startWatchApp,
  isProtectedDataAvailable,
  queryStateOfMindSamples,
  queryStateOfMindSamplesWithAnchor,
  saveStateOfMindSample,
  requestMedicationsAuthorization,
  currentAppSource,

  queryMedicationEventsWithAnchor,
  queryMedicationEvents,
  queryMedications,

  subscribeToCategorySamples,
  useSubscribeToCategorySamples,

  // hooks
  useMostRecentCategorySample,
  useMostRecentQuantitySample,
  useMostRecentWorkout,
  useSubscribeToChanges,
  useSubscribeToQuantitySamples,
  useHealthkitAuthorization,
  useIsHealthDataAvailable,
  useSources,
  useStatisticsForQuantity,
}
