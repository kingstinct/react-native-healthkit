import type { AnyMap } from 'react-native-nitro-modules'
import type {
  CategoryTypedMetadata,
  CategoryTypedMetadataForIdentifierGenerated,
  CategoryValueForIdentifierGenerated,
} from '../generated/healthkit.generated'
import {
  CategoryValueAppetiteChanges,
  CategoryValueAppleStandHour,
  CategoryValueAppleWalkingSteadinessEvent,
  CategoryValueCervicalMucusQuality,
  CategoryValueContraceptive,
  CategoryValueEnvironmentalAudioExposureEvent,
  CategoryValueHeadphoneAudioExposureEvent,
  CategoryValueLowCardioFitnessEvent,
  CategoryValueMenstrualFlow,
  CategoryValue as CategoryValueNotApplicable,
  CategoryValueOvulationTestResult,
  CategoryValuePregnancyTestResult,
  CategoryValuePresence,
  CategoryValueProgesteroneTestResult,
  CategoryValueSeverity,
  CategoryValueSleepAnalysis,
  CategoryValueVaginalBleeding,
} from '../generated/healthkit.generated'
import type { CategoryTypeIdentifier } from './CategoryTypeIdentifier'
import type {
  BaseSample,
  DeletedSample,
  GenericMetadata,
  MetadataWithUnknown,
} from './Shared'
import type { SourceRevision } from './Source'

export {
  CategoryValueAppetiteChanges,
  CategoryValueAppleStandHour,
  CategoryValueAppleWalkingSteadinessEvent,
  CategoryValueCervicalMucusQuality,
  CategoryValueContraceptive,
  CategoryValueEnvironmentalAudioExposureEvent,
  CategoryValueHeadphoneAudioExposureEvent,
  CategoryValueLowCardioFitnessEvent,
  CategoryValueMenstrualFlow,
  CategoryValueNotApplicable,
  CategoryValueOvulationTestResult,
  CategoryValuePregnancyTestResult,
  CategoryValuePresence,
  CategoryValueProgesteroneTestResult,
  CategoryValueSeverity,
  CategoryValueSleepAnalysis,
  CategoryValueVaginalBleeding,
}

export type CategoryTypePresenceIdentifier =
  | 'HKCategoryTypeIdentifierAppetiteChanges'
  | 'HKCategoryTypeIdentifierSleepChanges'

export type CategoryTypeValueNotApplicableIdentifier =
  | 'HKCategoryTypeIdentifierHighHeartRateEvent'
  | 'HKCategoryTypeIdentifierHypertensionEvent'
  | 'HKCategoryTypeIdentifierIntermenstrualBleeding'
  | 'HKCategoryTypeIdentifierMindfulSession'
  | 'HKCategoryTypeIdentifierSexualActivity'
  | 'HKCategoryTypeIdentifierSleepApneaEvent'

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

export type CategoryValue =
  | CategoryValueForIdentifierGenerated<CategoryTypeIdentifier>
  | number

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

export interface CategorySample extends BaseSample {
  readonly categoryType: CategoryTypeIdentifier
  readonly value: CategoryValueForIdentifier
}

export interface CategorySamplesWithAnchorResponseTyped<
  T extends CategoryTypeIdentifier,
> {
  readonly samples: readonly CategorySampleTyped<T>[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export type MetadataForCategoryIdentifier<
  T extends CategoryTypeIdentifier = CategoryTypeIdentifier,
> = GenericMetadata & CategoryTypedMetadataForIdentifierGenerated<T>

export interface CategorySampleTyped<T extends CategoryTypeIdentifier>
  extends Omit<CategorySample, 'categoryType' | 'value' | 'metadata'> {
  readonly categoryType: T
  readonly value: CategoryValueForIdentifier<T>
  readonly metadata: MetadataForCategoryIdentifier<T>

  readonly metadataSexualActivityProtectionUsed?: boolean
  readonly metadataMenstrualCycleStart?: boolean
}

export type CategoryValueForIdentifier<
  T extends CategoryTypeIdentifier = CategoryTypeIdentifier,
> = CategoryValueForIdentifierGenerated<T>
