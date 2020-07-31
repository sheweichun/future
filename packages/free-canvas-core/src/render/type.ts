import {ObjectStyleDeclaration} from '../utils/type'
import { BaseModel } from './dsl/store';
import { OperationPos } from '../core/operation/pos';
import {ICommander} from 'free-canvas-shared'

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
    // getRect():DOMRect
    getRoot():Node
    getModel():T
    updateStyle(width:number,height:number):void
    destroy():void
} 



export type ViewLifeCallback = (viewModel?:IViewModel)=>void
export type OnPositionChange = (left:number,top:number)=>void
// export type OnSelect = (viewModel:IViewModel)=>void

export interface ViewOptions{
    
    // onPostionChange?:OnPositionChange
    // onSelect?:OnSelect
   
    // didUpdate?:(prevModel:Model,curModel:Model)=>void
    // didMount?:ViewLifeCallback
}

export interface IViewModelCollection{
    viewModelList:IViewModel[]
    didMount:()=>void
    didUpdate:()=>void
    update:(data:any)=>void
}

export interface IViewModel{
    isRoot:boolean
    isGroup:boolean
    children:IViewModelCollection
    getModel():BaseModel
    getParent():IViewModel
    isChildren(vm:IViewModel):boolean
    getRect():OperationPos
    getAbsRect():OperationPos
    getView():IMovable
    getViewModelByXY(x:number,y:number):IViewModel
    getRelativeRect(rect:OperationPos):{left:number,top:number,width:number,height:number}
    // updateRectByWheel(scrollX:number,scrollY:number):void
    // isInside(vm:IViewModel):boolean
    // moveLeft(diffx:number):void
    // moveTop(diffy:number):void
    // moveRight(diffx:number):void
    // moveBottom(diffy:number):void
    // canMove():boolean
    // disableMove():void
    changePosition(diffx:number,diffy:number):void
}

export interface IMovable{
    focus(x:number,y:number,shiftKey:boolean):void
    // mark():void
}


// export enum COMMANDERS {
//     POSITIONCHANGE,
//     SELECTED,
//     UNSELECTED
// }

// export interface CommanderData{
//     type:COMMANDERS
//     vm:IViewModel
//     data:any
// }

// export interface CommanderOption {
//     callback:CommanderCallback,
//     context?:any,
//     params?:any[]
// }

// export type CommanderCallback = (data?:any)=>void

// export interface ICommander{
//     register(name:number,callback: CommanderCallback,context?:any,params?:any[]):void
//     unregister(name:number):void
//     excute(name:number,data?:any):void
// }

export interface ViewModelOptions extends MovableOptions{
    commander?:ICommander,
    addViewModel:(viewModel:IViewModel)=>void
    removeViewModel:(ViewModel:IViewModel)=>void
    getRect:()=>OperationPos
}

export interface MovableOptions extends ViewOptions{
    onPostionChange?:OnPositionChange,
    onFocus?:ViewLifeCallback,
    onBlur?:ViewLifeCallback
    id:string[],
    mountNode?:HTMLElement
    excute(name:number,data?:any):void
    isRoot?:boolean
    isChild?:boolean
    vm:IViewModel
}