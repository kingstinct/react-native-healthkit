import type { CLLocationRawForSaving, EnergyUnit, HKCategorySampleRaw, HKCategoryTypeIdentifier, HKCorrelationRaw, HKCorrelationTypeIdentifier, HKDevice, HKHeartbeatSeriesSampleRaw, HKQuantityTypeIdentifier, HKSourceRevision, HKUnit, HKWorkoutRaw, LengthUnit, MetadataMapperForQuantityIdentifier, QueryStatisticsResponseRaw, UnitForIdentifier } from './native-types';
export * from './native-types';
/**
 * Options for querying workouts.
 * @template TEnergy The energy unit type.
 * @template TDistance The distance unit type.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkout Apple Docs HKWorkout}
 */
export interface QueryWorkoutsOptions<TEnergy extends HKUnit, TDistance extends HKUnit> extends GenericQueryOptions {
    readonly energyUnit?: TEnergy;
    readonly distanceUnit?: TDistance;
}
/**
 * Represents a category sample.
 * @template T The category type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorysample Apple Docs HKCategorySample}
 */
export interface HKCategorySample<T extends HKCategoryTypeIdentifier = HKCategoryTypeIdentifier> extends Omit<HKCategorySampleRaw<T>, 'endDate' | 'startDate'> {
    readonly startDate: Date;
    readonly endDate: Date;
}
/**
 * Generic options for querying.
 */
export type GenericQueryOptions = {
    readonly from?: Date;
    readonly to?: Date;
    readonly limit?: number;
    readonly ascending?: boolean;
    readonly anchor?: string;
};
/**
 * Represents a workout.
 * @template TEnergy The energy unit type.
 * @template TDistance The distance unit type.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkout Apple Docs HKWorkout}
 */
export interface HKWorkout<TEnergy extends EnergyUnit = EnergyUnit, TDistance extends LengthUnit = LengthUnit> extends Omit<HKWorkoutRaw<TEnergy, TDistance>, 'endDate' | 'startDate'> {
    readonly startDate: Date;
    readonly endDate: Date;
}
/**
 * Represents a heartbeat series sample.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkheartbeatseriessample Apple Docs HKHeartbeatSeriesSample}
 */
export interface HKHeartbeatSeriesSample extends Omit<HKHeartbeatSeriesSampleRaw, 'endDate' | 'startDate'> {
    readonly startDate: Date;
    readonly endDate: Date;
}
/**
 * Represents a quantity sample.
 * @template TIdentifier The quantity type identifier.
 * @template TUnit The unit for the identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitysample Apple Docs HKQuantitySample}
 */
export interface HKQuantitySample<TIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>> {
    readonly uuid: string;
    readonly device?: HKDevice;
    readonly quantityType: TIdentifier;
    readonly quantity: number;
    readonly unit: TUnit;
    readonly metadata?: MetadataMapperForQuantityIdentifier<TIdentifier>;
    readonly sourceRevision?: HKSourceRevision;
    readonly startDate: Date;
    readonly endDate: Date;
}
/**
 * Represents a response from a statistics query.
 * @template TIdentifier The quantity type identifier.
 * @template TUnit The unit for the identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstatisticsquery Apple Docs HKStatisticsQuery}
 */
export interface QueryStatisticsResponse<TIdentifier extends HKQuantityTypeIdentifier, TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>> extends Omit<QueryStatisticsResponseRaw<TIdentifier, TUnit>, 'mostRecentQuantityDateInterval'> {
    readonly mostRecentQuantityDateInterval?: {
        readonly from: Date;
        readonly to: Date;
    };
}
/**
 * Represents a category sample for saving.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategorysample Apple Docs HKCategorySample}
 */
export type HKCategorySampleForSaving = Omit<HKCategorySample, 'device' | 'endDate' | 'startDate' | 'uuid'> & {
    readonly startDate?: Date;
    readonly endDate?: Date;
};
/**
 * Represents a quantity sample for saving.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitysample Apple Docs HKQuantitySample}
 */
export type HKQuantitySampleForSaving = Omit<HKQuantitySample, 'device' | 'endDate' | 'startDate' | 'uuid'> & {
    readonly startDate?: Date;
    readonly endDate?: Date;
};
/**
 * Represents a correlation.
 * @template TIdentifier The correlation type identifier.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcorrelation Apple Docs HKCorrelation}
 */
export interface HKCorrelation<TIdentifier extends HKCorrelationTypeIdentifier> extends Omit<HKCorrelationRaw<TIdentifier>, 'endDate' | 'objects' | 'startDate'> {
    readonly objects: readonly (HKCategorySample | HKQuantitySample)[];
    readonly startDate: Date;
    readonly endDate: Date;
}
/**
 * Represents a location sample for saving.
 * @see {@link https://developer.apple.com/documentation/corelocation/cllocation Apple Docs CLLocation}
 */
export type CLLocationForSaving = Omit<CLLocationRawForSaving, 'timestamp'> & {
    readonly timestamp: number;
};
