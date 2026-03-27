import {
  type ContractMetadataValueKind,
  getKnownCategoryMetadataKindMap,
  getKnownQuantityMetadataKindMap,
  KNOWN_OBJECT_METADATA_KIND_BY_KEY,
  KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
  KNOWN_WORKOUT_EVENT_METADATA_KIND_BY_KEY,
  KNOWN_WORKOUT_METADATA_KIND_BY_KEY,
} from '../generated/healthkit.contract.generated'
import type { CategorySampleTyped } from '../types/CategoryType'
import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier'
import type { QuantitySampleTyped } from '../types/QuantitySample'
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier'
import type { WorkoutEventTyped, WorkoutSampleTyped } from '../types/Workouts'

export interface ContractValidationIssue {
  readonly path: string
  readonly message: string
}

export interface ContractValidationResult {
  readonly ok: boolean
  readonly issues: readonly ContractValidationIssue[]
}

type UnknownRecord = Record<string, unknown>

function pushIssue(
  issues: ContractValidationIssue[],
  path: string,
  message: string,
) {
  issues.push({ path, message })
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value != null && !Array.isArray(value)
}

function isQuantityLike(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.unit === 'string' &&
    typeof value.quantity === 'number'
  )
}

function isDateLike(value: unknown): boolean {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

function validateKind(
  issues: ContractValidationIssue[],
  path: string,
  kind: ContractMetadataValueKind,
  value: unknown,
) {
  switch (kind) {
    case 'string':
      if (typeof value !== 'string') {
        pushIssue(issues, path, `expected string, got ${typeof value}`)
      }
      return
    case 'boolean':
      if (typeof value !== 'boolean') {
        pushIssue(issues, path, `expected boolean, got ${typeof value}`)
      }
      return
    case 'number':
    case 'enum':
      if (typeof value !== 'number') {
        pushIssue(issues, path, `expected number, got ${typeof value}`)
      }
      return
    case 'quantity':
      if (!isQuantityLike(value)) {
        pushIssue(issues, path, 'expected Quantity-like object')
      }
      return
  }
}

function validateMetadataShape(
  issues: ContractValidationIssue[],
  metadata: unknown,
  knownKinds: Readonly<Record<string, ContractMetadataValueKind>>,
  path: string,
) {
  if (!isRecord(metadata)) {
    pushIssue(issues, path, 'expected metadata object')
    return
  }

  for (const [key, kind] of Object.entries(knownKinds)) {
    const value = metadata[key]
    if (value === undefined) {
      continue
    }
    validateKind(issues, `${path}.${key}`, kind, value)
  }
}

function validateBaseSampleShape(
  issues: ContractValidationIssue[],
  sample: unknown,
  path: string,
  metadataKinds: Readonly<Record<string, ContractMetadataValueKind>>,
) {
  if (!isRecord(sample)) {
    pushIssue(issues, path, 'expected sample object')
    return
  }

  if (typeof sample.uuid !== 'string') {
    pushIssue(issues, `${path}.uuid`, 'expected string')
  }
  if (!isDateLike(sample.startDate)) {
    pushIssue(issues, `${path}.startDate`, 'expected Date')
  }
  if (!isDateLike(sample.endDate)) {
    pushIssue(issues, `${path}.endDate`, 'expected Date')
  }
  if (
    !isRecord(sample.sampleType) ||
    typeof sample.sampleType.identifier !== 'string'
  ) {
    pushIssue(issues, `${path}.sampleType`, 'expected sampleType object')
  }
  validateMetadataShape(
    issues,
    sample.metadata,
    metadataKinds,
    `${path}.metadata`,
  )
}

function combineKinds(
  ...sources: Readonly<Record<string, ContractMetadataValueKind>>[]
): Record<string, ContractMetadataValueKind> {
  return Object.assign({}, ...sources)
}

export function validateQuantitySampleContract<
  T extends QuantityTypeIdentifier,
>(identifier: T, sample: unknown): ContractValidationResult {
  const issues: ContractValidationIssue[] = []
  const metadataKinds = combineKinds(
    KNOWN_OBJECT_METADATA_KIND_BY_KEY,
    KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
    getKnownQuantityMetadataKindMap(identifier),
  )

  validateBaseSampleShape(issues, sample, 'quantitySample', metadataKinds)

  if (isRecord(sample)) {
    if (sample.quantityType !== identifier) {
      pushIssue(
        issues,
        'quantitySample.quantityType',
        `expected ${identifier}, got ${String(sample.quantityType)}`,
      )
    }
    if (typeof sample.quantity !== 'number') {
      pushIssue(issues, 'quantitySample.quantity', 'expected number')
    }
    if (typeof sample.unit !== 'string') {
      pushIssue(issues, 'quantitySample.unit', 'expected string')
    }
  }

  return { ok: issues.length === 0, issues }
}

export function validateCategorySampleContract<
  T extends CategoryTypeIdentifier,
>(identifier: T, sample: unknown): ContractValidationResult {
  const issues: ContractValidationIssue[] = []
  const metadataKinds = combineKinds(
    KNOWN_OBJECT_METADATA_KIND_BY_KEY,
    KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
    getKnownCategoryMetadataKindMap(identifier),
  )

  validateBaseSampleShape(issues, sample, 'categorySample', metadataKinds)

  if (isRecord(sample)) {
    if (sample.categoryType !== identifier) {
      pushIssue(
        issues,
        'categorySample.categoryType',
        `expected ${identifier}, got ${String(sample.categoryType)}`,
      )
    }
    if (typeof sample.value !== 'number') {
      pushIssue(issues, 'categorySample.value', 'expected number')
    }
  }

  return { ok: issues.length === 0, issues }
}

export function validateWorkoutEventContract(
  event: unknown,
): ContractValidationResult {
  const issues: ContractValidationIssue[] = []

  if (!isRecord(event)) {
    pushIssue(issues, 'workoutEvent', 'expected object')
    return { ok: false, issues }
  }

  if (typeof event.type !== 'number') {
    pushIssue(issues, 'workoutEvent.type', 'expected number')
  }
  if (!isDateLike(event.startDate)) {
    pushIssue(issues, 'workoutEvent.startDate', 'expected Date')
  }
  if (!isDateLike(event.endDate)) {
    pushIssue(issues, 'workoutEvent.endDate', 'expected Date')
  }
  if (event.metadata !== undefined) {
    validateMetadataShape(
      issues,
      event.metadata,
      KNOWN_WORKOUT_EVENT_METADATA_KIND_BY_KEY,
      'workoutEvent.metadata',
    )
  }

  return { ok: issues.length === 0, issues }
}

export function validateWorkoutSampleContract(
  sample: unknown,
): ContractValidationResult {
  const issues: ContractValidationIssue[] = []
  const metadataKinds = combineKinds(
    KNOWN_OBJECT_METADATA_KIND_BY_KEY,
    KNOWN_SAMPLE_METADATA_KIND_BY_KEY,
    KNOWN_WORKOUT_METADATA_KIND_BY_KEY,
  )

  validateBaseSampleShape(issues, sample, 'workoutSample', metadataKinds)

  if (isRecord(sample)) {
    if (typeof sample.workoutActivityType !== 'number') {
      pushIssue(issues, 'workoutSample.workoutActivityType', 'expected number')
    }
    if (!isQuantityLike(sample.duration)) {
      pushIssue(
        issues,
        'workoutSample.duration',
        'expected Quantity-like object',
      )
    }
    if (sample.events !== undefined) {
      if (!Array.isArray(sample.events)) {
        pushIssue(issues, 'workoutSample.events', 'expected array')
      } else {
        sample.events.forEach((event, index) => {
          const result = validateWorkoutEventContract(event)
          for (const issue of result.issues) {
            pushIssue(
              issues,
              issue.path.replace(
                'workoutEvent',
                `workoutSample.events[${index}]`,
              ),
              issue.message,
            )
          }
        })
      }
    }
  }

  return { ok: issues.length === 0, issues }
}

function formatIssues(issues: readonly ContractValidationIssue[]): string {
  return issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n')
}

export function assertQuantitySampleContract<T extends QuantityTypeIdentifier>(
  identifier: T,
  sample: unknown,
): asserts sample is QuantitySampleTyped<T> {
  const result = validateQuantitySampleContract(identifier, sample)
  if (!result.ok) {
    throw new Error(formatIssues(result.issues))
  }
}

export function assertCategorySampleContract<T extends CategoryTypeIdentifier>(
  identifier: T,
  sample: unknown,
): asserts sample is CategorySampleTyped<T> {
  const result = validateCategorySampleContract(identifier, sample)
  if (!result.ok) {
    throw new Error(formatIssues(result.issues))
  }
}

export function assertWorkoutSampleContract(
  sample: unknown,
): asserts sample is WorkoutSampleTyped {
  const result = validateWorkoutSampleContract(sample)
  if (!result.ok) {
    throw new Error(formatIssues(result.issues))
  }
}

export function assertWorkoutEventContract(
  event: unknown,
): asserts event is WorkoutEventTyped {
  const result = validateWorkoutEventContract(event)
  if (!result.ok) {
    throw new Error(formatIssues(result.issues))
  }
}
