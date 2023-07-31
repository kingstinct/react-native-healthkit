"use strict";

var _deserializeCategorySample = _interopRequireDefault(require("./deserializeCategorySample"));
var _types = require("../types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
describe('deserializeCategorySample', () => {
  it('should deserialize category sample', () => {
    const sample = {
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-01-01T00:00:00.000Z',
      value: 1,
      categoryType: _types.HKCategoryTypeIdentifier.sexualActivity,
      metadata: {},
      uuid: 'uuid'
    };
    expect((0, _deserializeCategorySample.default)(sample)).toEqual({
      ...sample,
      startDate: new Date('2020-01-01T00:00:00.000Z'),
      endDate: new Date('2020-01-01T00:00:00.000Z')
    });
  });
});
//# sourceMappingURL=deserializeCategorySample.test.js.map