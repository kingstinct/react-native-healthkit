import type { AnyMap, HybridObject } from "react-native-nitro-modules";

import type { DeletedSample, GenericMetadata } from "../types/Shared";
import type { CategoryTypeIdentifier } from "../types/CategoryTypeIdentifier";
import type { Device, SourceRevision } from "./CoreModule.nitro";
import type { QueryOptionsWithAnchor, QueryOptionsWithSortOrder } from "../types/QueryOptions";


export type CategoryTypePresenceIdentifier = 'CategoryTypeIdentifierAppetiteChanges'
| 'CategoryTypeIdentifierSleepChanges'

export type CategoryTypeValueNotApplicableIdentifier = 'CategoryTypeIdentifierHighHeartRateEvent'
| 'CategoryTypeIdentifierIntermenstrualBleeding'
| 'CategoryTypeIdentifierMindfulSession'
| 'CategoryTypeIdentifierSexualActivity'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepregnancytestresult Apple Docs }
 */
enum CategoryValuePregnancyTestResult {
  positive = 2,
  negative = 1,
  indeterminate = 3,
}

export type CategoryTypeSeverityIdentifier = 'CategoryTypeIdentifierAbdominalCramps'
  | 'CategoryTypeIdentifierAcne'
  | 'CategoryTypeIdentifierBladderIncontinence'
  | 'CategoryTypeIdentifierBloating'
  | 'CategoryTypeIdentifierBreastPain'
  | 'CategoryTypeIdentifierChestTightnessOrPain'
  | 'CategoryTypeIdentifierChills'
  | 'CategoryTypeIdentifierConstipation'
  | 'CategoryTypeIdentifierCoughing'
  | 'CategoryTypeIdentifierDiarrhea'
  | 'CategoryTypeIdentifierDizziness'
  | 'CategoryTypeIdentifierDrySkin'
  | 'CategoryTypeIdentifierFainting'
  | 'CategoryTypeIdentifierFatigue'
  | 'CategoryTypeIdentifierFever'
  | 'CategoryTypeIdentifierGeneralizedBodyAche'
  | 'CategoryTypeIdentifierHairLoss'
  | 'CategoryTypeIdentifierHeadache'
  | 'CategoryTypeIdentifierHeartburn'
  | 'CategoryTypeIdentifierHotFlashes'
  | 'CategoryTypeIdentifierLossOfSmell'
  | 'CategoryTypeIdentifierLossOfTaste'
  | 'CategoryTypeIdentifierLowerBackPain'
  | 'CategoryTypeIdentifierMemoryLapse'
  | 'CategoryTypeIdentifierMoodChanges'
  | 'CategoryTypeIdentifierNausea'
  | 'CategoryTypeIdentifierNightSweats'
  | 'CategoryTypeIdentifierPelvicPain'
  | 'CategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat'
  | 'CategoryTypeIdentifierRunnyNose'
  | 'CategoryTypeIdentifierShortnessOfBreath'
  | 'CategoryTypeIdentifierSinusCongestion'
  | 'CategoryTypeIdentifierSkippedHeartbeat'
  | 'CategoryTypeIdentifierSoreThroat'
  | 'CategoryTypeIdentifierVaginalDryness'
  | 'CategoryTypeIdentifierVomiting'
  | 'CategoryTypeIdentifierWheezing'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluecervicalmucusquality Apple Docs }
 */
export enum CategoryValueCervicalMucusQuality {
  dry = 1,
  sticky = 2,
  creamy = 3,
  watery = 4,
  eggWhite = 5,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluemenstrualflow Apple Docs }
 */
export enum CategoryValueMenstrualFlow {
  unspecified = 1,
  none = 5,
  light = 2,
  medium = 3,
  heavy = 4,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueovulationtestresult Apple Docs }
 */
export enum CategoryValueOvulationTestResult {
  negative = 1,
  luteinizingHormoneSurge = 2,
  indeterminate = 3,
  estrogenSurge = 4,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluesleepanalysis Apple Docs }
 */
export enum CategoryValueSleepAnalysis {
  inBed = 0,
  asleepUnspecified = 1,
  awake = 2,
  asleepCore = 3,
  asleepDeep = 4,
  asleepREM = 5,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueappetitechanges Apple Docs}
 */
export enum CategoryValueAppetiteChanges {
  decreased = 2,
  increased = 3,
  noChange = 1,
  unspecified = 0,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepresence Apple Docs}
 */
export enum CategoryValuePresence {
  notPresent = 1,
  present = 0,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueseverity Apple Docs }
 */
export enum CategoryValueSeverity {
  notPresent = 1,
  mild = 2,
  moderate = 3,
  severe = 4,
  unspecified = 0,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalue/notapplicable Apple Docs }
 */
export enum CategoryValueNotApplicable {
  notApplicable = 0,
}


export enum CategoryValueLowCardioFitnessEvent {
  lowFitness = 1,
}

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalue Apple Docs }
 */
export type CategoryValue =
  | CategoryValueAppetiteChanges
  | CategoryValueCervicalMucusQuality
  | CategoryValueLowCardioFitnessEvent
  | CategoryValueMenstrualFlow
  | CategoryValueOvulationTestResult
  | CategoryValuePresence
  | CategoryValueSeverity
  | CategoryValueSleepAnalysis
  | number;


export enum CategoryValueAppleStandHour {
  stood = 0,
  idle = 1,
}


export interface CategorySampleForSaving {
  readonly start: Date;
  readonly end: Date;
  readonly categoryType: CategoryTypeIdentifier;
  readonly value: CategoryValueForIdentifier;
  readonly metadata: AnyMap;
  readonly sourceRevision?: SourceRevision;
};

export interface QueryCategorySamplesResponseRaw {
  readonly samples: readonly CategorySample[];
  readonly deletedSamples: readonly DeletedSample[];
  readonly newAnchor: string;
};

export interface CategorySample {
  readonly uuid: string;
  readonly device?: Device;
  readonly categoryType: CategoryTypeIdentifier;
  readonly start: Date;
  readonly end: Date;
  readonly value: CategoryValueForIdentifier;
  readonly metadata: AnyMap;
  readonly sourceRevision?: SourceRevision;
};

export type CategoryValueForIdentifier<T extends CategoryTypeIdentifier = CategoryTypeIdentifier> =
  T extends 'CategoryTypeIdentifierCervicalMucusQuality'
    ? CategoryValueCervicalMucusQuality
    : T extends 'CategoryTypeIdentifierMenstrualFlow'
      ? CategoryValueMenstrualFlow
      : T extends 'CategoryTypeIdentifierOvulationTestResult'
        ? CategoryValueOvulationTestResult
        : T extends 'CategoryTypeIdentifierSleepAnalysis'
          ? CategoryValueSleepAnalysis
          : T extends CategoryTypeValueNotApplicableIdentifier
            ? CategoryValueNotApplicable
            : T extends CategoryTypeSeverityIdentifier
              ? CategoryValueSeverity
              : T extends CategoryTypePresenceIdentifier
                ? CategoryValuePresence
                : T extends 'CategoryTypeIdentifierLowCardioFitnessEvent'
                  ? CategoryValueLowCardioFitnessEvent
                  : T extends 'CategoryTypeIdentifierPregnancyTestResult'
                    ? CategoryValuePregnancyTestResult
                    : T extends 'CategoryTypeIdentifierPregnancyTestResult'
                      ? CategoryValuePregnancyTestResult
                      : T extends 'CategoryTypeIdentifierAppleStandHour'
                        ? CategoryValueAppleStandHour
                        : number;


export interface CategoryTypeModule extends HybridObject<{ ios: 'swift' }> {

  saveCategorySample(
    identifier: CategoryTypeIdentifier,
    value: CategoryValueForIdentifier,
    start: Date,
    end: Date,
    metadata: AnyMap
  ): Promise<boolean>;

  queryCategorySamples(
    identifier: CategoryTypeIdentifier,
    options?: QueryOptionsWithSortOrder
  ): Promise<readonly CategorySample[]>;


  queryCategorySamplesWithAnchor(
    identifier: CategoryTypeIdentifier,
    options: QueryOptionsWithAnchor
  ): Promise<QueryCategorySamplesResponseRaw>;

}

export type MetadataMapperForCategoryIdentifier<
  T extends CategoryTypeIdentifier = CategoryTypeIdentifier
> = T extends 'CategoryTypeIdentifierSexualActivity'
  ? GenericMetadata & {
    readonly HKSexualActivityProtectionUsed: boolean;
  }
  : T extends 'CategoryTypeIdentifierMenstrualFlow'
    ? GenericMetadata & {
      readonly HKMenstrualCycleStart: boolean;
    }
    : GenericMetadata;
