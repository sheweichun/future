import {IEditorHook,IHookCore,IHeadView} from '@pkg/free-canvas-shared'
import {ObjectSchema,SchemaChangeType} from '@pkg/free-canvas-json-editor'
import React from 'react'
import ReactDOM from 'react-dom'
// import DataView from './dataView/index'
import IconButton from './icon-button/index' 
import JSONEditor from './json-editor/index'
import {model2Template} from '../../transform/index'
// import {schemaData,schemaValue,emptySchemaData,emptyValue} from '../../data/schema'
import {schema,Store} from '../store/index'

  
import s from './index.less';      



// const objSchema = rootSchema2JSONSchema(schemaData,{});
// const tabs = [
//     { title: '视图', key: 'view' },
//     { title: '数据', key: 'data'}
// ];

export class HeadView implements IHeadView{ 
    private _core:IHookCore
    private _canvasEl:HTMLElement
    private _dataViewRootEl:HTMLElement
    private _contentEl:HTMLElement
    private _unmountCallback:()=>void
    private _dataOpenFlag:boolean = false
    private _refreshCallback:()=>void
    private _schemaChangeFlag:boolean = false;
    // private _store:Store
    constructor(){
        // console.log(3)
        // this._store = Store.getInstance()
    }
    initCanvasEl(el:HTMLElement){
        this._canvasEl = el;
    }
    setRefreshCallback(cb:()=>void){
        this._refreshCallback = cb;
    }
    setContentEl(el:HTMLElement){
        this._contentEl = el;
    }
    showLeftPanel(render:(el:HTMLElement)=>(()=>void)){
        const {_contentEl} = this
        if(_contentEl == null) return
        if(this._dataViewRootEl){
            if(this._unmountCallback){
                this._unmountCallback();
            }
        }else{
            const div = document.createElement('div')
            div.className = s.dxDataView
            this._dataViewRootEl = div
            _contentEl.appendChild(div)
        }
        this._unmountCallback = render(this._dataViewRootEl)
    }
    hideLeftPanel(){
        const {_dataViewRootEl,_contentEl} = this
        if(_dataViewRootEl == null || _contentEl == null) return
        // ReactDOM.unmountComponentAtNode(_dataViewRootEl)
        if(this._unmountCallback){
            this._unmountCallback();
        }
        this._unmountCallback = null
        _contentEl.removeChild(_dataViewRootEl);
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
    onChangeJson=(val:ObjectSchema)=>{
        this._schemaChangeFlag = true
        // console.log('onChangeJson !! :',val.toValue());
        // updateSchemaValue(val.toValue());
    }
    toggleDataPanel=()=>{
        // const {_dataOpenFlag} = this;
        this._dataOpenFlag = !this._dataOpenFlag;
        if(this._dataOpenFlag){
            this._schemaChangeFlag = false;
            this.showLeftPanel((el:HTMLElement)=>{
                ReactDOM.render(<JSONEditor store={Store.getInstance()} onChange={this.onChangeJson}>
                {/* ReactDOM.render(<JSONEditor data={emptySchemaData} value={emptyValue} onChange={this.onChangeJson}> */}
                </JSONEditor>,el)
                return ()=>{
                    el && ReactDOM.unmountComponentAtNode(el);
                }
            })
        }else{
            this.hideLeftPanel()
            if(this._schemaChangeFlag){
                this._core.refreshAllViews()
            }
            this._schemaChangeFlag = false;
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