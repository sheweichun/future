


export function controlDelta(val:number,speed:number = 5){
    return Math.floor(val / speed);
}

export function completeOptions(options:any,defaultOptions:any){
    if(options == null) return defaultOptions;
    if(defaultOptions == null) return options;
    return Object.keys(defaultOptions).reduce((ret,key)=>{
        //@ts-ignore
        if(ret[key] === null || ret[key] === undefined){
            ret[key] = defaultOptions[key];
        }
        return ret;
    },Object.assign({},options))
}

let throttleId:any;
let curFn:()=>void;

export function throttle(fn:()=>void,tm:number){
    curFn = fn;
    if(throttleId != null) return;
    throttleId = setTimeout(function(){
        curFn && curFn();
        throttleId = null;
    },tm)
}