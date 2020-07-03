import {Model} from './model';
import {ObjectStyleDeclaration} from '../utils/type'

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

export type ViewLifeCallback = ()=>void

export interface ViewOptions{
    onPostionChange?:OnPositionChange
    didUpdate?:ViewLifeCallback
}

export type OnPositionChange = (left:number,top:number)=>void

export interface MovableOptions {
    onPostionChange?:OnPositionChange
}