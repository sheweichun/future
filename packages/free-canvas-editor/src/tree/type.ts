
import {Model} from 'free-canvas-shared'
export interface TreeProps{
    className?:string
}

export interface TreeState{
    data:Model[],
    hoverMap:{[key:string]:boolean}
}