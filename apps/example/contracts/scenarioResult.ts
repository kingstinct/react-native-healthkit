import type { ContractScenarioId } from './scenarios'

export interface ContractScenarioResult<
  Id extends string = ContractScenarioId,
> {
  readonly id: Id
  readonly title: string
  readonly ok: boolean
  readonly details: readonly string[]
  readonly payload?: unknown
}

/** Options a scenario may accept from the launch command or the UI. */
export interface ScenarioRunOptions {
  /** Iteration count for benchmark scenarios; ignored by contract scenarios. */
  readonly iterations?: number
}

export interface ContractScenario<Id extends string = ContractScenarioId> {
  readonly id: Id
  readonly title: string
  readonly run: (
    options?: ScenarioRunOptions,
  ) => Promise<ContractScenarioResult<Id>>
}

export function success<Id extends string>(
  id: Id,
  title: string,
  payload: unknown,
  details: string[] = [],
): ContractScenarioResult<Id> {
  return {
    id,
    title,
    ok: true,
    details,
    payload,
  }
}

export function failure<Id extends string>(
  id: Id,
  title: string,
  error: unknown,
  payload?: unknown,
): ContractScenarioResult<Id> {
  return {
    id,
    title,
    ok: false,
    details: [error instanceof Error ? error.message : String(error)],
    payload,
  }
}
