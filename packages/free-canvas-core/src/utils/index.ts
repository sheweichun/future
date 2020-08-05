


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


// let debounceId:any;
// let curDebounceFn:()=>void;

export function throttle(fn:(...args:any[])=>void,tm:number){
    let throttleId:any;
    let curFn:(...args:any[])=>void;
    return function(...args:any[]){
        curFn = fn;
        if(throttleId != null) return;
        throttleId = setTimeout(function(){
            curFn && curFn(...args);
            throttleId = null;
        },tm)
        return throttleId
    }
}

export function debounce(fn:()=>void,tm:number){
    let debounceId:any;
    return function(){
        if(debounceId != null){
            clearTimeout(debounceId)
        }
        debounceId = setTimeout(function(){
            fn();
            debounceId = null;
        },tm)
    }
}