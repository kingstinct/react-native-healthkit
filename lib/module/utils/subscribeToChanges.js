import Native, { EventEmitter } from '../native-types';
const subscribeToChanges = async (identifier, callback) => {
  const subscription = EventEmitter.addListener('onChange', _ref => {
    let {
      typeIdentifier
    } = _ref;
    if (typeIdentifier === identifier) {
      callback();
    }
  });
  const queryId = await Native.subscribeToObserverQuery(identifier).catch(async error => {
    subscription.remove();
    return Promise.reject(error);
  });
  return async () => {
    subscription.remove();
    return Native.unsubscribeQuery(queryId);
  };
};
export default subscribeToChanges;
//# sourceMappingURL=subscribeToChanges.js.map