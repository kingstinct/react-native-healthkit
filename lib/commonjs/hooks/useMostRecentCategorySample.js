"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _useSubscribeToChanges = _interopRequireDefault(require("./useSubscribeToChanges"));
var _getMostRecentCategorySample = _interopRequireDefault(require("../utils/getMostRecentCategorySample"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function useMostRecentCategorySample(identifier) {
  const [category, setCategory] = (0, _react.useState)(null);
  const updater = (0, _react.useCallback)(() => {
    void (0, _getMostRecentCategorySample.default)(identifier).then(setCategory);
  }, [identifier]);
  (0, _useSubscribeToChanges.default)(identifier, updater);
  return category;
}
var _default = useMostRecentCategorySample;
exports.default = _default;
//# sourceMappingURL=useMostRecentCategorySample.js.map