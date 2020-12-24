import {IPlugin,ICommander,IMutation, COMMANDERS,Model, IViewModel, IPluginOptions, OperationPos,MarketData} from 'free-canvas-shared'  
import * as React from 'react';
import { Search } from '@alife/next';
import {CLASS_PREFIX} from '../util/contant'
import {Drag} from '../dnd';
// import {MarketOption} from './type';
// import MockData from './data'
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
    componentData:MarketData[]
}

export interface MarketState{
    tabIndex:number
}


const MARKET_CLZ = `${CLASS_PREFIX}market`
const MARKET_HEAD_CLZ = `${CLASS_PREFIX}market-head`
const MARKET_HEAD_SEARCH_CLZ = `${CLASS_PREFIX}market-head-search`
const MARKET_HEAD_TAB_CLZ = `${CLASS_PREFIX}market-head-tab`
const MARKET_CONTENT_CLZ = `${CLASS_PREFIX}market-content`
const MARKET_HEAD_TABITEM_CLZ = `${CLASS_PREFIX}market-head-tabitem`
const MARKET_DRAGITEM_CLZ = `${CLASS_PREFIX}market-dragitem`

export class Market extends React.Component<MarketProps,MarketState> implements IPlugin{
    private _commander:ICommander
    private _canvasEl:HTMLElement
    private _canvasRect:DOMRect
    private _getContentRect:()=>OperationPos
    constructor(props:MarketProps){
        super(props);
        this.onCanvasDragEnter = this.onCanvasDragEnter.bind(this);
        this.onCanvasDragLeave = this.onCanvasDragLeave.bind(this);
        this.state = {
            tabIndex:0
        }
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
    update(data:Model,selectModels:Model[],vms:IViewModel[]):void{

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
    onChangeTab(tabIndex:number){
        const {state} = this;
        if(state.tabIndex === tabIndex) return;
        this.setState({
            tabIndex
        })
    }
    render(){
        const {tabIndex} = this.state;
        const {previewEl,componentData} = this.props;
        const activeComs = componentData[tabIndex];
        return (<div className={MARKET_CLZ}>
            <div className={MARKET_HEAD_CLZ}>
                <Search className={MARKET_HEAD_SEARCH_CLZ} shape="simple"></Search>
                <div className={MARKET_HEAD_TAB_CLZ}>
                    {
                        componentData && componentData.map((item,itemKey)=>{
                        return <div key={itemKey} className={MARKET_HEAD_TABITEM_CLZ + (tabIndex === itemKey ? ' active':'')} onClick={this.onChangeTab.bind(this,itemKey)}>{item.name}</div>
                        })
                    }
                </div>
            </div>
            <div className={MARKET_CONTENT_CLZ}>
                {
                    activeComs && activeComs.children && activeComs.children.map((cdata,index)=>{
                        return <div key={index} style={{padding:'8px 0 16px 0'}}>
                            <div style={{padding:'2px 8px',fontSize:'14px'}}>{cdata.name}</div>
                            <div style={{display:'flex'}}>
                                { 
                                    cdata.children && cdata.children.map((item,itemKey)=>{
                                        return  <Drag className={MARKET_DRAGITEM_CLZ} key={itemKey} onDragStart={this.onDragStart} 
                                        onDragMove={this.onDragMove}
                                        previewEle={previewEl}
                                        onDragEnd={this.onDragEnd}
                                        data={item}>
                                            <img src={item.preview}/>
                                            <div>{item.name}</div>
                                        </Drag>
                                    })
                                }
                            </div>
                        </div>
                    })
                }
            </div>
        </div>);
    }
}
