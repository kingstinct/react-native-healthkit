"use strict";

var _serializeDate = _interopRequireDefault(require("./serializeDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
describe('serializeDate', () => {
  it('should serialize zero date', () => {
    expect((0, _serializeDate.default)(new Date(0))).toBe('1970-01-01T00:00:00.000Z');
  });
  it('should serialize date', () => {
    const date = new Date();
    expect((0, _serializeDate.default)(date)).toBe(date.toISOString());
  });
  it('should serialize null date', () => {
    expect((0, _serializeDate.default)(null)).toBe('1969-12-31T23:59:59.999Z');
  });
});
//# sourceMappingURL=serializeDate.test.js.map