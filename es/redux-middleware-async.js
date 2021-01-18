// const warning = (message: string): void => {
//   if (typeof console !== 'undefined' && typeof console.error === 'function') {
//     console.error(message)
//   }
//   try {
//     throw new Error(message)
//   } catch (e) {}
// }
const isFunc = cb => {
  if (typeof cb === "function") return true;
  return false;
};

const initDispatchFunc = () => {};

var index = (({
  actionName = 'async',
  succuss: succussAll = res => res,
  error: errorAll = () => {},
  start: startAll = initDispatchFunc,
  always: alwaysAll = initDispatchFunc
}) => ({
  dispatch
}) => {
  return next => async action => {
    const {
      [actionName]: AsyncFunc,
      ...otherAction
    } = action;
    const {
      succuss,
      start,
      error,
      always
    } = action;

    if (AsyncFunc && typeof AsyncFunc === 'function') {
      if (start && isFunc(start)) {
        start(dispatch, action.type, () => startAll(dispatch, action.type));
      } else {
        startAll(dispatch, action.type);
      }

      try {
        let payload;
        const results = await AsyncFunc();

        if (succuss && isFunc(succuss)) {
          payload = succuss(results, () => succussAll(results));
        } else {
          payload = succussAll(results);
        }

        return next({ ...otherAction,
          ...payload
        });
      } catch (err) {
        if (error && isFunc(error)) {
          error(err, () => errorAll(err));
        } else {
          errorAll(err);
        }
      } finally {
        if (always && isFunc(always)) {
          always(dispatch, action.type, () => alwaysAll(dispatch, action.type));
        } else {
          alwaysAll(dispatch, action.type);
        }
      }
    } else {
      return next(action);
    }
  };
});

export default index;
