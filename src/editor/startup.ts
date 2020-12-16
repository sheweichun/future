
import {IPlugin,IEditorHook,IHookCore, IHeadView, ComponentMarketStore, RenderVarInput} from '@pkg/free-canvas-shared'
import {showTagName} from '@pkg/free-canvas-dx'
import {setup,HookManager} from '@pkg/free-canvas-editor'
import {initTheme} from '@pkg/free-canvas-theme'



const taskList:IPlugin[] = []
let freeCanvas:IHookCore
const mountNode = document.querySelector('.root') as HTMLElement

function runTask(...plugins:IPlugin[]){
    if(freeCanvas == null){
        taskList.push(...plugins)
    }else{
        plugins.forEach((plg)=>{
            freeCanvas.installPlugin(plg)
        })
    }
}

export type InitOption = {
    head?:IHeadView
    getComponentData?:()=>Promise<ComponentMarketStore>
    renderVarInput?:RenderVarInput
}

export function init(hooks:IEditorHook[],opt:InitOption){
    const { head,getComponentData,renderVarInput } = opt || {}
    const hookManager = new HookManager(hooks);
    initTheme(); 
    //@ts-ignore
    window.$$onCanvasLoaded = function(_freeCanvas:IHookCore){
        freeCanvas = _freeCanvas;
        taskList.forEach((item)=>{
            freeCanvas.installPlugin(item);
        })
        freeCanvas.registerHookManager(hookManager)
        hookManager.onInit(freeCanvas);
        head && head.setCore(freeCanvas)
    }
    return setup(mountNode,{
        head:head,
        components:{},//components
        showTagName,
        renderVarInput,
        getComponentData,
        runTask
    })
}


