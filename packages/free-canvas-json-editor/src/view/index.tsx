import React from 'react'
import {JSON_ROOT_SCHEMA} from 'free-canvas-shared'
import {Button, Input} from '@alife/next'
import {ObjectSchema,createValueSchema,SchemaViewProps,SchemaViewState, ValueSchema, SchemaChangeType, SchemaOnChange, BaseComponent} from '../schema'
import ObjectView from './object_view'
import Operation from './operation'
import {PREFIX, ROOT_CLASS} from './constant'
import {ROOT_IDENTIFY} from './util'

export {default as Icon} from './icon'
// export {ROOT_IDENTIFY} from './util'
// import {} from './factory'




export function rootSchema2JSONSchema(data:JSON_ROOT_SCHEMA,value:any={},onChange:SchemaOnChange){
    const {properties,required} = data;
    const schema = new ObjectSchema(null,'数据定义','数据')
    // debugger;
    Object.keys(properties).forEach((name:string)=>{
        const item = properties[name]
        const val = value[name];
        const newSchema = createValueSchema(schema,item,val,onChange)
        schema.addProperty(name,newSchema,required.indexOf(name) >= 0)
    })
    schema.onChange(onChange)
    return schema
}

export class JSONSchemaView extends React.Component<SchemaViewProps,SchemaViewState>{
    hoverSchema:ValueSchema
    hoverName:string
    // private _scrollEl:HTMLElement
    private _rootEl:HTMLElement
    private _onChangeFlag:boolean = false
    private _updateId:number
    constructor(props:SchemaViewProps){
        super(props)
        const {value} = props;
        value.onChange(this.onSchemaChange);
        // const rootSchema = rootSchema2JSONSchema(data,value,this.onSchemaChange)
        // onInitValue && onInitValue(rootSchema);
        this.state = {
            schema:props.value,
            // value:'test'
        }
        this._onChangeFlag = true
    }
    reRenderView(){
        if(!this._onChangeFlag) return
        if(this._updateId){
            clearTimeout(this._updateId)
        }
        this._updateId = setTimeout(()=>{
            this.setState({})
        })
    }
    onSchemaChange=(schema:ValueSchema,type:SchemaChangeType)=>{
        this.reRenderView()
        const {onValueChange} = this.props;
        // if(type === SchemaChangeType.isData){
        onValueChange && onValueChange(this.state.schema,type)
        // }
    }
    onClickView=(value:ValueSchema,name:string,view:BaseComponent<any,any>)=>{
        if(name === ROOT_IDENTIFY) return;
        const {hoverSchema,hoverName} = this
        if(hoverSchema === value && name == hoverName) return;
        if(hoverSchema){
            hoverSchema.blur()
        }
        this.hoverSchema = value;
        this.hoverName = name
        if(value){
            value.focus()
            this.reRenderView()
            // this.onSchemaChange(value,SchemaChangeType.isSchema)
        }
    }
    onCopy=(value:ValueSchema,name:string,view:BaseComponent<any,any>)=>{
        const {parent} = value;
        const {hoverSchema} = this;
        if(parent && parent instanceof ObjectSchema){
            const schema = parent as ObjectSchema
            const newValue = value.clone(true);
            const newName = schema.getCopyPropertiName(name);
            schema.addProperty(newName,newValue,schema.isRequired(name))
            if(hoverSchema){
                hoverSchema.blur()
            }
            this.hoverSchema = newValue;
            newValue.focus();
            this.hoverName = newName;
            this.onSchemaChange(newValue,SchemaChangeType.isSchema)
        }
    }
    onDelete=(value:ValueSchema,name:string,view:BaseComponent<any,any>)=>{
        const {parent} = value
        if(parent && parent instanceof ObjectSchema){
            if(value === this.hoverSchema){
                this.hoverSchema = null;
                this.hoverName = null;
            }
            const schema = parent as ObjectSchema
            schema.removeProperty(name);
            this.onSchemaChange(value,SchemaChangeType.isSchema)
        }
    }
    // initScroll=(el:HTMLElement)=>{
    //     this._scrollEl = el;
    // }
    initRootEl=(el:HTMLElement)=>{
        this._rootEl = el;
    }
    getRootEl=()=>{
        return this._rootEl
    }
    render(){
        const {hoverSchema,hoverName} = this;
        const {className,style} = this.props;
        const {schema} = this.state;
        return <div className={`${ROOT_CLASS} ${className || ''}`} style={style} ref={this.initRootEl}>
            {/* <div>
                <Button type="primary" onClick={()=>{
                    console.log('schema :',)
                    console.log('value :',schema.toValue())
                }}>导出</Button>
            </div> */}
            <div style={{flex:1,overflow:'auto'}} >
                <ObjectView name={ROOT_IDENTIFY} value={schema} style={{flex:1}} 
                    onClickView={this.onClickView}
                    onCopy={this.onCopy}
                    isRequired={false}
                    noIcon
                    onDelete={this.onDelete}
                    getRootEl={this.getRootEl}
                    // onlyValue
                >
                </ObjectView>
            </div>
            <Operation onChangeHover={this.onClickView} data={hoverSchema} name={hoverName}></Operation>
            
        </div>
    }
}