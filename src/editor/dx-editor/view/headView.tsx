import {IEditorHook,IHookCore,IHeadView} from '@pkg/free-canvas-shared'
import {model2Template} from '../transform/index'
import React from 'react'

export class HeadView implements IHeadView{
    private _core:IHookCore
    constructor(){

    }
    setCore(core:IHookCore){
        this._core = core
    }
    onClick=()=>{
        const {_core} = this
        const data = _core.getStore().currentState.toJS().data
        // console.log('_core.getStore().currentState :',model2Template(data))
    }
    renderMiddleView(){
        return <div onClick={this.onClick}>
            test
        </div>
    }
}