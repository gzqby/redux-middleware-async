import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import getMiddlewareAsync from "@zgo/redux-middleware-async";

const numberReducer = (state=0, action:any) => {
  switch (action.type) {
    case 'add':
      return state+1;
    case 'less':
      return state-1;
    default:
      return state;
  }
}

const loading = (state={}, action:any) => {
  const { type, ...otherAction } = action;
  switch (type) {
    case 'loading':
      return {...state, ...otherAction};
    default:
      return state;
  }
}

const reducer = combineReducers({
  number: numberReducer,
  loading,
});

const store = createStore(reducer, applyMiddleware(getMiddlewareAsync({
  actionName: 'async',
  start: (dispacth, actionType) => {
    dispacth({type: 'loading', [actionType]: true});
  },
  always: (dispacth, actionType) => {
    dispacth({type: 'loading', [actionType]: false});
  },
})));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
