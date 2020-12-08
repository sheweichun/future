import React from 'react'
import {Input} from '@alife/next'
import {IMutation, Model,ModelPropSchema,Utils} from 'free-canvas-shared'
import {CLASS_PREFIX} from '../../../../util/contant'


const {debounce} = Utils

export interface MeasureProps{
    modelData:Model[]
    selectModel:Model
    schema:ModelPropSchema
    mutation:IMutation
}

export interface MeasureState{
    
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
        const {schema,mutation} = this.props;
        schema.update(mutation,data)
    }
    getRenderValue(){
        const {modelData,schema} = this.props;
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
        return {
            x,y,width,height
        }
    }
    render(){
        const {modelData} = this.props;
        const placeholder = modelData.length > 1 ? '多个值' : ''
        const {x,y,width,height} = this.getRenderValue()
        return <div className={MEASURE_CLZ}>
            <Input addonTextBefore="X" htmlType="number" placeholder={placeholder} value={x} onChange={this.onChangeX}></Input>
            <Input addonTextBefore="Y" htmlType="number" placeholder={placeholder} value={y} onChange={this.onChangeY}></Input>
            <Input addonTextBefore="W" htmlType="number" placeholder={placeholder} value={width} onChange={this.onChangeW}></Input>
            <Input addonTextBefore="H" htmlType="number" placeholder={placeholder} value={height} onChange={this.onChangeH}></Input>
        </div>
    }
}