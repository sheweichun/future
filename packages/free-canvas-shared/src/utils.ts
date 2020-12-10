

const SPLIT = '.'


export function encode(val:any[]){
    const retVal = val.reduce((ret,item)=>{
        if(item == null) return ret;
        if(typeof item === 'number'){
            ret += `${SPLIT}$$$${item}`
        }else{
            ret += `${SPLIT}${item}`;
        }
        return ret;
    },'')
    return retVal.substring(1);
}

export function decode(val:string){
    const ret = val.split(SPLIT).map((item)=>{
        if(item.indexOf('$$$') === 0){
            return parseInt(item.replace(/\$/g,''))
        }
        return item
    })
    return ret;
}

export function encode2ShortId(val:any[]){

    const retVal = val.reduce((ret,item)=>{
        if(item == null) return ret;
        if(typeof item === 'number'){
            ret += `${SPLIT}$${item}`
        }else{
            ret += `${SPLIT}${item.substring(0,1)}`;
        }
        return ret;
    },'')
    return retVal.substring(1);
}

const KEY_MAP = {
    d:'data',
    c:'children'
}

export function decodeFromShortId(val:string){
    const ret = val.split(SPLIT).map((item)=>{
        if(item.indexOf('$') === 0){
            return parseInt(item.replace(/\$/g,''))
        }
        //@ts-ignore
        return KEY_MAP[item]
    })
    return ret;
}


export function isOverLap(left:number,top:number,right:number,bottom:number,
    left1:number,top1:number,right1:number,bottom1:number){
    return (right  > left1 &&
        right1  > left &&
        bottom > top1 &&
        bottom1 > top
    )
}

export function contain(left:number,top:number,right:number,bottom:number,
    left1:number,top1:number,right1:number,bottom1:number){
    return left <= left1 &&
        right >= right1 &&
        top <= top1 && 
        bottom >= bottom1
}

export function fixValue(val:number,scale:number){
    // return Math.floor(val * scale)
    return val * scale
}


export function throttle(fn:(...args:any[])=>void,tm:number){
    let throttleId:any;
    let curFn:(...args:any[])=>void;
    const ret = function(...args:any[]){
        curFn = fn;
        if(throttleId != null) return;
        throttleId = setTimeout(function(){
            curFn && curFn(...args);
            throttleId = null;
        },tm)
        return throttleId
    }
    ret.cancel = function(){
        if(throttleId != null){
            clearTimeout(throttleId)
            throttleId = null
        }
    }
    return ret;
}

export function debounce(fn:(...args:any[])=>void,tm:number){
    let debounceId:any;
    return function(...args:any[]){
        if(debounceId != null){
            clearTimeout(debounceId)
        }
        debounceId = setTimeout(function(){
            fn(...args);
            debounceId = null;
        },tm)
    }
}

const HEX_CHAR = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
function num2Str(val:number):string{
    return HEX_CHAR[val]
}

export function data2BackgroundColor(data:any){
    const {hex,rgb} = data;
    return hexAlpha2BackgroundColor(hex,rgb.a)
    // const renderHex = hex === 'transparent' ? '#000000':hex
    // if(rgb.a ===  1) return renderHex
    // const alpha = Math.round(rgb.a * 255)
    // return `${renderHex}${num2Str(Math.floor(alpha / 16))}${num2Str(alpha % 16)}`
}

export function hexAlpha2BackgroundColor(hex:string,alphaVal:number){
    const renderHex = hex === 'transparent' ? '#000000':hex
    if(alphaVal ===  1) return renderHex
    const alpha = Math.round(alphaVal * 255)
    return `${renderHex}${num2Str(Math.floor(alpha / 16))}${num2Str(alpha % 16)}`
}