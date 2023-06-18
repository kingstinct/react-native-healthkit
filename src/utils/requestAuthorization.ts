import Native from '../native-types'

import type {
  HealthkitReadAuthorization, HealthkitWriteAuthorization, ReadPermissions, WritePermissions,
} from '../native-types'

/** See https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization */
const requestAuthorization = async (
  read: readonly HealthkitReadAuthorization[],
  write: readonly HealthkitWriteAuthorization[] = [],
): Promise<boolean> => {
  const readPermissions = read.reduce((obj, cur) => ({ ...obj, [cur]: true }), {} as ReadPermissions)

  const writePermissions = write.reduce((obj, cur) => ({ ...obj, [cur]: true }), {} as WritePermissions)

  return Native.requestAuthorization(writePermissions, readPermissions)
}

export default requestAuthorization
