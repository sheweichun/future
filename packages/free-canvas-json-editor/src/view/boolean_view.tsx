


import React from 'react';
import {Switch} from '@alife/next'
import {BooleanSchema,BaseProps,BaseComponent} from '../schema'
import Item from './item'
export interface BooleanViewProps extends BaseProps {
    value:BooleanSchema
}

export type BooleanViewState = {

}

// const DATASOURCE = [
//     {
//         label:'true',
//         value:true
//     },{
//         label:'false',
//         value:false
//     }
// ]

// const DATASOURCE = [
//     {label:'option1', value:'option1'},
//     {label:'option2', value:'option2'},
//     {label:'disabled', disabled:true}
// ]

export default class BooleanView extends BaseComponent<BooleanViewProps,BooleanViewState>{
    constructor(props:BooleanViewProps){
        super(props)
    }
    onChange=(val:any)=>{
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
        return <Item view={this} getRoot={this.initRoot} name={name} data={value} onClick={this.onItemClick} onlyChild={onlyChild} {...others}>
            <Switch checked={value.getValue()} onChange={this.onChange}>
            </Switch>
        </Item>
    }
}