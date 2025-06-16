import type { AnyMap } from 'react-native-nitro-modules'
import type { CategoryTypeIdentifier } from './CategoryTypeIdentifier'
import type { Device } from './Device'
import type { DeletedSample, GenericMetadata } from './Shared'
import type { SourceRevision } from './Source'

export type CategoryTypePresenceIdentifier =
  | 'HKCategoryTypeIdentifierAppetiteChanges'
  | 'HKCategoryTypeIdentifierSleepChanges'

export type CategoryTypeValueNotApplicableIdentifier =
  | 'HKCategoryTypeIdentifierHighHeartRateEvent'
  | 'HKCategoryTypeIdentifierIntermenstrualBleeding'
  | 'HKCategoryTypeIdentifierMindfulSession'
  | 'HKCategoryTypeIdentifierSexualActivity'

/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepregnancytestresult Apple Docs }
 */
enum CategoryValuePregnancyTestResult {
  positive = 2,
  negative = 1,
  indeterminate = 3,
}

export type CategoryTypeSeverityIdentifier =
  | 'HKCategoryTypeIdentifierAbdominalCramps'
  | 'HKCategoryTypeIdentifierAcne'
  | 'HKCategoryTypeIdentifierBladderIncontinence'
  | 'HKCategoryTypeIdentifierBloating'
  | 'HKCategoryTypeIdentifierBreastPain'
  | 'HKCategoryTypeIdentifierChestTightnessOrPain'
  | 'HKCategoryTypeIdentifierChills'
  | 'HKCategoryTypeIdentifierConstipation'
  | 'HKCategoryTypeIdentifierCoughing'
  | 'HKCategoryTypeIdentifierDiarrhea'
  | 'HKCategoryTypeIdentifierDizziness'
  | 'HKCategoryTypeIdentifierDrySkin'
  | 'HKCategoryTypeIdentifierFainting'
  | 'HKCategoryTypeIdentifierFatigue'
  | 'HKCategoryTypeIdentifierFever'
  | 'HKCategoryTypeIdentifierGeneralizedBodyAche'
  | 'HKCategoryTypeIdentifierHairLoss'
  | 'HKCategoryTypeIdentifierHeadache'
  | 'HKCategoryTypeIdentifierHeartburn'
  | 'HKCategoryTypeIdentifierHotFlashes'
  | 'HKCategoryTypeIdentifierLossOfSmell'
  | 'HKCategoryTypeIdentifierLossOfTaste'
  | 'HKCategoryTypeIdentifierLowerBackPain'
  | 'HKCategoryTypeIdentifierMemoryLapse'
  | 'HKCategoryTypeIdentifierMoodChanges'
  | 'HKCategoryTypeIdentifierNausea'
  | 'HKCategoryTypeIdentifierNightSweats'
  | 'HKCategoryTypeIdentifierPelvicPain'
  | 'HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat'
  | 'HKCategoryTypeIdentifierRunnyNose'
  | 'HKCategoryTypeIdentifierShortnessOfBreath'
  | 'HKCategoryTypeIdentifierSinusCongestion'
  | 'HKCategoryTypeIdentifierSkippedHeartbeat'
  | 'HKCategoryTypeIdentifierSoreThroat'
  | 'HKCategoryTypeIdentifierVaginalDryness'
  | 'HKCategoryTypeIdentifierVomiting'
  | 'HKCategoryTypeIdentifierWheezing'

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
  | number

export enum CategoryValueAppleStandHour {
  stood = 0,
  idle = 1,
}

export interface CategorySampleForSaving {
  readonly start: Date
  readonly end: Date
  readonly categoryType: CategoryTypeIdentifier
  readonly value: CategoryValueForIdentifier
  readonly metadata: AnyMap
  readonly sourceRevision?: SourceRevision
}

export interface CategorySamplesWithAnchorResponse {
  readonly samples: readonly CategorySample[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export interface CategorySample {
  readonly uuid: string
  readonly device?: Device
  readonly categoryType: CategoryTypeIdentifier
  readonly startDate: Date
  readonly endDate: Date
  readonly value: CategoryValueForIdentifier
  readonly metadata: AnyMap
  readonly sourceRevision?: SourceRevision
}

export interface CategorySamplesWithAnchorResponseTyped<
  T extends CategoryTypeIdentifier,
> {
  readonly samples: readonly CategorySampleTyped<T>[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export interface CategorySampleTyped<T extends CategoryTypeIdentifier> {
  readonly uuid: string
  readonly device?: Device
  readonly categoryType: T
  readonly startDate: Date
  readonly endDate: Date
  readonly value: CategoryValueForIdentifier<T>
  readonly metadata: MetadataForCategoryIdentifier<T>
  readonly sourceRevision?: SourceRevision
}

export type MetadataForCategoryIdentifier<
  T extends CategoryTypeIdentifier = CategoryTypeIdentifier,
> = T extends 'HKCategoryTypeIdentifierSexualActivity'
  ? GenericMetadata & {
      readonly HKSexualActivityProtectionUsed: boolean
    }
  : T extends 'HKCategoryTypeIdentifierMenstrualFlow'
    ? GenericMetadata & {
        readonly HKMenstrualCycleStart: boolean
      }
    : GenericMetadata

export type CategoryValueForIdentifier<
  T extends CategoryTypeIdentifier = CategoryTypeIdentifier,
> = T extends 'HKCategoryTypeIdentifierCervicalMucusQuality'
  ? CategoryValueCervicalMucusQuality
  : T extends 'CategoryTypeIdentifierMenstrualFlow'
    ? CategoryValueMenstrualFlow
    : T extends 'HKCategoryTypeIdentifierOvulationTestResult'
      ? CategoryValueOvulationTestResult
      : T extends 'HKCategoryTypeIdentifierSleepAnalysis'
        ? CategoryValueSleepAnalysis
        : T extends CategoryTypeValueNotApplicableIdentifier
          ? CategoryValueNotApplicable
          : T extends CategoryTypeSeverityIdentifier
            ? CategoryValueSeverity
            : T extends CategoryTypePresenceIdentifier
              ? CategoryValuePresence
              : T extends 'HKCategoryTypeIdentifierLowCardioFitnessEvent'
                ? CategoryValueLowCardioFitnessEvent
                : T extends 'HKCategoryTypeIdentifierPregnancyTestResult'
                  ? CategoryValuePregnancyTestResult
                  : T extends 'HKCategoryTypeIdentifierPregnancyTestResult'
                    ? CategoryValuePregnancyTestResult
                    : T extends 'HKCategoryTypeIdentifierAppleStandHour'
                      ? CategoryValueAppleStandHour
                      : number
