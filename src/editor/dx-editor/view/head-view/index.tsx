import {IEditorHook,IHookCore,IHeadView, ModelVo} from '@pkg/free-canvas-shared'
import React from 'react'
import ReactDOM from 'react-dom'
// import DataView from './dataView/index'
import IconButton from './icon-button/index' 
import JSONEditor from './json-editor/index'
import {model2Template} from '../../transform/index'

  
import s from './index.less';      


// const tabs = [
//     { title: '视图', key: 'view' },
//     { title: '数据', key: 'data'}
// ];

export class HeadView implements IHeadView{ 
    private _core:IHookCore
    private _canvasEl:HTMLElement
    private _dataViewRootEl:HTMLElement
    private _unmountCallback:()=>void
    private _dataOpenFlag:boolean = false
    private _refreshCallback:()=>void
    constructor(){
        // console.log(3)
    }
    initCanvasEl(el:HTMLElement){
        this._canvasEl = el;
    }
    setRefreshCallback(cb:()=>void){
        this._refreshCallback = cb;
    }
    showLeftPanel(render:(el:HTMLElement)=>(()=>void)){
        const {_canvasEl} = this
        if(_canvasEl == null) return
        if(this._dataViewRootEl){
            if(this._unmountCallback){
                this._unmountCallback();
            }
        }else{
            const div = document.createElement('div')
            div.className = s.dxDataView
            this._dataViewRootEl = div
            _canvasEl.appendChild(div)
        }
        this._unmountCallback = render(this._dataViewRootEl)
    }
    hideLeftPanel(){
        const {_dataViewRootEl,_canvasEl} = this
        if(_dataViewRootEl == null || _canvasEl == null) return
        // ReactDOM.unmountComponentAtNode(_dataViewRootEl)
        if(this._unmountCallback){
            this._unmountCallback();
        }
        this._unmountCallback = null
        _canvasEl.removeChild(_dataViewRootEl);
        this._dataViewRootEl = null;
    }
    setCore(core:IHookCore){
        this._core = core 
    }
    onClick=()=>{
        const {_core} = this
        const data = _core.getStore().currentState.toJS().data
        console.log('_core.getStore().currentState :',model2Template(data))
    }
    onChangeJson=(vo:ModelVo)=>{
        console.log('vo :',vo);
    }
    toggleDataPanel=()=>{
        // const {_dataOpenFlag} = this;
        this._dataOpenFlag = !this._dataOpenFlag;
        if(this._dataOpenFlag){
            this.showLeftPanel((el:HTMLElement)=>{
                ReactDOM.render(<JSONEditor defaultValue={{
                    "text1":"test1",
                    "text2":"test2",
                    "text3":"test3"
                }} onChange={this.onChangeJson}>
                </JSONEditor>,el)
                return ()=>{
                    el && ReactDOM.unmountComponentAtNode(el);
                }
            })
        }else{
            this.hideLeftPanel()
        }
        this._refreshCallback();
    }
    renderMiddleView(){
        const {_dataOpenFlag} = this
        return <div  className={s.dxHeaderMiddle}>
            <div className={s.dxHeaderMiddleLeft}> 
                <div onClick={this.onClick}>test</div>
                <IconButton title="逻辑" type="js" ></IconButton>
                <IconButton title="数据" type="shuju" active={_dataOpenFlag} onClick={this.toggleDataPanel}></IconButton>
            </div>
            <div className={s.dxHeaderMiddleMiddle}>
                <IconButton title="保存" type="baocun"></IconButton>
                <IconButton title="真机调试" type="zhenjitiaoshi"></IconButton>
                <IconButton title="预览" type="yulan"></IconButton>
            </div>
            <div className={s.dxHeaderMiddleRight}>
                <IconButton title="提测" type="tice"></IconButton>
                <IconButton title="强制通过" type="tongguo"></IconButton>
                <IconButton title="回退编辑" type="huitui"></IconButton>
                <IconButton title="预发布" type="yufabu"></IconButton>
                <IconButton title="发布" type="fabu"></IconButton>
            </div>
        </div>
        // return <div onClick={this.onClick}>test</div>
    }
}