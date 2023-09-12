// eslint-disable-next-line import/no-extraneous-dependencies
import { act } from '@testing-library/react-native';
const waitForNextUpdate = async () => {
  await act(async () => {
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  });
};
export default waitForNextUpdate;
//# sourceMappingURL=test-utils.js.map