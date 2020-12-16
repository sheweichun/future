// import React from 'react';
// import ReactDOM from 'react-dom';
// import {GlobalContextValue,GlobalContext} from './context'
// import {Editor} from './editor'
import {init} from './startup';
import '@pkg/free-canvas-editor/dist/editor.css'
import {DxEditorHook,HeadView,getComponentData,renderVarInput} from './dx-editor'

// const canvasEl = document.querySelector('.canvas-content') as HTMLElement;
// const iframe = (canvasEl.querySelector('iframe') as HTMLIFrameElement)
// const market = new Market(document.querySelector('.aside'),{
//     canvasEl,
//     getCanvasElement:function(id:string){
//         return iframe.contentDocument.getElementById(id)
//     }
// })

console.log('renderVarInput :',renderVarInput);

init([new DxEditorHook()],{
    head:new HeadView(),
    getComponentData,
    renderVarInput
}); 

// const mountNode = document.querySelector('.root')
//     ReactDOM.render(
//         <GlobalContext.Provider value={GlobalContextValue}>
//             <Editor
//             runTask={runTask}
//             ></Editor>
//         </GlobalContext.Provider>
//     ,mountNode)
