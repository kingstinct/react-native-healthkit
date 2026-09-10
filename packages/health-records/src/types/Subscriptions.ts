import type { ClinicalTypeIdentifier } from './ClinicalTypeIdentifier'

export interface EmitterSubscription {
  /** Returns `false` if the subscription was already removed. */
  remove: () => boolean
}

export interface OnChangeCallbackArgs {
  readonly typeIdentifier: ClinicalTypeIdentifier
  readonly errorMessage?: string
}
