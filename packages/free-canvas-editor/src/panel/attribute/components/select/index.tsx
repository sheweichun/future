import React from 'react'
import {Select} from '@alife/next'
import {Utils,AttrPropType,AttrStateType} from 'free-canvas-shared'
import {EdiItem} from '../../../../components/edi-item/index'
import {BaseComponent,getDerivedStateFromProps} from '../base'
import {CLASS_PREFIX} from '../../../../util/contant'


const {debounce} = Utils

export interface SelectProps extends AttrPropType{
 
}

export interface SelectState extends AttrStateType{
    
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


export class SelectAttr extends BaseComponent<SelectProps,SelectState>{
    constructor(props:SelectProps){
        super(props)
        this.state = {
            value:null
        }
        // this.onChangeValue = debounce(this.onChangeValue.bind(this),50);
        this.onChangeValue = this.onChangeValue.bind(this)
    }
    static getDerivedStateFromProps = getDerivedStateFromProps
    onChangeValue(value:any,actionType:string,item:any){
        const {schema,mutation} = this.props;
        schema.update(mutation,Object.assign({},this.state.value,{
            value:value
        }))
    }
    render(){
        const {schema,modelData,renderVarInput,mutation} = this.props
        const {value} = this.state
        const {props} = schema
        const hasMore = modelData.length > 1
        return  <EdiItem title={schema.title} supportVar={!!renderVarInput} checked={value.isExp} onChange={this._onChangeExp}>
            {value.isExp ? renderVarInput(modelData,schema,mutation) : 
            <Select className={Select_CLZ} {...props} placeholder={hasMore ? '多个值': ''} value={value ? value.value : null} onChange={this.onChangeValue}>

            </Select>}
        </EdiItem> 
    }
}