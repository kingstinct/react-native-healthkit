"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _nativeTypes = require("./native-types");
Object.keys(_nativeTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _nativeTypes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _nativeTypes[key];
    }
  });
});
//# sourceMappingURL=types.js.map