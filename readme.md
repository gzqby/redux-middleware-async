# redux-middleware-async
> This is a middleware of redux.it can help us to do async events and transfer their results to redux!
## usage
```
import getRA from 'redux-middleware-async'
import * as reducers from './reducers'

const reducer = combineReducers(reducers)
const store = createStore(reducer, applyMiddleware(getRA({
  actionName?: string;
  succuss?: (results: any) => any;
  error?: (error: any) => void;
  start?: (dispacth: Dispatch, actionName: string) => void;
  always?: (dispacth: Dispatch, actionName: string) => void;
})));

store.dispatch({
  type: string;
  succuss?: (results: any, cb: () => any) => Object;
  error?: (error: any, cb: () => void) => void;
  start?: (dispacth: Dispatch<TypeAction>, actionName: string, cb: () => void) => void;
  always?: (dispacth: Dispatch<TypeAction>, actionName: string, cb: () => void) => void;
  [actionName]: () => Promise<any>;
  // actionName对应初始化定义
})
```
## example
[index.tsx](./example/index.tsx)
[App.tsx](./example/App.tsx)