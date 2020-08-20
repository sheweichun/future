
import {Model} from 'free-canvas-shared'
import { CSSProperties } from 'react';
export interface TreeProps{
    className?:string
    style?:CSSProperties
}

export interface TreeState{
    data:Model[],
    hoverMap:{[key:string]:boolean}
}