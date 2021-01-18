import { Dispatch } from "redux";
export declare type TypeInit = {
    actionName?: string;
    succuss?: (results: any) => any;
    error?: (error: any) => void;
    start?: (dispacth: Dispatch, actionName: string) => void;
    always?: (dispacth: Dispatch, actionName: string) => void;
};
export declare type TypeAction = {
    type: string;
    succuss?: (results: any, cb: () => any) => Object;
    error?: (error: any, cb: () => void) => void;
    start?: (dispacth: Dispatch<TypeAction>, actionName: string, cb: () => void) => void;
    always?: (dispacth: Dispatch<TypeAction>, actionName: string, cb: () => void) => void;
    [actionName: string]: any;
};
export declare type TypeProps<T> = {
    dispatch: Dispatch<TypeAction>;
} & T;
export declare type TypeAsyncFunc = () => Promise<any>;
declare const _default: ({ actionName, succuss: succussAll, error: errorAll, start: startAll, always: alwaysAll }: TypeInit) => ({ dispatch }: any) => (next: any) => (action: TypeAction) => Promise<any>;
export default _default;
