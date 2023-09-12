import Native from '../native-types';
const getDateOfBirth = async () => {
  const dateOfBirth = await Native.getDateOfBirth();
  return new Date(dateOfBirth);
};
export default getDateOfBirth;
//# sourceMappingURL=getDateOfBirth.js.map