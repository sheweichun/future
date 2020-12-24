import React from 'react'
import {Switch} from '@alife/next'
import {Utils,AttrPropType,AttrStateType} from 'free-canvas-shared'
import {CLASS_PREFIX} from '../../../../util/contant'
import {EdiItem} from '../../../../components/edi-item/index'
import {BaseComponent,getDerivedStateFromProps} from '../base'



export interface SwitchProps extends AttrPropType{
}

export interface SwitchState extends AttrStateType{
    
}

const Switch_CLZ = `${CLASS_PREFIX}Switch`






export class SwitchAttr extends BaseComponent<SwitchProps,SwitchState>{
    constructor(props:SwitchProps){
        super(props)
        this.state = {
            value:null
        }
        this.onChangeValue = this.onChangeValue.bind(this)
    }
    static getDerivedStateFromProps = getDerivedStateFromProps
    onChangeValue(value:any){
        const {schema,mutation} = this.props;
        schema.update(mutation,Object.assign({},this.state.value,{
            value:value ? 'true' : ''
        }))
    }
    render(){
        const {value} = this.state;
        const {schema,modelData,renderVarInput,mutation} = this.props
        const {props} = schema
        const {placeholder,...otherProps} = props || {}
        return <EdiItem title={schema.title} supportVar={!!renderVarInput} checked={value.isExp} onChange={this._onChangeExp}>
            {value.isExp ? renderVarInput(modelData,schema,mutation,value) : 
            <Switch className={Switch_CLZ} {...otherProps} placeholder={modelData.length > 1 ? '多个值' : placeholder} checked={value ? value.value ? true : false : false} onChange={this.onChangeValue}>

            </Switch>}
        </EdiItem>
    }
}