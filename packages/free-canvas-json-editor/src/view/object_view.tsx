


// import { JSON_PROPERTY_TYPES } from 'free-canvas-shared';
import React from 'react';
// import {Balloon} from '@alife/next'
import {renderView} from './util'
import Icon from './icon'
import {ObjectSchema, ValueSchema,BaseProps,BaseComponent, createValueSchema, StringSchema} from '../schema'
import {PREFIX} from './constant'
import Item from './item'
import { JSON_PROPERTY_TYPES } from 'free-canvas-shared';

export interface ObjectViewProps extends BaseProps {
    value:ObjectSchema
    style?:React.CSSProperties 
}

export type ObjectViewState = {

}


const OBJECT_VIEW_CLASS = `${PREFIX}objectview`


export default class ObjectView extends BaseComponent<ObjectViewProps,ObjectViewState>{
    constructor(props:ObjectViewProps){
        super(props)
    }
    onItemClick=()=>{
        const {onClickView,value,name} = this.props;
        onClickView && onClickView(value,name,this)
    }
    onAdd=(e:React.MouseEvent)=>{
        e.stopPropagation()
        const {value,onClickView} = this.props;
        const newSchema = createValueSchema(value,{
            type:JSON_PROPERTY_TYPES.string,
            title:'test',
            description:'test',
        },null,value.getChangeCallback())
        newSchema.focus()
        const newName = value.getCopyPropertiName('test')
        value.addProperty(newName,newSchema,false);
        onClickView(newSchema,newName,null);
    }
    render(){
        const {value,style,onlyChild,onClickView,name,...others} = this.props;
        const properties = value.getProperties();
        return <Item view={this} getRoot={this.initRoot} name={name} onlyChild={onlyChild} 
            action={<Icon style={{cursor:'pointer'}} type="add" onClick={this.onAdd}></Icon>}
            onClick={this.onItemClick} data={value} {...others}>
            <div className={OBJECT_VIEW_CLASS} style={style}>
                {
                    Object.keys(properties).map((name:string)=>{
                        const item:ValueSchema = properties[name];
                        // const des = item.getDescription() || ''
                        return renderView(item,name,{
                            onClickView,
                            ...others
                        })
                    })
                }
            </div>
        </Item>
        // return <div className={OBJECT_VIEW_CLASS} style={style}>
        //     {
        //         Object.keys(properties).map((name:string)=>{
        //             const item:ValueSchema = properties[name];
        //             const des = item.getDescription() || ''
        //             return <Item title={item.getTitle()} name={name} desc={des}>
        //                 {renderView(item)}
        //             </Item>
        //         })
        //     }
        // </div>
    }
}