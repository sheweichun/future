import React from 'react'
import {Input} from '@alife/next'
import {Utils,AttrPropType,AttrStateType} from 'free-canvas-shared'
import {CLASS_PREFIX} from '../../../../util/contant'
import {EdiItem} from '../../../../components/edi-item/index'
import {BaseComponent,getDerivedStateFromProps} from '../base'


const {debounce} = Utils

export interface TextProps extends AttrPropType{
}

export interface TextState extends AttrStateType{
    
}

const Text_CLZ = `${CLASS_PREFIX}text`






export class TextAttr extends BaseComponent<TextProps,TextState>{
    constructor(props:TextProps){
        super(props)
        this.state = {
            value:null
        }
        // this.onChangeValue = debounce(this.onChangeValue.bind(this),50);
        this.onChangeValue = this.onChangeValue.bind(this)
    }
    static getDerivedStateFromProps = getDerivedStateFromProps
    onChangeValue(value:any){
        const {schema,mutation} = this.props;
        schema.update(mutation,Object.assign({},this.state.value,{
            value:value
        }))
    }
    render(){
        const {value} = this.state;
        const {schema,modelData,renderVarInput,mutation} = this.props
        const {props} = schema
        const {placeholder,...otherProps} = props || {}
        return <EdiItem title={schema.title} supportVar={!!renderVarInput} checked={value.isExp} onChange={this._onChangeExp}> 
            {value.isExp ? renderVarInput(modelData,schema,mutation,value) : 
            <Input className={Text_CLZ} {...otherProps} placeholder={modelData.length > 1 ? '多个值' : placeholder} value={value ? value.value : null} onChange={this.onChangeValue}>

            </Input>}
        </EdiItem>
    }
}