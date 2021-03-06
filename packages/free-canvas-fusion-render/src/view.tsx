import React from 'react'
import ReactDOM from 'react-dom'
import * as Next from '@alife/next'
import {Model,IView,ViewOptions,ModelPropSchemas} from 'free-canvas-shared'

type WrapCompoenntProps = {
    data:Model,
    componentProps:UniversalProps
    // childNodes:Node[],
}
type WrapCompoenntState = {
    data:Model,
    // childNodes:Node[],
    componentProps:UniversalProps
}

type UniversalProps = {
    [key:string]:any
}

const assign = Object.assign

function calculatePropSchemas(propSchemas:ModelPropSchemas){
    return Object.keys(propSchemas).reduce((ret:UniversalProps,name)=>{
        const item = propSchemas[name];
        ret[name] = item.value;
        return ret;
    },{})
}

class WrapComponent extends React.Component<WrapCompoenntProps,WrapCompoenntState>{
    private _root:HTMLElement
    constructor(props:WrapCompoenntProps){
        super(props);
        this.state = {
            ...props
        }
    }
    initRef=(node:HTMLElement)=>{
        this._root = node
    }
    getEl(){
        return this._root
    }
    render(){
        const {data,componentProps} = this.state;
        const {name,style} = data
        
        const applyStyle = Object.assign({},style,{
            transition:'none'
        })
        //@ts-ignore
        const RenderComponent = Next[name]
        return <RenderComponent ref={this.initRef} {...componentProps} style={applyStyle}>
          
        </RenderComponent>;
    }
}

export class FusionView implements IView<Model>{
        private _instance:WrapComponent
        private _el:HTMLElement
        private _componentProps:UniversalProps
        constructor(private _data:Model,option:ViewOptions){
            this._componentProps = calculatePropSchemas(_data.propSchemas)
            this.render();
        }
        initRef=(node:WrapComponent)=>{
            this._instance = node
        }
        render(){
            const div = document.createElement('div');
            div.style.pointerEvents = 'none';
            this._el = div
            ReactDOM.render(<WrapComponent ref={this.initRef} componentProps={this._componentProps} data={this._data} >
            </WrapComponent>,this._el);
        }
        getModel(){
            return this._data
        }
        update(model:Model){
            this._data = model;
            this._componentProps = calculatePropSchemas(model.propSchemas)
            this._instance.setState({
                data:model,
                componentProps:this._componentProps
            })
        }
        updateStyle(width:number,height:number){
            this._instance.setState({
                data:assign({},this._data,{
                    style:assign({},this._data.style,{
                        width:`${width}px`,
                        height:`${height}px`
                    })
                })
            })
        }
        // appendChild(view:IView<Model>){
        //     console.log('appendChild');
        //     if(view == null) return
            
        //     // this._childNodes.push(view.getRoot());
        //     // this._instance.setState({
        //     //     childNodes:_childNodes
        //     // })
        //     // this._root.appendChild(view.getRoot())
        // }
        getRoot(){
            return this._el
        }
        destroy(){
            ReactDOM.unmountComponentAtNode(this._el);
        }
}