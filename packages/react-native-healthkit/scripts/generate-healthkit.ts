import ts from 'typescript'

type ObjectType =
  | 'common'
  | 'sample'
  | 'categorySample'
  | 'quantitySample'
  | 'workout'
  | 'workoutEvent'

interface EnumMemberSchema {
  readonly name: string
  readonly swiftName: string
  readonly rawValue: number
}

interface EnumSchema {
  readonly name: string
  readonly ios: string | null
  readonly members: readonly EnumMemberSchema[]
}

interface QuantityIdentifierSchema {
  readonly name: string
  readonly ios: string | null
  readonly canonicalUnit: string | null
  readonly aggregationStyle: string | null
  readonly writeable: boolean
  readonly legacy: boolean
}

interface CategoryIdentifierSchema {
  readonly name: string
  readonly ios: string | null
  readonly valueEnum: string | null
  readonly writeable: boolean
  readonly legacy: boolean
}

type MetadataValueKind = 'string' | 'boolean' | 'number' | 'quantity' | 'enum'

interface MetadataKeySchema {
  readonly keyConstant: string
  readonly rawKey: string
  readonly ios: string | null
  readonly expectedType: string | null
  readonly tsType: string
  readonly valueKind: MetadataValueKind
  readonly enumName: string | null
  readonly objectTypes: readonly ObjectType[]
  readonly identifiers: readonly string[]
}

export interface HealthkitSchema {
  readonly quantityIdentifiers: readonly QuantityIdentifierSchema[]
  readonly categoryIdentifiers: readonly CategoryIdentifierSchema[]
  readonly enums: readonly EnumSchema[]
  readonly metadataKeys: readonly MetadataKeySchema[]
}

interface MetadataOverride {
  readonly objectTypes?: readonly ObjectType[]
  readonly identifiers?: readonly string[]
  readonly tsType?: string
  readonly valueKind?: MetadataValueKind
  readonly enumName?: string | null
  readonly skip?: boolean
}

export interface IdentifierOverrides {
  readonly quantity: {
    readonly readOnly: readonly string[]
  }
  readonly category: {
    readonly readOnly: readonly string[]
  }
}

interface SymbolGraphAvailabilityItem {
  readonly domain?: string
  readonly introduced?: {
    readonly major?: number
    readonly minor?: number
  }
  readonly deprecated?: {
    readonly major?: number
    readonly minor?: number
  }
  readonly renamed?: string
}

interface SymbolGraphSymbol {
  readonly kind?: {
    readonly identifier?: string
  }
  readonly identifier?: {
    readonly precise?: string
  }
  readonly pathComponents?: readonly string[]
  readonly names?: {
    readonly title?: string
  }
  readonly availability?: readonly SymbolGraphAvailabilityItem[]
}

export interface SymbolGraphDocument {
  readonly symbols: readonly SymbolGraphSymbol[]
}

interface SymbolGraphNamedConstant {
  readonly name: string
  readonly ios: string | null
  readonly legacy: boolean
}

const METADATA_OVERRIDES: Record<string, MetadataOverride> = {
  HKMetadataKeyDeviceSerialNumber: {
    objectTypes: ['common'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeyUDIDeviceIdentifier: {
    objectTypes: ['common'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeyUDIProductionIdentifier: {
    objectTypes: ['common'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeyDigitalSignature: {
    objectTypes: ['common'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeyExternalUUID: {
    objectTypes: ['common'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeySyncIdentifier: {
    objectTypes: ['common'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeySyncVersion: {
    objectTypes: ['common'],
    tsType: 'number',
    valueKind: 'number',
    enumName: null,
  },
  HKMetadataKeyTimeZone: {
    objectTypes: ['common'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeyDeviceName: {
    objectTypes: ['common'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeyDeviceManufacturerName: {
    objectTypes: ['common'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeyWasTakenInLab: {
    objectTypes: ['common'],
    tsType: 'boolean',
    valueKind: 'boolean',
    enumName: null,
  },
  HKMetadataKeyReferenceRangeLowerLimit: {
    objectTypes: ['common'],
    tsType: 'number',
    valueKind: 'number',
    enumName: null,
  },
  HKMetadataKeyReferenceRangeUpperLimit: {
    objectTypes: ['common'],
    tsType: 'number',
    valueKind: 'number',
    enumName: null,
  },
  HKMetadataKeyWasUserEntered: {
    objectTypes: ['common'],
    tsType: 'boolean',
    valueKind: 'boolean',
    enumName: null,
  },
  HKMetadataKeyWeatherCondition: {
    objectTypes: ['sample', 'workout'],
    tsType: 'WeatherCondition',
    valueKind: 'enum',
    enumName: 'WeatherCondition',
  },
  HKMetadataKeyWeatherTemperature: {
    objectTypes: ['sample', 'workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyWeatherHumidity: {
    objectTypes: ['sample', 'workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyActivityType: {
    objectTypes: ['sample'],
    tsType: 'WorkoutActivityType',
    valueKind: 'enum',
    enumName: 'WorkoutActivityType',
  },
  HKMetadataKeyAlgorithmVersion: {
    objectTypes: ['sample'],
    tsType: 'number',
    valueKind: 'number',
    enumName: null,
  },
  HKMetadataKeyUserMotionContext: {
    objectTypes: ['sample'],
    tsType: 'UserMotionContext',
    valueKind: 'enum',
    enumName: 'UserMotionContext',
  },
  HKMetadataKeyAverageMETs: {
    objectTypes: ['workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyAverageSpeed: {
    objectTypes: ['workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyMaximumSpeed: {
    objectTypes: ['workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyAlpineSlopeGrade: {
    objectTypes: ['workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyElevationAscended: {
    objectTypes: ['workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyElevationDescended: {
    objectTypes: ['workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyDateOfEarliestDataUsedForEstimate: {
    objectTypes: ['sample'],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeyGlassesPrescriptionDescription: {
    objectTypes: [],
    tsType: 'string',
    valueKind: 'string',
    enumName: null,
  },
  HKMetadataKeyAppleDeviceCalibrated: {
    objectTypes: ['sample'],
    tsType: 'boolean',
    valueKind: 'boolean',
    enumName: null,
  },
  HKMetadataKeySexualActivityProtectionUsed: {
    objectTypes: ['categorySample'],
    identifiers: ['HKCategoryTypeIdentifierSexualActivity'],
  },
  HKMetadataKeyMenstrualCycleStart: {
    objectTypes: ['categorySample'],
    identifiers: ['HKCategoryTypeIdentifierMenstrualFlow'],
  },
  HKMetadataKeyBodyTemperatureSensorLocation: {
    objectTypes: ['quantitySample'],
    identifiers: [
      'HKQuantityTypeIdentifierBodyTemperature',
      'HKQuantityTypeIdentifierBasalBodyTemperature',
    ],
    tsType: 'BodyTemperatureSensorLocation',
    valueKind: 'enum',
    enumName: 'BodyTemperatureSensorLocation',
  },
  HKMetadataKeyHeartRateSensorLocation: {
    objectTypes: ['quantitySample'],
    tsType: 'HeartRateSensorLocation',
    valueKind: 'enum',
    enumName: 'HeartRateSensorLocation',
  },
  HKMetadataKeyHeartRateMotionContext: {
    objectTypes: ['quantitySample'],
    tsType: 'HeartRateMotionContext',
    valueKind: 'enum',
    enumName: 'HeartRateMotionContext',
  },
  HKMetadataKeyHeartRateEventThreshold: {
    objectTypes: ['categorySample'],
    identifiers: [
      'HKCategoryTypeIdentifierHighHeartRateEvent',
      'HKCategoryTypeIdentifierLowHeartRateEvent',
    ],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeySessionEstimate: {
    objectTypes: ['quantitySample'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyHeartRateRecoveryTestType: {
    objectTypes: ['quantitySample'],
    tsType: 'HeartRateRecoveryTestType',
    valueKind: 'enum',
    enumName: 'HeartRateRecoveryTestType',
  },
  HKMetadataKeyHeartRateRecoveryActivityType: {
    objectTypes: ['quantitySample'],
    tsType: 'WorkoutActivityType',
    valueKind: 'enum',
    enumName: 'WorkoutActivityType',
  },
  HKMetadataKeyHeartRateRecoveryActivityDuration: {
    objectTypes: ['quantitySample'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyHeartRateRecoveryMaxObservedRecoveryHeartRate: {
    objectTypes: ['quantitySample'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyBloodGlucoseMealTime: {
    objectTypes: ['quantitySample'],
    identifiers: ['HKQuantityTypeIdentifierBloodGlucose'],
    tsType: 'BloodGlucoseMealTime',
    valueKind: 'enum',
    enumName: 'BloodGlucoseMealTime',
  },
  HKMetadataKeyVO2MaxTestType: {
    objectTypes: ['quantitySample'],
    identifiers: ['HKQuantityTypeIdentifierVO2Max'],
    tsType: 'VO2MaxTestType',
    valueKind: 'enum',
    enumName: 'VO2MaxTestType',
  },
  HKMetadataKeyInsulinDeliveryReason: {
    objectTypes: ['quantitySample'],
    identifiers: ['HKQuantityTypeIdentifierInsulinDelivery'],
    tsType: 'InsulinDeliveryReason',
    valueKind: 'enum',
    enumName: 'InsulinDeliveryReason',
  },
  HKMetadataKeyQuantityClampedToLowerBound: {
    objectTypes: ['quantitySample'],
    tsType: 'boolean',
    valueKind: 'boolean',
    enumName: null,
  },
  HKMetadataKeyQuantityClampedToUpperBound: {
    objectTypes: ['quantitySample'],
    tsType: 'boolean',
    valueKind: 'boolean',
    enumName: null,
  },
  HKMetadataKeyAudioExposureLevel: {
    objectTypes: ['categorySample'],
    identifiers: [
      'HKCategoryTypeIdentifierAudioExposureEvent',
      'HKCategoryTypeIdentifierEnvironmentalAudioExposureEvent',
      'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent',
    ],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyVO2MaxValue: {
    objectTypes: ['categorySample'],
    identifiers: ['HKCategoryTypeIdentifierLowCardioFitnessEvent'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyLowCardioFitnessEventThreshold: {
    objectTypes: ['categorySample'],
    identifiers: ['HKCategoryTypeIdentifierLowCardioFitnessEvent'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyHeadphoneGain: {
    objectTypes: ['categorySample'],
    identifiers: [
      'HKCategoryTypeIdentifierAudioExposureEvent',
      'HKCategoryTypeIdentifierHeadphoneAudioExposureEvent',
    ],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyWorkoutBrandName: {
    objectTypes: ['workout'],
  },
  HKMetadataKeyGroupFitness: {
    objectTypes: ['workout'],
  },
  HKMetadataKeyAppleFitnessPlusCatalogIdentifier: {
    objectTypes: ['workout'],
  },
  HKMetadataKeyAppleFitnessPlusSession: {
    objectTypes: ['workout'],
  },
  HKMetadataKeyIndoorWorkout: {
    objectTypes: ['workout'],
  },
  HKMetadataKeyCoachedWorkout: {
    objectTypes: ['workout'],
  },
  HKMetadataKeyLapLength: {
    objectTypes: ['workout'],
  },
  HKMetadataKeySwimmingLocationType: {
    objectTypes: ['workout'],
    tsType: 'WorkoutSwimmingLocationType',
    valueKind: 'enum',
    enumName: 'WorkoutSwimmingLocationType',
  },
  HKMetadataKeySwimmingStrokeStyle: {
    objectTypes: ['workoutEvent'],
    tsType: 'SwimmingStrokeStyle',
    valueKind: 'enum',
    enumName: 'SwimmingStrokeStyle',
  },
  HKMetadataKeySWOLFScore: {
    objectTypes: ['workout'],
    tsType: 'number',
    valueKind: 'number',
    enumName: null,
  },
  HKMetadataKeyCrossTrainerDistance: {
    objectTypes: ['workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyFitnessMachineDuration: {
    objectTypes: ['workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyIndoorBikeDistance: {
    objectTypes: ['workout'],
    tsType: 'Quantity',
    valueKind: 'quantity',
    enumName: null,
  },
  HKMetadataKeyPhysicalEffortEstimationType: {
    objectTypes: ['sample'],
    tsType: 'PhysicalEffortEstimationType',
    valueKind: 'enum',
    enumName: 'PhysicalEffortEstimationType',
  },
  HKMetadataKeyWaterSalinity: {
    objectTypes: ['sample'],
    tsType: 'WaterSalinity',
    valueKind: 'enum',
    enumName: 'WaterSalinity',
  },
}

const CATEGORY_VALUE_ENUM_OVERRIDES: Record<string, string> = {
  HKCategoryTypeIdentifierMenstrualFlow: 'HKCategoryValueMenstrualFlow',
  HKCategoryTypeIdentifierAudioExposureEvent:
    'HKCategoryValueEnvironmentalAudioExposureEvent',
}

const EXISTING_ENUM_NAME_OVERRIDES: Record<string, string> = {
  HKWeatherCondition: 'WeatherCondition',
  HKHeartRateMotionContext: 'HeartRateMotionContext',
  HKInsulinDeliveryReason: 'InsulinDeliveryReason',
}

function lowerFirst(value: string): string {
  if (!value) {
    return value
  }

  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`
}

function toTsEnumName(swiftName: string): string {
  return EXISTING_ENUM_NAME_OVERRIDES[swiftName] ?? swiftName.replace(/^HK/, '')
}

function toRawMetadataKey(keyConstant: string): string {
  return keyConstant.replace(/^HKMetadataKey/, 'HK')
}

function splitTopLevelCommas(input: string): string[] {
  const result: string[] = []
  let current = ''
  let depth = 0

  for (const char of input) {
    if (char === '(') {
      depth += 1
    } else if (char === ')') {
      depth = Math.max(0, depth - 1)
    }

    if (char === ',' && depth === 0) {
      if (current.trim()) {
        result.push(current.trim())
      }
      current = ''
      continue
    }

    current += char
  }

  if (current.trim()) {
    result.push(current.trim())
  }

  return result
}

function parseIosAvailability(text: string): string | null {
  const match = text.match(/ios\(([^),]+)/)
  return match?.[1]?.trim() ?? null
}

function parseSymbolGraphIosAvailability(
  symbol: SymbolGraphSymbol,
): string | null {
  const iosAvailability = symbol.availability?.find(
    (entry) => entry.domain === 'iOS',
  )
  const major = iosAvailability?.introduced?.major
  if (major == null) {
    return null
  }
  const minor = iosAvailability?.introduced?.minor ?? 0
  return `${major}.${minor}`
}

function isLegacySymbol(symbol: SymbolGraphSymbol): boolean {
  return (
    symbol.availability?.some(
      (entry) => entry.deprecated != null || entry.renamed != null,
    ) ?? false
  )
}

function parseSwiftNamedConstants(
  symbolGraph: SymbolGraphDocument,
  ownerName: string,
  precisePrefix?: string,
): SymbolGraphNamedConstant[] {
  return symbolGraph.symbols
    .filter((symbol) => symbol.kind?.identifier === 'swift.type.property')
    .filter((symbol) => symbol.pathComponents?.[0] === ownerName)
    .filter((symbol) =>
      precisePrefix == null
        ? true
        : (symbol.identifier?.precise?.startsWith(precisePrefix) ?? false),
    )
    .map((symbol) => {
      const precise = symbol.identifier?.precise
      const name = precise?.replace(/^c:@/, '')
      if (name == null) {
        throw new Error(`Missing precise identifier for ${ownerName} constant`)
      }

      return {
        name,
        ios: parseSymbolGraphIosAvailability(symbol),
        legacy: isLegacySymbol(symbol),
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name))
}

function sanitizeEnumEntry(entry: string): string {
  return entry
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseNumericValue(
  rawValue: string | undefined,
  knownValues: Map<string, number>,
  previousValue: number,
): number {
  if (rawValue == null || rawValue === '') {
    return previousValue + 1
  }

  const cleanValue = rawValue.trim()
  if (/^-?\d+$/.test(cleanValue)) {
    return Number.parseInt(cleanValue, 10)
  }

  if (knownValues.has(cleanValue)) {
    const knownValue = knownValues.get(cleanValue)
    if (knownValue != null) {
      return knownValue
    }
  }

  return previousValue + 1
}

export function parseNsEnums(headerSource: string): EnumSchema[] {
  const enums: EnumSchema[] = []
  const enumRegex =
    /typedef NS_ENUM\((?:NS)?(?:U)?Integer,\s*(\w+)\)\s*\{([\s\S]*?)\}\s*([^;]*);/g

  for (const match of headerSource.matchAll(enumRegex)) {
    const swiftName = match[1]
    const rawBody = match[2]
    if (swiftName == null || rawBody == null) {
      continue
    }
    const body = rawBody.replace(/\/\/.*$/gm, '')
    const trailer = match[3] ?? ''
    const ios = parseIosAvailability(trailer)
    const entries = splitTopLevelCommas(body)
    const members: EnumMemberSchema[] = []
    const knownValues = new Map<string, number>()
    let previousValue = -1

    for (const rawEntry of entries) {
      const entry = sanitizeEnumEntry(rawEntry)
      if (!entry) {
        continue
      }

      const nameMatch = entry.match(/^(\w+)/)
      if (!nameMatch) {
        continue
      }

      const fullName = nameMatch[1]
      if (fullName == null) {
        continue
      }
      const suffix = fullName.startsWith(swiftName)
        ? fullName.slice(swiftName.length)
        : fullName.replace(/^HK/, '')
      const memberName = lowerFirst(
        /^\d/.test(suffix) ? `value${suffix}` : suffix,
      )
      const rawValueMatch = entry.match(/=\s*([^=]+)$/)
      const rawValue = parseNumericValue(
        rawValueMatch?.[1],
        knownValues,
        previousValue,
      )
      previousValue = rawValue
      knownValues.set(fullName, rawValue)

      members.push({
        name: memberName,
        swiftName: fullName,
        rawValue,
      })
    }

    enums.push({
      name: toTsEnumName(swiftName),
      ios,
      members,
    })
  }

  return enums.sort((left, right) => left.name.localeCompare(right.name))
}

function parseQuantityIdentifierComments(headerSource: string): Map<
  string,
  {
    readonly canonicalUnit: string | null
    readonly aggregationStyle: string | null
  }
> {
  const identifiers = new Map<
    string,
    {
      readonly canonicalUnit: string | null
      readonly aggregationStyle: string | null
    }
  >()
  const regex =
    /^HK_EXTERN HKQuantityTypeIdentifier const (\w+)\s+([^;]*);\s*\/\/\s*(.*)$/gm

  for (const match of headerSource.matchAll(regex)) {
    const name = match[1]
    if (name == null) {
      continue
    }
    const comment = match[3]?.trim() ?? ''
    const [canonicalUnitRaw, aggregationRaw] = comment
      .split(',')
      .map((value) => value.trim())
    identifiers.set(name, {
      canonicalUnit: canonicalUnitRaw || null,
      aggregationStyle: aggregationRaw || null,
    })
  }

  return identifiers
}

function parseCategoryIdentifierValueEnums(
  headerSource: string,
): Map<string, string | null> {
  const identifiers = new Map<string, string | null>()
  const regex =
    /^HK_EXTERN HKCategoryTypeIdentifier const (\w+)\s+([^;]*);\s*\/\/\s*(.*)$/gm

  for (const match of headerSource.matchAll(regex)) {
    const name = match[1]
    if (name == null) {
      continue
    }
    const comment = match[3]?.trim() ?? ''
    identifiers.set(
      name,
      CATEGORY_VALUE_ENUM_OVERRIDES[name] ?? (comment || null),
    )
  }

  return identifiers
}

function parseMetadataDocComments(headerSource: string): Map<
  string,
  {
    readonly expectedType: string | null
    readonly objectTypes: readonly ObjectType[]
    readonly identifiers: readonly string[]
  }
> {
  const keys = new Map<
    string,
    {
      readonly expectedType: string | null
      readonly objectTypes: readonly ObjectType[]
      readonly identifiers: readonly string[]
    }
  >()
  const regex =
    /(\/\*![\s\S]*?\*\/)\s*HK_EXTERN NSString \* const (HKMetadataKey\w+)\s*([^;]*);/g

  for (const match of headerSource.matchAll(regex)) {
    const docComment = match[1]
    const keyConstant = match[2]
    if (docComment == null || keyConstant == null) {
      continue
    }

    keys.set(keyConstant, {
      expectedType: extractExpectedType(docComment),
      objectTypes: inferObjectTypes(docComment).objectTypes,
      identifiers: inferObjectTypes(docComment).identifiers,
    })
  }

  return keys
}

function parseQuantityIdentifiers(
  symbolGraph: SymbolGraphDocument,
  headerSource: string,
  overrides: IdentifierOverrides,
): QuantityIdentifierSchema[] {
  const readOnly = new Set(overrides.quantity.readOnly)
  const commentMap = parseQuantityIdentifierComments(headerSource)
  const identifiers = new Map<string, QuantityIdentifierSchema>()
  const discovered = parseSwiftNamedConstants(
    symbolGraph,
    'HKQuantityTypeIdentifier',
    'c:@HKQuantityTypeIdentifier',
  )

  for (const constant of discovered) {
    const commentInfo = commentMap.get(constant.name)
    identifiers.set(constant.name, {
      name: constant.name,
      ios: constant.ios,
      canonicalUnit: commentInfo?.canonicalUnit ?? null,
      aggregationStyle: commentInfo?.aggregationStyle ?? null,
      writeable: !readOnly.has(constant.name),
      legacy: constant.legacy,
    })
  }

  return [...identifiers.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  )
}

function parseCategoryIdentifiers(
  symbolGraph: SymbolGraphDocument,
  headerSource: string,
  overrides: IdentifierOverrides,
): CategoryIdentifierSchema[] {
  const readOnly = new Set(overrides.category.readOnly)
  const valueEnumMap = parseCategoryIdentifierValueEnums(headerSource)
  const identifiers = new Map<string, CategoryIdentifierSchema>()
  const discovered = parseSwiftNamedConstants(
    symbolGraph,
    'HKCategoryTypeIdentifier',
    'c:@HKCategoryTypeIdentifier',
  )

  for (const constant of discovered) {
    identifiers.set(constant.name, {
      name: constant.name,
      ios: constant.ios,
      valueEnum: valueEnumMap.get(constant.name) ?? null,
      writeable: !readOnly.has(constant.name),
      legacy: constant.legacy,
    })
  }

  return [...identifiers.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  )
}

function extractExpectedType(docComment: string): string | null {
  const normalized = docComment.replace(/\s+/g, ' ')
  const match = normalized.match(/The expected value type is ([^.]+)\./i)
  return match?.[1]?.trim() ?? null
}

function inferObjectTypes(docComment: string): {
  readonly objectTypes: ObjectType[]
  readonly identifiers: string[]
} {
  const normalized = docComment.replace(/\s+/g, ' ')
  const identifiers = [
    ...new Set(
      [...normalized.matchAll(/HK(?:Category|Quantity)TypeIdentifier\w+/g)].map(
        (match) => match[0],
      ),
    ),
  ]
  const objectTypes = new Set<ObjectType>()

  if (
    /HKObject|creating an HKObject|when the HKObject was created|of the HKObject/i.test(
      normalized,
    )
  ) {
    objectTypes.add('common')
  }

  if (/sample|reading|HKSample/i.test(normalized)) {
    objectTypes.add('sample')
  }

  if (/category sample/i.test(normalized)) {
    objectTypes.add('categorySample')
  }

  if (/quantity sample|HKQuantitySample/i.test(normalized)) {
    objectTypes.add('quantitySample')
  }

  if (
    /HKWorkout object|workout segment|distance sample|workout was/i.test(
      normalized,
    )
  ) {
    objectTypes.add('workout')
  }

  if (/HKWorkoutEvent object/i.test(normalized)) {
    objectTypes.add('workoutEvent')
  }

  return {
    objectTypes: [...objectTypes],
    identifiers,
  }
}

function inferTsType(expectedType: string | null): {
  readonly tsType: string
  readonly valueKind: MetadataValueKind
  readonly enumName: string | null
} | null {
  if (expectedType == null) {
    return null
  }

  if (/NSString/i.test(expectedType)) {
    return {
      tsType: 'string',
      valueKind: 'string',
      enumName: null,
    }
  }

  if (/BOOL/i.test(expectedType)) {
    return {
      tsType: 'boolean',
      valueKind: 'boolean',
      enumName: null,
    }
  }

  if (/HKQuantity/i.test(expectedType)) {
    return {
      tsType: 'Quantity',
      valueKind: 'quantity',
      enumName: null,
    }
  }

  const enumMatch = expectedType.match(/\b(HK[A-Za-z0-9]+)\b/)

  if (enumMatch?.[1] && enumMatch[1] !== 'HKQuantity') {
    return {
      tsType: toTsEnumName(enumMatch[1]),
      valueKind: 'enum',
      enumName: toTsEnumName(enumMatch[1]),
    }
  }

  if (/NSNumber/i.test(expectedType)) {
    return {
      tsType: 'number',
      valueKind: 'number',
      enumName: null,
    }
  }

  return null
}

function parseMetadataKeys(
  symbolGraph: SymbolGraphDocument,
  headerSource: string,
): MetadataKeySchema[] {
  const keys: MetadataKeySchema[] = []
  const docCommentMap = parseMetadataDocComments(headerSource)
  const metadataConstants = symbolGraph.symbols
    .filter((symbol) => symbol.kind?.identifier === 'swift.var')
    .filter((symbol) =>
      symbol.identifier?.precise?.startsWith('c:@HKMetadataKey'),
    )
    .map((symbol) => {
      const precise = symbol.identifier?.precise
      const name = precise?.replace(/^c:@/, '')
      if (name == null) {
        throw new Error('Missing metadata key precise identifier')
      }
      return {
        name,
        ios: parseSymbolGraphIosAvailability(symbol),
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name))

  for (const constant of metadataConstants) {
    const docComment = docCommentMap.get(constant.name)
    const keyConstant = constant.name
    const ios = constant.ios
    const expectedType = docComment?.expectedType ?? null
    const inferred = inferTsType(expectedType)
    const override = METADATA_OVERRIDES[keyConstant]

    if (override?.skip) {
      continue
    }

    if (inferred == null && override?.tsType == null) {
      continue
    }

    const tsType = override?.tsType ?? inferred?.tsType
    const valueKind = override?.valueKind ?? inferred?.valueKind
    const enumName =
      override != null && 'enumName' in override
        ? (override.enumName ?? null)
        : (inferred?.enumName ?? null)

    if (tsType == null || valueKind == null) {
      continue
    }

    keys.push({
      keyConstant,
      rawKey: toRawMetadataKey(keyConstant),
      ios,
      expectedType,
      tsType,
      valueKind,
      enumName,
      objectTypes: override?.objectTypes ?? docComment?.objectTypes ?? [],
      identifiers: override?.identifiers ?? docComment?.identifiers ?? [],
    })
  }

  return keys.sort((left, right) => left.rawKey.localeCompare(right.rawKey))
}

export function buildHealthkitSchemaFromSources(sources: {
  readonly sdkPath: string
  readonly symbolGraph: SymbolGraphDocument
  readonly identifierOverrides: IdentifierOverrides
  readonly typeIdentifiersHeader: string
  readonly categoryValuesHeader: string
  readonly metadataHeader: string
  readonly metadataEnumsHeader: string
  readonly workoutHeader: string
}): HealthkitSchema {
  const enumsByName = new Map<string, EnumSchema>()
  for (const enumSchema of [
    ...parseNsEnums(sources.categoryValuesHeader),
    ...parseNsEnums(sources.metadataEnumsHeader),
    ...parseNsEnums(sources.workoutHeader).filter(
      (schema) =>
        schema.name === 'WorkoutActivityType' ||
        schema.name === 'WorkoutEventType',
    ),
  ]) {
    enumsByName.set(enumSchema.name, enumSchema)
  }

  return {
    quantityIdentifiers: parseQuantityIdentifiers(
      sources.symbolGraph,
      sources.typeIdentifiersHeader,
      sources.identifierOverrides,
    ),
    categoryIdentifiers: parseCategoryIdentifiers(
      sources.symbolGraph,
      sources.typeIdentifiersHeader,
      sources.identifierOverrides,
    ),
    enums: [...enumsByName.values()].sort((left, right) =>
      left.name.localeCompare(right.name),
    ),
    metadataKeys: parseMetadataKeys(
      sources.symbolGraph,
      sources.metadataHeader,
    ),
  }
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)]
}

function tsSource(
  strings: TemplateStringsArray,
  ...values: readonly string[]
): string {
  let output = ''

  for (const [index, string] of strings.entries()) {
    output += string
    output += values[index] ?? ''
  }

  return output
}

const FACTORY = ts.factory
const EXPORT_MODIFIER = FACTORY.createModifier(ts.SyntaxKind.ExportKeyword)
const READONLY_MODIFIER = FACTORY.createModifier(ts.SyntaxKind.ReadonlyKeyword)

function identifierName(name: string): ts.PropertyName {
  return FACTORY.createIdentifier(name)
}

function stringLiteralType(value: string): ts.TypeNode {
  return FACTORY.createLiteralTypeNode(FACTORY.createStringLiteral(value))
}

function keywordType(kind: ts.KeywordTypeSyntaxKind): ts.KeywordTypeNode {
  return FACTORY.createKeywordTypeNode(kind)
}

function namedType(
  name: string,
  typeArguments: ts.TypeNode[] = [],
): ts.TypeNode {
  switch (name) {
    case 'string':
      return keywordType(ts.SyntaxKind.StringKeyword)
    case 'number':
      return keywordType(ts.SyntaxKind.NumberKeyword)
    case 'boolean':
      return keywordType(ts.SyntaxKind.BooleanKeyword)
    case 'never':
      return keywordType(ts.SyntaxKind.NeverKeyword)
    default:
      return FACTORY.createTypeReferenceNode(name, typeArguments)
  }
}

function canonicalUnitToTypeNode(unit: string | null): ts.TypeNode {
  if (unit == null) {
    return keywordType(ts.SyntaxKind.StringKeyword)
  }

  if (unit === 'mg/dL' || unit.startsWith('mmol<')) {
    return namedType('BloodGlucoseUnit')
  }
  if (unit === '%') {
    return stringLiteralType('%')
  }
  if (unit === 'count') {
    return stringLiteralType('count')
  }
  if (unit === 'IU') {
    return stringLiteralType('IU')
  }
  if (unit === 'appleEffortScore') {
    return stringLiteralType('appleEffortScore')
  }
  if (unit === 'degC' || unit === 'degF' || unit === 'K') {
    return namedType('TemperatureUnit')
  }
  if (
    unit === 'm' ||
    unit === 'cm' ||
    unit === 'km' ||
    unit === 'ft' ||
    unit === 'in' ||
    unit === 'yd' ||
    unit === 'mi'
  ) {
    return namedType('LengthUnit')
  }
  if (
    unit === 'kg' ||
    unit === 'g' ||
    unit === 'mg' ||
    unit === 'mcg' ||
    unit === 'oz' ||
    unit === 'lb' ||
    unit === 'st'
  ) {
    return namedType('MassUnit')
  }
  if (unit === 'l' || unit === 'ml') {
    return namedType('VolumeUnit')
  }
  if (unit === 'kcal' || unit === 'Cal' || unit === 'cal' || unit === 'J') {
    return namedType('EnergyUnit')
  }
  if (unit === 'd' || unit === 'hr' || unit === 'min' || unit === 's') {
    return namedType('TimeUnit')
  }
  if (/^count\/(s|min|hr|d)$/.test(unit)) {
    return namedType('CountPerTime', [namedType('TimeUnit')])
  }
  if (
    /^(m|km|cm|ft|in|yd|mi)\/(s|min|hr|d)$/.test(unit) ||
    /^(m|km|cm)\/(s|min|hr)$/.test(unit)
  ) {
    return namedType('SpeedUnit', [
      namedType('LengthUnit'),
      namedType('TimeUnit'),
    ])
  }
  if (
    unit === 'mmHg' ||
    unit === 'inHg' ||
    unit === 'cmAq' ||
    unit === 'atm' ||
    unit === 'dBASPL' ||
    unit === 'Pa'
  ) {
    return namedType('PressureUnit')
  }
  if (unit === 'Hz') {
    return namedType('Unit')
  }

  return keywordType(ts.SyntaxKind.StringKeyword)
}

function exportedTypeAlias(
  name: string,
  type: ts.TypeNode,
  typeParameters?: ts.TypeParameterDeclaration[],
): ts.TypeAliasDeclaration {
  return FACTORY.createTypeAliasDeclaration(
    [EXPORT_MODIFIER],
    name,
    typeParameters,
    type,
  )
}

function exportedInterface(
  name: string,
  members: ts.TypeElement[],
  extendsNames: string[] = [],
): ts.InterfaceDeclaration {
  return FACTORY.createInterfaceDeclaration(
    [EXPORT_MODIFIER],
    name,
    undefined,
    extendsNames.map((extendName) =>
      FACTORY.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        FACTORY.createExpressionWithTypeArguments(
          FACTORY.createIdentifier(extendName),
          undefined,
        ),
      ]),
    ),
    members,
  )
}

function readonlyProperty(
  name: string,
  type: ts.TypeNode,
  optional = true,
): ts.PropertySignature {
  return FACTORY.createPropertySignature(
    [READONLY_MODIFIER],
    identifierName(name),
    optional ? FACTORY.createToken(ts.SyntaxKind.QuestionToken) : undefined,
    type,
  )
}

function exportedConstObject(
  name: string,
  entries: readonly { readonly key: string; readonly value: string | null }[],
): ts.VariableStatement {
  return FACTORY.createVariableStatement(
    [EXPORT_MODIFIER],
    FACTORY.createVariableDeclarationList(
      [
        FACTORY.createVariableDeclaration(
          name,
          undefined,
          undefined,
          FACTORY.createAsExpression(
            FACTORY.createObjectLiteralExpression(
              entries.map((entry) =>
                FACTORY.createPropertyAssignment(
                  identifierName(entry.key),
                  entry.value == null
                    ? FACTORY.createNull()
                    : FACTORY.createStringLiteral(entry.value),
                ),
              ),
              true,
            ),
            FACTORY.createTypeReferenceNode('const'),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  )
}

function createLiteralUnion(values: readonly string[]): ts.TypeNode {
  if (values.length === 0) {
    return keywordType(ts.SyntaxKind.NeverKeyword)
  }
  if (values.length === 1) {
    const firstValue = values[0]
    if (firstValue == null) {
      return keywordType(ts.SyntaxKind.NeverKeyword)
    }
    return stringLiteralType(firstValue)
  }
  return FACTORY.createUnionTypeNode(
    values.map((value) => stringLiteralType(value)),
  )
}

function createPickType(
  baseName: string,
  fields: readonly string[],
): ts.TypeNode {
  return namedType('Pick', [namedType(baseName), createLiteralUnion(fields)])
}

function createKeyofType(name: string): ts.TypeNode {
  return FACTORY.createTypeOperatorNode(
    ts.SyntaxKind.KeyOfKeyword,
    namedType(name),
  )
}

function createConditionalGeneratedType(
  genericName: string,
  baseName: string,
  mapName: string,
  fallbackType: ts.TypeNode,
): ts.TypeAliasDeclaration {
  return exportedTypeAlias(
    genericName,
    FACTORY.createIntersectionTypeNode([
      namedType(baseName),
      FACTORY.createParenthesizedType(
        FACTORY.createConditionalTypeNode(
          namedType('T'),
          createKeyofType(mapName),
          FACTORY.createIndexedAccessTypeNode(
            namedType(mapName),
            namedType('T'),
          ),
          fallbackType,
        ),
      ),
    ]),
    [
      FACTORY.createTypeParameterDeclaration(
        undefined,
        'T',
        FACTORY.createTypeReferenceNode(
          genericName.includes('Quantity')
            ? 'QuantityTypeIdentifier'
            : 'CategoryTypeIdentifier',
        ),
        FACTORY.createTypeReferenceNode(
          genericName.includes('Quantity')
            ? 'QuantityTypeIdentifier'
            : 'CategoryTypeIdentifier',
        ),
      ),
    ],
  )
}

export function renderGeneratedTypescript(schema: HealthkitSchema): string {
  const statements: ts.Statement[] = []

  statements.push(
    FACTORY.createImportDeclaration(
      undefined,
      FACTORY.createImportClause(
        true,
        undefined,
        FACTORY.createNamedImports([
          FACTORY.createImportSpecifier(
            true,
            undefined,
            FACTORY.createIdentifier('Quantity'),
          ),
        ]),
      ),
      FACTORY.createStringLiteral('../types/QuantityType'),
    ),
  )
  statements.push(
    FACTORY.createImportDeclaration(
      undefined,
      FACTORY.createImportClause(
        true,
        undefined,
        FACTORY.createNamedImports(
          [
            'BloodGlucoseUnit',
            'CountPerTime',
            'EnergyUnit',
            'LengthUnit',
            'MassUnit',
            'PressureUnit',
            'SpeedUnit',
            'TemperatureUnit',
            'TimeUnit',
          ].map((name) =>
            FACTORY.createImportSpecifier(
              true,
              undefined,
              FACTORY.createIdentifier(name),
            ),
          ),
        ),
      ),
      FACTORY.createStringLiteral('../types/Units'),
    ),
  )

  const quantityReadOnly = schema.quantityIdentifiers
    .filter((identifier) => !identifier.writeable)
    .map((identifier) => identifier.name)
  const quantityWriteable = schema.quantityIdentifiers
    .filter((identifier) => identifier.writeable)
    .map((identifier) => identifier.name)
  const categoryReadOnly = schema.categoryIdentifiers
    .filter((identifier) => !identifier.writeable)
    .map((identifier) => identifier.name)
  const categoryWriteable = schema.categoryIdentifiers
    .filter((identifier) => identifier.writeable)
    .map((identifier) => identifier.name)

  statements.push(
    exportedTypeAlias(
      'QuantityTypeIdentifierReadOnly',
      createLiteralUnion(quantityReadOnly),
    ),
    exportedTypeAlias(
      'QuantityTypeIdentifierWriteable',
      createLiteralUnion(quantityWriteable),
    ),
    exportedTypeAlias(
      'QuantityTypeIdentifier',
      FACTORY.createUnionTypeNode([
        namedType('QuantityTypeIdentifierReadOnly'),
        namedType('QuantityTypeIdentifierWriteable'),
      ]),
    ),
    exportedTypeAlias(
      'CategoryTypeIdentifierReadOnly',
      createLiteralUnion(categoryReadOnly),
    ),
    exportedTypeAlias(
      'CategoryTypeIdentifierWriteable',
      createLiteralUnion(categoryWriteable),
    ),
    exportedTypeAlias(
      'CategoryTypeIdentifier',
      FACTORY.createUnionTypeNode([
        namedType('CategoryTypeIdentifierReadOnly'),
        namedType('CategoryTypeIdentifierWriteable'),
      ]),
    ),
  )

  statements.push(
    exportedConstObject(
      'QUANTITY_IDENTIFIER_IOS_AVAILABILITY',
      schema.quantityIdentifiers.map((identifier) => ({
        key: identifier.name,
        value: identifier.ios,
      })),
    ),
    exportedConstObject(
      'CATEGORY_IDENTIFIER_IOS_AVAILABILITY',
      schema.categoryIdentifiers.map((identifier) => ({
        key: identifier.name,
        value: identifier.ios,
      })),
    ),
    exportedConstObject(
      'QUANTITY_IDENTIFIER_CANONICAL_UNITS',
      schema.quantityIdentifiers.map((identifier) => ({
        key: identifier.name,
        value: identifier.canonicalUnit,
      })),
    ),
    exportedConstObject(
      'CATEGORY_IDENTIFIER_VALUE_ENUMS',
      schema.categoryIdentifiers.map((identifier) => ({
        key: identifier.name,
        value: identifier.valueEnum ? toTsEnumName(identifier.valueEnum) : null,
      })),
    ),
  )

  statements.push(
    ...schema.enums.map((schemaEnum) =>
      FACTORY.createEnumDeclaration(
        [EXPORT_MODIFIER],
        schemaEnum.name,
        schemaEnum.members.map((member) =>
          FACTORY.createEnumMember(
            member.name,
            FACTORY.createNumericLiteral(member.rawValue),
          ),
        ),
      ),
    ),
  )

  const categoryValueMembers = schema.categoryIdentifiers
    .filter((identifier) => identifier.valueEnum != null)
    .map((identifier) => {
      if (identifier.valueEnum == null) {
        throw new Error(`Missing category value enum for ${identifier.name}`)
      }
      return readonlyProperty(
        identifier.name,
        namedType(toTsEnumName(identifier.valueEnum)),
        false,
      )
    })
  statements.push(
    exportedInterface('CategoryValueByIdentifierMap', categoryValueMembers),
    exportedTypeAlias(
      'CategoryValueForIdentifierGenerated',
      FACTORY.createConditionalTypeNode(
        namedType('T'),
        createKeyofType('CategoryValueByIdentifierMap'),
        FACTORY.createIndexedAccessTypeNode(
          namedType('CategoryValueByIdentifierMap'),
          namedType('T'),
        ),
        keywordType(ts.SyntaxKind.NumberKeyword),
      ),
      [
        FACTORY.createTypeParameterDeclaration(
          undefined,
          'T',
          namedType('CategoryTypeIdentifier'),
          namedType('CategoryTypeIdentifier'),
        ),
      ],
    ),
  )

  const metadataByObjectType = {
    common: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('common'),
    ),
    sample: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('sample'),
    ),
    categorySample: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('categorySample'),
    ),
    quantitySample: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('quantitySample'),
    ),
    workout: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('workout'),
    ),
    workoutEvent: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('workoutEvent'),
    ),
  }

  const uniqueMetadataMembers = (
    keys: readonly HealthkitSchema['metadataKeys'][number][],
  ) =>
    unique(keys.map((key) => key.rawKey)).map((rawKey) => {
      const key = keys.find((entry) => entry.rawKey === rawKey)
      if (key == null) {
        throw new Error(`Missing metadata key for raw key ${rawKey}`)
      }
      return readonlyProperty(key.rawKey, namedType(key.tsType))
    })

  const quantityGlobalKeys = metadataByObjectType.quantitySample.filter(
    (key) => key.identifiers.length === 0,
  )
  const quantitySpecificKeys = metadataByObjectType.quantitySample.filter(
    (key) => key.identifiers.length > 0,
  )
  const categorySpecificKeys = metadataByObjectType.categorySample.filter(
    (key) => key.identifiers.length > 0,
  )

  statements.push(
    exportedInterface(
      'KnownObjectMetadata',
      uniqueMetadataMembers(metadataByObjectType.common),
    ),
    exportedInterface(
      'KnownSampleMetadata',
      uniqueMetadataMembers(metadataByObjectType.sample),
      ['KnownObjectMetadata'],
    ),
    exportedInterface(
      'CategoryTypedMetadata',
      uniqueMetadataMembers(metadataByObjectType.categorySample),
      ['KnownSampleMetadata'],
    ),
    exportedInterface(
      'QuantityTypedMetadata',
      uniqueMetadataMembers([...quantityGlobalKeys, ...quantitySpecificKeys]),
      ['KnownSampleMetadata'],
    ),
    exportedInterface(
      'WorkoutTypedMetadata',
      uniqueMetadataMembers(metadataByObjectType.workout),
      ['KnownSampleMetadata'],
    ),
    exportedInterface(
      'WorkoutEventTypedMetadata',
      uniqueMetadataMembers(metadataByObjectType.workoutEvent),
    ),
  )

  const categorySpecificMap = new Map<string, string[]>()
  for (const key of categorySpecificKeys) {
    for (const identifier of key.identifiers) {
      const fields = categorySpecificMap.get(identifier) ?? []
      fields.push(key.rawKey)
      categorySpecificMap.set(identifier, fields)
    }
  }
  const quantitySpecificMap = new Map<string, string[]>()
  for (const key of quantitySpecificKeys) {
    for (const identifier of key.identifiers) {
      const fields = quantitySpecificMap.get(identifier) ?? []
      fields.push(key.rawKey)
      quantitySpecificMap.set(identifier, fields)
    }
  }

  statements.push(
    exportedInterface(
      'CategorySpecificMetadataByIdentifierMap',
      [...categorySpecificMap.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([identifier, fields]) =>
          readonlyProperty(
            identifier,
            createPickType('CategoryTypedMetadata', fields.sort()),
            false,
          ),
        ),
    ),
    createConditionalGeneratedType(
      'CategoryTypedMetadataForIdentifierGenerated',
      'KnownSampleMetadata',
      'CategorySpecificMetadataByIdentifierMap',
      namedType('Record', [
        keywordType(ts.SyntaxKind.StringKeyword),
        keywordType(ts.SyntaxKind.NeverKeyword),
      ]),
    ),
    exportedInterface(
      'QuantitySpecificMetadataByIdentifierMap',
      [...quantitySpecificMap.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([identifier, fields]) =>
          readonlyProperty(
            identifier,
            createPickType('QuantityTypedMetadata', fields.sort()),
            false,
          ),
        ),
    ),
    exportedTypeAlias(
      'QuantityTypedMetadataForIdentifierGenerated',
      FACTORY.createIntersectionTypeNode([
        namedType('KnownSampleMetadata'),
        namedType('Pick', [
          namedType('QuantityTypedMetadata'),
          createLiteralUnion(
            quantityGlobalKeys.map((key) => key.rawKey).sort(),
          ),
        ]),
        FACTORY.createParenthesizedType(
          FACTORY.createConditionalTypeNode(
            namedType('T'),
            createKeyofType('QuantitySpecificMetadataByIdentifierMap'),
            FACTORY.createIndexedAccessTypeNode(
              namedType('QuantitySpecificMetadataByIdentifierMap'),
              namedType('T'),
            ),
            namedType('Record', [
              keywordType(ts.SyntaxKind.StringKeyword),
              keywordType(ts.SyntaxKind.NeverKeyword),
            ]),
          ),
        ),
      ]),
      [
        FACTORY.createTypeParameterDeclaration(
          undefined,
          'T',
          namedType('QuantityTypeIdentifier'),
          namedType('QuantityTypeIdentifier'),
        ),
      ],
    ),
  )

  statements.push(
    exportedInterface(
      'QuantityUnitByIdentifierMap',
      schema.quantityIdentifiers.map((identifier) =>
        readonlyProperty(
          identifier.name,
          canonicalUnitToTypeNode(identifier.canonicalUnit),
          false,
        ),
      ),
    ),
    exportedTypeAlias(
      'UnitForIdentifierGenerated',
      FACTORY.createConditionalTypeNode(
        namedType('T'),
        createKeyofType('QuantityUnitByIdentifierMap'),
        FACTORY.createIndexedAccessTypeNode(
          namedType('QuantityUnitByIdentifierMap'),
          namedType('T'),
        ),
        keywordType(ts.SyntaxKind.StringKeyword),
      ),
      [
        FACTORY.createTypeParameterDeclaration(
          undefined,
          'T',
          namedType('QuantityTypeIdentifier'),
          namedType('QuantityTypeIdentifier'),
        ),
      ],
    ),
  )

  const sourceFile = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  )
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const printed = printer.printFile(sourceFile)
  return `/*\n * AUTO-GENERATED FILE. DO NOT EDIT.\n * Source: scripts/generate-healthkit.ts\n */\n\n${printed}`
}

function renderMetadataValueKindMap(
  name: string,
  keys: readonly MetadataKeySchema[],
): string {
  const entries = unique(keys.map((key) => key.rawKey))
    .sort((left, right) => left.localeCompare(right))
    .map((rawKey) => {
      const key = keys.find((entry) => entry.rawKey === rawKey)
      if (key == null) {
        throw new Error(`Missing metadata key for raw key ${rawKey}`)
      }
      return `  ${JSON.stringify(rawKey)}: ${JSON.stringify(key.valueKind)},`
    })
    .join('\n')

  return `export const ${name} = {\n${entries}\n} as const`
}

function renderIdentifierMetadataKindMap(
  name: string,
  keys: readonly MetadataKeySchema[],
): string {
  const byIdentifier = new Map<string, MetadataKeySchema[]>()

  for (const key of keys) {
    for (const identifier of key.identifiers) {
      const existing = byIdentifier.get(identifier) ?? []
      existing.push(key)
      byIdentifier.set(identifier, existing)
    }
  }

  const entries = [...byIdentifier.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([identifier, identifierKeys]) => {
      const lines = unique(identifierKeys.map((key) => key.rawKey))
        .sort((left, right) => left.localeCompare(right))
        .map((rawKey) => {
          const key = identifierKeys.find((entry) => entry.rawKey === rawKey)
          if (key == null) {
            throw new Error(`Missing metadata key for raw key ${rawKey}`)
          }
          return `    ${JSON.stringify(rawKey)}: ${JSON.stringify(key.valueKind)},`
        })
        .join('\n')

      return `  ${JSON.stringify(identifier)}: {\n${lines}\n  },`
    })
    .join('\n')

  return `export const ${name} = {\n${entries}\n} as const`
}

export function renderGeneratedContracts(schema: HealthkitSchema): string {
  const metadataByObjectType = {
    common: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('common'),
    ),
    sample: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('sample'),
    ),
    categorySample: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('categorySample'),
    ),
    quantitySample: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('quantitySample'),
    ),
    workout: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('workout'),
    ),
    workoutEvent: schema.metadataKeys.filter((key) =>
      key.objectTypes.includes('workoutEvent'),
    ),
  }

  return tsSource`/*
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: scripts/generate-healthkit.ts
 */

import { z } from 'zod'
import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'

export type ContractMetadataValueKind = 'string' | 'boolean' | 'number' | 'quantity' | 'enum'

${renderMetadataValueKindMap(
  'KNOWN_OBJECT_METADATA_KIND_BY_KEY',
  metadataByObjectType.common,
)}

${renderMetadataValueKindMap(
  'KNOWN_SAMPLE_METADATA_KIND_BY_KEY',
  metadataByObjectType.sample,
)}

${renderMetadataValueKindMap(
  'KNOWN_WORKOUT_METADATA_KIND_BY_KEY',
  metadataByObjectType.workout,
)}

${renderMetadataValueKindMap(
  'KNOWN_WORKOUT_EVENT_METADATA_KIND_BY_KEY',
  metadataByObjectType.workoutEvent,
)}

${renderIdentifierMetadataKindMap(
  'KNOWN_CATEGORY_METADATA_KIND_BY_IDENTIFIER',
  metadataByObjectType.categorySample.filter(
    (key) => key.identifiers.length > 0,
  ),
)}

${renderIdentifierMetadataKindMap(
  'KNOWN_QUANTITY_METADATA_KIND_BY_IDENTIFIER',
  metadataByObjectType.quantitySample.filter(
    (key) => key.identifiers.length > 0,
  ),
)}

const CATEGORY_METADATA_KIND_LOOKUP = KNOWN_CATEGORY_METADATA_KIND_BY_IDENTIFIER as Readonly<Record<string, Readonly<Record<string, ContractMetadataValueKind>>>>
const QUANTITY_METADATA_KIND_LOOKUP = KNOWN_QUANTITY_METADATA_KIND_BY_IDENTIFIER as Readonly<Record<string, Readonly<Record<string, ContractMetadataValueKind>>>>

export const contractQuantitySchema = z
  .object({
    unit: z.string(),
    quantity: z.number(),
  })
  .passthrough()

export const contractSourceSchema = z
  .object({
    name: z.string(),
    bundleIdentifier: z.string(),
  })
  .passthrough()

export const contractSourceRevisionSchema = z
  .object({
    source: contractSourceSchema,
    operatingSystemVersion: z.string(),
    version: z.string().optional(),
    productType: z.string().optional(),
  })
  .passthrough()

export const contractDeviceSchema = z
  .object({
    name: z.string().optional(),
    firmwareVersion: z.string().optional(),
    hardwareVersion: z.string().optional(),
    localIdentifier: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    softwareVersion: z.string().optional(),
    udiDeviceIdentifier: z.string().optional(),
  })
  .passthrough()

export const contractSampleTypeSchema = z
  .object({
    identifier: z.string(),
    allowsRecalibrationForEstimates: z.boolean(),
    isMinimumDurationRestricted: z.boolean(),
    isMaximumDurationRestricted: z.boolean(),
  })
  .passthrough()

export const contractWorkoutActivitySchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    uuid: z.string(),
    duration: z.number(),
  })
  .passthrough()

function contractSchemaForMetadataKind(
  kind: ContractMetadataValueKind,
): z.ZodTypeAny {
  switch (kind) {
    case 'string':
      return z.string()
    case 'boolean':
      return z.boolean()
    case 'number':
    case 'enum':
      return z.number()
    case 'quantity':
      return contractQuantitySchema
  }
}

function contractMetadataSchemaFromKinds(
  kinds: Readonly<Record<string, ContractMetadataValueKind>>,
) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const [key, kind] of Object.entries(kinds)) {
    shape[key] = contractSchemaForMetadataKind(kind).optional()
  }

  return z.object(shape).passthrough()
}

function mergeContractMetadataKinds(
  ...sources: ReadonlyArray<Readonly<Record<string, ContractMetadataValueKind>>>
): Record<string, ContractMetadataValueKind> {
  return Object.assign({}, ...sources)
}

export const contractObjectMetadataSchema = contractMetadataSchemaFromKinds(
  KNOWN_OBJECT_METADATA_KIND_BY_KEY,
)
export const contractSampleMetadataSchema = contractMetadataSchemaFromKinds(
  mergeContractMetadataKinds(
    KNOWN_OBJECT_METADATA_KIND_BY_KEY,
    KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
  ),
)
export const contractWorkoutMetadataSchema = contractMetadataSchemaFromKinds(
  mergeContractMetadataKinds(
    KNOWN_OBJECT_METADATA_KIND_BY_KEY,
    KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
    KNOWN_WORKOUT_METADATA_KIND_BY_KEY,
  ),
)
export const contractWorkoutEventMetadataSchema =
  contractMetadataSchemaFromKinds(KNOWN_WORKOUT_EVENT_METADATA_KIND_BY_KEY)

const categoryMetadataSchemaLookup = Object.fromEntries(
  Object.entries(CATEGORY_METADATA_KIND_LOOKUP).map(([identifier, kinds]) => [
    identifier,
    contractMetadataSchemaFromKinds(
      mergeContractMetadataKinds(
        KNOWN_OBJECT_METADATA_KIND_BY_KEY,
        KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
        kinds,
      ),
    ),
  ]),
) as Record<string, z.ZodTypeAny>

const quantityMetadataSchemaLookup = Object.fromEntries(
  Object.entries(QUANTITY_METADATA_KIND_LOOKUP).map(([identifier, kinds]) => [
    identifier,
    contractMetadataSchemaFromKinds(
      mergeContractMetadataKinds(
        KNOWN_OBJECT_METADATA_KIND_BY_KEY,
        KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
        kinds,
      ),
    ),
  ]),
) as Record<string, z.ZodTypeAny>

export function getKnownCategoryMetadataKindMap(
  identifier: CategoryTypeIdentifier,
): Readonly<Record<string, ContractMetadataValueKind>> {
  return CATEGORY_METADATA_KIND_LOOKUP[identifier] ?? {}
}

export function getKnownQuantityMetadataKindMap(
  identifier: QuantityTypeIdentifier,
): Readonly<Record<string, ContractMetadataValueKind>> {
  return QUANTITY_METADATA_KIND_LOOKUP[identifier] ?? {}
}

export function getCategoryMetadataContractSchema(
  identifier: CategoryTypeIdentifier,
): z.ZodTypeAny {
  return categoryMetadataSchemaLookup[identifier] ?? contractSampleMetadataSchema
}

export function getQuantityMetadataContractSchema(
  identifier: QuantityTypeIdentifier,
): z.ZodTypeAny {
  return quantityMetadataSchemaLookup[identifier] ?? contractSampleMetadataSchema
}

function createBaseSampleContractSchema(metadataSchema: z.ZodTypeAny) {
  return z
    .object({
      uuid: z.string(),
      sourceRevision: contractSourceRevisionSchema,
      device: contractDeviceSchema.optional(),
      metadata: metadataSchema,
      sampleType: contractSampleTypeSchema,
      startDate: z.date(),
      endDate: z.date(),
      hasUndeterminedDuration: z.boolean(),
    })
    .passthrough()
}

export function getQuantitySampleContractSchema(
  identifier: QuantityTypeIdentifier,
) {
  return createBaseSampleContractSchema(
    getQuantityMetadataContractSchema(identifier),
  )
    .extend({
      quantityType: z.literal(identifier),
      quantity: z.number(),
      unit: z.string(),
    })
    .passthrough()
}

export function getCategorySampleContractSchema(
  identifier: CategoryTypeIdentifier,
) {
  return createBaseSampleContractSchema(
    getCategoryMetadataContractSchema(identifier),
  )
    .extend({
      categoryType: z.literal(identifier),
      value: z.number(),
    })
    .passthrough()
}

export const contractWorkoutEventSchema = z
  .object({
    type: z.number(),
    startDate: z.date(),
    endDate: z.date(),
    metadata: contractWorkoutEventMetadataSchema.optional(),
  })
  .passthrough()

export const contractWorkoutSampleSchema = createBaseSampleContractSchema(
  contractWorkoutMetadataSchema,
)
  .extend({
    workoutActivityType: z.number(),
    duration: contractQuantitySchema,
    totalEnergyBurned: contractQuantitySchema.optional(),
    totalDistance: contractQuantitySchema.optional(),
    totalSwimmingStrokeCount: contractQuantitySchema.optional(),
    totalFlightsClimbed: contractQuantitySchema.optional(),
    events: z.array(contractWorkoutEventSchema).optional(),
    activities: z.array(contractWorkoutActivitySchema).optional(),
  })
  .passthrough()
`
}

export function renderGeneratedSwift(schema: HealthkitSchema): string {
  const booleanKeys = unique(
    schema.metadataKeys
      .filter((key) => key.valueKind === 'boolean')
      .map((key) => key.rawKey),
  )
  const numericKeys = unique(
    schema.metadataKeys
      .filter((key) => key.valueKind === 'number' || key.valueKind === 'enum')
      .map((key) => key.rawKey),
  )

  const renderSetEntries = (keys: readonly string[]) =>
    keys.map((key) => `  ${JSON.stringify(key)},`).join('\n')

  return `// AUTO-GENERATED FILE. DO NOT EDIT.\n// Source: scripts/generate-healthkit.ts\n\nimport Foundation\n\nprivate let healthkitBooleanMetadataKeys: Set<String> = [\n${renderSetEntries(booleanKeys)}\n]\n\nprivate let healthkitNumericMetadataKeys: Set<String> = [\n${renderSetEntries(numericKeys)}\n]\n\nfunc isKnownBooleanMetadataKey(_ key: String) -> Bool {\n  healthkitBooleanMetadataKeys.contains(key)\n}\n\nfunc isKnownNumericMetadataKey(_ key: String) -> Bool {\n  healthkitNumericMetadataKeys.contains(key)\n}\n`
}
