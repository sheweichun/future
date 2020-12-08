import {Model,MarketDataItem} from 'free-canvas-shared'
import React from 'react'

export interface DragProp{
    className?:string,
    style?:React.CSSProperties,
    data:MarketDataItem,
    onDragStart:(data:Model,x:number,y:number)=>void
    onDragMove:(x:number,y:number)=>void
    onDragEnd:()=>void
    previewEle:HTMLElement
}

export interface DragState{
    
}