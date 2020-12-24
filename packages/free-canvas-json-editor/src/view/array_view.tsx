


import React from 'react';
import {ArraySchema, ValueSchema,BaseProps,BaseComponent} from '../schema'
import {Table,Button} from '@alife/next'
import Item from './item'
import Icon from './icon'
import { renderView } from './util';

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
        // this.setState({})
    }
    renderCell=(colName:string,schema:ValueSchema)=>{
        // const {} = this.props
        // console.log('name :',name);
        const {value,onlyChild,name,...others} = this.props;
        return renderView(schema,colName,{onlyChild:true,...others})
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
                    action={<Icon style={{cursor:'pointer'}} type="add" onClick={this.onAdd}></Icon>}
                    {...others}
                    onlyChild={onlyChild}>
            <div style={{width:'100%'}}>
                <Table style={{padding:'0 4px'}} dataSource={items} >
                    {
                        propKeys && propKeys.map((name:string,key:number)=>{
                            const schema = properties[name];
                            return <Table.Column key={key} title={<div style={{padding:'8px 12px',cursor:'pointer',background:schema.focused ? 'var(--HIGHLIGHT_BACKGROUND)' : ''}} 
                            onClick={this.onColClick.bind(this,schema,name,properties[name])}>
                                {schema.getTitle()+`(${name})`}
                            </div>} dataIndex={name} cell={this.renderCell.bind(this,name)}></Table.Column>
                        })
                    }
                    {!others.onlyValue &&  <Table.Column width={115} title={<div style={{padding:'8px 12px'}}>操作</div>} cell={this.renderOperation}></Table.Column>}
                </Table>
                {/* <div style={{cursor:'pointer',margin:'0px 4px',padding:'4px 0',textAlign:'center',background:'var(--PRIMARY_BACKGROUND)',color:'var(--ACTIVE_TEXT_COLOR)'}}>
                    新增
                </div> */}
            </div>
        </Item>
    }
}