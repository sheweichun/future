
import {ViewOptions,Model,IView,ImutBase} from './view'


export interface IRenderEngineOpt{ 
    getData():any
}

export type CreateView = (data:Model,options?:ViewOptions)=>IView<Model>
export type ShowTagName = (md:Model)=>string

export interface IRenderEngine{
    createView:CreateView
    showTagName:ShowTagName
    getData():any
    getListData:(model:ImutBase,value:any)=>Array<any>  
}