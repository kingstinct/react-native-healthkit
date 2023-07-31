import { useEffect, useState } from 'react';
import Native from '../native-types';
const useIsHealthDataAvailable = () => {
  const [isAvailable, setIsAvailable] = useState(null);
  useEffect(() => {
    const init = async () => {
      const res = await Native.isHealthDataAvailable();
      setIsAvailable(res);
    };
    void init();
  }, []);
  return isAvailable;
};
export default useIsHealthDataAvailable;
//# sourceMappingURL=useIsHealthDataAvailable.js.map