import Native from '../native-types';
/** See https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization */
const requestAuthorization = async function (read) {
  let write = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  const readPermissions = read.reduce((obj, cur) => ({
    ...obj,
    [cur]: true
  }), {});
  const writePermissions = write.reduce((obj, cur) => ({
    ...obj,
    [cur]: true
  }), {});
  return Native.requestAuthorization(writePermissions, readPermissions);
};
export default requestAuthorization;
//# sourceMappingURL=requestAuthorization.js.map