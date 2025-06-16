import { Platform } from 'react-native'
import { NitroModules } from 'react-native-nitro-modules'
import useHealthkitAuthorization from './hooks/useHealthkitAuthorization'
import { useIsHealthDataAvailable } from './hooks/useIsHealthDataAvailable'
import useMostRecentCategorySample from './hooks/useMostRecentCategorySample'
import useMostRecentQuantitySample from './hooks/useMostRecentQuantitySample'
import useMostRecentWorkout from './hooks/useMostRecentWorkout'
import useSources from './hooks/useSources'
import useStatisticsForQuantity from './hooks/useStatisticsForQuantity'
import useSubscribeToChanges from './hooks/useSubscribeToChanges'
import type {
  CategoryTypeModule,
  CategoryTypeModuleTyped,
} from './specs/CategoryTypeModule.nitro'
import type { CharacteristicTypeModule } from './specs/CharacteristicTypeModule.nitro'
import type { CoreModule } from './specs/CoreModule.nitro'
import type { CorrelationTypeModule } from './specs/CorrelationTypeModule.nitro'
import type { HeartbeatSeriesModule } from './specs/HeartbeatSeriesModule.nitro'
import type { QuantityTypeModule } from './specs/QuantityTypeModule.nitro'
import type { StateOfMindModule } from './specs/StateOfMindModule.nitro'
import type { WorkoutsModule } from './specs/WorkoutsModule.nitro'
import type { QuantityTypeIdentifier } from './types/QuantityTypeIdentifier'
import getMostRecentCategorySample from './utils/getMostRecentCategorySample'
import getMostRecentQuantitySample from './utils/getMostRecentQuantitySample'
import getMostRecentWorkout from './utils/getMostRecentWorkout'
import getPreferredUnit from './utils/getPreferredUnit'

const Core = NitroModules.createHybridObject<CoreModule>('CoreModule')

const Workouts =
  NitroModules.createHybridObject<WorkoutsModule>('WorkoutsModule')

const Characteristics =
  NitroModules.createHybridObject<CharacteristicTypeModule>(
    'CharacteristicTypeModule',
  )

const QuantityTypes =
  NitroModules.createHybridObject<QuantityTypeModule>('QuantityTypeModule')

const CategoryTypes = NitroModules.createHybridObject<CategoryTypeModule>(
  'CategoryTypeModule',
) as CategoryTypeModuleTyped

const CorrelationTypes = NitroModules.createHybridObject<CorrelationTypeModule>(
  'CorrelationTypeModule',
)

const HeartbeatSeries = NitroModules.createHybridObject<HeartbeatSeriesModule>(
  'HeartbeatSeriesModule',
)

const StateOfMind =
  NitroModules.createHybridObject<StateOfMindModule>('StateOfMindModule')

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

// Named exports - all functions bound to their respective modules
const authorizationStatusFor = Core.authorizationStatusFor.bind(Core)
const disableAllBackgroundDelivery =
  Core.disableAllBackgroundDelivery.bind(Core)
const disableBackgroundDelivery = Core.disableBackgroundDelivery.bind(Core)
const enableBackgroundDelivery = Core.enableBackgroundDelivery.bind(Core)
const getBiologicalSex = Characteristics.getBiologicalSex.bind(Characteristics)
const getBloodType = Characteristics.getBloodType.bind(Characteristics)
const getDateOfBirth = Characteristics.getDateOfBirth.bind(Characteristics)
const getFitzpatrickSkinType =
  Characteristics.getFitzpatrickSkinType.bind(Characteristics)
const getPreferredUnits = Core.getPreferredUnits.bind(Core)
const getRequestStatusForAuthorization =
  Core.getRequestStatusForAuthorization.bind(Core)
const getWheelchairUse = Characteristics.getWheelchairUse.bind(Characteristics)
const isHealthDataAvailable = Core.isHealthDataAvailable.bind(Core)
const isHealthDataAvailableAsync = Core.isHealthDataAvailableAsync.bind(Core)
const queryCategorySamples =
  CategoryTypes.queryCategorySamples.bind(CategoryTypes)
const queryCategorySamplesWithAnchor =
  CategoryTypes.queryCategorySamplesWithAnchor.bind(CategoryTypes)
const queryCorrelationSamples =
  CorrelationTypes.queryCorrelationSamples.bind(CorrelationTypes)
const queryHeartbeatSeriesSamples =
  HeartbeatSeries.queryHeartbeatSeriesSamples.bind(HeartbeatSeries)
const queryHeartbeatSeriesSamplesWithAnchor =
  HeartbeatSeries.queryHeartbeatSeriesSamplesWithAnchor.bind(HeartbeatSeries)
const queryQuantitySamples =
  QuantityTypes.queryQuantitySamples.bind(QuantityTypes)
const queryQuantitySamplesWithAnchor =
  QuantityTypes.queryQuantitySamplesWithAnchor.bind(QuantityTypes)
const queryStatisticsForQuantity =
  QuantityTypes.queryStatisticsForQuantity.bind(QuantityTypes)
const queryStatisticsCollectionForQuantity =
  QuantityTypes.queryStatisticsCollectionForQuantity.bind(QuantityTypes)
const queryWorkoutSamples = Workouts.queryWorkoutSamples.bind(Workouts)
const queryWorkoutSamplesWithAnchor =
  Workouts.queryWorkoutSamplesWithAnchor.bind(Workouts)
const querySources = Core.querySources.bind(Core)
const requestAuthorization = Core.requestAuthorization.bind(Core)
const deleteObjects = Core.deleteObjects.bind(Core)
const saveCategorySample = CategoryTypes.saveCategorySample.bind(CategoryTypes)
const saveCorrelationSample =
  CorrelationTypes.saveCorrelationSample.bind(CorrelationTypes)
const saveQuantitySample = QuantityTypes.saveQuantitySample.bind(QuantityTypes)
const saveWorkoutSample = Workouts.saveWorkoutSample.bind(Workouts)
const subscribeToChanges = Core.subscribeToObserverQuery.bind(Core)
const startWatchApp =
  Workouts.startWatchAppWithWorkoutConfiguration.bind(Workouts)
const isProtectedDataAvailable = Core.isProtectedDataAvailable.bind(Core)
const queryStateOfMindSamples =
  StateOfMind.queryStateOfMindSamples.bind(StateOfMind)
const saveStateOfMindSample =
  StateOfMind.saveStateOfMindSample.bind(StateOfMind)
const isQuantityCompatibleWithUnit =
  QuantityTypes.isQuantityCompatibleWithUnit.bind(QuantityTypes)

const isObjectTypeAvailable = Core.isObjectTypeAvailable.bind(Core)
const isObjectTypeAvailableAsync = Core.isObjectTypeAvailableAsync.bind(Core)
const areObjectTypesAvailable = Core.areObjectTypesAvailable.bind(Core)
const areObjectTypesAvailableAsync =
  Core.areObjectTypesAvailableAsync.bind(Core)

export {
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
  queryHeartbeatSeriesSamples,
  queryHeartbeatSeriesSamplesWithAnchor,
  queryQuantitySamples,
  queryQuantitySamplesWithAnchor,
  queryStatisticsForQuantity,
  queryStatisticsCollectionForQuantity,
  queryWorkoutSamples,
  queryWorkoutSamplesWithAnchor,
  querySources,
  requestAuthorization,
  deleteObjects,
  saveCategorySample,
  saveCorrelationSample,
  saveQuantitySample,
  saveWorkoutSample,
  subscribeToChanges,
  startWatchApp,
  isProtectedDataAvailable,
  queryStateOfMindSamples,
  saveStateOfMindSample,
  // Modules
  Core,
  Workouts,
  Characteristics,
  QuantityTypes,
  CategoryTypes,
  CorrelationTypes,
  HeartbeatSeries,
  StateOfMind,
  // hooks
  useMostRecentCategorySample,
  useMostRecentQuantitySample,
  useMostRecentWorkout,
  useSubscribeToChanges,
  useHealthkitAuthorization,
  useIsHealthDataAvailable,
  useSources,
  useStatisticsForQuantity,
}
