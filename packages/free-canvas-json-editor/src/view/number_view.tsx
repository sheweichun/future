


import React from 'react';
import {Input} from '@alife/next'
import {NumberSchema,BaseProps,BaseComponent} from '../schema'
import Item from './item'
export interface NumberViewProps extends BaseProps {
    value:NumberSchema
}

export type NumberViewState = {

}


export default class NumberView extends BaseComponent<NumberViewProps,NumberViewState>{
    constructor(props:NumberViewProps){
        super(props)
    }
    onChange=(val:string)=>{
        const {value} = this.props;
        value.setValue(val)
        // this.setState({})
    }
    onItemClick=()=>{
        const {onClickView,value,name} = this.props;
        onClickView && onClickView(value,name,this)
    }
    render(){
        const {value,name,onlyChild,...others} = this.props;
        const val = value.getValue();
        return <Item view={this} getRoot={this.initRoot} data={value} name={name} onClick={this.onItemClick} onlyChild={onlyChild} {...others}>
            <Input style={{width:'100%'}} value={val == null ? '' : val} onChange={this.onChange}></Input>
        </Item>
    }
}