"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _subscribeToChanges = _interopRequireDefault(require("../utils/subscribeToChanges"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function useSubscribeToChanges(identifier, onChange) {
  const onChangeRef = (0, _react.useRef)(onChange);
  (0, _react.useEffect)(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  (0, _react.useEffect)(() => {
    let cancelSubscription;
    const init = async () => {
      cancelSubscription = await (0, _subscribeToChanges.default)(identifier, onChangeRef.current);
    };
    void init();
    return () => {
      var _cancelSubscription;
      void ((_cancelSubscription = cancelSubscription) === null || _cancelSubscription === void 0 ? void 0 : _cancelSubscription());
    };
  }, [identifier]);
}
var _default = useSubscribeToChanges;
exports.default = _default;
//# sourceMappingURL=useSubscribeToChanges.js.map