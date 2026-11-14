// Writes the package's Exact interface, `exact.json`, from the tables below.
// Run with `bun scripts/manifest.mjs` (or `--check` to fail when the file on
// disk differs). The names mirror @kingstinct/react-native-healthkit's
// exports one to one; each takes its arguments as keyword options, as every
// Exact name does.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const PACKAGE = '@kingstinct/exact-healthkit'
const here = import.meta.dir
const version = JSON.parse(
  readFileSync(join(here, '..', 'package.json'), 'utf8'),
).version

const NON_APPLE = ['web', 'macos', 'linux', 'windows', 'tvos', 'android']
const unsupported = { unsupported: NON_APPLE }

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

const base = {
  uuid: 'string',
  sourceRevision: 'SourceRevision',
  device: 'option<Device>',
  metadata: 'MetadataEntry[]',
  sampleType: 'SampleType',
  startDate: 'number',
  endDate: 'number',
  hasUndeterminedDuration: 'bool',
}

const anchored = (samples, key = 'samples') => ({
  [key]: `${samples}[]`,
  deletedSamples: 'DeletedSample[]',
  newAnchor: 'string',
})

const statistics = {
  averageQuantity: 'option<Quantity>',
  maximumQuantity: 'option<Quantity>',
  minimumQuantity: 'option<Quantity>',
  sumQuantity: 'option<Quantity>',
  mostRecentQuantity: 'option<Quantity>',
  mostRecentQuantityDateInterval: 'option<DateInterval>',
  duration: 'option<Quantity>',
  startDate: 'option<number>',
  endDate: 'option<number>',
}

const filterBase = {
  uuid: 'option<string>',
  uuids: 'option<string[]>',
  metadata: 'option<MetadataPredicate>',
  date: 'option<DateFilter>',
  workoutUuid: 'option<string>',
  sourceBundleIdentifiers: 'option<string[]>',
}

const workoutFilterBase = {
  ...filterBase,
  workoutActivityType: 'option<number>',
  duration: 'option<WorkoutDurationPredicate>',
}

const shapes = {
  // Objects HealthKit answers with.
  Source: { name: 'string', bundleIdentifier: 'string' },
  SourceRevision: {
    source: 'Source',
    version: 'option<string>',
    operatingSystemVersion: 'string',
    productType: 'option<string>',
  },
  Device: {
    name: 'option<string>',
    firmwareVersion: 'option<string>',
    hardwareVersion: 'option<string>',
    localIdentifier: 'option<string>',
    manufacturer: 'option<string>',
    model: 'option<string>',
    softwareVersion: 'option<string>',
    udiDeviceIdentifier: 'option<string>',
  },
  Quantity: { unit: 'string', quantity: 'number' },
  DateInterval: { from: 'number', to: 'number' },
  // One metadata key and its value: exactly one of the value fields is set.
  // Dates are ms since the epoch.
  MetadataEntry: {
    key: 'string',
    stringValue: 'option<string>',
    numberValue: 'option<number>',
    boolValue: 'option<bool>',
    dateValue: 'option<number>',
    quantityValue: 'option<Quantity>',
  },
  SampleType: {
    identifier: 'string',
    allowsRecalibrationForEstimates: 'bool',
    isMinimumDurationRestricted: 'bool',
    isMaximumDurationRestricted: 'bool',
  },
  DeletedSample: { uuid: 'string', metadata: 'MetadataEntry[]' },

  QuantitySample: {
    ...base,
    quantityType: 'string',
    quantity: 'number',
    unit: 'string',
  },
  QuantitySamplesWithAnchorResponse: anchored('QuantitySample'),
  CategorySample: { ...base, categoryType: 'string', value: 'number' },
  CategorySamplesWithAnchorResponse: anchored('CategorySample'),
  CorrelationSample: {
    ...base,
    correlationType: 'string',
    quantitySamples: 'QuantitySample[]',
    categorySamples: 'CategorySample[]',
  },
  QueryCorrelationSamplesWithAnchorResponse: anchored(
    'CorrelationSample',
    'correlations',
  ),

  QueryStatisticsResponse: { ...statistics, sources: 'Source[]' },
  QueryStatisticsResponseFromSingleSource: { ...statistics, source: 'Source' },

  WorkoutEvent: {
    type: 'number',
    startDate: 'number',
    endDate: 'number',
    metadata: 'MetadataEntry[]',
  },
  WorkoutActivity: {
    uuid: 'string',
    startDate: 'number',
    endDate: 'number',
    duration: 'number',
    activityType: 'number',
    locationType: 'number',
    metadata: 'MetadataEntry[]',
  },
  WorkoutSample: {
    ...base,
    workoutActivityType: 'number',
    duration: 'Quantity',
    totalEnergyBurned: 'option<Quantity>',
    totalDistance: 'option<Quantity>',
    totalSwimmingStrokeCount: 'option<Quantity>',
    totalFlightsClimbed: 'option<Quantity>',
    events: 'WorkoutEvent[]',
    activities: 'WorkoutActivity[]',
  },
  QueryWorkoutSamplesWithAnchorResponse: anchored('WorkoutSample', 'workouts'),
  WorkoutRouteLocation: {
    altitude: 'number',
    course: 'number',
    date: 'number',
    distance: 'option<number>',
    horizontalAccuracy: 'number',
    latitude: 'number',
    longitude: 'number',
    speed: 'number',
    speedAccuracy: 'number',
    verticalAccuracy: 'number',
  },
  WorkoutRoute: {
    uuid: 'string',
    locations: 'WorkoutRouteLocation[]',
    syncIdentifier: 'option<string>',
    syncVersion: 'option<number>',
  },
  WorkoutPlan: { id: 'string', activityType: 'number' },
  WorkoutStatistic: {
    quantityType: 'string',
    statistics: 'QueryStatisticsResponse',
  },

  Heartbeat: { timeSinceSeriesStart: 'number', precededByGap: 'bool' },
  HeartbeatSeriesSample: { ...base, heartbeats: 'Heartbeat[]' },
  HeartbeatSeriesSamplesWithAnchorResponse: anchored('HeartbeatSeriesSample'),

  ElectrocardiogramVoltage: {
    timeSinceSampleStart: 'number',
    voltage: 'number',
    lead: 'enum<appleWatchSimilarToLeadI|unknown>',
  },
  ElectrocardiogramSample: {
    ...base,
    classification:
      'enum<notSet|sinusRhythm|atrialFibrillation|inconclusiveLowHeartRate|inconclusiveHighHeartRate|inconclusivePoorReading|inconclusiveOther|unrecognized>',
    symptomsStatus: 'enum<notSet|none|present>',
    averageHeartRateBpm: 'option<number>',
    samplingFrequencyHz: 'option<number>',
    numberOfVoltageMeasurements: 'number',
    voltages: 'option<ElectrocardiogramVoltage[]>',
  },
  ElectrocardiogramSamplesWithAnchorResponse: anchored(
    'ElectrocardiogramSample',
  ),

  StateOfMindSample: {
    ...base,
    valence: 'number',
    kind: 'number',
    valenceClassification: 'number',
    associations: 'number[]',
    labels: 'number[]',
  },
  StateOfMindSamplesWithAnchorResponse: anchored('StateOfMindSample'),

  RelatedCoding: {
    system: 'string',
    code: 'string',
    version: 'option<string>',
  },
  MedicationConcept: {
    identifier: 'string',
    displayText: 'string',
    generalForm:
      'enum<capsule|cream|device|drops|foam|gel|inhaler|injection|liquid|lotion|ointment|patch|powder|spray|suppository|tablet|topical|unknown>',
    relatedCodings: 'RelatedCoding[]',
  },
  UserAnnotatedMedication: {
    isArchived: 'bool',
    hasSchedule: 'bool',
    nickname: 'option<string>',
    medication: 'MedicationConcept',
  },
  MedicationDoseEvent: {
    ...base,
    scheduleType: 'number',
    medicationConceptIdentifier: 'string',
    medicationDisplayText: 'option<string>',
    scheduledDate: 'option<number>',
    scheduledDoseQuantity: 'option<number>',
    doseQuantity: 'option<number>',
    logStatus: 'number',
    unit: 'string',
  },
  MedicationDoseEventsWithAnchorResponse: anchored('MedicationDoseEvent'),

  ActivitySummaryDateComponents: {
    era: 'option<number>',
    year: 'option<number>',
    month: 'option<number>',
    day: 'option<number>',
  },
  ActivitySummary: {
    dateComponents: 'ActivitySummaryDateComponents',
    activityMoveMode: 'number',
    activeEnergyBurned: 'Quantity',
    activeEnergyBurnedGoal: 'Quantity',
    appleExerciseTime: 'Quantity',
    appleExerciseTimeGoal: 'Quantity',
    appleStandHours: 'Quantity',
    appleStandHoursGoal: 'Quantity',
    appleMoveTime: 'option<Quantity>',
    appleMoveTimeGoal: 'option<Quantity>',
    isPaused: 'option<bool>',
  },

  ObjectTypeAvailability: { identifier: 'string', available: 'bool' },
  EarliestAuthorizedSampleDate: {
    identifier: 'string',
    date: 'option<number>',
  },
  IdentifierWithUnit: { typeIdentifier: 'string', unit: 'string' },

  // What a call passes.
  DateFilter: {
    startDate: 'option<number>',
    endDate: 'option<number>',
    strictStartDate: 'option<bool>',
    strictEndDate: 'option<bool>',
  },
  // `operatorType` is NSComparisonPredicate.Operator's raw value
  // (ComparisonPredicateOperator); the value is one of the value fields.
  MetadataPredicate: {
    withMetadataKey: 'string',
    operatorType: 'option<number>',
    stringValue: 'option<string>',
    numberValue: 'option<number>',
    boolValue: 'option<bool>',
    dateValue: 'option<number>',
  },
  SampleFilterBase: filterBase,
  SampleFilter: {
    ...filterBase,
    anyOf: 'option<SampleFilterBase[]>',
    allOf: 'option<SampleFilterBase[]>',
    noneOf: 'option<SampleFilterBase[]>',
  },
  WorkoutDurationPredicate: {
    predicateOperator: 'number',
    durationInSeconds: 'number',
  },
  WorkoutFilterBase: workoutFilterBase,
  WorkoutFilter: {
    ...workoutFilterBase,
    anyOf: 'option<WorkoutFilterBase[]>',
    allOf: 'option<WorkoutFilterBase[]>',
    noneOf: 'option<WorkoutFilterBase[]>',
  },
  ActivitySummaryQueryFilter: { date: 'option<DateFilter>' },
  IntervalComponents: {
    minute: 'option<number>',
    hour: 'option<number>',
    day: 'option<number>',
    month: 'option<number>',
    year: 'option<number>',
  },
  QuantitySampleForSaving: {
    startDate: 'number',
    endDate: 'number',
    quantityType: 'string',
    quantity: 'number',
    unit: 'string',
    metadata: 'option<MetadataEntry[]>',
  },
  CategorySampleForSaving: {
    startDate: 'number',
    endDate: 'number',
    categoryType: 'string',
    value: 'number',
    metadata: 'option<MetadataEntry[]>',
  },
  WorkoutTotals: {
    distance: 'option<number>',
    energyBurned: 'option<number>',
  },
  LocationForSaving: {
    altitude: 'number',
    course: 'number',
    date: 'number',
    horizontalAccuracy: 'number',
    latitude: 'number',
    longitude: 'number',
    speed: 'number',
    verticalAccuracy: 'number',
  },
  WorkoutConfiguration: {
    activityType: 'number',
    locationType: 'option<number>',
  },
}

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

// HealthKit never says whether a read was granted: a type that was asked
// for reads `unknown` from then on, and a read of a type never asked fails
// with NotAllowedError naming the request that asks for it.
const permission = (name, grant) => ({
  name,
  grants: [grant],
  denied: 'NotAllowedError',
  whilePrompt: { error: 'NotAllowedError', message: 'requestAuthorization' },
  answered: { ios: 'unknown' },
})

const READ = 'device.health-read'
const WRITE = 'device.health-write'

// Types the names read without an identifier option: each has its own
// permission, which the wildcard below would otherwise stand for.
const fixedRead = {
  workout: 'HKWorkoutTypeIdentifier',
  workoutRoute: 'HKWorkoutRouteTypeIdentifier',
  heartbeatSeries: 'HKDataTypeIdentifierHeartbeatSeries',
  electrocardiogram: 'HKElectrocardiogramType',
  stateOfMind: 'HKDataTypeStateOfMind',
  activitySummary: 'HKActivitySummaryTypeIdentifier',
  medicationDoseEvent: 'HKMedicationDoseEventTypeIdentifierMedicationDoseEvent',
  biologicalSex: 'HKCharacteristicTypeIdentifierBiologicalSex',
  bloodType: 'HKCharacteristicTypeIdentifierBloodType',
  dateOfBirth: 'HKCharacteristicTypeIdentifierDateOfBirth',
  fitzpatrickSkinType: 'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
  wheelchairUse: 'HKCharacteristicTypeIdentifierWheelchairUse',
}
const fixedWrite = {
  workout: 'HKWorkoutTypeIdentifier',
  workoutRoute: 'HKWorkoutRouteTypeIdentifier',
  stateOfMind: 'HKDataTypeStateOfMind',
}
const readOf = (id) => `healthkit.read.${id}`
const writeOf = (id) => `healthkit.share.${id}`

const permissions = [
  ...Object.values(fixedRead).map((id) => permission(readOf(id), READ)),
  ...Object.values(fixedWrite).map((id) => permission(writeOf(id), WRITE)),
  permission('healthkit.read.*', READ),
  permission('healthkit.share.*', WRITE),
]

// ---------------------------------------------------------------------------
// Names
// ---------------------------------------------------------------------------

// Every name runs on iOS alone, in the foreground, at the app's request.
const common = { origin: 'app', foreground: true, substitute: unsupported }

// A live read: asked again whenever HealthKit says the type changed.
const read = (name, options, answers, permissionBy) => ({
  source: name,
  live: true,
  ...common,
  person: true,
  permission: false,
  ...(permissionBy ? { permissionBy } : {}),
  options,
  answers,
})

// A read of one fixed type, under that type's own permission.
const readFixed = (name, options, answers, id) => ({
  source: name,
  live: true,
  ...common,
  person: true,
  permission: readOf(id),
  options,
  answers,
})

// A status read: never held or refused.
const status = (name, options, answers, live = false) => ({
  source: name,
  ...(live ? { live: true } : {}),
  ...common,
  permission: false,
  options,
  answers,
})

const send = (name, options, answers, permissionBy) => ({
  send: name,
  ...common,
  person: true,
  permission: false,
  ...(permissionBy ? { permissionBy } : {}),
  options,
  answers,
})

const sendFixed = (name, options, answers, id) => ({
  send: name,
  ...common,
  person: true,
  permission: writeOf(id),
  options,
  answers,
})

const byIdentifier = { identifier: 'healthkit.read.{}' }
const writeByIdentifier = { identifier: 'healthkit.share.{}' }

const sortOptions = (extra = {}) => ({
  limit: { type: 'option<number>', min: 0, default: 0 },
  ascending: 'option<bool>',
  filter: 'option<SampleFilter>',
  ...extra,
})
const anchorOptions = (extra = {}) => ({
  limit: { type: 'option<number>', min: 0, default: 0 },
  anchor: 'option<string>',
  filter: 'option<SampleFilter>',
  ...extra,
})
const workoutSort = {
  limit: { type: 'option<number>', min: 0, default: 0 },
  ascending: 'option<bool>',
  filter: 'option<WorkoutFilter>',
}
const workoutAnchor = {
  limit: { type: 'option<number>', min: 0, default: 0 },
  anchor: 'option<string>',
  filter: 'option<WorkoutFilter>',
}
const STATISTICS =
  'enum<cumulativeSum|discreteAverage|discreteMax|discreteMin|duration|mostRecent>[]'
const statisticsOptions = {
  identifier: 'string',
  statistics: STATISTICS,
  unit: 'option<string>',
  filter: 'option<SampleFilter>',
}
const collectionOptions = {
  ...statisticsOptions,
  anchorDate: 'number',
  intervalComponents: 'IntervalComponents',
}
const saving = { metadata: 'option<MetadataEntry[]>' }

const names = [
  // Availability and authorization status.
  status('isHealthDataAvailable', {}, 'bool'),
  status('isProtectedDataAvailable', {}, 'bool', true),
  status('isObjectTypeAvailable', { identifier: 'string' }, 'bool'),
  status(
    'areObjectTypesAvailable',
    { identifiers: 'string[]' },
    'ObjectTypeAvailability[]',
  ),
  // HKAuthorizationStatus: 0 notDetermined, 1 sharingDenied, 2 sharingAuthorized.
  status('authorizationStatusFor', { identifier: 'string' }, 'number', true),
  // HKAuthorizationRequestStatus: 0 unknown, 1 shouldRequest, 2 unnecessary.
  status(
    'getRequestStatusForAuthorization',
    { toShare: 'option<string[]>', toRead: 'option<string[]>' },
    'number',
    true,
  ),
  status(
    'getEarliestAuthorizedSampleDates',
    { identifiers: 'string[]' },
    'EarliestAuthorizedSampleDate[]',
    true,
  ),
  status(
    'getPreferredUnits',
    { identifiers: 'string[]', forceUpdate: 'option<bool>' },
    'IdentifierWithUnit[]',
    true,
  ),
  status('currentAppSource', {}, 'Source'),
  {
    send: 'requestAuthorization',
    request: true,
    ...common,
    permission: false,
    permissionEach: {
      toShare: 'healthkit.share.{}',
      toRead: 'healthkit.read.{}',
    },
    options: { toShare: 'option<string[]>', toRead: 'option<string[]>' },
    answers: 'bool',
  },
  send(
    'requestPerObjectReadAuthorization',
    { identifier: 'string' },
    'unit',
    byIdentifier,
  ),
  send('requestMedicationsAuthorization', {}, 'bool'),

  // Characteristics: an HKCharacteristicType's raw value, 0 for notSet.
  readFixed('getBiologicalSex', {}, 'number', fixedRead.biologicalSex),
  readFixed('getBloodType', {}, 'number', fixedRead.bloodType),
  readFixed('getDateOfBirth', {}, 'option<number>', fixedRead.dateOfBirth),
  readFixed(
    'getFitzpatrickSkinType',
    {},
    'number',
    fixedRead.fitzpatrickSkinType,
  ),
  readFixed('getWheelchairUse', {}, 'number', fixedRead.wheelchairUse),

  // Sources.
  read(
    'querySources',
    { identifier: 'string', filter: 'option<SampleFilter>' },
    'Source[]',
    byIdentifier,
  ),

  // Quantities.
  read(
    'queryQuantitySamples',
    sortOptions({ identifier: 'string', unit: 'option<string>' }),
    'QuantitySample[]',
    byIdentifier,
  ),
  read(
    'queryQuantitySamplesWithAnchor',
    anchorOptions({ identifier: 'string', unit: 'option<string>' }),
    'QuantitySamplesWithAnchorResponse',
    byIdentifier,
  ),
  read(
    'queryStatisticsForQuantity',
    statisticsOptions,
    'QueryStatisticsResponse',
    byIdentifier,
  ),
  read(
    'queryStatisticsCollectionForQuantity',
    collectionOptions,
    'QueryStatisticsResponse[]',
    byIdentifier,
  ),
  read(
    'queryStatisticsForQuantitySeparateBySource',
    statisticsOptions,
    'QueryStatisticsResponseFromSingleSource[]',
    byIdentifier,
  ),
  read(
    'queryStatisticsCollectionForQuantitySeparateBySource',
    collectionOptions,
    'QueryStatisticsResponseFromSingleSource[]',
    byIdentifier,
  ),
  status(
    'isQuantityCompatibleWithUnit',
    { identifier: 'string', unit: 'string' },
    'bool',
  ),
  send(
    'saveQuantitySample',
    {
      identifier: 'string',
      unit: 'string',
      value: 'number',
      startDate: 'number',
      endDate: 'number',
      ...saving,
    },
    'QuantitySample',
    writeByIdentifier,
  ),

  // Categories.
  read(
    'queryCategorySamples',
    sortOptions({ identifier: 'string' }),
    'CategorySample[]',
    byIdentifier,
  ),
  read(
    'queryCategorySamplesWithAnchor',
    anchorOptions({ identifier: 'string' }),
    'CategorySamplesWithAnchorResponse',
    byIdentifier,
  ),
  send(
    'saveCategorySample',
    {
      identifier: 'string',
      value: 'number',
      startDate: 'number',
      endDate: 'number',
      ...saving,
    },
    'CategorySample',
    writeByIdentifier,
  ),

  // Correlations.
  read(
    'queryCorrelationSamples',
    sortOptions({ identifier: 'string' }),
    'CorrelationSample[]',
    byIdentifier,
  ),
  read(
    'queryCorrelationSamplesWithAnchor',
    anchorOptions({ identifier: 'string' }),
    'QueryCorrelationSamplesWithAnchorResponse',
    byIdentifier,
  ),
  send(
    'saveCorrelationSample',
    {
      identifier: 'string',
      quantitySamples: 'option<QuantitySampleForSaving[]>',
      categorySamples: 'option<CategorySampleForSaving[]>',
      startDate: 'number',
      endDate: 'number',
      ...saving,
    },
    'CorrelationSample',
    writeByIdentifier,
  ),

  // Workouts.
  readFixed(
    'queryWorkoutSamples',
    workoutSort,
    'WorkoutSample[]',
    fixedRead.workout,
  ),
  readFixed(
    'queryWorkoutSamplesWithAnchor',
    workoutAnchor,
    'QueryWorkoutSamplesWithAnchorResponse',
    fixedRead.workout,
  ),
  readFixed(
    'getWorkoutRoutes',
    { workoutUuid: 'string' },
    'WorkoutRoute[]',
    fixedRead.workoutRoute,
  ),
  readFixed(
    'getWorkoutPlan',
    { workoutUuid: 'string' },
    'option<WorkoutPlan>',
    fixedRead.workout,
  ),
  readFixed(
    'getWorkoutStatistic',
    { workoutUuid: 'string', quantityType: 'string', unit: 'option<string>' },
    'option<QueryStatisticsResponse>',
    fixedRead.workout,
  ),
  readFixed(
    'getAllWorkoutStatistics',
    { workoutUuid: 'string' },
    'WorkoutStatistic[]',
    fixedRead.workout,
  ),
  sendFixed(
    'saveWorkoutSample',
    {
      workoutActivityType: 'number',
      quantities: 'option<QuantitySampleForSaving[]>',
      startDate: 'number',
      endDate: 'number',
      totals: 'option<WorkoutTotals>',
      ...saving,
    },
    'WorkoutSample',
    fixedWrite.workout,
  ),
  sendFixed(
    'saveWorkoutRoute',
    { workoutUuid: 'string', locations: 'LocationForSaving[]' },
    'bool',
    fixedWrite.workoutRoute,
  ),
  {
    send: 'startWatchAppWithWorkoutConfiguration',
    ...common,
    permission: writeOf(fixedWrite.workout),
    options: { workoutConfiguration: 'WorkoutConfiguration' },
    answers: 'bool',
  },

  // Heartbeat series and electrocardiograms.
  readFixed(
    'queryHeartbeatSeriesSamples',
    sortOptions(),
    'HeartbeatSeriesSample[]',
    fixedRead.heartbeatSeries,
  ),
  readFixed(
    'queryHeartbeatSeriesSamplesWithAnchor',
    anchorOptions(),
    'HeartbeatSeriesSamplesWithAnchorResponse',
    fixedRead.heartbeatSeries,
  ),
  readFixed(
    'queryElectrocardiogramSamples',
    sortOptions({
      includeVoltages: 'option<bool>',
    }),
    'ElectrocardiogramSample[]',
    fixedRead.electrocardiogram,
  ),
  readFixed(
    'queryElectrocardiogramSamplesWithAnchor',
    anchorOptions({
      includeVoltages: 'option<bool>',
    }),
    'ElectrocardiogramSamplesWithAnchorResponse',
    fixedRead.electrocardiogram,
  ),

  // State of mind (iOS 18).
  readFixed(
    'queryStateOfMindSamples',
    sortOptions(),
    'StateOfMindSample[]',
    fixedRead.stateOfMind,
  ),
  readFixed(
    'queryStateOfMindSamplesWithAnchor',
    anchorOptions(),
    'StateOfMindSamplesWithAnchorResponse',
    fixedRead.stateOfMind,
  ),
  sendFixed(
    'saveStateOfMindSample',
    {
      date: 'number',
      kind: 'number',
      valence: 'number',
      labels: 'number[]',
      associations: 'number[]',
      ...saving,
    },
    'StateOfMindSample',
    fixedWrite.stateOfMind,
  ),

  // Medications (iOS 26).
  status('queryMedications', {}, 'UserAnnotatedMedication[]', true),
  readFixed(
    'queryMedicationEvents',
    sortOptions(),
    'MedicationDoseEvent[]',
    fixedRead.medicationDoseEvent,
  ),
  readFixed(
    'queryMedicationEventsWithAnchor',
    anchorOptions(),
    'MedicationDoseEventsWithAnchorResponse',
    fixedRead.medicationDoseEvent,
  ),

  // Activity summaries.
  readFixed(
    'queryActivitySummary',
    { filter: 'option<ActivitySummaryQueryFilter>' },
    'ActivitySummary[]',
    fixedRead.activitySummary,
  ),

  // Deleting.
  send(
    'deleteObjects',
    { identifier: 'string', filter: 'SampleFilter' },
    'number',
    writeByIdentifier,
  ),
]

const manifest = {
  kind: 'interface',
  name: PACKAGE,
  version,
  grants: [READ, WRITE],
  substitute: 'implementation',
  permission: permissions,
  agent: { store: 'string', now: 'string' },
  shapes,
  names,
}

const out = `${JSON.stringify(manifest, null, 2)}\n`
const path = join(here, '..', 'exact.json')
if (process.argv.includes('--check')) {
  if (readFileSync(path, 'utf8') !== out) {
    console.error('exact.json is stale: run `bun scripts/manifest.mjs`')
    process.exit(1)
  }
} else {
  writeFileSync(path, out)
  console.log(
    `wrote ${path}: ${names.length} names, ${Object.keys(shapes).length} shapes`,
  )
}
