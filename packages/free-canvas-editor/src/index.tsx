
import React from 'react'
import ReactDOM from 'react-dom'
import {CanvasEvent,IPlugin} from 'free-canvas-shared'
import {GlobalContext,GlobalContextValue} from './context'
import {Editor,EditorComponents} from './editor/index'
// import React from 'react';
// import {Market} from './market/index'
// import {Header} from './header/index'

function preventDefault(e:DragEvent){
    e.preventDefault();
}


function preventPinch(e:MouseWheelEvent){
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
    document.body.addEventListener(CanvasEvent.DRAGOVER,preventDefault)
    mountNode.addEventListener(CanvasEvent.MOUSEWHEEL,preventPinch)
    ReactDOM.render(
        <GlobalContext.Provider value={GlobalContextValue}>
            <Editor
            components={components}
            runTask={opt.runTask}
            ></Editor>
        </GlobalContext.Provider>
    ,mountNode)
    return function(){
        document.body.removeEventListener(CanvasEvent.DRAGOVER,preventDefault)
        mountNode.removeEventListener(CanvasEvent.MOUSEWHEEL,preventPinch)
        ReactDOM.unmountComponentAtNode(mountNode);
    }
}