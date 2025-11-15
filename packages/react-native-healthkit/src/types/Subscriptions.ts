import type { QuantitySample } from './QuantitySample'
import type { QuantityTypeIdentifier } from './QuantityTypeIdentifier'
import type { DeletedSample, SampleTypeIdentifier } from './Shared'

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
  readonly anchor: string
  readonly samples: readonly QuantitySample[]
  readonly deletedSamples: readonly DeletedSample[]
}

export type OnQuantitySamplesCallback =
  | OnQuantitySamplesCallbackError
  | OnQuantitySamplesCallbackSuccess
