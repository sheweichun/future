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
}

// export interface AlignItem{
//     type:AlignType,
//     left?:number,
//     top?:number,
//     right?:number,
//     bottom?:number
// }
export interface AlignItem {
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
    Guides
}

export interface AlignItemMap {
    left:AlignItem,
    top:AlignItem,
    right:AlignItem,
    bottom:AlignItem,
    hmiddle:AlignItem,
    vmiddle:AlignItem
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