//@ts-ignore
import * as Dinamic from '@ali/dinamic';
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import '@ali/dinamic-views';
import {Model,IView,ViewOptions} from 'free-canvas-shared'


Dinamic.utils.env.deviceWidth = 375

// const pluginAddPointerNone = {
//     componentFinishFirstPaint:(data:any,el:HTMLElement)=>{
//         el.style.pointerEvents = 'none'
//     }
// }

// Dinamic.addTemplatePlugins([
//     pluginAddPointerNone
// ]);

// type UniversalProps = {
//     [key:string]:any
// }

function fixAttr(data:any){
    return Object.keys(data).reduce((ret,val)=>{
        const item = data[val]
        const retVal = item && !item.disabled ? item.value : ''
        // @ts-ignore
        ret[val] = retVal 
        return ret;
    },{})
}

function extraDxSource(md:Model){
    const {style,dxSource} = md.props
    const dxSourceVal = dxSource.value;
    // const {name} = dxSourceVal
    const ret = Object.assign({},dxSourceVal,{
        attrs:fixAttr(Object.assign({},dxSourceVal.attrs,style.value))
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
        attrs:fixAttr(Object.assign({},dxSourceVal.attrs,{width:{value:width},height:{value:height}}))
    })
    return ret;
}

interface WrapProps{
    data:any
}


let dataId = 0;


const mockData = {
    test:'我是你大哥',
    url:'https://gw.alicdn.com/tfs/TB1tK9cF7Y2gK0jSZFgXXc5OFXa-750-1334.png'
}

const {Template} = Dinamic

Template.prototype.shouldComponentUpdate = function(){
    return true;
}
// console.dir(Template)

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
            // const {_dxSource} = this
            const div = document.createElement('div');
            div.style.pointerEvents = 'none';
            this._el = div 
            //ref={this.initWrap}
            this.wrapRender();
        }
        wrapRender(){
            try{
                const {_dxSource,_el} = this
                // console.log('_dxSource :',_dxSource,mockData);
                Dinamic.render(<Template ref={this.initWrap} data={mockData}  tpl={{
                    bizCode:'swc',
                    template:[_dxSource]
                }}></Template>
                    ,_el)
            }catch(e){
                console.error(e)
            }
        }
        getModel(){
            return this._data
        }
        renderTemplate(){
            const {_el,_dxSource,_wrapIns} = this
            if(_dxSource.name === 'TextView' || this._wrapIns == null){
                unmountComponentAtNode(_el);
                this.wrapRender();
            }else{
                _wrapIns.shadow.tpl = {
                    bizCode:'swc',
                    template:[_dxSource]
                }
                _wrapIns.setState({})
            }
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