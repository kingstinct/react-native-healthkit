import serializeDate from './serializeDate';
const prepareOptions = options => {
  const limit = !options.limit || options.limit === Infinity ? 0 : options.limit;
  const ascending = options.ascending ?? limit === 0;
  const from = serializeDate(options.from ? options.from : limit > 0 ? new Date(0) : undefined);
  const to = serializeDate(options.to);
  const anchor = options.anchor ?? '';
  return {
    limit,
    ascending,
    from,
    to,
    anchor
  };
};
export default prepareOptions;
//# sourceMappingURL=prepareOptions.js.map