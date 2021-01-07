import React from 'react'
import {Input} from '@alife/next'
import {JSONSchemaView,ObjectSchema,SchemaChangeType,Icon} from '@pkg/free-canvas-json-editor'
import {JsonEditorProps,JsonEditorState} from './type'
import s from './index.less';  
// import { SchemaValue } from 'src/editor/dx-editor/data';
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
        this.onAdd = this.onAdd.bind(this)
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
        const {onChange,store} = this.props;
        store.setValue(val.toValue())
        onChange && onChange(val,type)
    }
    onChangeTab(index:number){
        const {store,onChange} = this.props;
        store.changeIndex(index);
        onChange && onChange(store.getSchema(),SchemaChangeType.isData);
        this.setState({})
    }
    onRemove(index:number,e:React.MouseEvent){
        const {store,onChange} = this.props;
        store.remove(index);
        onChange && onChange(store.getSchema(),SchemaChangeType.isData);
        this.setState({})
        e.stopPropagation()
    }
    onAdd(){
        const {store,onChange} = this.props;
        store.push({});
        onChange && onChange(store.getSchema(),SchemaChangeType.isData);
        this.setState({})
    }
    onEnableEdit(index:number){
        const {store} = this.props;
        store.enabelEdit(index);
        this.setState({})
    }
    onDisableEdit(index:number){
        const {store} = this.props;
        store.disabelEdit(index);
        this.setState({})
    }
    onChangeTitle(index:number,val:string){
        const {store} = this.props;
        store.changeTitle(index,val);
        this.setState({})
    }
    render(){
        const {store} = this.props;
        const curIndex = store.getIndex();
        const values = store.getAllValue();
        const moreOne = values.length > 1;
        // console.log('values :',values);
        return <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column'}}>
            <div>
                {
                    values && values.map((item,index)=>{
                        // console.log('isEditing:',item,item.isEditing);
                        const isActive = index === curIndex;
                        return <div className={`${s.jsonEditorTab} ${isActive ? s.active : ''}`} key={index} onClick={isActive ? null : this.onChangeTab.bind(this,index)}>
                            <div className={s.jsonEditorTabTitle}>
                                {
                                    item.isEditing ?  <Input autoFocus onBlur={this.onDisableEdit.bind(this,index)} style={{
                                        width:'80px'
                                    }} value={item.title} onChange={this.onChangeTitle.bind(this,index)}></Input> : 
                                    <div style={{padding:'4px 0px'}} onDoubleClick={this.onEnableEdit.bind(this,index)}>{item.title}</div>
                                }
                            </div>
                            {moreOne && <Icon style={{
                                position: 'absolute',
                                right: 0,
                                top: '4px'
                            }} type="close" onClick={this.onRemove.bind(this,index)}></Icon>}
                        </div>
                    })
                }
                <div className={s.jsonEditorTab} >
                    <div className={s.jsonEditorTabTitle} style={{
                        background:'var(--PRIMARY_BACKGROUND)',
                        color:'white',
                        padding: '4px 8px'
                    }} onClick={this.onAdd}>
                        <Icon type="add" ></Icon>
                    </div>
                </div>
            </div>
            <JSONSchemaView className={s.jsonEditor} value={store.getSchema()} onValueChange={this.onChangeValue}>
            </JSONSchemaView>
        </div>
    }
}