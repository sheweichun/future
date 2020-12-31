import React from 'react'
import {Input} from '@alife/next'
import {Utils,AttrPropType,AttrStateType} from 'free-canvas-shared'
import {BaseComponent} from '../base'
import {EdiItem} from '../../../../components/edi-item/index'
import {CLASS_PREFIX} from '../../../../util/contant'


const {debounce} = Utils

export interface MeasureProps extends AttrPropType{
  
}

export interface MeasureState{
    x:number
    y:number
    width:number
    height:number
}

const MEASURE_CLZ = `${CLASS_PREFIX}measure`



function getValue(val:string){
    val = (val+'').replace(/\s/g,'')
    const ret = parseInt(val)
    if(isNaN(ret)){
        return 0
    }
    return ret;
}


export class Measure extends React.Component<MeasureProps,MeasureState>{
    constructor(props:MeasureProps){
        super(props)
        this.state = {
            x:0,
            y:0,
            width:0,
            height:0
        }
        this.onChangeValue = debounce(this.onChangeValue.bind(this),50);
    }
    renderEmpty(){
        return ''
    }

    onChangeX=(value:string)=>{
        this.onChangeValue({
            left:getValue(value)
        })
    }
    onChangeY=(value:string)=>{
        this.onChangeValue({
            top:getValue(value)
        })
    }
    onChangeW=(value:string)=>{
        this.onChangeValue({
            width:getValue(value)
        })
    }
    onChangeH=(value:string)=>{
        this.onChangeValue({
            height:getValue(value)
        })
    }
    onChangeValue(data:any){
        const {schema,mutation,modelData} = this.props;
        schema.update(mutation,modelData,data)
    }
    static getDerivedStateFromProps(nextProps:MeasureProps,prevState:MeasureState){
        const {modelData,schema} = nextProps;
        let {left:x,top:y,width,height} = schema.get(modelData[0]);
        modelData.forEach((md)=>{
            const pos = schema.get(md)
            if(x != null && pos.left !== x){
                x = null
            }
            if(y != null && pos.top !== y){
                y = null
            }
            if(width != null && pos.width !== width){
                width = null
            }
            if(height != null && pos.height !== height){
                height = null
            }
        })
        return Object.assign({},prevState,{
            x,y,width,height
        })
    }
    // getRenderValue(){
    //     const {modelData,schema} = this.props;
    //     let {left:x,top:y,width,height} = schema.get(modelData[0]);
    //     modelData.forEach((md)=>{
    //         const pos = schema.get(md)
    //         if(x != null && pos.left !== x){
    //             x = null
    //         }
    //         if(y != null && pos.top !== y){
    //             y = null
    //         }
    //         if(width != null && pos.width !== width){
    //             width = null
    //         }
    //         if(height != null && pos.height !== height){
    //             height = null
    //         }
    //     })
    //     return {
    //         x,y,width,height
    //     }
    // }
    render(){
        const {modelData,schema} = this.props;
        const {x,y,width,height} = this.state;
        const placeholder = modelData.length > 1 ? '多个值' : ''
        // const {x,y,width,height} = this.getRenderValue()
        return  <EdiItem title={schema.title} >
            <div className={MEASURE_CLZ}>
                <Input addonTextBefore="X" htmlType="number" placeholder={placeholder} value={x} onChange={this.onChangeX}></Input>
                <Input addonTextBefore="Y" htmlType="number" placeholder={placeholder} value={y} onChange={this.onChangeY}></Input>
                <Input addonTextBefore="W" htmlType="number" placeholder={placeholder} value={width} onChange={this.onChangeW}></Input>
                <Input addonTextBefore="H" htmlType="number" placeholder={placeholder} value={height} onChange={this.onChangeH}></Input>
            </div>
        </EdiItem>
    }
}