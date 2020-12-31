


import React from 'react';
import {ArraySchema, ValueSchema,BaseProps,BaseComponent, createValueSchema} from '../schema'
import {Table,Button} from '@alife/next'
import Item from './item'
import Icon from './icon'
import { renderView } from './util';
import { JSON_PROPERTY_TYPES } from 'free-canvas-shared';

export interface ArrayViewProps extends BaseProps {
    value:ArraySchema,
}

export type ArrayViewState = {

}

// function renderCell(schema:ValueSchema){
//     return renderView(schema)
// }



function stopPropagation(e:React.MouseEvent){
    e.stopPropagation()
}

export default class ArrayView extends BaseComponent<ArrayViewProps,ArrayViewState>{
    constructor(props:ArrayViewProps){
        super(props)
    }
    onItemClick=()=>{
        const {onClickView,name,value} = this.props;
        onClickView && onClickView(value,name,this)
    }
    onColClick=(value:ValueSchema,name:string,view:BaseComponent<any,any>,e:React.MouseEvent)=>{
        const {onClickView} = this.props;
        onClickView && onClickView(value,name,view)
        e.stopPropagation()
    }
    onDeleteItem(index:number){
        const {value} = this.props;
        value.removeItem(index);
        value.triggerChange()
        // this.setState({})
    }
    onUpItem(index:number){
        const {value} = this.props;
        if(value.upItem(index)){
            // this.setState({})
            value.triggerChange()
        }
    }
    onDownItem(index:number){
        const {value} = this.props;
        if(value.downItem(index)){
            value.triggerChange()
            // this.setState({})
        }
    }
    onCopy(index:number){
        const {value} = this.props;
        value.copyItem(index)
        value.triggerChange()
        // this.setState({})
    }
    renderOperation=(val:any,index:number)=>{
        return <div >
            <Icon style={{padding:'4px 6px',cursor:'pointer'}} type="copy" onClick={this.onCopy.bind(this,index)}></Icon>
            <Icon style={{padding:'4px 6px',cursor:'pointer'}} type="up" onClick={this.onUpItem.bind(this,index)}></Icon>
            <Icon style={{padding:'4px 6px',cursor:'pointer'}} type="down" onClick={this.onDownItem.bind(this,index)}></Icon>
            <Icon style={{padding:'4px 6px',cursor:'pointer'}} type="delete" onClick={this.onDeleteItem.bind(this,index)}></Icon>
        </div>
    }
    onAdd=()=>{
        const {value} = this.props;
        value.addItem();
        value.triggerChange()
    }
    onAddItemProperty=(e:React.MouseEvent)=>{
        const {value,onClickView} = this.props;
        const newSchema = createValueSchema(value,{
            type:JSON_PROPERTY_TYPES.string,
            title:'测试',
            description:'test',
        },null,value.getChangeCallback())
        const name = value.getCopyPropertiName('column')
        value.addItemProperty(name,newSchema,true);
        onClickView(newSchema,name,null)
        e.stopPropagation();
    }
    renderCell=(colName:string,schema:ValueSchema)=>{
        // const {} = this.props
        // console.log('name :',name);
        const {value,onlyChild,name,...others} = this.props;
        return renderView(schema,colName,{onlyChild:true,...others,isRequired:value.isRequired(name)})
    }
    onDeleteClick(name:string,e:React.MouseEvent){
        const {value,onClickView,name:curName} = this.props;
        value.removeItemProperty(name)
        onClickView(value,curName,this);
        e.stopPropagation()
    }
    onCopyClick(name:string,e:React.MouseEvent){
        const {value,onClickView} = this.props;
        const properties = value.getObjectSchema()
        const curSchema = properties[name]
        if(!curSchema) return
        const newSchema = curSchema.clone(true)
        const newName = value.getCopyPropertiName(name);
        value.addItemProperty(newName,newSchema,value.isRequired(name))
        onClickView(newSchema,newName,null);
        e.stopPropagation()
    }
    render(){
        const {value,name,onlyChild,...others} = this.props;
        const items = value.getItems();
        const properties = value.getObjectSchema()
        const propKeys = Object.keys(properties || {})
        return <Item data={value}
                    getRoot={this.initRoot}
                    name={name} 
                    view={this}
                    onClick={this.onItemClick} 
                    action={<Icon style={{cursor:'pointer'}} type="add" onClick={this.onAddItemProperty}></Icon>}
                    {...others}
                    onlyChild={onlyChild}>
            <div style={{width:'100%'}}>
                <Table style={{padding:'0 4px'}} dataSource={items} >
                    {
                        propKeys && propKeys.map((name:string,key:number)=>{
                            const schema = properties[name];
                            return <Table.Column 
                            key={key} 
                            title={<div 
                                    style={{padding:'8px 12px',cursor:'pointer',background:schema.focused ? 'var(--HIGHLIGHT_BACKGROUND)' : ''}} 
                                    onClick={this.onColClick.bind(this,schema,name,properties[name])}>
                                    <div style={{width:'100%',height:'100%',display:'flex',justifyContent:'space-between'}}>
                                        <div>
                                            {value.isRequired(name) ? <span style={{color:'red',marginRight:'4px',position: 'relative',top: '2px'}}>*</span>:''}
                                            <span>{schema.getTitle()+`(${name})`}</span>
                                        </div>
                                        {!others.onlyValue && <div>
                                            <Icon style={{marginLeft:'6px',cursor:'pointer'}} type="copy" onClick={this.onCopyClick.bind(this,name)}></Icon>
                                            <Icon style={{marginLeft:'6px',cursor:'pointer'}} type="delete" onClick={this.onDeleteClick.bind(this,name)}></Icon>
                                        </div>}
                                    </div>
                                    
                                </div>
                            } dataIndex={name} cell={this.renderCell.bind(this,name)}></Table.Column>
                        })
                    }
                    <Table.Column width={115} title={<div style={{padding:'8px 12px'}}>操作</div>} cell={this.renderOperation}></Table.Column>
                </Table>
                <div onClick={this.onAdd} style={{
                    cursor:'pointer',
                    margin:'0px 4px',
                    padding:'6px 0',
                    textAlign:'center',
                    background:'var(--PRIMARY_BACKGROUND)',color:'var(--ACTIVE_TEXT_COLOR)'}}>
                    新增一行
                </div>
            </div>
        </Item>
    }
}