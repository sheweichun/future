import React from 'react'
import {JSON_ROOT_SCHEMA} from 'free-canvas-shared'
import {ObjectSchema,createValueSchema,SchemaViewProps,SchemaViewState, ValueSchema, SchemaChangeType, SchemaOnChange, BaseComponent} from '../schema'
import ObjectView from './object_view'
import Operation from './operation'
import {PREFIX, ROOT_CLASS} from './constant'
// import {} from './factory'




function rootSchema2JSONSchema(data:JSON_ROOT_SCHEMA,value:any={},onChange:SchemaOnChange){
    const {properties,required} = data;
    const schema = new ObjectSchema(null,'','')
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
    private _scrollEl:HTMLElement
    private _onChangeFlag:boolean = false
    private _updateId:number
    constructor(props:SchemaViewProps){
        super(props)
        const rootSchema = rootSchema2JSONSchema(props.data,props.value,this.onSchemaChange)
        rootSchema.onChange(this.onSchemaChange)
        this.state = {
            schema:rootSchema
        }
        this._onChangeFlag = true
    }
    onSchemaChange=(schema:ValueSchema,type:SchemaChangeType)=>{
        if(!this._onChangeFlag) return
        if(this._updateId){
            clearTimeout(this._updateId)
        }
        this._updateId = setTimeout(()=>{
            this.setState({})
        })
    }
    onClickView=(value:ValueSchema,name:string,view:BaseComponent<any,any>)=>{
        // console.log('!!! in onClickView');
        const {hoverSchema,hoverName} = this
        if(hoverSchema === value && name == hoverName) return;
        if(hoverSchema){
            hoverSchema.blur()
        }
        value.focus()
        this.hoverSchema = value;
        this.hoverName = name
        this.onSchemaChange(value,SchemaChangeType.isSchema)
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
    initScroll=(el:HTMLElement)=>{
        this._scrollEl = el;
    }
    render(){
        const {hoverSchema,hoverName} = this;
        const {schema} = this.state;
        return <div className={ROOT_CLASS}>
            <div style={{flex:1,overflow:'auto'}} ref={this.initScroll}>
                <ObjectView name="" value={schema} style={{flex:1}} 
                    onClickView={this.onClickView}
                    onCopy={this.onCopy}
                    onDelete={this.onDelete}
                >
                </ObjectView>
            </div>
            <Operation onChangeHover={this.onClickView} data={hoverSchema} name={hoverName}></Operation>
        </div>
    }
}