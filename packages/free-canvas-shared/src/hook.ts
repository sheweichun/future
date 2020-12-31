
import {Model,IPlugin, IMutation} from './view'


export interface CallbackFunction {
    (preState: any, nextState: any): void;
}

export interface HistoryApi {
    currentState:any
    undo(): any;
    redo(): any;
    subscribe(callback: CallbackFunction): () => void;
}

export interface IHookCore{
    getMutation():IMutation
    registerHookManager(hookManager:IHookManager):void
    update(data:Model):void
    getStore():HistoryApi
    installPlugin(plugin:IPlugin):void
    refreshAllViews():void
}

export interface IHookManager{
    onInit(core:IHookCore):void
    onDestroy():void
}

export interface IEditorHook{
    onInit(core:IHookCore):void
    onDestroy():void
}


export interface IPluginView{
    setCore:(core:IHookCore)=>void
}


export interface IHeadView extends HeadViewHook,IPluginView{
    initCanvasEl(el:HTMLElement):void
    setRefreshCallback(cb:()=>void):void
    setContentEl:(el:HTMLElement)=>void
}

export interface HeadViewHook{
    renderLeftView?:()=>JSX.Element
    renderRightView?:()=>JSX.Element
    renderMiddleView?:()=>JSX.Element
}

