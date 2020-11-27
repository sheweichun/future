
import React from 'react'
import ReactDOM from 'react-dom'
import {CanvasEvent,IPlugin} from 'free-canvas-shared'
// import {createGlobalContext} from './context'
import {Provider} from './provider'
import {Editor,EditorComponents} from './editor/index'
// import React from 'react';
// import {Market} from './market/index'
// import {Header} from './header/index'

function preventDefault(e:DragEvent){
    e.preventDefault();
}


function preventPinch(e:WheelEvent){
    const {deltaX,ctrlKey} = e;
    if(deltaX === 0 && ctrlKey){
        e.preventDefault()
        e.stopPropagation();
    }
}

export interface SetupOptions{
    runTask(plugin:IPlugin):void
}
// function initComponents<T>(context:React.Context<T>){
//     Header.contextType = context;
//     Market.contextType = context;
// }

export * from './market/index';
export * from './header/index'
export * from './panel/index'
export * from './tree/index'
export * from './aside/index'
export function setup(mountNode:HTMLElement,components:EditorComponents,opt:SetupOptions){
    const {runTask} = opt
    // const {GlobalContext,GlobalContextValue} = createGlobalContext({propSchemaMap})
    document.body.addEventListener(CanvasEvent.DRAGOVER,preventDefault)
    mountNode.addEventListener(CanvasEvent.MOUSEWHEEL,preventPinch)
    ReactDOM.render(
        <Provider >
            <Editor
            components={components}
            runTask={runTask}
            ></Editor>
        </Provider>
    ,mountNode)
    return function(){
        document.body.removeEventListener(CanvasEvent.DRAGOVER,preventDefault)
        mountNode.removeEventListener(CanvasEvent.MOUSEWHEEL,preventPinch)
        ReactDOM.unmountComponentAtNode(mountNode);
    }
}