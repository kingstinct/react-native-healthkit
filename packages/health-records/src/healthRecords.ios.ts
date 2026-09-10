import useClinicalRecords from './hooks/useClinicalRecords'
import useHealthRecordsAuthorization from './hooks/useHealthRecordsAuthorization'
import useSubscribeToClinicalRecordChanges from './hooks/useSubscribeToClinicalRecordChanges'
import { HealthRecords } from './modules'
import { parseFHIRResourceData } from './utils/parseFHIRResourceData'
import { subscribeToClinicalRecordChanges } from './utils/subscribeToClinicalRecordChanges'

export * from './types'

const isHealthDataAvailable =
  HealthRecords.isHealthDataAvailable.bind(HealthRecords)
const supportsHealthRecords =
  HealthRecords.supportsHealthRecords.bind(HealthRecords)
const authorizationStatusFor =
  HealthRecords.authorizationStatusFor.bind(HealthRecords)
const getRequestStatusForAuthorization =
  HealthRecords.getRequestStatusForAuthorization.bind(HealthRecords)
const requestAuthorization =
  HealthRecords.requestAuthorization.bind(HealthRecords)
const queryClinicalRecords =
  HealthRecords.queryClinicalRecords.bind(HealthRecords)
const queryClinicalRecordsWithAnchor =
  HealthRecords.queryClinicalRecordsWithAnchor.bind(HealthRecords)
const enableBackgroundDelivery =
  HealthRecords.enableBackgroundDelivery.bind(HealthRecords)
const disableBackgroundDelivery =
  HealthRecords.disableBackgroundDelivery.bind(HealthRecords)

export {
  authorizationStatusFor,
  disableBackgroundDelivery,
  enableBackgroundDelivery,
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  parseFHIRResourceData,
  queryClinicalRecords,
  queryClinicalRecordsWithAnchor,
  requestAuthorization,
  subscribeToClinicalRecordChanges,
  supportsHealthRecords,
  useClinicalRecords,
  useHealthRecordsAuthorization,
  useSubscribeToClinicalRecordChanges,
}

export default {
  authorizationStatusFor,
  disableBackgroundDelivery,
  enableBackgroundDelivery,
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  parseFHIRResourceData,
  queryClinicalRecords,
  queryClinicalRecordsWithAnchor,
  requestAuthorization,
  subscribeToClinicalRecordChanges,
  supportsHealthRecords,

  // hooks
  useClinicalRecords,
  useHealthRecordsAuthorization,
  useSubscribeToClinicalRecordChanges,
}
