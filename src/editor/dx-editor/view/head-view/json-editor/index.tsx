import React from 'react'
// import {Input} from '@alife/next'
import {JSONSchemaView,ObjectSchema,SchemaChangeType} from '@pkg/free-canvas-json-editor'
import {JsonEditorProps,JsonEditorState} from './type'
import s from './index.less';  
// import { ModelVo } from '@pkg/free-canvas-shared';




export default class JsonEditor extends React.Component<JsonEditorProps,JsonEditorState>{
    constructor(props:JsonEditorProps){
        super(props);
        // const {defaultValue} = props
        // if(defaultValue){
        //     this.state = {
        //         value:defaultValue
        //     }
        // }
        
    }
    // static getDerivedStateFromProps(nextProps:JsonEditorProps,prevState:JsonEditorState){
    //     if(nextProps.value == null){
    //         return prevState
    //     }
    //     return Object.assign({},prevState,{
    //         value:nextProps.value
    //     })
    // }
    onChangeValue=(val:ObjectSchema,type:SchemaChangeType)=>{
        // console.log('in onChangeValue!!!');
        const {onChange} = this.props;
        onChange && onChange(val,type)
    }
    render(){
        const {value} = this.props;
        return <JSONSchemaView className={s.jsonEditor} value={value} onValueChange={this.onChangeValue}>
        </JSONSchemaView>
    }
}