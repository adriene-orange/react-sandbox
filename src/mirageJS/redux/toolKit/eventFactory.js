const efHelper = (eventType, meta) => (payload, error) => ({
  type: eventType,
  meta,
  payload,
  error: Boolean(error),
});

const camelize = (str) => str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
  if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
  return index === 0 ? match.toLowerCase() : match.toUpperCase();
});

export default (arg, meta) => {
  if (Array.isArray(arg)) {
    return arg.reduce((actionCreators, eventType) => {
      if (typeof eventType === 'string') {
        const fnName = camelize(eventType);
        // eslint-disable-next-line no-param-reassign
        actionCreators[fnName] = efHelper(eventType, meta);
        return actionCreators;
      }
      throw new Error('First argument must be an array of strings');
    }, {});
  } if (typeof arg === 'string') {
    return efHelper(arg, meta);
  }
  throw new Error('Invalid: first argument must be an array or string');
};
