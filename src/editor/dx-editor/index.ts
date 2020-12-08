import {IEditorHook,IHookCore} from '@pkg/free-canvas-shared'
import {getTemplateById} from './fetch'

import {template2Model} from './transform'

export {getComponentData} from './fetch'

export * from './view/index'



export class DxEditorHook implements IEditorHook{
    private _core:IHookCore
    onInit(core:IHookCore){
        this._core = core
        getTemplateById('10117').then((data:any)=>{
            const model = template2Model(data.source);
            core.update(model)
        })
    }
    onDestroy(){

    }
}



