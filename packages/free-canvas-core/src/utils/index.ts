
import {OperationPos, Utils,Model} from 'free-canvas-shared'
import { BaseModel } from '../render';
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


export function stopPropagation(e:MouseEvent){
    e.stopPropagation()
}

export function getOverlapArtboard(artboards:IViewModel[],rect:OperationPos){
    for(let i = 0 ; i < artboards.length; i++){
        const curArtboard = artboards[i];
        if(curArtboard.getRect().isOverlap(rect)){ //移动到对应的artboard里面
            return curArtboard;
        }
    }
}


export function getWrapSize(model:BaseModel):{width:number,height:number}{
    const ret = {width:0,height:0}
    if(model  == null) return ret;
    const pos = model.getIn(['extra','position'],null);
    if(pos == null) return ret;
    const curWidth = pos.get('width') || 0
    const curHeight = pos.get('height') || 0
    const children = model.get('children',null);
    if(children == null || children.size === 0) return ret
    for(let i = 0; i < children.size; i++){
        const item = children.get(i,null);
        if(item == null) continue;
        const pos = item.getIn(['extra','position'],null);
        if(pos == null) continue;
        const right = (pos.get('left') || 0) + (pos.get('width') || 0);
        const bottom = (pos.get('top') || 0) + (pos.get('height') || 0);
        ret.width = Math.max(ret.width,right)
        ret.height = Math.max(ret.height,bottom)
    }
    ret.width = Math.min(ret.width,curWidth)
    ret.height = Math.min(ret.height,curHeight)
    return ret;
}


export function fixData(data:Model){
    // console.log('data :',data);
    const {position} = data.extra
    let style = data.props.style;
    if(style == null){
        style = {value:{}}
        data.props.style = style;
    }
    const styleValue = style.value
    // const {backgroundColor} = styleValue
    // if(backgroundColor && typeof backgroundColor === 'object'){
    //     if(backgroundColor.disabled){
    //         styleValue.backgroundColor = ''
    //     }else{
    //         styleValue.backgroundColor = backgroundColor.value
    //     }
    // }
    styleValue.width = {
        value:position.width == null  ? 'auto': `${position.width}px`
    }
    styleValue.height = {
        value:position.height == null ? 'auto': `${position.height}px`
    }
    return data;
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