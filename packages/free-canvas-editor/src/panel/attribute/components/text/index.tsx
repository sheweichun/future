import React from 'react'
import {Input} from '@alife/next'
import {IMutation, Model,ModelPropSchema,Utils} from 'free-canvas-shared'
import {CLASS_PREFIX} from '../../../../util/contant'


const {debounce} = Utils

export interface TextProps{
    modelData:Model[]
    selectModel:Model
    schema:ModelPropSchema
    mutation:IMutation
}

export interface TextState{
    
}

const Text_CLZ = `${CLASS_PREFIX}text`






export class TextAttr extends React.Component<TextProps,TextState>{
    constructor(props:TextProps){
        super(props)
        this.state = {

        }
        // this.onChangeValue = debounce(this.onChangeValue.bind(this),50);
        this.onChangeValue = this.onChangeValue.bind(this)
    }
    onChangeValue(value:any){
        const {schema,mutation} = this.props;
        schema.update(mutation,value)
    }
    getRenderValue(){
        const {modelData,schema} = this.props;
        let value = schema.get(modelData[0]);
        modelData.forEach((md)=>{
            const data = schema.get(md)
            if(value != null && data != value){
                value = null
            }
        })
        return value
    }
    render(){
        const {schema,modelData} = this.props
        const {props} = schema
        const {placeholder,...otherProps} = props || {}
        return <Input className={Text_CLZ} {...otherProps} placeholder={modelData.length > 1 ? '多个值' : placeholder} value={this.getRenderValue()} onChange={this.onChangeValue}>

        </Input>
    }
}