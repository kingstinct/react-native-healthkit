import type {
  BloodGlucoseUnit,
  CategorySampleTyped,
  CategoryTypeIdentifier,
  CategoryTypeIdentifierWriteable,
  CategoryValueForIdentifier,
  CategoryValueSleepAnalysis,
  CorrelationSampleTyped,
  HeartRateMotionContext,
  Quantity,
  QuantitySampleTyped,
  QueryOptionsWithAnchorAndUnit,
  QueryOptionsWithSortOrderAndUnit,
  StateOfMindSampleTyped,
  StatisticsQueryOptions,
  SwimmingStrokeStyle,
  WorkoutEventTyped,
  WorkoutSampleTyped,
} from '../types'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false

type Assert<T extends true> = T

type _sleepAnalysisValuesAreTyped = Assert<
  Equal<
    CategoryValueForIdentifier<'HKCategoryTypeIdentifierSleepAnalysis'>,
    CategoryValueSleepAnalysis
  >
>

type _newCategoryIdentifierFromSdkIsPresent = Assert<
  'HKCategoryTypeIdentifierHypertensionEvent' extends CategoryTypeIdentifier
    ? true
    : false
>

type _heartRateMetadataNarrowsToEnum = Assert<
  Equal<
    QuantitySampleTyped<'HKQuantityTypeIdentifierHeartRate'>['metadata']['HKHeartRateMotionContext'],
    HeartRateMotionContext | undefined
  >
>

type _categoryMetadataIncludesKnownSampleFields = Assert<
  Equal<
    CategorySampleTyped<'HKCategoryTypeIdentifierSleepAnalysis'>['metadata']['HKWasUserEntered'],
    boolean | undefined
  >
>

type _heartRateEventMetadataIsTypedOnMetadata = Assert<
  Equal<
    QuantitySampleTyped<'HKQuantityTypeIdentifierHeartRate'>['metadata']['HKAppleDeviceCalibrated'],
    boolean | undefined
  >
>

type _quantityMetadataIncludesEstimateDate = Assert<
  Equal<
    QuantitySampleTyped<'HKQuantityTypeIdentifierVO2Max'>['metadata']['HKDateOfEarliestDataUsedForEstimate'],
    string | undefined
  >
>

type _heartRateEventThresholdMetadataIsTyped = Assert<
  Equal<
    CategorySampleTyped<'HKCategoryTypeIdentifierHighHeartRateEvent'>['metadata']['HKHeartRateEventThreshold'],
    Quantity | undefined
  >
>

type _bloodGlucoseUnitNarrows = Assert<
  Equal<
    QuantitySampleTyped<'HKQuantityTypeIdentifierBloodGlucose'>['unit'],
    BloodGlucoseUnit
  >
>

type _quantityQueryOptionsUnitNarrows = Assert<
  Equal<
    QueryOptionsWithSortOrderAndUnit<BloodGlucoseUnit>['unit'],
    BloodGlucoseUnit | undefined
  >
>

type _quantityAnchorQueryOptionsUnitNarrows = Assert<
  Equal<
    QueryOptionsWithAnchorAndUnit<BloodGlucoseUnit>['unit'],
    BloodGlucoseUnit | undefined
  >
>

type _quantityStatisticsOptionsUnitNarrows = Assert<
  Equal<
    StatisticsQueryOptions<BloodGlucoseUnit>['unit'],
    BloodGlucoseUnit | undefined
  >
>

type _categorySaveIdentifierIsWriteableOnly = Assert<
  'HKCategoryTypeIdentifierHighHeartRateEvent' extends CategoryTypeIdentifierWriteable
    ? false
    : true
>

type _stateOfMindMetadataIsTyped = Assert<
  Equal<
    StateOfMindSampleTyped['metadata']['HKWasUserEntered'],
    boolean | undefined
  >
>

type _correlationMetadataIsTyped = Assert<
  Equal<CorrelationSampleTyped['metadata']['HKFoodType'], string | undefined>
>

type _workoutMetadataIsTypedOnMetadata = Assert<
  Equal<
    WorkoutSampleTyped['metadata']['HKWorkoutBrandName'],
    string | undefined
  >
>

type _workoutEventMetadataIsTypedOnMetadata = Assert<
  Equal<
    NonNullable<WorkoutEventTyped['metadata']>['HKSwimmingStrokeStyle'],
    SwimmingStrokeStyle | undefined
  >
>
