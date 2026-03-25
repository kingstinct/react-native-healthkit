import type { CategorySampleTyped } from './CategoryType'
import type { CategoryTypeIdentifier } from './CategoryTypeIdentifier'
import type { QuantitySampleTyped } from './QuantitySample'
import type { QuantityTypeIdentifier } from './QuantityTypeIdentifier'
import type { SampleTypeIdentifier } from './Shared'

export interface EmitterSubscription {
  remove: () => void
}

export interface OnChangeCallbackArgs {
  readonly typeIdentifier: SampleTypeIdentifier
  readonly errorMessage?: string
}

export interface OnQuantitySamplesCallbackError<
  T extends QuantityTypeIdentifier = QuantityTypeIdentifier,
> {
  readonly typeIdentifier: T
  readonly errorMessage: string
}

export interface OnQuantitySamplesCallbackSuccess<
  T extends QuantityTypeIdentifier = QuantityTypeIdentifier,
> {
  readonly typeIdentifier: T
  readonly samples: readonly QuantitySampleTyped<T>[]
}

export type OnQuantitySamplesCallback<
  T extends QuantityTypeIdentifier = QuantityTypeIdentifier,
> = OnQuantitySamplesCallbackError<T> | OnQuantitySamplesCallbackSuccess<T>

export interface OnCategorySamplesCallbackError<
  T extends CategoryTypeIdentifier = CategoryTypeIdentifier,
> {
  readonly typeIdentifier: T
  readonly errorMessage: string
}

export interface OnCategorySamplesCallbackSuccess<
  T extends CategoryTypeIdentifier,
> {
  readonly typeIdentifier: T
  readonly samples: readonly CategorySampleTyped<T>[]
}

export type OnCategorySamplesCallback<T extends CategoryTypeIdentifier> =
  | OnCategorySamplesCallbackError<T>
  | OnCategorySamplesCallbackSuccess<T>
