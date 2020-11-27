
import {IPlugin} from '@pkg/free-canvas-shared'
import {setup} from '@pkg/free-canvas-editor'
import {initTheme} from '@pkg/free-canvas-theme'

const taskList:IPlugin[] = []
let freeCanvas:any
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

export function init(){
    initTheme(); 
    //@ts-ignore
    window.$$onCanvasLoaded = function(_freeCanvas:any){
        freeCanvas = _freeCanvas;
        taskList.forEach((item)=>{
            freeCanvas.installPlugin(item);
        })
    }
    return setup(mountNode,{ //components
            
    },{
        runTask
    })
}


