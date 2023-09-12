import { renderHook, act } from '@testing-library/react-native';
import useHealthkitAuthorization from './useHealthkitAuthorization';
import Native, { HKAuthorizationRequestStatus, HKCategoryTypeIdentifier } from '../native-types';
import waitForNextUpdate from '../test-utils';
describe('useHealthkitAuthorization', () => {
  test('should return shouldRequest', async () => {
    jest.spyOn(Native, 'getRequestStatusForAuthorization').mockReturnValue(Promise.resolve(HKAuthorizationRequestStatus.shouldRequest));
    const {
      result
    } = renderHook(() => useHealthkitAuthorization([HKCategoryTypeIdentifier.abdominalCramps]));
    await waitForNextUpdate();
    expect(result.current[0]).toBe(HKAuthorizationRequestStatus.shouldRequest);
  });
  test('should request permissions', async () => {
    const spy = jest.spyOn(Native, 'getRequestStatusForAuthorization').mockReturnValue(Promise.resolve(HKAuthorizationRequestStatus.shouldRequest));
    jest.spyOn(Native, 'requestAuthorization').mockReturnValue(Promise.resolve(true));
    const {
      result
    } = renderHook(() => useHealthkitAuthorization([HKCategoryTypeIdentifier.abdominalCramps]));
    await waitForNextUpdate();
    spy.mockReturnValue(Promise.resolve(HKAuthorizationRequestStatus.unnecessary));
    let retVal;
    await act(async () => {
      retVal = await result.current[1]();
    });
    expect(result.current[0]).toBe(HKAuthorizationRequestStatus.unnecessary);
    expect(retVal).toBe(HKAuthorizationRequestStatus.unnecessary);
  });
  test('should return unnecessary', async () => {
    jest.spyOn(Native, 'getRequestStatusForAuthorization').mockReturnValue(Promise.resolve(HKAuthorizationRequestStatus.unnecessary));
    const {
      result
    } = renderHook(() => useHealthkitAuthorization([HKCategoryTypeIdentifier.abdominalCramps]));
    await waitForNextUpdate();
    expect(result.current[0]).toBe(HKAuthorizationRequestStatus.unnecessary);
  });
  test('should return null before initalizing', async () => {
    const {
      result
    } = renderHook(() => useHealthkitAuthorization([HKCategoryTypeIdentifier.abdominalCramps]));
    expect(result.current[0]).toBe(null);
    await waitForNextUpdate();
  });
});
//# sourceMappingURL=useHealthkitAuthorization.test.js.map