import { MakerData } from "./operation/type"
import {MoveEventData} from '../events/type'
import { OperationPos } from "./operation/pos"
import {DSL,CreateView,ShowTagName, IRenderEngine} from 'free-canvas-shared' 

export interface CanvasOption {
    onMouseEvent?:(eventName:string,e:MouseEvent)=>void
}


export enum KeyBoardKeys {
    METAKEY = 'metaKey',
    SHIFTKEY = 'shiftKey',
    ALTKEY = 'altKey',
    ARROWUP = 'ArrowUp',
    ARROWDOWN = 'ArrowDown',
    ARROWLEFT = 'ArrowLeft',
    ARROWRIGHT = 'ArrowRight',
    BACKSPACE = 'Backspace'
}
export interface RectSelectOption{
    updateRectSelect:(data?:MoveEventData)=>void
}


export interface ICanvas{
    context:CanvasRenderingContext2D;
    width:number;
    height:number;
    resize():void;
    getRadio():number;
    getLineWidth():number;
    getLineOffset():number;
}

export type ListenFunc = (e:MouseEvent) => void
export type ListenRecord = {
    listener:ListenFunc,
    name:string,
    el:HTMLElement
}

export interface ShortCutItem{
    context?:any,
    fn:ShortCutCallback,
    params?:any[]
}

export interface IDispose {
    destroy():void
}

export type ShortCutCallback = ()=>void

export interface IKeyBoard{
    registerShortcut(keys:string[],item:ShortCutItem):boolean
    focus():void
}


export interface IDisposable{
    destroy():void
}

export interface OperationSizeOptions{
    name?:string
    onMove:(diffx:number,diffy:number,pos:HANDLER_ITEM_DIRECTION)=>void
    onChange:(diffx:number,diffy:number,pos:HANDLER_ITEM_DIRECTION)=>void
    onStartMove:(diffx:number,diffy:number,pos:HANDLER_ITEM_DIRECTION)=>void
    getScale:()=>number
    noNeedOperation?:boolean
    // onStart:()=>void
}

// export type OperationPos = {left:number,top:number,width:number,height:number}

export enum HANDLER_ITEM_DIRECTION{
    LEFT,
    TOP,
    RIGHT,
    BOTTOM,
    LEFT_TOP,
    RIGHT_TOP,
    LEFT_BOTTOM,
    RIGHT_BOTTOM
}

export interface ContentOptions{
    // getRect:()=>OperationPos
    updateMakers:(data?:MakerData[])=>void
    updateRectSelect:(data?:OperationPos)=>void
    // wheelSpeedX:number,
    // wheelSpeedY:number,
    // margin:number,
    // showTagName?:ShowTagName
    // createView?:CreateView,
    renderEngine?:IRenderEngine
    eventEl:HTMLElement
    scale:number,
    // x?:number,
    // y?:number
}

export interface HanlerItemOption extends OperationSizeOptions{
    
}

export interface MutationOptions{
    getRect:()=>OperationPos
}

export interface CoreOptions  {
    canvas?:CanvasOption
    data?:DSL
    // createView?:CreateView
    // showTagName?:ShowTagName
    renderEngine?:IRenderEngine
    rulerBackgroundColor?:string
    wheelSpeedX?:number
    wheelSpeedY?:number
}

