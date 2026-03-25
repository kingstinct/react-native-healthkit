import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import { buildHealthkitSchemaFromSources } from './generate-healthkit'
import { GENERATED_SWIFT_PATH, loadHealthkitSdkSources } from './healthkit-sdk'

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
  const generatedSwift = readFileSync(GENERATED_SWIFT_PATH, 'utf8')

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

  assert.ok(
    generatedSwift.includes(
      'HKSwimmingStrokeStyle: metadataEnum(metadata, key: "HKSwimmingStrokeStyle", type: SwimmingStrokeStyle.self)',
    ),
    'Generated Swift should use enum serialization for HKSwimmingStrokeStyle',
  )
  assert.ok(
    generatedSwift.includes(
      'HKWeatherCondition: serializeWeatherCondition(metadata?["HKWeatherCondition"] as? HKWeatherCondition)',
    ),
    'Generated Swift should use WeatherCondition serializer',
  )
  assert.ok(
    generatedSwift.includes(
      'HKWeatherTemperature: metadataQuantity(metadata, key: "HKWeatherTemperature")',
    ),
    'Generated Swift should use quantity serialization for HKWeatherTemperature',
  )
  assert.ok(
    generatedSwift.includes(
      'HKWasUserEntered: metadataBool(metadata, key: "HKWasUserEntered")',
    ),
    'Generated Swift should use bool serialization for HKWasUserEntered',
  )

  process.stdout.write(
    `Verified HealthKit SDK-backed schema invariants using ${sources.sdkPath}\n`,
  )
}

main()
