import type { KnownSampleMetadata } from '../generated/healthkit.generated'
import type {
  MedicationDoseEvent,
  UserAnnotatedMedication,
} from '../specs/MedicationModule.nitro'
import type { DeletedSample, WithTypedMetadata } from './Shared'

export type { UserAnnotatedMedication }

export type MedicationDoseEventTyped = WithTypedMetadata<
  MedicationDoseEvent,
  KnownSampleMetadata
>

export interface MedicationDoseEventsWithAnchorResponseTyped {
  readonly samples: readonly MedicationDoseEventTyped[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}
