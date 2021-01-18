import React, { useCallback } from 'react';
import './App.css';
import { connect } from "react-redux";
import { TypeProps } from "@zgo/redux-middleware-async";

type TypeLoading = {
  [name: string]: boolean
}

function App({dispatch, number, loading}:TypeProps<{number: number, loading: TypeLoading}>) {
  const addOrLess = useCallback((bool: boolean)=>{
    if (bool) {
      dispatch({
        type: 'add',
        async: ()=>new Promise((resolve, reject) => {
          setTimeout(()=>{resolve(100)}, 1000);
          // setTimeout(()=>{reject(100)}, 1000);
        }),
        succuss: (res)=>{
          return {type: 'less'};
        },
        error: (err)=>{
          console.log(err);
          return err;
        },
        start: (dispatch, actionName, cb) =>{
          cb();
          console.log(actionName);
        },
        always: (dispatch, actionName, cb)=>{
          cb();
          console.log(actionName);
        }
      });
    }else{
      dispatch({type: 'less'});
    }
  },[]);
  console.log(loading.add); 
  // ->boolean
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          {number}
        </p>
        <a onClick={()=>addOrLess(true)}>
          add
        </a>
        <a onClick={()=>addOrLess(false)}>
          less
        </a>
      </header>
    </div>
  );
}

export default connect(({number, loading}:any)=>{
  return {number, loading}
})(App);
