import React from 'react'
import {Select} from '@alife/next'
import {IMutation, Model,ModelPropSchema,Utils} from 'free-canvas-shared'
import {CLASS_PREFIX} from '../../../../util/contant'


const {debounce} = Utils

export interface SelectProps{
    modelData:Model[]
    selectModel:Model
    schema:ModelPropSchema
    mutation:IMutation
}

export interface SelectState{
    
}

const Select_CLZ = `${CLASS_PREFIX}select`



function getValue(val:string){
    val = (val+'').replace(/\s/g,'')
    const ret = parseInt(val)
    if(isNaN(ret)){
        return 0
    }
    return ret;
}


export class SelectAttr extends React.Component<SelectProps,SelectState>{
    constructor(props:SelectProps){
        super(props)
        this.state = {

        }
        // this.onChangeValue = debounce(this.onChangeValue.bind(this),50);
        this.onChangeValue = this.onChangeValue.bind(this)
    }
    onChangeValue(value:any,actionType:string,item:any){
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
        const hasMore = modelData.length > 1
        return <Select className={Select_CLZ} {...props} placeholder={hasMore ? '多个值': ''} value={this.getRenderValue()} onChange={this.onChangeValue}>

        </Select>
    }
}