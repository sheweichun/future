import FreeCanvas from '@pkg/free-canvas-core';
import {createView} from '@pkg/free-canvas-fusion-render';
import {initTheme} from '@pkg/free-canvas-theme'

import ModelData from './data'
const imgCookData = require('./schema');
const imgCookData1 = require('./schema1');
const imgCookData2 = require('./schema2');


// //@ts-ignore
// window.$$onCanvasReady = function(cb:(canvas:FreeCanvas)=>void){
    
//     cb(canvas)
// }
console.log('in freeCanvas');
initTheme();
const canvas = FreeCanvas('canvas',{
    createView,
    data:{
        data:ModelData,
        type:0
        // data:[imgCookData,imgCookData1,imgCookData2],
        // type:1
        // data:[imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2,imgCookData,imgCookData1,imgCookData2],
        // type:1
    }
});
// @ts-ignore
const {$$onCanvasLoaded} = window.top;
if($$onCanvasLoaded){
    $$onCanvasLoaded(canvas);
}