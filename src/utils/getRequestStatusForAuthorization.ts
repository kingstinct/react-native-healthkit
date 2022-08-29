import Native from '../native-types'

import type {
  HealthkitReadAuthorization, HealthkitWriteAuthorization, ReadPermissions, WritePermissions,
} from '../native-types'

const getRequestStatusForAuthorization = async (
  read: readonly HealthkitReadAuthorization[],
  write: readonly HealthkitWriteAuthorization[] = [],
) => {
  const readPermissions = read.reduce((obj, cur) => ({ ...obj, [cur]: true }), {} as ReadPermissions)

  const writePermissions = write.reduce((obj, cur) => ({ ...obj, [cur]: true }), {} as WritePermissions)

  return Native.getRequestStatusForAuthorization(
    writePermissions,
    readPermissions,
  )
}

export default getRequestStatusForAuthorization
