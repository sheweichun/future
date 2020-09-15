import {Utils} from 'free-canvas-shared';
import {ObjectStyleDeclaration,DOMRect} from './type';


export function setStyle(el:HTMLElement,style:ObjectStyleDeclaration){
    Object.keys(style).forEach((name)=>{
        //@ts-ignore
        el.style[name] = style[name];
    })
}

export function px2Num(px:string | number,defaultValue:number){
    const val = parseInt(px as string);
    if(isNaN(val)){
        return defaultValue;
    }
    return val;
}

export function createStyle(val:string){
    const  style = document.createElement("style") as HTMLStyleElement;
    style.type = "text/css";
    try{

    　　style.appendChild(document.createTextNode(val));
    }catch(ex){
        //@ts-ignore
    　　style.styleSheet.cssText = "body{background-color:red}";//针对IE
    }
    var head = document.getElementsByTagName("head")[0];

    head.appendChild(style);
}


export function fixValue(val:number,scale:number){
    return Math.round(val * scale)
}

export function getBoundingClientRect(el:HTMLElement,scale:number):DOMRect{
    const {left,top,width,height} = el.getBoundingClientRect();
    const baseScale = 1/ scale;
    return {
        left:fixValue(left,baseScale),
        top:fixValue(top,baseScale),
        width:fixValue(width,baseScale),
        height:fixValue(height,baseScale),
    }
}