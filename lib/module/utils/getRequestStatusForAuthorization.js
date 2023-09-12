import Native from '../native-types';
const getRequestStatusForAuthorization = async function (read) {
  let write = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  const readPermissions = read.reduce((obj, cur) => ({
    ...obj,
    [cur]: true
  }), {});
  const writePermissions = write.reduce((obj, cur) => ({
    ...obj,
    [cur]: true
  }), {});
  return Native.getRequestStatusForAuthorization(writePermissions, readPermissions);
};
export default getRequestStatusForAuthorization;
//# sourceMappingURL=getRequestStatusForAuthorization.js.map