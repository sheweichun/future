import {IPlugin,ICommander,ImutBase, COMMANDERS,Model, CanvasEvent, IPluginOptions, OperationPos} from 'free-canvas-shared'  
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Drag} from '../dnd';
import {MarketOption} from './type';
import {Button} from '@alife/next';


function postionAddData(data:Model,x:number,y:number){
    if(!data.extra) {
        data.extra = {position:{left:x,top:y},isSelect:true}
        return data;
    }
    data.extra.position = {left:x,top:y}
    data.extra.isSelect = true
    return data;
}



export class Market implements IPlugin{
    private _commander:ICommander
    private _previewEle:HTMLElement
    private _canvasMask:HTMLElement
    private _canvasRect:DOMRect
    private _getContentRect:()=>OperationPos
    constructor(private _el:HTMLElement,private _options:MarketOption){
        this.createPreviewEle();
        this.createMask();
        this.mount();
        this._canvasRect = this._options.canvasEl.getBoundingClientRect();
        this.listen();
    }
    listen(){
        const {canvasEl} = this._options
        this.onCanvasDragEnter = this.onCanvasDragEnter.bind(this);
        this.onCanvasDragLeave = this.onCanvasDragLeave.bind(this);
        canvasEl.addEventListener(CanvasEvent.DRAGENTER,this.onCanvasDragEnter);
        canvasEl.addEventListener(CanvasEvent.DRAGLEAVE,this.onCanvasDragLeave);
    }
    onCanvasDragEnter(){
        this._commander.excute(COMMANDERS.SELECTENTER)
    }
    onCanvasDragLeave(){
        this._commander.excute(COMMANDERS.SELECTLEAVE)
    }
    createMask(){
        const div = document.createElement('div');
        div.setAttribute("style","position:absolute;width:100%;height:100%;left:0;top:0;z-index:999");
        this._canvasMask = div;
    }
    createPreviewEle(){
        const div = document.createElement('div')
        div.innerHTML = 'hello'
        div.style.opacity = '0'
        div.style.position = 'absolute'
        div.style.left = '-999999px'
        div.style.top = '-999999px'
        document.body.appendChild(div)
        this._previewEle = div;
    }
    install(commander:ICommander,options:IPluginOptions){
        this._commander = commander;
        this._getContentRect = options.getContentRect
    }
    update(data:ImutBase,selectNodes:ImutBase[]):void{

    }
    destroy(){
        document.body.removeChild(this._previewEle);
        const {canvasEl} = this._options
        canvasEl.removeEventListener(CanvasEvent.DRAGENTER,this.onCanvasDragEnter);
        canvasEl.removeEventListener(CanvasEvent.DRAGLEAVE,this.onCanvasDragLeave);
    }
    fixPosData(x:number,y:number){
        const {left,top} = this._canvasRect
        const contentRect = this._getContentRect()
        return {
            x: x - left - contentRect.left,
            y: y - top - contentRect.top,
        }
    }
    onDragStart=(data:Model,startX:number,startY:number):void=>{
        const newData = this.fixPosData(startX,startY);
        this._commander.excute(COMMANDERS.ADD,postionAddData(data,newData.x,newData.y));
        const {canvasEl} = this._options
        canvasEl.appendChild(this._canvasMask);
        this._commander.excute(COMMANDERS.SELECTSTART,newData)
        // return getCanvasElement(elId)
    }
    onDragMove=(startX:number,startY:number)=>{
        const newData = this.fixPosData(startX,startY);
        this._commander.excute(COMMANDERS.SELECTMOVE,newData);
    }
    onDragEnd=()=>{
        const {canvasEl} = this._options
        this._commander.excute(COMMANDERS.SELECTSTOP);
        canvasEl.removeChild(this._canvasMask);
    }
    mount(){
        ReactDOM.render(<div>
            in react aside
            <Drag onDragStart={this.onDragStart} 
            onDragMove={this.onDragMove}
            previewEle={this._previewEle}
            onDragEnd={this.onDragEnd}
            data={{
                id:'114',
                name:'div',
                style:{
                    width:'150px',
                    height:'150px',
                    backgroundColor:'pink'
                },
                extra:{
                    position:{
                        left:1200,
                        top:200
                    }
                }
            }}>
                add buttong
            </Drag>
        </div>,this._el);
    }
}