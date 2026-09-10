import type { ClinicalTypeIdentifier } from './ClinicalTypeIdentifier'

export interface EmitterSubscription {
  remove: () => void
}

export interface OnChangeCallbackArgs {
  readonly typeIdentifier: ClinicalTypeIdentifier
  readonly errorMessage?: string
}
