import type { CategorySampleTyped } from '@kingstinct/react-native-healthkit/types/CategoryType'
import type { CategoryTypeIdentifier } from '@kingstinct/react-native-healthkit/types/CategoryTypeIdentifier'
import type { QuantitySampleTyped } from '@kingstinct/react-native-healthkit/types/QuantitySample'
import type { QuantityTypeIdentifier } from '@kingstinct/react-native-healthkit/types/QuantityTypeIdentifier'
import type {
  WorkoutEventTyped,
  WorkoutSampleTyped,
} from '@kingstinct/react-native-healthkit/types/Workouts'
import type { z } from 'zod'
import {
  contractWorkoutEventSchema,
  contractWorkoutSampleSchema,
  getCategorySampleContractSchema,
  getQuantitySampleContractSchema,
} from './generated/healthkit.contract.generated'

export {
  contractWorkoutEventSchema,
  contractWorkoutSampleSchema,
  getCategorySampleContractSchema,
  getQuantitySampleContractSchema,
} from './generated/healthkit.contract.generated'

export interface ContractValidationIssue {
  readonly path: string
  readonly message: string
}

export interface ContractValidationResult {
  readonly ok: boolean
  readonly issues: readonly ContractValidationIssue[]
}

function formatPathSegment(segment: string | number): string {
  if (typeof segment === 'number') {
    return `[${segment}]`
  }
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(segment)
    ? `.${segment}`
    : `[${JSON.stringify(segment)}]`
}

function formatIssuePath(
  rootPath: string,
  path: readonly (string | number)[],
): string {
  if (path.length === 0) {
    return rootPath
  }

  return `${rootPath}${path.map(formatPathSegment).join('')}`
}

function issuesFromError(
  rootPath: string,
  error: z.ZodError,
): readonly ContractValidationIssue[] {
  return error.issues.map((issue) => ({
    path: formatIssuePath(rootPath, issue.path as Array<string | number>),
    message: issue.message,
  }))
}

function safeParseContract(
  rootPath: string,
  schema: z.ZodTypeAny,
  value: unknown,
): ContractValidationResult {
  const result = schema.safeParse(value)
  if (result.success) {
    return { ok: true, issues: [] }
  }

  return {
    ok: false,
    issues: issuesFromError(rootPath, result.error),
  }
}

function formatIssues(issues: readonly ContractValidationIssue[]): string {
  return issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n')
}

export function validateQuantitySampleContract<
  T extends QuantityTypeIdentifier,
>(identifier: T, sample: unknown): ContractValidationResult {
  return safeParseContract(
    'quantitySample',
    getQuantitySampleContractSchema(identifier),
    sample,
  )
}

export function validateCategorySampleContract<
  T extends CategoryTypeIdentifier,
>(identifier: T, sample: unknown): ContractValidationResult {
  return safeParseContract(
    'categorySample',
    getCategorySampleContractSchema(identifier),
    sample,
  )
}

export function validateWorkoutEventContract(
  event: unknown,
): ContractValidationResult {
  return safeParseContract('workoutEvent', contractWorkoutEventSchema, event)
}

export function validateWorkoutSampleContract(
  sample: unknown,
): ContractValidationResult {
  return safeParseContract('workoutSample', contractWorkoutSampleSchema, sample)
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
