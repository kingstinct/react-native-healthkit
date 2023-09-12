import { useState, useEffect, useCallback, useRef } from 'react';
import useSubscribeToChanges from './useSubscribeToChanges';
import queryStatisticsForQuantity from '../utils/queryStatisticsForQuantity';
function useStatisticsForQuantity(identifier, options, from, to, unit) {
  const [result, setResult] = useState(null);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  const update = useCallback(async () => {
    const res = await queryStatisticsForQuantity(identifier, optionsRef.current, from, to, unit);
    setResult(res);
  }, [identifier, from, to, unit]);
  useEffect(() => {
    void update();
  }, [update]);
  useSubscribeToChanges(identifier, update);
  return result;
}
export default useStatisticsForQuantity;
//# sourceMappingURL=useStatisticsForQuantity.js.map