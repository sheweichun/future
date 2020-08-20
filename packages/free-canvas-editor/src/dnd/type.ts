import {Model} from 'free-canvas-shared'

export interface DragProp{
    className?:string,
    data:Model,
    onDragStart:(data:Model,x:number,y:number)=>void
    onDragMove:(x:number,y:number)=>void
    onDragEnd:()=>void
    previewEle:HTMLElement
}

export interface DragState{
    
}