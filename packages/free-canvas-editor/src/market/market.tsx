import {IPlugin,ICommander,IMutation, COMMANDERS,Model, CanvasEvent, IPluginOptions, OperationPos,ModelFromType} from 'free-canvas-shared'  
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Drag} from '../dnd';
// import {MarketOption} from './type';
import MockData from './data'
// import {Button} from '@alife/next';


function postionAddData(data:Model,x:number,y:number){
    if(!data.extra) {
        data.extra = {position:{left:x,top:y,width:100,height:100},isSelect:true}
        return data;
    }
    data.extra.position = Object.assign(data.extra.position || {},{left:x,top:y})
    data.extra.isSelect = true
    return data;
}

export interface MarketProps{
    maskEl:HTMLElement
    previewEl:HTMLElement
    children?: React.ReactNode;
}

export interface MarketState{

}


export class Market extends React.Component<MarketProps> implements IPlugin{
    private _commander:ICommander
    private _canvasEl:HTMLElement
    private _canvasRect:DOMRect
    private _getContentRect:()=>OperationPos
    constructor(props:MarketProps){
        super(props);
        this.onCanvasDragEnter = this.onCanvasDragEnter.bind(this);
        this.onCanvasDragLeave = this.onCanvasDragLeave.bind(this);
    }
    // listen(){
    //     const {canvasEl} = this._options

    //     canvasEl.addEventListener(CanvasEvent.DRAGENTER,this.onCanvasDragEnter);
    //     canvasEl.addEventListener(CanvasEvent.DRAGLEAVE,this.onCanvasDragLeave);
    // }
    initCanvas(el:HTMLElement){
        this._canvasEl = el;
        this._canvasRect = el.getBoundingClientRect();
    }
    onCanvasDragEnter(){
        this._commander.excute(COMMANDERS.SELECTENTER)
    }
    onCanvasDragLeave(){
        this._commander.excute(COMMANDERS.SELECTLEAVE)
    }
    install(commander:ICommander,mutation:IMutation,options:IPluginOptions){
        this._commander = commander;
        this._getContentRect = options.getContentRect
    }
    update(data:Model,selectNodes:Model[]):void{

    }
    destroy(){
        // const {_canvasEl} = this
        // _canvasEl.removeEventListener(CanvasEvent.DRAGENTER,this.onCanvasDragEnter);
        // _canvasEl.removeEventListener(CanvasEvent.DRAGLEAVE,this.onCanvasDragLeave);
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
        const {_canvasEl} = this
        const {maskEl} = this.props;
        _canvasEl.appendChild(maskEl);
        this._commander.excute(COMMANDERS.SELECTSTART,newData)
        // return getCanvasElement(elId)
    }
    onDragMove=(startX:number,startY:number)=>{
        const newData = this.fixPosData(startX,startY);
        this._commander.excute(COMMANDERS.SELECTMOVE,newData);
    }
    onDragEnd=()=>{
        const {_canvasEl} = this
        const {maskEl} = this.props;
        this._commander.excute(COMMANDERS.SELECTSTOP);
        _canvasEl.removeChild(maskEl);
    }
    render(){
        const {previewEl} = this.props;
        return (<div>
            in react aside
            <Drag onDragStart={this.onDragStart} 
            onDragMove={this.onDragMove}
            previewEle={previewEl}
            onDragEnd={this.onDragEnd}
            data={MockData[0]}>
                add Button
            </Drag>
            <Drag onDragStart={this.onDragStart} 
            onDragMove={this.onDragMove}
            previewEle={previewEl}
            onDragEnd={this.onDragEnd}
            data={MockData[1]}>
                add Progess
            </Drag>
            <Drag onDragStart={this.onDragStart} 
            onDragMove={this.onDragMove}
            previewEle={previewEl}
            onDragEnd={this.onDragEnd}
            data={MockData[2]}>
                add Card
            </Drag>
        </div>);
    }
}
