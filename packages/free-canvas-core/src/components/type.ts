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


export interface ContextMenuDataItem {
    icon?:string,
    label:string,
    callback?:(data?:ContextMenuDataItem)=>boolean | void
}

export interface ContextMenuData{
    children:ContextMenuDataItem[]
}

export interface ContextMenuOptions{
    getMenuData:(e:MouseEvent)=>ContextMenuData[]
    onHide?:(e?:MouseEvent)=>void
    style?:Partial<CSSStyleDeclaration>
}

export interface ContextMenuItem{
    getMenuData:(e:MouseEvent)=>ContextMenuData[]
    onContextMenu?:(e:MouseEvent)=>void
    onHide?:(e?:MouseEvent)=>void
    style?:Partial<CSSStyleDeclaration>
    el:HTMLElement
}

