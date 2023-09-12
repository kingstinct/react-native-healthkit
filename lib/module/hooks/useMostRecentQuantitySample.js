import { useEffect, useState } from 'react';
import ensureUnit from '../utils/ensureUnit';
import getMostRecentQuantitySample from '../utils/getMostRecentQuantitySample';
import subscribeToChanges from '../utils/subscribeToChanges';
function useMostRecentQuantitySample(identifier, unit) {
  const [lastSample, setLastSample] = useState(null);
  useEffect(() => {
    let cancelSubscription;
    const init = async () => {
      const actualUnit = await ensureUnit(identifier, unit);
      cancelSubscription = await subscribeToChanges(identifier, async () => {
        const value = await getMostRecentQuantitySample(identifier, actualUnit);
        setLastSample(value);
      });
    };
    void init();
    return () => {
      var _cancelSubscription;
      void ((_cancelSubscription = cancelSubscription) === null || _cancelSubscription === void 0 ? void 0 : _cancelSubscription());
    };
  }, [identifier, unit]);
  return lastSample;
}
export default useMostRecentQuantitySample;
//# sourceMappingURL=useMostRecentQuantitySample.js.map