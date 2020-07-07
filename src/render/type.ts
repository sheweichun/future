import {Model} from './model';
import {ObjectStyleDeclaration} from '../utils/type'
import { BaseModel } from './dsl/store';

export interface ViewAttribute{
    style?:ObjectStyleDeclaration
    [name:string]:any
}

export interface RenderOptions{
    
}

export interface IView<T>{
    // model:Model
    appendChild(view:IView<T>):void
    update(model:T):void
    getRect():DOMRect
    getRoot():Node
    getModel():T
    destroy():void
} 



export type ViewLifeCallback = (viewModel?:IViewModel)=>void
export type OnPositionChange = (left:number,top:number)=>void
// export type OnSelect = (viewModel:IViewModel)=>void

export interface ViewOptions{
    
    // onPostionChange?:OnPositionChange
    // onSelect?:OnSelect
   
    didUpdate?:(prevModel:Model,curModel:Model)=>void
    didMount?:ViewLifeCallback
}

export interface IViewModel{
    getModel():BaseModel
}


export enum COMMANDERS {
    POSITIONCHANGE,
    SELECTED,
    UNSELECTED
    // VIEWFOCUS,
    // VIEWBLUR
}

export interface CommanderData{
    type:COMMANDERS
    vm:IViewModel
    data:any
}

export interface CommanderOption {
    callback:CommanderCallback,
    context?:any,
    params?:any[]
}

export type CommanderCallback = (vm:IViewModel,data?:any)=>void

export interface ICommander{
    register(name:number,callback: CommanderCallback,context?:any,params?:any[]):void
    unregister(name:number):void
    excute(name:number,vm:IViewModel,data?:any):void
}

export interface ViewModelOptions extends MovableOptions{
    commander?:ICommander
}

export interface MovableOptions extends ViewOptions{
    onPostionChange?:OnPositionChange,
    onFocus?:ViewLifeCallback,
    onBlur?:ViewLifeCallback
    mountNode?:HTMLElement
    excute(name:number,data?:any):void
    isRoot?:boolean
}