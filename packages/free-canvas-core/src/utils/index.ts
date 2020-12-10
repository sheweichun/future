
import {OperationPos, Utils} from 'free-canvas-shared'
import { IViewModel } from '../render/type';

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


export function getOverlapArtboard(artboards:IViewModel[],rect:OperationPos){
    for(let i = 0 ; i < artboards.length; i++){
        const curArtboard = artboards[i];
        if(curArtboard.getRect().isOverlap(rect)){ //移动到对应的artboard里面
            return curArtboard;
        }
    }
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