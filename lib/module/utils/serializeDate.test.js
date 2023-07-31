import serializeDate from './serializeDate';
describe('serializeDate', () => {
  it('should serialize zero date', () => {
    expect(serializeDate(new Date(0))).toBe('1970-01-01T00:00:00.000Z');
  });
  it('should serialize date', () => {
    const date = new Date();
    expect(serializeDate(date)).toBe(date.toISOString());
  });
  it('should serialize null date', () => {
    expect(serializeDate(null)).toBe('1969-12-31T23:59:59.999Z');
  });
});
//# sourceMappingURL=serializeDate.test.js.map