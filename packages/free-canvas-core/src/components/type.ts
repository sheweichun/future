import {LineOption} from '../entities/type';

export interface RulerGroupOptions{
    lineStyle?:string
    rulerBackgroundColor?:string
    length:number,
    baseX:number,
    baseY:number,
    // wheelSpeedX:number,
    // wheelSpeedY:number
}

export interface LabelOptions extends LineOption{
    isVertical:boolean
    value:string
    color?:string
    fontStyle?:string
    fontWeight?:string
    padding?:number
    fontSize?:number
    fontFamily?:string
}

export interface GuideOptions extends LabelOptions{
    
}


export interface ContextMenuData {
    icon?:string,
    label:string,
    callback?:(data?:ContextMenuData)=>void
}

export interface ContextMenuOptions{
    getMenuData:(e:MouseEvent)=>ContextMenuData[]
    onHide:(e?:MouseEvent)=>void
}

