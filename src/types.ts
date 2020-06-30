import type {
  HKUnit,
  HKQuantityTypeIdentifier,
  HKBloodType,
  HKBiologicalSex,
  HKWheelchairUse,
  HKFitzpatrickSkinType,
  HKStatisticsOptions,
  HKCharacteristicTypeIdentifier,
  HKSampleTypeIdentifier,
  HKCategoryValueForIdentifier,
  HKCategoryTypeIdentifier,
  HKAuthorizationRequestStatus,
  HKMetadataForCategoryIdentifier,
  HKQuantitySampleRaw,
  QueryStatisticsResponseRaw,
  HKWorkoutRaw,
  HKCategorySampleRaw,
  HKUnitSI,
  HKUnitSIPrefix,
  HKMetadataForQuantityIdentifier,
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
>
  extends Omit<
    HKQuantitySampleRaw<TUnit, TIdentifier>,
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
    metadata?: HKMetadataForQuantityIdentifier<TUnit>;
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
    metadata?: HKMetadataForCategoryIdentifier<T>;
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

  buildUnitWithPrefix: (prefix: HKUnitSIPrefix, unit: HKUnitSI) => HKUnit;

  isHealthDataAvailable: IsHealthDataAvailableFn;

  queryCategorySamples: QueryCategorySamplesFn;
  queryQuantitySamples: QueryQuantitySamplesFn;
  queryStatisticsForQuantity: QueryStatisticsForQuantityFn;
  queryWorkouts: QueryWorkoutsFn;

  requestAuthorization: RequestAuthorizationFn;

  saveCategorySample: SaveCategorySampleFn;
  saveQuantitySample: SaveQuantitySampleFn;

  subscribeToChanges: SubscribeToChangesFn;

  useMostRecentWorkout: MostRecentWorkoutHook;
  useMostRecentCategorySample: MostRecentCategorySampleHook;
  useMostRecentQuantitySample: MostRecentQuantitySampleHook;
};
