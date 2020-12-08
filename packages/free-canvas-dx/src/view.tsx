//@ts-ignore
import * as Dinamic from '@ali/dinamic';
import React from 'react';
import ReactDOM from 'react-dom';
import '@ali/dinamic-views';
import {Model,IView,ViewOptions} from 'free-canvas-shared'


Dinamic.utils.env.deviceWidth = 375

// type UniversalProps = {
//     [key:string]:any
// }



function extraDxSource(md:Model){
    const {style,dxSource} = md.props
    const dxSourceVal = dxSource.value;
    const {name} = dxSourceVal
    const ret = Object.assign({},dxSourceVal,{
        attrs:Object.assign({},dxSourceVal.attrs,style.value)
    })
    // if(name === 'ImageView' && ret.attrs.backgroundColor == null){
    //     ret.attrs.backgroundColor = '#ccc'
    // }
    return ret;
}

function updateDxSource(md:Model,width:number,height:number){
    const {dxSource} = md.props
    const dxSourceVal = dxSource.value;
    const ret = Object.assign({},dxSourceVal,{
        attrs:Object.assign({},dxSourceVal.attrs,{width,height})
    })
    return ret;
}

interface WrapProps{
    data:any
}




const {Template} = Dinamic
export class DxView implements IView<Model>{
        private _el:HTMLElement
        private _dxSource:any
        private _wrapIns:any
        // private _componentProps:UniversalProps
        constructor(private _data:Model,option:ViewOptions){
            this._dxSource = extraDxSource(_data)
        }
        initWrap=(wrapIns:any)=>{
            this._wrapIns = wrapIns
        }
        render(){ 
            const {_dxSource} = this
            const div = document.createElement('div');
            div.style.pointerEvents = 'none';
            this._el = div 
            Dinamic.render(<Template ref={this.initWrap} tpl={{
                bizCode:'swc',
                template:[_dxSource]
            }}></Template>
                ,div)
        }
        getModel(){
            return this._data
        }
        renderTemplate(){
            const { _wrapIns,_dxSource } = this
            _wrapIns.shadow.tpl = {
                bizCode:'swc',
                template:[_dxSource]
            }
            _wrapIns.forceUpdate()
        }
        update(model:Model){
            this._data = model;
            this._dxSource = extraDxSource(model);
            this.renderTemplate()
        }
        updateStyle(width:number,height:number){
            this._dxSource = updateDxSource(this._data,width,height)
            this.renderTemplate()
        }
        getRoot(){
            return this._el
        }
        destroy(){
            ReactDOM.unmountComponentAtNode(this._el);
        }
}