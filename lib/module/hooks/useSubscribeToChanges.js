import { useEffect, useRef } from 'react';
import subscribeToChanges from '../utils/subscribeToChanges';
function useSubscribeToChanges(identifier, onChange) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    let cancelSubscription;
    const init = async () => {
      cancelSubscription = await subscribeToChanges(identifier, onChangeRef.current);
    };
    void init();
    return () => {
      var _cancelSubscription;
      void ((_cancelSubscription = cancelSubscription) === null || _cancelSubscription === void 0 ? void 0 : _cancelSubscription());
    };
  }, [identifier]);
}
export default useSubscribeToChanges;
//# sourceMappingURL=useSubscribeToChanges.js.map