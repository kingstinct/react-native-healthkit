import type {
  HKAuthorizationRequestStatus,
  HKBiologicalSex,
  HKBloodType,
  HKCategorySampleRaw,
  HKCategoryTypeIdentifier,
  HKCategoryValueForIdentifier,
  HKCharacteristicTypeIdentifier,
  HKCorrelationRaw,
  HKCorrelationTypeIdentifier,
  HKFitzpatrickSkinType,
  HKQuantitySampleRaw,
  HKQuantityTypeIdentifier,
  HKSampleTypeIdentifier,
  HKStatisticsOptions,
  HKUnit,
  HKUnitSI,
  HKUnitSIPrefix,
  HKUpdateFrequency,
  HKWheelchairUse,
  HKWorkoutActivityType,
  HKWorkoutMetadata,
  HKWorkoutRaw,
  MetadataMapperForCategoryIdentifier,
  MetadataMapperForCorrelationIdentifier,
  MetadataMapperForQuantityIdentifier,
  QueryStatisticsResponseRaw,
  WorkoutRoute,
} from './native-types';

export interface QueryWorkoutsOptions<
  TEnergy extends HKUnit,
  TDistance extends HKUnit
> extends GenericQueryOptions {
  energyUnit?: TEnergy;
  distanceUnit?: TDistance;
}

export interface HKCategorySample<
  T extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier
> extends Omit<HKCategorySampleRaw<T>, 'startDate' | 'endDate'> {
  startDate: Date;
  endDate: Date;
}

export type GenericQueryOptions = {
  from?: Date;
  to?: Date;
  limit?: Number;
  ascending?: boolean;
};

export interface HKWorkout<
  TEnergy extends HKUnit = HKUnit,
  TDistance extends HKUnit = HKUnit
> extends Omit<HKWorkoutRaw<TEnergy, TDistance>, 'startDate' | 'endDate'> {
  startDate: Date;
  endDate: Date;
}

export interface HKQuantitySample<
  TIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends HKUnit = HKUnit
> extends Omit<
    HKQuantitySampleRaw<TIdentifier, TUnit>,
    'startDate' | 'endDate'
  > {
  startDate: Date;
  endDate: Date;
}

export interface QueryStatisticsResponse<T extends HKUnit = HKUnit>
  extends Omit<
    QueryStatisticsResponseRaw<T>,
    'mostRecentQuantityDateInterval'
  > {
  mostRecentQuantityDateInterval?: { from: Date; to: Date };
}

type UnsubscribeFunction = () => Promise<boolean>;

export type IsHealthDataAvailableFn = () => Promise<boolean>;

export type GetBloodTypeFn = () => Promise<HKBloodType>;

export type GetDateOfBirthFn = () => Promise<Date>;
export type GetBiologicalSexFn = () => Promise<HKBiologicalSex>;
export type GetWheelchairUseFn = () => Promise<HKWheelchairUse>;
export type GetFitzpatrickSkinTypeFn = () => Promise<HKFitzpatrickSkinType>;

export type QueryStatisticsForQuantityFn = <TUnit extends HKUnit>(
  identifier: HKQuantityTypeIdentifier,
  options: HKStatisticsOptions[],
  from: Date,
  to?: Date,
  unit?: TUnit
) => Promise<QueryStatisticsResponse<TUnit>>;

export type QueryWorkoutsFn = <
  TEnergy extends HKUnit,
  TDistance extends HKUnit
>(
  options: QueryWorkoutsOptions<TEnergy, TDistance>
) => Promise<HKWorkout<TEnergy, TDistance>[]>;

export type AuthorizationStatusForFn = (
  type: HKSampleTypeIdentifier | HKCharacteristicTypeIdentifier
) => Promise<boolean>;

export type QueryCategorySamplesFn = <T extends HKCategoryTypeIdentifier>(
  identifier: T,
  options: GenericQueryOptions
) => Promise<HKCategorySample<T>[]>;

export type GetRequestStatusForAuthorizationFn = (
  read: (HKCharacteristicTypeIdentifier | HKSampleTypeIdentifier)[],
  write?: HKSampleTypeIdentifier[]
) => Promise<HKAuthorizationRequestStatus>;

export type RequestAuthorizationFn = (
  read: (HKCharacteristicTypeIdentifier | HKSampleTypeIdentifier)[],
  write?: HKSampleTypeIdentifier[]
) => Promise<boolean>;

export type SaveQuantitySampleFn = <TUnit extends HKQuantityTypeIdentifier>(
  identifier: TUnit,
  unit: HKUnit,
  value: number,
  options?: {
    start?: Date;
    end?: Date;
    metadata?: MetadataMapperForQuantityIdentifier<TUnit>;
  }
) => Promise<boolean>;

export type QueryQuantitySamplesFn = <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends HKUnit = HKUnit
>(
  identifier: TIdentifier,
  options: GenericQueryOptions & { unit?: TUnit }
) => Promise<HKQuantitySample<TIdentifier, TUnit>[]>;

export type SubscribeToChangesFn = (
  identifier: HKSampleTypeIdentifier,
  callback: () => void
) => Promise<UnsubscribeFunction>;

export type SaveCategorySampleFn = <T extends HKCategoryTypeIdentifier>(
  identifier: T,
  value: HKCategoryValueForIdentifier<T>,
  options?: {
    start?: Date;
    end?: Date;
    metadata?: MetadataMapperForCategoryIdentifier<T>;
  }
) => Promise<boolean>;

export type GetMostRecentCategorySampleFn = <
  T extends HKCategoryTypeIdentifier
>(
  identifier: T
) => Promise<HKCategorySample<T> | null>;

export type MostRecentCategorySampleHook = <T extends HKCategoryTypeIdentifier>(
  identifier: T
) => HKCategorySample<T> | null;

export type MostRecentCorrelationSampleHook = <
  T extends HKCorrelationTypeIdentifier
>(
  identifer: T
) => HKCorrelation<T> | null;

export type GetMostRecentQuantitySampleFn = <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends HKUnit
>(
  identifier: TIdentifier,
  unit?: TUnit
) => Promise<HKQuantitySample<TIdentifier, TUnit>>;

export type MostRecentQuantitySampleHook = <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends HKUnit
>(
  identifier: TIdentifier,
  unit?: TUnit
) => HKQuantitySample<TIdentifier, TUnit> | null;

export type GetMostRecentWorkoutFn = <
  TEnergy extends HKUnit,
  TDistance extends HKUnit
>(
  options?: Pick<
    QueryWorkoutsOptions<TEnergy, TDistance>,
    'distanceUnit' | 'energyUnit'
  >
) => Promise<HKWorkout<TEnergy, TDistance> | null>;

export type MostRecentWorkoutHook = <
  TEnergy extends HKUnit,
  TDistance extends HKUnit
>(
  options?: Pick<
    QueryWorkoutsOptions<TEnergy, TDistance>,
    'distanceUnit' | 'energyUnit'
  >
) => HKWorkout<TEnergy, TDistance> | null;

export type GetPreferredUnitsFn = (
  identifiers: HKQuantityTypeIdentifier[]
) => Promise<HKUnit[]>;

export type GetPreferredUnitFn = (
  identifier: HKQuantityTypeIdentifier
) => Promise<HKUnit>;

export type SaveCorrelationSampleFn = <
  TIdentifier extends HKCorrelationTypeIdentifier
>(
  typeIdentifier: TIdentifier,
  samples: (
    | Omit<HKCategorySample, 'startDate' | 'endDate' | 'uuid' | 'device'>
    | Omit<HKQuantitySample, 'startDate' | 'endDate' | 'uuid' | 'device'>
  )[],
  options?: {
    start?: Date;
    end?: Date;
    metadata?: MetadataMapperForCorrelationIdentifier<TIdentifier>;
  }
) => Promise<boolean>;

export type SaveWorkoutSampleFn = (
  typeIdentifier: HKWorkoutActivityType,
  quantities: Omit<
    HKQuantitySample,
    'startDate' | 'endDate' | 'uuid' | 'device'
  >[],
  start: Date,
  options?: {
    end?: Date;
    metadata?: HKWorkoutMetadata;
  }
) => Promise<boolean>;

export interface HKCorrelation<TIdentifier extends HKCorrelationTypeIdentifier>
  extends Omit<
    HKCorrelationRaw<TIdentifier>,
    'startDate' | 'endDate' | 'objects'
  > {
  objects: (HKQuantitySample | HKCategorySample)[];
  startDate: Date;
  endDate: Date;
}

export type QueryCorrelationSamplesFn = <
  TIdentifier extends HKCorrelationTypeIdentifier
>(
  typeIdentifier: TIdentifier,
  options: Omit<GenericQueryOptions, 'limit' | 'ascending'>
) => Promise<HKCorrelation<TIdentifier>[]>;

export type SubscribeToChangesHook = <
  TIdentifier extends HKSampleTypeIdentifier
>(
  identifier: TIdentifier,
  onChange: () => void,
  runInitialUpdate?: boolean
) => void;

export type GetWorkoutRoutesFn = (
  workoutUUID: string
) => Promise<WorkoutRoute[]>;

export type ReactNativeHealthkit = {
  authorizationStatusFor: AuthorizationStatusForFn;

  getBiologicalSex: GetBiologicalSexFn;
  getBloodType: GetBloodTypeFn;
  getDateOfBirth: GetDateOfBirthFn;
  getFitzpatrickSkinType: GetFitzpatrickSkinTypeFn;
  getMostRecentQuantitySample: GetMostRecentQuantitySampleFn;
  getMostRecentCategorySample: GetMostRecentCategorySampleFn;
  getMostRecentWorkout: GetMostRecentWorkoutFn;
  getPreferredUnit: GetPreferredUnitFn;
  getPreferredUnits: GetPreferredUnitsFn;
  getRequestStatusForAuthorization: GetRequestStatusForAuthorizationFn;
  getWheelchairUse: GetWheelchairUseFn;
  getWorkoutRoutes: GetWorkoutRoutesFn;

  buildUnitWithPrefix: (prefix: HKUnitSIPrefix, unit: HKUnitSI) => HKUnit;

  isHealthDataAvailable: IsHealthDataAvailableFn;

  queryCategorySamples: QueryCategorySamplesFn;
  queryQuantitySamples: QueryQuantitySamplesFn;
  queryStatisticsForQuantity: QueryStatisticsForQuantityFn;
  queryWorkouts: QueryWorkoutsFn;
  queryCorrelationSamples: QueryCorrelationSamplesFn;

  requestAuthorization: RequestAuthorizationFn;

  saveCategorySample: SaveCategorySampleFn;
  saveQuantitySample: SaveQuantitySampleFn;
  saveCorrelationSample: SaveCorrelationSampleFn;
  saveWorkoutSample: SaveWorkoutSampleFn;
  enableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier,
    updateFrequency: HKUpdateFrequency
  ) => Promise<boolean>;
  disableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier
  ) => Promise<boolean>;
  disableAllBackgroundDelivery: () => Promise<boolean>;

  subscribeToChanges: SubscribeToChangesFn;

  useMostRecentWorkout: MostRecentWorkoutHook;
  useMostRecentCategorySample: MostRecentCategorySampleHook;
  useMostRecentQuantitySample: MostRecentQuantitySampleHook;

  useSubscribeToChanges: SubscribeToChangesHook;
};
