import {IEditorHook,IHookCore,IHookManager} from 'free-canvas-shared'




export class HookManager implements IHookManager{
    constructor(private _hooks:IEditorHook[]){

    }
    _each(iterator:(hook:IEditorHook)=>void){
        this._hooks.forEach(iterator)
    }
    onInit(core:IHookCore){
        this._each((hook:IEditorHook)=>{
            hook.onInit(core)
        })
    }
    onDestroy(){
        this._each((hook:IEditorHook)=>{
            hook.onDestroy()
        })
    }
}