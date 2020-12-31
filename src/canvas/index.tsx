import FreeCanvas from '@pkg/free-canvas-core';
// import {createViewGenerator,showTagName} from '@pkg/free-canvas-dx';
import {DXRenderEngine} from '@pkg/free-canvas-dx';
import {initTheme} from '@pkg/free-canvas-theme'
// import {getSchemaValue} from '../editor/dx-editor/view/store/schema'
import ModelData from './data'
const imgCookData = require('./schema');
const imgCookData1 = require('./schema1');
const imgCookData2 = require('./schema2');


// //@ts-ignore
// window.$$onCanvasReady = function(cb:(canvas:FreeCanvas)=>void){
    
//     cb(canvas)
// }
// @ts-ignore
const {$$onCanvasLoaded,$$getSchemaValue} = window.top;
const dxRenderEngine = new DXRenderEngine({
    getData:$$getSchemaValue
})
initTheme();
const canvas = FreeCanvas('canvas',{
    renderEngine:dxRenderEngine 
    // createView:createViewGenerator($$getSchemaValue),
    // showTagName,
    // data:{
    //     data:ModelData,
    //     type:0
    // }
});
// @ts-ignore
if($$onCanvasLoaded){
    $$onCanvasLoaded(canvas);
}


    // data:[imgCookData,imgCookData1,imgCookData2],
        // type:1
        // data:[imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2],
        // type:1