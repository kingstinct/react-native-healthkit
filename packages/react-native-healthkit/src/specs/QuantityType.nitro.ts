import type { HybridObject } from "react-native-nitro-modules";
import type { HKGenericMetadata } from "./Shared";
import type { MassUnit } from "./Unit.nitro";
import type { BloodGlucoseUnit, CountPerTime, HKUnit, HKUnits, LengthUnit, SpeedUnit, TemperatureUnit, TimeUnit, VolumeUnit } from "./Unit.nitro";
import type { EnergyUnit } from "./Unit.nitro";
import type { HKWorkoutRaw } from "./Workout.nitro";
import type { HKCategorySampleRaw } from "./CategoryType.nitro";
import type { HKDevice } from "./Source.nitro";
import type { HKSourceRevision } from "./Source.nitro";
import type { HKQuantityTypeIdentifier } from "../types/HKQuantityTypeIdentifier";
import type { HKCategoryTypeIdentifier } from "../types/HKCategoryTypeIdentifier";

export interface DeletedQuantitySampleRaw<T extends HKQuantityTypeIdentifier> {
  readonly uuid: string;
  readonly metadata: MetadataMapperForQuantityIdentifier;
};

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkquantitysample Apple Docs }
 */
export interface HKQuantitySampleRaw {
  readonly uuid: string;
  readonly device?: HKDevice;
  readonly quantityType: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly quantity: number;
  readonly unit: string;
  readonly metadata: HKGenericMetadata;
  readonly sourceRevision?: HKSourceRevision;
};


export interface HKQuantitySampleRawForSaving extends Omit<
  HKQuantitySampleRaw,
  'device' | 'endDate' | 'startDate' | 'uuid'
> {
  readonly startDate?: string;
  readonly endDate?: string;
};

export interface QueryStatisticsResponseRaw<
  TIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>
> {
  readonly averageQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly maximumQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly minimumQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly sumQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly mostRecentQuantity?: HKQuantity<TIdentifier, TUnit>;
  readonly mostRecentQuantityDateInterval?: {
    readonly from: string;
    readonly to: string;
  };
  readonly duration?: HKQuantity<HKQuantityTypeIdentifier, TimeUnit>;
};


export interface QueryQuantitySamplesResponseRaw<
  T extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier
> {
  readonly samples: readonly HKQuantitySampleRaw[];
  readonly deletedSamples: readonly DeletedQuantitySampleRaw<T>[];
  readonly newAnchor: string;
};


export interface HKQuantity<
  TIdentifier extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier,
  TUnit extends UnitForIdentifier<TIdentifier> = UnitForIdentifier<TIdentifier>
> {
  readonly unit: TUnit;
  readonly quantity: number;
};

export interface HKQuantityRaw {
  readonly unit: string;
  readonly quantity: number;
};


/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkinsulindeliveryreason Apple Docs }
 */
export enum HKInsulinDeliveryReason {
  basal = 1,
  bolus = 2,
}

export enum HKHeartRateMotionContext {
  active = 2,
  notSet = 0,
  sedentary = 1,
}


export interface IntervalComponents {
  readonly minute?: number;
  readonly hour?: number;
  readonly day?: number;
  readonly month?: number;
  readonly year?: number;
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstatisticsoptions Apple Docs }
 */
export enum HKStatisticsOptions {
  cumulativeSum = 'cumulativeSum',
  discreteAverage = 'discreteAverage',
  discreteMax = 'discreteMax',
  discreteMin = 'discreteMin',
  discreteMostRecent = 'discreteMostRecent',
  duration = 'duration',
  mostRecent = 'mostRecent',
  separateBySource = 'separateBySource',
}

export type MetadataMapperForQuantityIdentifier<
  TQuantityTypeIdentifier = HKQuantityTypeIdentifier
> = TQuantityTypeIdentifier extends 'HKQuantityTypeIdentifierInsulinDelivery'
  ? HKGenericMetadata & {
    readonly HKInsulinDeliveryReason: HKInsulinDeliveryReason;
  }
  : TQuantityTypeIdentifier extends 'HKQuantityTypeIdentifierBloodGlucose'
    ? HKGenericMetadata & {
      readonly HKBloodGlucoseMealTime?: number;
    }
    : TQuantityTypeIdentifier extends 'HKQuantityTypeIdentifierHeartRate'
      ? HKGenericMetadata & {
        readonly HKHeartRateMotionContext?: HKHeartRateMotionContext;
      }
      : HKGenericMetadata;

export type UnitForIdentifier<T extends HKQuantityTypeIdentifier = HKQuantityTypeIdentifier> =
  T extends 'HKQuantityTypeIdentifierBloodGlucose'
    ? BloodGlucoseUnit
    : T extends
    | 'HKQuantityTypeIdentifierAppleExerciseTime'
    | 'HKQuantityTypeIdentifierAppleMoveTime'
    | 'HKQuantityTypeIdentifierAppleStandTime'
      ? TimeUnit
      : T extends
      | 'HKQuantityTypeIdentifierActiveEnergyBurned'
      | 'HKQuantityTypeIdentifierBasalEnergyBurned'
      | 'HKQuantityTypeIdentifierDietaryEnergyConsumed'
        ? EnergyUnit
        : T extends
        | 'HKQuantityTypeIdentifierDistanceCycling'
        | 'HKQuantityTypeIdentifierDistanceDownhillSnowSports'
        | 'HKQuantityTypeIdentifierDistanceSwimming'
        | 'HKQuantityTypeIdentifierDistanceWalkingRunning'
        | 'HKQuantityTypeIdentifierDistanceWheelchair'
        | 'HKQuantityTypeIdentifierSixMinuteWalkTestDistance'
        | 'HKQuantityTypeIdentifierWaistCircumference'
          ? LengthUnit
          : T extends
          | 'HKQuantityTypeIdentifierBodyFatPercentage'
          | 'HKQuantityTypeIdentifierOxygenSaturation'
          | 'HKQuantityTypeIdentifierWalkingAsymmetryPercentage'
          | 'HKQuantityTypeIdentifierWalkingDoubleSupportPercentage'
            ? HKUnits.Percent
            : T extends
            | 'HKQuantityTypeIdentifierBasalBodyTemperature'

              ? TemperatureUnit
              : T extends
              | 'HKQuantityTypeIdentifierRunningSpeed'
              | 'HKQuantityTypeIdentifierStairAscentSpeed'
              | 'HKQuantityTypeIdentifierStairDescentSpeed'
              | 'HKQuantityTypeIdentifierWalkingSpeed'

                ? SpeedUnit<LengthUnit, TimeUnit>
                : T extends
                | 'HKQuantityTypeIdentifierFlightsClimbed'
                | 'HKQuantityTypeIdentifierNumberOfAlcoholicBeverages'
                | 'HKQuantityTypeIdentifierNumberOfTimesFallen'
                | 'HKQuantityTypeIdentifierPushCount'
                | 'HKQuantityTypeIdentifierStepCount'
                | 'HKQuantityTypeIdentifierSwimmingStrokeCount'
                  ? HKUnits.Count
                  : T extends
                  | 'HKQuantityTypeIdentifierDietaryBiotin'
                  | 'HKQuantityTypeIdentifierDietaryCaffeine'
                  | 'HKQuantityTypeIdentifierDietaryCalcium'
                  | 'HKQuantityTypeIdentifierDietaryCarbohydrates'
                  | 'HKQuantityTypeIdentifierDietaryChloride'
                  | 'HKQuantityTypeIdentifierDietaryCholesterol'
                  | 'HKQuantityTypeIdentifierDietaryChromium'
                  | 'HKQuantityTypeIdentifierDietaryCopper'
                  | 'HKQuantityTypeIdentifierDietaryFatMonounsaturated'
                  | 'HKQuantityTypeIdentifierDietaryFatPolyunsaturated'
                  | 'HKQuantityTypeIdentifierDietaryFatSaturated'
                  | 'HKQuantityTypeIdentifierDietaryFatTotal'
                  | 'HKQuantityTypeIdentifierDietaryFiber'
                  | 'HKQuantityTypeIdentifierDietaryFolate'
                  | 'HKQuantityTypeIdentifierDietaryIodine'
                  | 'HKQuantityTypeIdentifierDietaryIron'
                  | 'HKQuantityTypeIdentifierDietaryMagnesium'
                  | 'HKQuantityTypeIdentifierDietaryManganese'
                  | 'HKQuantityTypeIdentifierDietaryMolybdenum'
                  | 'HKQuantityTypeIdentifierDietaryNiacin'
                  | 'HKQuantityTypeIdentifierDietaryPantothenicAcid'
                  | 'HKQuantityTypeIdentifierDietaryPhosphorus'
                  | 'HKQuantityTypeIdentifierDietaryPotassium'
                  | 'HKQuantityTypeIdentifierDietaryProtein'
                  | 'HKQuantityTypeIdentifierDietaryRiboflavin'
                  | 'HKQuantityTypeIdentifierDietarySelenium'
                  | 'HKQuantityTypeIdentifierDietarySodium'
                  | 'HKQuantityTypeIdentifierDietarySugar'
                  | 'HKQuantityTypeIdentifierDietaryThiamin'
                  | 'HKQuantityTypeIdentifierDietaryVitaminA'
                  | 'HKQuantityTypeIdentifierDietaryVitaminB6'
                  | 'HKQuantityTypeIdentifierDietaryVitaminB12'
                  | 'HKQuantityTypeIdentifierDietaryVitaminC'
                  | 'HKQuantityTypeIdentifierDietaryVitaminD'
                  | 'HKQuantityTypeIdentifierDietaryVitaminE'
                  | 'HKQuantityTypeIdentifierDietaryVitaminK'
                  | 'HKQuantityTypeIdentifierDietaryZinc'
                    ? MassUnit
                    : T extends 'HKQuantityTypeIdentifierDietaryWater'
                      ? VolumeUnit
                      : T extends 'HKQuantityTypeIdentifierInsulinDelivery'
                        ? HKUnits.InternationalUnit | `${HKUnits.InternationalUnit}`
                        : T extends
                        | 'HKQuantityTypeIdentifierHeartRate'
                        | 'HKQuantityTypeIdentifierRestingHeartRate'
                        | 'HKQuantityTypeIdentifierWalkingHeartRateAverage'
                          ? CountPerTime<TimeUnit>
                          : HKUnit;



export interface QuantityType extends HybridObject<{ ios: 'swift' }> {

  readonly saveQuantitySample: (
    identifier: HKQuantityTypeIdentifier,
    unit: HKUnit,
    value: number,
    start: string,
    end: string,
    metadata: HKGenericMetadata
  ) => Promise<boolean>;
  readonly deleteQuantitySample: (
    identifier: HKQuantityTypeIdentifier,
    uuid: string
  ) => Promise<boolean>;
  readonly deleteSamples: (
    identifier: HKQuantityTypeIdentifier,  
    start: string,
    end: string
  ) => Promise<boolean>;
  readonly queryWorkoutSamples: (
    energyUnit: EnergyUnit,
    distanceUnit: LengthUnit,
    from: string,
    to: string,
    limit: number,
    ascending: boolean
  ) => Promise<readonly HKWorkoutRaw[]>;
  readonly queryCategorySamples: (
    identifier: HKCategoryTypeIdentifier,
    from: string,
    to: string,
    limit: number,
    ascending: boolean
  ) => Promise<readonly HKCategorySampleRaw[]>;
  readonly queryQuantitySamples: (
    identifier: HKQuantityTypeIdentifier,
    unit: UnitForIdentifier<HKQuantityTypeIdentifier>,
    from: string,
    to: string,
    limit: number,
    ascending: boolean
  ) => Promise<readonly HKQuantitySampleRaw[]>;

  readonly queryStatisticsForQuantity: (
    identifier: HKQuantityTypeIdentifier,
    unit: UnitForIdentifier,
    from: string,
    to: string,
    options: readonly HKStatisticsOptions[],
  ) => Promise<QueryStatisticsResponseRaw>;
  readonly queryStatisticsCollectionForQuantity: <
    TIdentifier extends HKQuantityTypeIdentifier,
    TUnit extends UnitForIdentifier<TIdentifier>
  >(
    identifier: TIdentifier,
    unit: TUnit,
    options: readonly HKStatisticsOptions[],
    anchorDate: string,
    intervalComponents: IntervalComponents,
    startDate: string,
    endDate: string
  ) => Promise<readonly QueryStatisticsResponseRaw<TIdentifier, TUnit>[]>;


  readonly queryQuantitySamplesWithAnchor: <
    TIdentifier extends HKQuantityTypeIdentifier,
    TUnit extends UnitForIdentifier<TIdentifier>
  >(
    identifier: TIdentifier,
    unit: TUnit,
    from: string,
    to: string,
    limit: number,
    anchor: string
  ) => Promise<QueryQuantitySamplesResponseRaw<TIdentifier>>;
}