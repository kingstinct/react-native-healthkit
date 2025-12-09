import type { QuantitySample } from './QuantitySample'
import type { QuantityTypeIdentifier } from './QuantityTypeIdentifier'
import type { SampleTypeIdentifier } from './Shared'

export interface EmitterSubscription {
  remove: () => void
}

export interface OnChangeCallbackArgs {
  readonly typeIdentifier: SampleTypeIdentifier
  readonly errorMessage?: string
}

export interface OnQuantitySamplesCallbackError {
  readonly typeIdentifier: QuantityTypeIdentifier
  readonly errorMessage: string
}

export interface OnQuantitySamplesCallbackSuccess {
  readonly typeIdentifier: QuantityTypeIdentifier
  readonly samples: readonly QuantitySample[]
}

export type OnQuantitySamplesCallback =
  | OnQuantitySamplesCallbackError
  | OnQuantitySamplesCallbackSuccess
