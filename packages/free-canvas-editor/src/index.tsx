
import React from 'react'
import ReactDOM from 'react-dom'
import {CanvasEvent,IPlugin} from 'free-canvas-shared'
import {GlobalContext,GlobalContextValue} from './context'
import {Editor,EditorComponents} from './editor/index'
// import React from 'react';
// import {Market} from './market/index'
// import {Header} from './header/index'

function preventDragOver(e:DragEvent){
    e.preventDefault();
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
export function setup(mountNode:HTMLElement,components:EditorComponents,opt:SetupOptions){
    document.body.addEventListener(CanvasEvent.DRAGOVER,preventDragOver)
    ReactDOM.render(
        <GlobalContext.Provider value={GlobalContextValue}>
            <Editor
            components={components}
            runTask={opt.runTask}
            ></Editor>
        </GlobalContext.Provider>
    ,mountNode)
}