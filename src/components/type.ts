import {LineOption} from '../entities/type';

export interface RulerGroupOptions{
    lineStyle?:string
    rulerBackgroundColor?:string
    length:number,
    wheelSpeedX:number,
    wheelSpeedY:number
}

export interface LabelOptions extends LineOption{
    isVertical:boolean
    value:string
    color?:string
    fontStyle?:string
    fontWeight?:string
    padding?:number
    fontSize?:string
    fontFamily?:string
}


export interface ContentOptions{
    wheelSpeedX:number,
    wheelSpeedY:number,
    x?:number,
    y?:number
}