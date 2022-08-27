import type {
  HealthkitReadAuthorization,
  HealthkitWriteAuthorization,
  HKAuthorizationRequestStatus,
  HKBiologicalSex,
  HKBloodType,
  HKCategorySampleRaw,
  HKCategoryTypeIdentifier,
  HKCategoryValueForIdentifier,
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
} from './native-types'

export interface QueryWorkoutsOptions<
  TEnergy extends HKUnit,
  TDistance extends HKUnit
> extends GenericQueryOptions {
  readonly energyUnit?: TEnergy;
  readonly distanceUnit?: TDistance;
}

export interface HKCategorySample<
  T extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier
> extends Omit<HKCategorySampleRaw<T>, 'endDate' | 'startDate'> {
  readonly startDate: Date;
  readonly endDate: Date;
}

export type GenericQueryOptions = {
  readonly from?: Date;
  readonly to?: Date;
  readonly limit?: number;
  readonly ascending?: boolean;
};

export interface HKWorkout<
  TEnergy extends HKUnit = HKUnit,
  TDistance extends HKUnit = HKUnit
> extends Omit<HKWorkoutRaw<TEnergy, TDistance>, 'endDate' | 'startDate'> {
  readonly startDate: Date;
  readonly endDate: Date;
}

export interface HKQuantitySample<
  TIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends HKUnit = HKUnit
> extends Omit<
  HKQuantitySampleRaw<TIdentifier, TUnit>,
  'endDate' | 'startDate'
  > {
  readonly startDate: Date;
  readonly endDate: Date;
}

export interface QueryStatisticsResponse<T extends HKUnit = HKUnit>
  extends Omit<
  QueryStatisticsResponseRaw<T>,
  'mostRecentQuantityDateInterval'
  > {
  readonly mostRecentQuantityDateInterval?: { readonly from: Date; readonly to: Date };
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
  options: readonly HKStatisticsOptions[],
  from: Date,
  to?: Date,
  unit?: TUnit
) => Promise<QueryStatisticsResponse<TUnit>>;

export type QueryWorkoutsFn = <
  TEnergy extends HKUnit,
  TDistance extends HKUnit
>(
  options: QueryWorkoutsOptions<TEnergy, TDistance>
) => Promise<readonly HKWorkout<TEnergy, TDistance>[]>;

export type AuthorizationStatusForFn = (
  type: HealthkitReadAuthorization
) => Promise<boolean>;

export type QueryCategorySamplesFn = <T extends HKCategoryTypeIdentifier>(
  identifier: T,
  options: GenericQueryOptions
) => Promise<readonly HKCategorySample<T>[]>;

export type GetRequestStatusForAuthorizationFn = (
  read: readonly HealthkitReadAuthorization[],
  write?: readonly HealthkitWriteAuthorization[]
) => Promise<HKAuthorizationRequestStatus>;

export type RequestAuthorizationFn = (
  read: readonly HealthkitReadAuthorization[],
  write?: readonly HealthkitWriteAuthorization[]
) => Promise<boolean>;

export type SaveQuantitySampleFn = <TUnit extends HKQuantityTypeIdentifier>(
  identifier: TUnit,
  unit: HKUnit,
  value: number,
  options?: {
    readonly start?: Date;
    readonly end?: Date;
    readonly metadata?: MetadataMapperForQuantityIdentifier<TUnit>;
  }
) => Promise<boolean>;

export type QueryQuantitySamplesFn = <
  TIdentifier extends HKQuantityTypeIdentifier,
  TUnit extends HKUnit = HKUnit
>(
  identifier: TIdentifier,
  options: GenericQueryOptions & { readonly unit?: TUnit }
) => Promise<readonly HKQuantitySample<TIdentifier, TUnit>[]>;

export type DeleteQuantitySampleFn = <
  TIdentifier extends HKQuantityTypeIdentifier
>(
  identifier: TIdentifier,
  uuid: string
) => Promise<boolean>;

export type SubscribeToChangesFn = (
  identifier: HKSampleTypeIdentifier,
  callback: () => void
) => Promise<UnsubscribeFunction>;

export type SaveCategorySampleFn = <T extends HKCategoryTypeIdentifier>(
  identifier: T,
  value: HKCategoryValueForIdentifier<T>,
  options?: {
    readonly start?: Date;
    readonly end?: Date;
    readonly metadata?: MetadataMapperForCategoryIdentifier<T>;
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
) => Promise<HKQuantitySample<TIdentifier, TUnit> | null>;

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
  identifiers: readonly HKQuantityTypeIdentifier[]
) => Promise<readonly HKUnit[]>;

export type GetPreferredUnitFn = (
  identifier: HKQuantityTypeIdentifier
) => Promise<HKUnit>;

export type SaveCorrelationSampleFn = <
  TIdentifier extends HKCorrelationTypeIdentifier
>(
  typeIdentifier: TIdentifier,
  samples: readonly (
    | Omit<HKCategorySample, 'device' | 'endDate' | 'startDate' | 'uuid'>
    | Omit<HKQuantitySample, 'device' | 'endDate' | 'startDate' | 'uuid'>
  )[],
  options?: {
    readonly start?: Date;
    readonly end?: Date;
    readonly metadata?: MetadataMapperForCorrelationIdentifier<TIdentifier>;
  }
) => Promise<boolean>;

export type SaveWorkoutSampleFn = (
  typeIdentifier: HKWorkoutActivityType,
  quantities: readonly Omit<
  HKQuantitySample,
  'device' | 'endDate' | 'startDate' | 'uuid'
  >[],
  start: Date,
  options?: {
    readonly end?: Date;
    readonly metadata?: HKWorkoutMetadata;
  }
) => Promise<boolean>;

export interface HKCorrelation<TIdentifier extends HKCorrelationTypeIdentifier>
  extends Omit<
  HKCorrelationRaw<TIdentifier>,
  'endDate' | 'objects' | 'startDate'
  > {
  readonly objects: readonly (HKCategorySample | HKQuantitySample)[];
  readonly startDate: Date;
  readonly endDate: Date;
}

export type QueryCorrelationSamplesFn = <
  TIdentifier extends HKCorrelationTypeIdentifier
>(
  typeIdentifier: TIdentifier,
  options: Omit<GenericQueryOptions, 'ascending' | 'limit'>
) => Promise<readonly HKCorrelation<TIdentifier>[]>;

export type SubscribeToChangesHook = <
  TIdentifier extends HKSampleTypeIdentifier
>(
  identifier: TIdentifier,
  onChange: () => void,
  runInitialUpdate?: boolean
) => void;

export type GetWorkoutRoutesFn = (
  workoutUUID: string
) => Promise<readonly WorkoutRoute[]>;

export type ReactNativeHealthkit = {
  readonly authorizationStatusFor: AuthorizationStatusForFn;

  readonly getBiologicalSex: GetBiologicalSexFn;
  readonly getBloodType: GetBloodTypeFn;
  readonly getDateOfBirth: GetDateOfBirthFn;
  readonly getFitzpatrickSkinType: GetFitzpatrickSkinTypeFn;
  readonly getMostRecentQuantitySample: GetMostRecentQuantitySampleFn;
  readonly getMostRecentCategorySample: GetMostRecentCategorySampleFn;
  readonly getMostRecentWorkout: GetMostRecentWorkoutFn;
  readonly getPreferredUnit: GetPreferredUnitFn;
  readonly getPreferredUnits: GetPreferredUnitsFn;
  readonly getRequestStatusForAuthorization: GetRequestStatusForAuthorizationFn;
  readonly getWheelchairUse: GetWheelchairUseFn;
  readonly getWorkoutRoutes: GetWorkoutRoutesFn;

  readonly buildUnitWithPrefix: (prefix: HKUnitSIPrefix, unit: HKUnitSI) => HKUnit;

  readonly isHealthDataAvailable: IsHealthDataAvailableFn;

  readonly queryCategorySamples: QueryCategorySamplesFn;
  readonly queryQuantitySamples: QueryQuantitySamplesFn;
  readonly queryStatisticsForQuantity: QueryStatisticsForQuantityFn;
  readonly queryWorkouts: QueryWorkoutsFn;
  readonly queryCorrelationSamples: QueryCorrelationSamplesFn;

  readonly requestAuthorization: RequestAuthorizationFn;

  readonly deleteQuantitySample: DeleteQuantitySampleFn;

  readonly saveCategorySample: SaveCategorySampleFn;
  readonly saveQuantitySample: SaveQuantitySampleFn;
  readonly saveCorrelationSample: SaveCorrelationSampleFn;
  readonly saveWorkoutSample: SaveWorkoutSampleFn;
  readonly enableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier,
    updateFrequency: HKUpdateFrequency
  ) => Promise<boolean>;
  readonly disableBackgroundDelivery: (
    typeIdentifier: HKSampleTypeIdentifier
  ) => Promise<boolean>;
  readonly disableAllBackgroundDelivery: () => Promise<boolean>;

  readonly subscribeToChanges: SubscribeToChangesFn;

  readonly useMostRecentWorkout: MostRecentWorkoutHook;
  readonly useMostRecentCategorySample: MostRecentCategorySampleHook;
  readonly useMostRecentQuantitySample: MostRecentQuantitySampleHook;

  readonly useSubscribeToChanges: SubscribeToChangesHook;
  readonly useIsHealthDataAvailable: () => boolean | null;
  readonly useHealthkitAuthorization: (
    read: readonly HealthkitReadAuthorization[],
    write?: readonly HealthkitWriteAuthorization[],
  ) => readonly [authorizationStatus: HKAuthorizationRequestStatus | null, request: () => Promise<HKAuthorizationRequestStatus | null>];
};
