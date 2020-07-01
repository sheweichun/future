import {Model} from './model';
import {ObjectStyleDeclaration} from '../utils/type'

export interface ViewAttribute{
    style?:ObjectStyleDeclaration
    [name:string]:any
}

export interface RenderOptions{
    
}

export interface IView{
    // model:Model
    appendChild(view:IView):void
    update(model:Model):void
    getRoot():Node
    getModel():Model
} 

export interface MovableOptions {
    left:string,
    top:string
}