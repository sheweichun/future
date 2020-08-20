import {ObjectStyleDeclaration} from './type';


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