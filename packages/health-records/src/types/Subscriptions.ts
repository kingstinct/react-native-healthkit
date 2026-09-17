import type { EmitterSubscription } from '@react-native-healthkit/core'
import type { ClinicalTypeIdentifier } from './ClinicalTypeIdentifier'

export type { EmitterSubscription }

export interface OnChangeCallbackArgs {
  readonly typeIdentifier: ClinicalTypeIdentifier
  readonly errorMessage?: string
}
