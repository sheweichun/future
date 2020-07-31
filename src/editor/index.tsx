import {Market,setup} from '@pkg/free-canvas-editor'
const canvasEl = document.querySelector('.canvas-content') as HTMLElement;
const iframe = (canvasEl.querySelector('iframe') as HTMLIFrameElement)
// const iframeRect = iframe.getBoundingClientRect();
const market = new Market(document.querySelector('.aside'),{
    canvasEl,
    getCanvasElement:function(id:string){
        return iframe.contentDocument.getElementById(id)
    }
})
iframe.addEventListener('click',()=>{
    console.log('click');
})
setup();
//@ts-ignore
window.$$onCanvasLoaded = function(freeCanvas){
    freeCanvas.installPlugin(market)
}
