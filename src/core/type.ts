
export interface CanvasOption {
    onMouseEvent?:(eventName:string,e:MouseEvent)=>void
}


export interface ICanvas{
    context:CanvasRenderingContext2D;
    width:number;
    height:number;
    resize():void;
    getLineWidth():number;
}

export type ListenFunc = (e:MouseEvent) => void
export type ListenRecord = {
    listener:ListenFunc,
    name:string,
    el:HTMLElement
}


export interface IDispose {
    destroy():void
}


