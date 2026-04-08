import { strict as assert } from 'node:assert'
import { buildHealthkitSchemaFromSources } from './generate-healthkit'
import { loadHealthkitSdkSources } from './healthkit-sdk'

function findMetadataKey(
  schema: ReturnType<typeof buildHealthkitSchemaFromSources>,
  keyConstant: string,
) {
  const metadataKey = schema.metadataKeys.find(
    (entry) => entry.keyConstant === keyConstant,
  )

  assert.ok(metadataKey, `Missing metadata key ${keyConstant}`)
  return metadataKey
}

function main() {
  const sources = loadHealthkitSdkSources()
  const schema = buildHealthkitSchemaFromSources(sources)

  const sleepAnalysis = schema.categoryIdentifiers.find(
    (identifier) => identifier.name === 'HKCategoryTypeIdentifierSleepAnalysis',
  )
  assert.equal(
    sleepAnalysis?.valueEnum,
    'HKCategoryValueSleepAnalysis',
    'Sleep analysis should map to HKCategoryValueSleepAnalysis',
  )

  const hypertensionEvent = schema.categoryIdentifiers.find(
    (identifier) =>
      identifier.name === 'HKCategoryTypeIdentifierHypertensionEvent',
  )
  assert.ok(
    hypertensionEvent,
    'Pinned SDK should expose HKCategoryTypeIdentifierHypertensionEvent',
  )

  const bloodGlucose = schema.quantityIdentifiers.find(
    (identifier) => identifier.name === 'HKQuantityTypeIdentifierBloodGlucose',
  )
  assert.equal(
    bloodGlucose?.canonicalUnit,
    'mg/dL',
    'Blood glucose should retain canonical unit mapping',
  )

  const workoutBrandName = findMetadataKey(
    schema,
    'HKMetadataKeyWorkoutBrandName',
  )
  assert.equal(workoutBrandName.tsType, 'string')
  assert.ok(workoutBrandName.objectTypes.includes('workout'))

  const swimmingStrokeStyle = findMetadataKey(
    schema,
    'HKMetadataKeySwimmingStrokeStyle',
  )
  assert.equal(swimmingStrokeStyle.enumName, 'SwimmingStrokeStyle')
  assert.ok(swimmingStrokeStyle.objectTypes.includes('workoutEvent'))

  const heartRateMotionContext = findMetadataKey(
    schema,
    'HKMetadataKeyHeartRateMotionContext',
  )
  assert.equal(heartRateMotionContext.enumName, 'HeartRateMotionContext')
  assert.ok(heartRateMotionContext.objectTypes.includes('quantitySample'))

  const heartRateEventThreshold = findMetadataKey(
    schema,
    'HKMetadataKeyHeartRateEventThreshold',
  )
  assert.equal(heartRateEventThreshold.tsType, 'Quantity')
  assert.ok(
    heartRateEventThreshold.identifiers.includes(
      'HKCategoryTypeIdentifierHighHeartRateEvent',
    ),
  )

  const audioExposureLevel = findMetadataKey(
    schema,
    'HKMetadataKeyAudioExposureLevel',
  )
  assert.equal(audioExposureLevel.tsType, 'Quantity')
  assert.ok(audioExposureLevel.objectTypes.includes('categorySample'))

  const appleDeviceCalibrated = findMetadataKey(
    schema,
    'HKMetadataKeyAppleDeviceCalibrated',
  )
  assert.equal(appleDeviceCalibrated.tsType, 'boolean')
  assert.ok(appleDeviceCalibrated.objectTypes.includes('sample'))

  const vo2MaxValue = findMetadataKey(schema, 'HKMetadataKeyVO2MaxValue')
  assert.equal(vo2MaxValue.tsType, 'Quantity')
  assert.ok(
    vo2MaxValue.identifiers.includes(
      'HKCategoryTypeIdentifierLowCardioFitnessEvent',
    ),
  )

  const lowCardioFitnessEventThreshold = findMetadataKey(
    schema,
    'HKMetadataKeyLowCardioFitnessEventThreshold',
  )
  assert.equal(lowCardioFitnessEventThreshold.tsType, 'Quantity')

  const earliestEstimateDate = findMetadataKey(
    schema,
    'HKMetadataKeyDateOfEarliestDataUsedForEstimate',
  )
  assert.equal(earliestEstimateDate.tsType, 'string')

  const quantityClampedToLowerBound = findMetadataKey(
    schema,
    'HKMetadataKeyQuantityClampedToLowerBound',
  )
  assert.equal(quantityClampedToLowerBound.tsType, 'boolean')

  const quantityClampedToUpperBound = findMetadataKey(
    schema,
    'HKMetadataKeyQuantityClampedToUpperBound',
  )
  assert.equal(quantityClampedToUpperBound.tsType, 'boolean')

  const glassesPrescriptionDescription = findMetadataKey(
    schema,
    'HKMetadataKeyGlassesPrescriptionDescription',
  )
  assert.equal(glassesPrescriptionDescription.tsType, 'string')

  const headphoneGain = findMetadataKey(schema, 'HKMetadataKeyHeadphoneGain')
  assert.equal(headphoneGain.tsType, 'Quantity')

  process.stdout.write(
    `Verified HealthKit SDK-backed schema invariants using ${sources.sdkPath}\n`,
  )
}

main()
