import { useCallback, useEffect, useState } from 'react';
import querySources from '../utils/querySources';
function useSources(identifier) {
  const [result, setResult] = useState(null);
  const update = useCallback(async () => {
    const res = await querySources(identifier);
    setResult(res);
  }, [identifier]);
  useEffect(() => {
    void update();
  }, [update]);
  return result;
}
export default useSources;
//# sourceMappingURL=useSources.js.map