



// export type StoreListener<T> = (data:T)=>void


export interface CallbackFunction {
    (preState: any, nextState: any): void;
}