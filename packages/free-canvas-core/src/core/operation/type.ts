import {OperationPos} from 'free-canvas-shared'
import { IViewModel } from "../../render/type";


export interface IOperation{
    hideMakers():void
    disableMove():void
}

export interface CalculateItem{
    val:number,
    vm:IViewModel,
    type:MarkType
}

export enum AlignType{
    VERTICAL_LEFT,
    VERTICAL_RIGHT,
    VERTICAL_MIDDLE,
    HORIZONTAL_TOP,
    HORIZONTAL_BOTTOM,
    HORIZONTAL_MIDDLE,
    VERTICAL_GUIDE,
    HORIZONTAL_GUIDE
}


export interface OperationOptions{
    margin:number,
    updateMakers:(data?:MakerData[])=>void
    getRect:()=>OperationPos
}

export interface MakerAssistOptions{
    updateMakers:(data?:MakerData[])=>void
    getRect:()=>OperationPos
    artboardId:string
}
// export interface AlignItem{
//     type:AlignType,
//     left?:number,
//     top?:number,
//     right?:number,
//     bottom?:number
// }

export interface AlignItem {
    type:AlignType,
    vm?:IViewModel,
    left?:number,
    top?:number,
    right?:number,
    bottom?:number,
}

export interface AlignValue{
    isVertical:boolean,
    value:number,
    data:AlignItem[]
}

export interface AlignItemVms {
    vms:IViewModel[],
    type:AlignType,
    isVertical:boolean,
    left?:number,
    top?:number,
    right?:number,
    bottom?:number,
    value:number
}

export enum MarkEntityType { 
    Line,
    LineMarker,
    RectMark,
    Guides
}

export interface AlignItemMap {
    left:AlignItemVms,
    top:AlignItemVms,
    right:AlignItemVms,
    bottom:AlignItemVms,
    hmiddle:AlignItemVms,
    vmiddle:AlignItemVms
}

export interface CalculateMap{
    [key:string]:CalculateItem
}

export enum MarkType{
    INNER_LEFT,
    OUTER_LEFT,
    INNER_TOP,
    OUTER_TOP,
    INNER_RIGHT,
    OUTER_RIGHT,
    INNER_BOTTOM,
    OUTER_BOTTOM,
}

export interface MakerData{
    type:MarkEntityType,
    data:any
}