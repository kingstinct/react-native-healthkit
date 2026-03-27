import type {
  BloodGlucoseUnit,
  CategorySampleTyped,
  CategoryTypeIdentifier,
  CategoryValueForIdentifier,
  CategoryValueSleepAnalysis,
  HeartRateMotionContext,
  Quantity,
  QuantitySampleTyped,
  SwimmingStrokeStyle,
  WorkoutEvent,
  WorkoutSample,
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

type _workoutMetadataIsTypedOnMetadata = Assert<
  Equal<WorkoutSample['metadata']['HKWorkoutBrandName'], string | undefined>
>

type _workoutEventMetadataIsTypedOnMetadata = Assert<
  Equal<
    NonNullable<WorkoutEvent['metadata']>['HKSwimmingStrokeStyle'],
    SwimmingStrokeStyle | undefined
  >
>
