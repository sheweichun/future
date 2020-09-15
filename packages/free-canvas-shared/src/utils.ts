

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

export function fixValue(val:number,scale:number){
    // return Math.floor(val * scale)
    return val * scale
}