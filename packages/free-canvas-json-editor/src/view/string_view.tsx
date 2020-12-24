


import React from 'react';
import {Input} from '@alife/next'
import {StringSchema,BaseProps,BaseComponent} from '../schema'
import Item from './item'

export interface StringViewProps extends BaseProps {
    value:StringSchema
}

export type StringViewState = {

}


export default class StringView extends BaseComponent<StringViewProps,StringViewState>{
    constructor(props:StringViewProps){
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
        return <Item view={this} getRoot={this.initRoot} data={value} name={name} onClick={this.onItemClick} onlyChild={onlyChild} {...others}>
            <Input style={{width:'100%'}} value={value.getValue()} onChange={this.onChange}></Input>
        </Item>
    }
}