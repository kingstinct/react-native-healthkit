import type { AnyMap, HybridObject } from 'react-native-nitro-modules'
import type {
  BaseSample,
  DeletedSample,
  Device,
  SourceRevision,
} from '../types'
import type {
  QueryOptionsWithAnchor,
  QueryOptionsWithSortOrder,
} from '../types/QueryOptions'

enum MedicationDoseEventScheduleType {
  asNeeded = 1,
  /// The person logged this dose event in response to a scheduled medication reminder.
  schedule = 2,
}
enum MedicationDoseEventLogStatus {
  notInteracted = 1,
  /// The system assigns this status when it fails to deliver a scheduled medication notification.
  ///
  /// The system can generate this status because of a person's notification
  /// restrictions or issues with notification delivery.
  notificationNotSent = 2,
  /// The person snoozes a scheduled medication notification.
  snoozed = 3,
  /// The person logs that they took the medication dose.
  taken = 4,
  /// The person logs that they skipped the medication dose.
  skipped = 5,
  /// The person undoes a previously logged medication status.
  ///
  /// The system clears the prior status.
  notLogged = 6,
}

interface RelatedCoding {
  system: string
  code: string
  version?: string
}

type GeneralForm =
  /// The medication comes in capsule form, such as a hard-shell capsule or softgel.
  | 'capsule'

  /// The medication is applied as a cream.
  | 'cream'

  /// The medication is administered through a device, such as an infusion pump for controlled fluid delivery.
  | 'device'

  /// The medication is taken as drops, for example eye drops or ear drops.
  | 'drops'

  /// The medication is applied as a foam.
  | 'foam'

  /// The medication is applied as a gel.
  | 'gel'

  /// The medication is delivered through an inhaler.
  | 'inhaler'

  /// The medication is given as an injection.
  | 'injection'

  /// The medication is taken as a liquid, such as a syrup.
  | 'liquid'

  /// The medication is applied as a lotion.
  | 'lotion'

  /// The medication is applied as an ointment.
  | 'ointment'

  /// The medication is applied as a patch worn on the skin.
  | 'patch'

  /// The medication is taken as a powder.
  | 'powder'

  /// The medication is delivered as a spray, for example a nasal spray or throat spray.
  | 'spray'

  /// The medication is delivered as a suppository.
  | 'suppository'

  /// The medication is taken as a tablet.
  | 'tablet'

  /// The medication is applied topically in a form that wasn't specified.
  | 'topical'

  /// The system doesn't know the general form of the medication.
  | 'unknown'

interface MedicationConcept {
  identifier: string
  displayText: string
  generalForm: GeneralForm
  relatedCodings: RelatedCoding[]
}

export interface UserAnnotatedMedication {
  isArchived: boolean
  hasSchedule: boolean
  nickname?: string
  medication: MedicationConcept
}

export interface MedicationDoseEvent extends BaseSample {
  scheduleType: MedicationDoseEventScheduleType
  medicationConceptIdentifier: string // not sure here
  scheduledDate?: Date
  scheduledDoseQuantity?: number
  doseQuantity?: number
  logStatus: MedicationDoseEventLogStatus
  unit: string
}

export interface MedicationDoseEventsWithAnchorResponse {
  readonly samples: readonly MedicationDoseEvent[]
  readonly deletedSamples: readonly DeletedSample[]
  readonly newAnchor: string
}

export interface MedicationModule extends HybridObject<{ ios: 'swift' }> {
  queryMedications(): Promise<readonly UserAnnotatedMedication[]>

  requestMedicationsAuthorization(): Promise<boolean>

  queryMedicationEvents(
    options: QueryOptionsWithSortOrder,
  ): Promise<readonly MedicationDoseEvent[]>

  queryMedicationEventsWithAnchor(
    options: QueryOptionsWithAnchor,
  ): Promise<MedicationDoseEventsWithAnchorResponse>
}
