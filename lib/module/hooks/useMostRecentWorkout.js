import { useEffect, useState, useRef, useCallback } from 'react';
import getMostRecentWorkout from '../utils/getMostRecentWorkout';
import getPreferredUnitsTyped from '../utils/getPreferredUnitsTyped';
import subscribeToChanges from '../utils/subscribeToChanges';
function useMostRecentWorkout(options) {
  const [workout, setWorkout] = useState(null);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  const update = useCallback(async () => {
    const {
      energyUnit,
      distanceUnit
    } = await getPreferredUnitsTyped(optionsRef.current);
    setWorkout(await getMostRecentWorkout({
      energyUnit,
      distanceUnit
    }));
  }, []);
  useEffect(() => {
    void update();
  }, [update]);
  useEffect(() => {
    let cancelSubscription;
    const init = async () => {
      cancelSubscription = await subscribeToChanges('HKWorkoutTypeIdentifier', update);
    };
    void init();
    return () => {
      var _cancelSubscription;
      void ((_cancelSubscription = cancelSubscription) === null || _cancelSubscription === void 0 ? void 0 : _cancelSubscription());
    };
  }, [update]);
  return workout;
}
export default useMostRecentWorkout;
//# sourceMappingURL=useMostRecentWorkout.js.map