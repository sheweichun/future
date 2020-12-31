import React from 'react';
import ReactDOM from 'react-dom';
// import {GlobalContextValue,GlobalContext} from './context'
// import {Editor} from './editor'
import {init} from './startup';
import '@pkg/free-canvas-editor/dist/editor.css'
import '@pkg/free-canvas-json-editor/dist/editor.css'
import {DxEditorHook,HeadView,getComponentData,renderVarInput} from './dx-editor'
import {JSONSchemaView,rootSchema2JSONSchema} from '@pkg/free-canvas-json-editor'
import {schemaData,schemaValue} from './dx-editor/data/schema'



// const canvasEl = document.querySelector('.canvas-content') as HTMLElement;
// const iframe = (canvasEl.querySelector('iframe') as HTMLIFrameElement)
// const market = new Market(document.querySelector('.aside'),{
//     canvasEl,
//     getCanvasElement:function(id:string){
//         return iframe.contentDocument.getElementById(id)
//     }
// })


init([new DxEditorHook()],{
    head:new HeadView(),
    getComponentData,
    renderVarInput
}); 


// import {initTheme} from '@pkg/free-canvas-theme'
// initTheme()
// const div = document.createElement('div');
// div.setAttribute('style','position:absolute;left:0;width:100%;height:100%;top:0')
// //@ts-ignore
// const shema = rootSchema2JSONSchema(schemaData,schemaValue,null);
// ReactDOM.render(<JSONSchemaView value={shema}></JSONSchemaView>,div)

// document.body.appendChild(div) 

/* ========================= */
// const mountNode = document.querySelector('.root')
//     ReactDOM.render(
//         <GlobalContext.Provider value={GlobalContextValue}>
//             <Editor
//             runTask={runTask}
//             ></Editor>
//         </GlobalContext.Provider>
//     ,mountNode)
