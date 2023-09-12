"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nativeTypes = _interopRequireWildcard(require("../native-types"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const subscribeToChanges = async (identifier, callback) => {
  const subscription = _nativeTypes.EventEmitter.addListener('onChange', _ref => {
    let {
      typeIdentifier
    } = _ref;
    if (typeIdentifier === identifier) {
      callback();
    }
  });
  const queryId = await _nativeTypes.default.subscribeToObserverQuery(identifier).catch(async error => {
    subscription.remove();
    return Promise.reject(error);
  });
  return async () => {
    subscription.remove();
    return _nativeTypes.default.unsubscribeQuery(queryId);
  };
};
var _default = subscribeToChanges;
exports.default = _default;
//# sourceMappingURL=subscribeToChanges.js.map