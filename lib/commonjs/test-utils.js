"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("@testing-library/react-native");
// eslint-disable-next-line import/no-extraneous-dependencies

const waitForNextUpdate = async () => {
  await (0, _reactNative.act)(async () => {
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  });
};
var _default = waitForNextUpdate;
exports.default = _default;
//# sourceMappingURL=test-utils.js.map