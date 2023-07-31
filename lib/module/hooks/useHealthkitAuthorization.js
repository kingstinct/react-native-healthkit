import { useCallback, useEffect, useRef, useState } from 'react';
import getRequestStatusForAuthorization from '../utils/getRequestStatusForAuthorization';
import requestAuthorization from '../utils/requestAuthorization';
const useHealthkitAuthorization = (read, write) => {
  const [status, setStatus] = useState(null);
  const readMemo = useRef(read);
  const writeMemo = useRef(write);
  useEffect(() => {
    readMemo.current = read;
    writeMemo.current = write;
  }, [read, write]);
  const refreshAuthStatus = useCallback(async () => {
    const auth = await getRequestStatusForAuthorization(readMemo.current, writeMemo.current);
    setStatus(auth);
    return auth;
  }, []);
  const request = useCallback(async () => {
    await requestAuthorization(readMemo.current, writeMemo.current);
    return refreshAuthStatus();
  }, [refreshAuthStatus]);
  useEffect(() => {
    void refreshAuthStatus();
  }, [refreshAuthStatus]);
  return [status, request];
};
export default useHealthkitAuthorization;
//# sourceMappingURL=useHealthkitAuthorization.js.map