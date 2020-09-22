
import {ColorSource} from './type'
export class ColorData{
    r:number
    g:number
    b:number
    a:number 
    h:number
    s:number 
    l:number
    v:number
    hex:string
    source:ColorSource
    constructor(){

    }
}


export interface OffsetColorData{
    offset:number,
    color:string,
    colorValue?:any
}

export type ColorDataAttr = keyof ColorData



