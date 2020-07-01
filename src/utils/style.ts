import {ObjectStyleDeclaration} from './type';


export function setStyle(el:HTMLElement,style:ObjectStyleDeclaration){
    Object.keys(style).forEach((name)=>{
        //@ts-ignore
        el.style[name] = style[name];
    })
}

export function px2Num(px:string,defaultValue:number){
    const val = parseInt(px);
    if(isNaN(val)){
        return defaultValue;
    }
    return val;
}