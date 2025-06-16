import type { SampleTypeIdentifier } from './Shared'

export interface EmitterSubscription {
  remove: () => void
}

export interface OnChangeCallbackArgs {
  readonly typeIdentifier: SampleTypeIdentifier
  readonly errorMessage?: string
}
