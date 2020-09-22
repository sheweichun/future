import {ObjectStyleDeclaration} from '../utils/type'
import { BaseModel } from './dsl/store';
import { OperationPos } from '../core/operation/pos';
import {ICommander,ViewOptions,CreateView,ModelType, IView, Model,IPos} from 'free-canvas-shared'

export interface ViewAttribute{
    style?:ObjectStyleDeclaration
    [name:string]:any
}

export interface RenderOptions{
    
}

// export interface ViewOptions{
    
// }

// export interface IView<T>{
//     // model:Model
//     appendChild(view:IView<T>):void
//     update(model:T):void
//     // getRect():DOMRect
//     getRoot():Node
//     getModel():T
//     updateStyle(width:number,height:number):void
//     destroy():void
// } 



export type ViewLifeCallback = (viewModel?:IViewModel)=>void
export type OnPositionChange = (left:number,top:number)=>void
// export type OnSelect = (viewModel:IViewModel)=>void



export interface IViewModelCollection{
    viewModelList:IViewModel[]
    didMount:()=>void
    didUpdate:()=>void
    update:(data:any)=>void
}

export interface IViewModel{
    modelType:ModelType
    children:IViewModelCollection
    getModel():BaseModel
    getArtboard():IViewModel
    getParent():IViewModel
    getInitialParent():IViewModel
    getTypeParent(type:ModelType):IViewModel
    changeRect(target:string,diffx:number,diffy:number,onlyPos?:boolean):void
    didMount():void
    update(model:BaseModel):void
    isChildren(vm:IViewModel):boolean
    getRect():OperationPos
    updateRect(pos:IPos):void
    recalculateRect():void
    changeArtboardId(artboardId:string):void
    // setRect(pos:OperationPos):void
    getAbsRect():OperationPos
    getView():IMovable
    remove():void
    separate():void
    removeChildViewModel(vm:IViewModel):void
    getParentRect():{left:number,top:number}
    getViewModelByXY(x:number,y:number):IViewModel
    getRelativeRect(rect:IPos,parentRect?:{left:number,top:number}):IPos
    // updateRectByWheel(scrollX:number,scrollY:number):void
    // isInside(vm:IViewModel):boolean
    // moveLeft(diffx:number):void
    // moveTop(diffy:number):void
    // moveRight(diffx:number):void
    // moveBottom(diffy:number):void
    // canMove():boolean
    // disableMove():void
    onDidUpdate():void
    onDidMount():void
    appendChild(vm:IViewModel):void
    changePosition(diffx:number,diffy:number,onlyPos?:boolean):void
}

export interface IMovable{
    view:IView<Model>
    updateIsChild(isChild:boolean):void
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
    artboardId?:string,
    createView?:CreateView
    addViewModel:(viewModel:IViewModel)=>void
    removeViewModel:(ViewModel:IViewModel)=>void
    getRootViewModel:()=>IViewModel
    getScale:()=>number
    getViewModel:(id:string)=>IViewModel
    getArtboards:(excludeIds:{[key:string]:boolean})=>IViewModel[]
    updateViewModel:(prevId:string,curVm:IViewModel)=>void
    getRect:()=>OperationPos
    isOperating:()=>boolean
}

export interface MovableOptions extends ViewOptions{
    onPostionChange?:OnPositionChange,
    onFocus?:ViewLifeCallback,
    onBlur?:ViewLifeCallback
    // id:string[],
    mountNode?:HTMLElement
    getScale:()=>number
    excute(name:number,data?:any):void
    // isRoot?:boolean
    // isGroup?:boolean
    modelType:ModelType
    isChild?:boolean
    createView?:CreateView
    isOperating:()=>boolean
    vm:IViewModel
}