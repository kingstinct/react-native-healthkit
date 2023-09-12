import { renderHook } from '@testing-library/react-native';
import useIsHealthDataAvailable from './useIsHealthDataAvailable';
import Native from '../native-types';
import waitForNextUpdate from '../test-utils';
describe('useIsHealthDataAvailable', () => {
  test('should return false', async () => {
    jest.spyOn(Native, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(false));
    const {
      result
    } = renderHook(useIsHealthDataAvailable);
    await waitForNextUpdate();
    expect(result.current).toBe(false);
  });
  test('should return true', async () => {
    jest.spyOn(Native, 'isHealthDataAvailable').mockReturnValue(Promise.resolve(true));
    const {
      result
    } = renderHook(useIsHealthDataAvailable);
    await waitForNextUpdate();
    expect(result.current).toBe(true);
  });
  test('should return null before initalizing', async () => {
    const {
      result
    } = renderHook(useIsHealthDataAvailable);
    expect(result.current).toBe(null);
    await waitForNextUpdate();
  });
});
//# sourceMappingURL=useIsHealthDataAvailable.test.js.map