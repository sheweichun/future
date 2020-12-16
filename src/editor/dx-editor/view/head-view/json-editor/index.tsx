import React from 'react'
import {Input} from '@alife/next'

import {JsonEditorProps,JsonEditorState} from './type'
import s from './index.less';  
import { ModelVo } from '@pkg/free-canvas-shared';




export default class JsonEditor extends React.Component<JsonEditorProps,JsonEditorState>{
    constructor(props:JsonEditorProps){
        super(props);
        const {defaultValue} = props
        if(defaultValue){
            this.state = {
                value:JSON.stringify(defaultValue,null,'  ')
            }
        }
        
    }
    static getDerivedStateFromProps(nextProps:JsonEditorProps,prevState:JsonEditorState){
        if(nextProps.value == null){
            return prevState
        }
        return Object.assign({},prevState,{
            value:JSON.stringify(nextProps.value,null,'  ')
        })
    }
    onChangeValue=(val:string)=>{
        const {onChange} = this.props;
        let json:ModelVo;
        try{
            json = JSON.parse(val)
            this.setState({
                value:val
            })
            onChange && onChange(json)
        }catch(e){

        }
    }
    render(){
        const {value} = this.state;
        return <Input.TextArea className={s.jsonEditor} value={value} onChange={this.onChangeValue}>
        </Input.TextArea>
    }
}