
import {Model,ShowTagName} from 'free-canvas-shared'
import { CSSProperties } from 'react';
export interface TreeProps{
    className?:string
    style?:CSSProperties
    showTagName?:ShowTagName
}

export interface FlagMap{
    [key:string]:boolean
}

export interface StringMap{
    [key:string]:string
}

export interface TreeState{
    data:Model[],
    editableMap:StringMap,
    hoverMap:FlagMap,
    expandMap:FlagMap
}