
import {Utils} from 'free-canvas-shared'

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

export function getPropertyValue(key:string){
    if(key && key.indexOf('var') === 0){
        const match = key.match(/var\((.*)\)/)
        const ret = document.body.style.getPropertyValue(match[1])
        return ret;
    }
    return key
}

// let debounceId:any;
// let curDebounceFn:()=>void;

export const throttle = Utils.throttle
export const debounce = Utils.debounce

// export function debounce(fn:(...args:any[])=>void,tm:number){
//     let debounceId:any;
//     return function(...args:any[]){
//         if(debounceId != null){
//             clearTimeout(debounceId)
//         }
//         debounceId = setTimeout(function(){
//             fn(...args);
//             debounceId = null;
//         },tm)
//     }
// }