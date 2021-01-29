import { Dispatch } from "redux";

export type TypeInit = {
  actionName?: string,
  succuss?: (results:any)=>any,
  error?: (error:any)=>void,
  start?: (dispacth:Dispatch, actionName:string)=>void,
  always?: (dispacth:Dispatch, actionName:string)=>void,
};
export type TypeAction = {
  type: string,
  succuss?: (results:any, cb: ()=>any)=>Object,
  error?: (error:any, cb: ()=>void)=>void,
  start?: (dispacth:Dispatch<TypeAction>, actionName:string, cb: ()=>void)=>void,
  always?: (dispacth:Dispatch<TypeAction>, actionName:string, cb: ()=>void)=>void,
  [actionName: string]: any,
};

export type TypeProps<T> = {
  dispatch: Dispatch<TypeAction>
} & T;

export type TypeAsyncFunc = (asyncProvider:any)=>Promise<any>;

const warning = (message: string): void => {
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message)
  }
  try {
    throw new Error(message)
  } catch (e) {}
}
// interface External{
//   methods: {
//     [k:string]: any;
//   }
// }

class External{
  public methods:{[k:string]: any;}={};

  private add(k:string, v:any){
    if(typeof v === 'function'){
      try{
        v.caller;
        v=v.bind(this.methods);
      }catch(err){
        if(!!this['add']) warning('if you use "=>function", you will lost pointer of current this');
      }
    }
    this.methods[k] = v;
    return true;
  }
  private delete(k:string){
    return delete this.methods[k];
  }
  private clear(){
    this.methods={};
    return true;
  }
}

export const external = new External();

const asyncProvider = {
  dispalyName: '$$asyncProvider',
  all: Promise.all,
  race: Promise.race,
  external: external.methods,
};

const isFunc = (cb:Function):boolean => {
  if(typeof cb === "function") return true;
  return false;
};

const initDispatchFunc = ()=>{};

export default ({actionName='async', succuss: succussAll=(res)=>res, error: errorAll=()=>{}, start: startAll=initDispatchFunc, always:alwaysAll=initDispatchFunc}:TypeInit) =>
  ({dispatch}:any) => {
  return (next:any) => async (action: TypeAction) => {
    const { [actionName]: AsyncFunc, ...otherAction } = action;
    const { succuss, start, error, always } = action;
    
    if (AsyncFunc && typeof AsyncFunc === 'function') {
      if(start && isFunc(start)){
        start(dispatch, action.type, ()=>startAll(dispatch, action.type));
      }else{
        startAll(dispatch, action.type);
      }
      try{
        let payload;
        const results = await (AsyncFunc as TypeAsyncFunc)(asyncProvider)
        if(succuss && isFunc(succuss)){
          payload = succuss(results, ()=>succussAll(results));
        }else{
          payload = succussAll(results);
        }
        return payload ? Object.prototype.toString.call(payload) === '[object Object]' ? next({...otherAction, ...payload}) : next(otherAction) : null;
      }catch(err){
        if(error && isFunc(error)){
          error(err,  ()=>errorAll(err));
        }else{
          errorAll(err);
        }
      }finally{
        if(always && isFunc(always)){
          always(dispatch, action.type, ()=>alwaysAll(dispatch, action.type));
        }else{
          alwaysAll(dispatch, action.type);
        };
      }
    }else{
      return next(action);
    }
  }
}
