import {JSON_PROPERTY_TYPE,
    JSON_PROPERTY_TYPES, 
    JSON_OBJECT_SCHEMA,
    JSON_PROPERTY_VALUE_TYPE,
    JSON_PROPERTY_KEY,
    JSON_ARRAY_SCHEMA,
    JSON_NUMBER_SCHEMA,
    JSON_BOOLEAN_SCHEMA, 
    JSON_ROOT_SCHEMA,
    JSON_STRING_SCHEMA} from 'free-canvas-shared'
    import React from 'react';
// import { ObjectSchema } from './factory';

export interface SchemaViewProps {
    // data:JSON_ROOT_SCHEMA
    className?:string
    style?:React.CSSProperties,
    onValueChange?:(val:ValueSchema,type:SchemaChangeType)=>void
    value:ObjectSchema
    // onInitValue?:(val:ValueSchema)=>void
    // value:any
}

export interface SchemaViewState {
    schema:ObjectSchema,
    // value:string
    // hoverSchema:ValueSchema
    // hoverName:string
}

export enum SchemaChangeType{
    isSchema,
    isData
}

export type SchemaOnChange = (schema:ValueSchema,type:SchemaChangeType)=>void


// export class JSONSchema{
//     // private _schema:JSON_ROOT_SCHEMA
//     private _root:ObjectSchema
//     constructor(){
//         // this._schema = {
//         //     $schema:"http://json-schema.org/draft-07/schema#",
//         //     definitions:{},
//         //     properties:{

//         //     },
//         //     required:[],
//         //     type:JSON_PROPERTY_TYPES.object
//         // }
//         this._root = new ObjectSchema('root','root');
//     }
//     addProperty(keyName:string,value:ValueSchema,required:boolean=false){
//         this.
//     }
//     removeProperty(keyName:JSON_PROPERTY_KEY){
//         this._properties[keyName] = null;
//         delete this._properties[keyName]
//         delete this._requiredMap[keyName];
//     }
// }






export class BaseComponent<T extends BaseProps,V> extends React.Component<T,V>{
    root:HTMLElement
    constructor(props:T){ 
        super(props)
    }
    // shouldComponentUpdate(nextProps:T,nextState:V){
    //     const {} = nextProps
    //     return true;
    // }
    initRoot=(el:HTMLElement)=>{
        this.root = el;
    }
}





// function createValueSchema(type:JSON_PROPERTY_TYPES,title:string,description:string):Partial<JSON_PROPERTY_VALUE_TYPE>{
//     return {
//         description,
//         title,
//         type
//     }
// }

// interface ISchema{
//     value:any
// }

export class ValueSchema{
    protected _onChangeCallback:SchemaOnChange
    focused:boolean
    constructor(
        public parent:ValueSchema,
        public readonly _type:JSON_PROPERTY_TYPES ,
        protected _title:string,
        protected _description:string,
        protected _format?:string){

    }
    changeRequired(name:string,required:boolean){
        const {parent} = this
        // console.log('changeRequired :',parent);
        if(parent instanceof ObjectSchema || parent instanceof ArraySchema){
            const pSchema = parent as ObjectSchema | ArraySchema;
            pSchema.setRequired(name,required)
            this.triggerChange()
        }
    }
    changeName(prevName:string,newName:string){
        const {parent} = this;
        if(parent instanceof ObjectSchema){
            parent.replacePropertyValue(prevName,newName,this);
        }else if(parent instanceof ArraySchema){
            parent.replaceItemProperty(prevName,newName,this)
        }
        this.triggerChange()
    }
    changeType(name:string,type:JSON_PROPERTY_TYPES){
        if(type === this._type){
            return
        }
        const {parent,_onChangeCallback,_description,_title,_format} = this;
        const newSchema = createValueSchema(parent,{
            type:type,
            description:_description || '',
            title:_title || '',
            format:_format
        },null,_onChangeCallback)
        newSchema.focused = this.focused
        if(parent instanceof ObjectSchema){
            const pSchema  = parent as ObjectSchema;
            pSchema.addProperty(name,newSchema)
        }else if(parent instanceof ArraySchema){
            const pSchema  = parent as ArraySchema;
            pSchema.addItemProperty(name,newSchema);
        }
        this.triggerChange();
        return newSchema
    }
    changeDescription(description:string){
        this._description = description
        this.triggerChange()
    }
    changeFormat(format:string){
        this._format = format
        this.triggerChange()
    }
    changeTitle(title:string){
        this._title = title
        this.triggerChange()
    }
    onChange(cb:SchemaOnChange){
        this._onChangeCallback = cb
    }
    getChangeCallback(){
        return this._onChangeCallback
    }
    triggerChange(type:SchemaChangeType=SchemaChangeType.isSchema){
        // console.log('triggerChange!!! :',this._onChangeCallback);
        this._onChangeCallback && this._onChangeCallback(this,type)
    }
    focus(){
        this.focused = true;
    }
    blur(){
        this.focused = false;
    }
    setValue(val:any){
        this.triggerChange(SchemaChangeType.isData)
        // this._onChangeCallback && this._onChangeCallback(this)
    }
    toValue():any{
    }
    toSchema(){
        const {_type,_description,_title,_format} = this
        const ret:any = {}
        _type && (ret.type = _type)
        _description && (ret.description = _description)
        _title && (ret.title = _title)
        _format && (ret.format = _format)
        return ret
    }
    getTitle(){
        return this._title
    }
    getDescription(){
        return this._description
    }
    getValue(){
    }
    getFormat(){
        return this._format
    }
    clone(flag:boolean = false):any{ return null}
}

export class StringSchema extends ValueSchema{
    private _value:string
    constructor(parent:ValueSchema,title:string,description:string,_format?:string){
        super(parent,JSON_PROPERTY_TYPES.string,title,description,_format)
    }
    setValue(val:any){
        if(val == null){
            this._value = val
        }else{
            this._value = val + '';
        }
        super.setValue(this._value)
    }
    getValue(){
        return this._value
    }
    toValue():string{
        return this._value
    }
    clone(flag:boolean=false){
        const {_title,_description,_format,_value,parent} = this;
        const schema = new StringSchema(parent,_title,_description,_format)
        flag && schema.setValue(_value)
        schema._onChangeCallback = this._onChangeCallback
        return schema
    }
}

export class NumberSchema extends ValueSchema{
    private _value:number
    constructor(parent:ValueSchema,title:string,description:string,_format?:string){
        super(parent,JSON_PROPERTY_TYPES.number,title,description,_format)
    }
    getValue(){
        return this._value
    }
    setValue(val:any){
        if(val == null || val == ''){ 
            this._value = null
        }else{
            const numVal = Number(val);
            if(!isNaN(val)){
                this._value = numVal
            }
            
        }
        // console.log('val :',this._value);
        super.setValue(this._value)
    }
    toValue():number{
        return this._value
    }
    clone(flag:boolean=false){
        const {parent,_title,_description,_format,_value} = this;
        const schema = new NumberSchema(parent,_title,_description,_format)
        flag && schema.setValue(_value)
        schema._onChangeCallback = this._onChangeCallback
        return schema
    }
}

export class BooleanSchema extends ValueSchema{
    private _value:boolean
    constructor(parent:ValueSchema,title:string,description:string,_format?:string){
        super(parent,JSON_PROPERTY_TYPES.boolean,title,description,_format)
    }
    getValue(){
        return this._value
    }
    setValue(val:any){
        if("false" === val){
            this._value = false
        }else if("true" === val){
            this._value = true
        }else{
            this._value = Boolean(val);
        }
        super.setValue(this._value)
    }
    toValue():boolean{
        return this._value
    }
    clone(flag:boolean=false){
        const {_title,_description,_format,_value,parent} = this;
        const schema = new BooleanSchema(parent,_title,_description,_format)
        flag && schema.setValue(_value)
        schema._onChangeCallback = this._onChangeCallback
        return schema
    }
}


export function createValueSchema(parent:ValueSchema,value:JSON_PROPERTY_VALUE_TYPE,schemaValue:any,onChange:SchemaOnChange){
    // if(value == null){
    //     debugger
    // }
    switch(value.type){
        case JSON_PROPERTY_TYPES.string:
            const stringSchema = new StringSchema(parent,value.title,value.description,(value as JSON_STRING_SCHEMA).format)
            stringSchema.onChange(onChange)
            stringSchema.setValue(schemaValue)
            return stringSchema
        case JSON_PROPERTY_TYPES.number:
            const numberSchema = new NumberSchema(parent,value.title,value.description,(value as JSON_NUMBER_SCHEMA).format)
            numberSchema.onChange(onChange)
            numberSchema.setValue(schemaValue)
            return numberSchema
        case JSON_PROPERTY_TYPES.boolean:
            const booleanSchema = new BooleanSchema(parent,value.title,value.description,(value as JSON_BOOLEAN_SCHEMA).format)
            booleanSchema.onChange(onChange)
            booleanSchema.setValue(schemaValue)
            return booleanSchema
        case JSON_PROPERTY_TYPES.object:
            const {properties,required : objRequired} = value as JSON_OBJECT_SCHEMA;
            const objSchema =  new ObjectSchema(parent,value.title,value.description)
            objSchema.onChange(onChange)
            Object.keys(properties || {}).forEach((name:string)=>{
                const item = properties[name]
                objSchema.addProperty(name,createValueSchema(objSchema,item,null,onChange),objRequired && objRequired.indexOf(name) >= 0)
            })
            objSchema.setValue(schemaValue)
            return objSchema
        case JSON_PROPERTY_TYPES.array:
            const {items,required} = value as JSON_ARRAY_SCHEMA
            const arraySchema =  new ArraySchema(parent,value.title,value.description)
            arraySchema.onChange(onChange)
            Object.keys(items || {}).forEach((name:string)=>{
                const item = items[name]
                arraySchema.addItemProperty(name,createValueSchema(arraySchema,item,null,onChange),required && required.indexOf(name) >= 0)
            })
            arraySchema.setValue(schemaValue)
            return arraySchema;
    }
}


export class ObjectSchema extends ValueSchema{
    private _properties:{
        [key:string]:ValueSchema
    } = {}
    private _value:any
    private _requiredMap: {[key:string]:boolean} = {}
    // private _value:{[key:string]:any} = {}
    constructor(parent:ValueSchema,title:string,description:string){
        super(parent,JSON_PROPERTY_TYPES.object,title,description)
    }
    getValue(){
        return this._value
    }
    onChange(cb:SchemaOnChange){
        const {_properties} = this;
        const propKeys = Object.keys(_properties);
        propKeys.forEach((name)=>{
            const item = _properties[name];
            item.onChange(cb)
        })
        this._onChangeCallback = cb;
    }
    hasPropertiName(keyName:string){
        return !!this._properties[keyName]
    }
    isRequired(keyName:string){
        return !!this._requiredMap[keyName]
    }
    getCopyPropertiName(keyName:string){
        const {_properties} = this;
        let name = keyName;
        let index = 1;
        while(_properties[name]){
            name = `${keyName}${index++}`
        }
        return name
    }
    addProperty(keyName:string,value:ValueSchema,required?:boolean){
        this._properties[keyName] = value;
        // required && (this._requiredMap[keyName] = required)
        if(required != null){
            if(required){
                this._requiredMap[keyName] = true
            }else {
                delete this._requiredMap[keyName]
            }
        }
        this.triggerChange()
    }
    setRequired(keyName:string,required:boolean=false){
        const {_requiredMap,_properties} = this
        if(!_properties[keyName]) return;
        if(required){
            _requiredMap[keyName] = true
        }else{
            delete this._requiredMap[keyName]
        }
    }
    replacePropertyValue(prevName:string,newName:string,value:ValueSchema,required?:boolean){
        delete this._properties[prevName];
        const prevRequired = this._requiredMap[prevName];
        delete this._requiredMap[prevName];
        this._properties[newName] = value;

        if(required == null){
            prevRequired && (this._requiredMap[newName] = true)
        }else if(required){
            this._requiredMap[newName] = true
        }else {
            delete this._requiredMap[newName]
        }
        this.triggerChange()
    }
    // setRequired(keyName:string,required:boolean){
    //     if(required){
    //         this._requiredMap[keyName] = true
    //     }else{
    //         delete this._requiredMap[keyName]
    //     }
    // }
    removeProperty(keyName:JSON_PROPERTY_KEY){
        this._properties[keyName] = null;
        delete this._properties[keyName]
        delete this._requiredMap[keyName];
        this.triggerChange()
    }
    setValue(value:any){
        value = value || {}
        const {_properties} = this
        this._value = value;
        Object.keys(_properties).forEach((name:string)=>{
            const item = _properties[name]
            item.setValue(value[name])
        })
        super.setValue(value)
    }
    getProperties(){
        return this._properties
    }
    clone(flag:boolean=false){
        const {_title,_description,_properties,_requiredMap,_value,parent} = this;
        const schema = new ObjectSchema(parent,_title,_description)
        Object.keys(_properties).forEach((name:string)=>{
            const item = _properties[name]
            const itemSchema = item.toSchema()
            schema.addProperty(name,createValueSchema(parent,itemSchema,null,this._onChangeCallback),_requiredMap[name])
        })
        schema._onChangeCallback = this._onChangeCallback
        flag && schema.setValue(_value && JSON.parse(JSON.stringify(_value)))
        return schema
    }
    toValue():any{
        const {_properties} = this;
        return Object.keys(_properties).reduce((ret,name:string)=>{
            //@ts-ignore
            ret[name] = _properties[name].toValue()
            return ret;
        },{})
    }
    toSchema(){
        const baseVal = super.toSchema();
        const {_properties,_requiredMap} = this;
        return {
            ...baseVal,
            properties:Object.keys(_properties).reduce((ret,keyName:string)=>{
                //@ts-ignore
                ret[keyName] = _properties[keyName].toSchema()
                return ret;
            },{}),
            required:Object.keys(_requiredMap)
        }
    }
}


export class ArraySchema extends ValueSchema{
    maxItems:number = 1
    minItems:number = 1
    private _value:any
    private _objectSchema:{[key: string]: ValueSchema} = {}
    private _items:Array<{[key:string]:ValueSchema}> = []
    private _requiredMap: {[key:string]:boolean} = {} 
    constructor(parent:ValueSchema,title:string,description:string){
        super(parent,JSON_PROPERTY_TYPES.array,title,description)
    }
    getItems(){
        return this._items
    }
    getValue(){
        return this._value
    }
    onChange(cb:SchemaOnChange){
        const {_objectSchema,_items} = this;
        const propKeys = Object.keys(_objectSchema);
        propKeys.forEach((name)=>{
            const item = _objectSchema[name];
            item.onChange(cb)
        })
        _items.forEach((item)=>{
            const itemKeys = Object.keys(item)
            itemKeys.forEach((name)=>{
                const itemSchema = item[name];
                itemSchema.onChange(cb)
            })
        })
        this._onChangeCallback = cb;
    }
    clone(flag:boolean=false){
        const {_title,_description,_objectSchema,_requiredMap,_value,parent} = this;
        const schema = new ArraySchema(parent,_title,_description)
        Object.keys(_objectSchema).forEach((name:string)=>{
            const item = _objectSchema[name]
            schema.addItemProperty(name,createValueSchema(parent,item.toSchema(),null,this._onChangeCallback),_requiredMap[name])
        })
        flag && schema.setValue(_value && JSON.parse(JSON.stringify(_value)))
        schema._onChangeCallback = this._onChangeCallback
        return schema
    }
    getObjectSchema(){
        return this._objectSchema
    }
    setRequired(keyName:string,required:boolean=false){
        const {_requiredMap,_objectSchema} = this
        if(!_objectSchema[keyName]) return;
        if(required){
            _requiredMap[keyName] = true
        }else{
            delete this._requiredMap[keyName]
        }
    }
    getCopyPropertiName(keyName:string){
        const {_objectSchema} = this;
        let name = keyName;
        let index = 1;
        while(_objectSchema[name]){
            name = `${keyName}${index++}`
        }
        return name
    }
    addItemProperty(keyName:string,value:ValueSchema,required?:boolean){
        const { _items } = this;
        this._objectSchema[keyName] = value;
        _items.forEach((item)=>{
            item[keyName] = value.clone();
        })
        if(required != null){
            if(required){
                this._requiredMap[keyName] = true
            }else {
                delete this._requiredMap[keyName]
            }
        }
        this.triggerChange()
    }
    replaceItemProperty(prevName:string,newName:string,value:ValueSchema,required?:boolean){
        const { _items } = this;
        const prevRequired = this._requiredMap[prevName];
        delete this._objectSchema[prevName];
        delete this._requiredMap[prevName];
        this._objectSchema[newName] = value;
        _items.forEach((item)=>{
            delete item[prevName];
            item[newName] = value.clone();
        })
        if(required == null){
            prevRequired && (this._requiredMap[newName] = true)
        }else if(required){
            this._requiredMap[newName] = true
        }else {
            delete this._requiredMap[newName]
        }
        this.triggerChange()
    }
    removeItemProperty(keyName:string){
        const { _items } = this;
        delete this._objectSchema[keyName];
        _items.forEach((item)=>{
            delete item[keyName]
        })
        delete this._requiredMap[keyName]
        this.triggerChange()
    }
    setValue(value:Array<any>){
        if(value == null){
            value = []
        }
        const {_objectSchema} = this;
        this._value = value;
        this._items = value.map((valItem,index)=>{
            return Object.keys(_objectSchema).reduce((ret,name:string)=>{
                const schema = _objectSchema[name]
                const scVal = valItem ? valItem[name] : null;
                // console.log('schema.toSchema() :',schema.toSchema(),scVal);
                //@ts-ignore
                ret[name] = createValueSchema(this,schema.toSchema(),scVal,this._onChangeCallback)
                return ret
            },{})
        })
        super.setValue(value)
    }
    addItem(){
        this._items.push(Object.keys(this._objectSchema).reduce((ret,keyName:string)=>{
            const value = this._objectSchema[keyName];
            //@ts-ignore
            ret[keyName] = value.clone()
            return ret;
        },{}))
        if(this.maxItems < this._items.length){
            this.maxItems = this._items.length
        }
        this.triggerChange()
    }
    removeItem(index:number){
        this._items.splice(index,1);
        this.triggerChange()
    }
    upItem(index:number):boolean{
        const { _items } = this
        if(index === 0) return false;
        const target = _items[index];
        const prevItem = _items[index - 1];
        _items[index - 1] = target;
        _items[index] = prevItem;
        this.triggerChange()
        return true
    }
    downItem(index:number):boolean{
        const { _items } = this
        if(index === _items.length - 1) return false;
        const target = _items[index];
        const nextItem = _items[index + 1];
        _items[index + 1] = target;
        _items[index] = nextItem;
        this.triggerChange()
        return true
    }
    copyItem(index:number){
        const { _items } = this
        const target = _items[index]
        const newTarget = Object.keys(target).reduce((ret:{[key:string]:ValueSchema},name:string)=>{
            const schema = target[name];
            ret[name] = schema.clone(true);
            return ret;
        },{})
        _items.splice(index, 0 , newTarget)
        this.triggerChange()
    }
    toValue():any{
        const {_items} = this;
        return _items.map((item)=>{
            return Object.keys(item).reduce((ret,name)=>{
                //@ts-ignore
                ret[name] = item[name].toValue();
                return ret;
            },{})
        })
    }
    isRequired(keyName:string){
        return !!this._requiredMap[keyName]
    }
    // setRequired(keyName:string,required:boolean){
    //     if(required){
    //         this._requiredMap[keyName] = true
    //     }else{
    //         delete this._requiredMap[keyName]
    //     }
    // }
    toSchema(){
        const baseVal = super.toSchema();
        const {minItems,maxItems,_objectSchema,_requiredMap} = this;
        return {
            ...baseVal,
            minItems:minItems,
            maxItems:maxItems,
            items:Object.keys(_objectSchema).reduce((ret,name:string)=>{
                //@ts-ignore
                ret[name] = _objectSchema[name].toSchema()
                return ret;
            },{}),
            required:Object.keys(_requiredMap)
        }
    }
}





export type OnClickView = (value:ValueSchema,name:string,view:BaseComponent<any,any>)=>void
// export type OnClickView = ()=>void

export interface BaseProps {
    onClickView?:OnClickView
    onCopy?:OnClickView
    onDelete?:OnClickView
    getRootEl?:()=>HTMLElement
    isRequired?:boolean
    name:string
    value?:any
    onlyValue?:boolean
    onlyChild?:boolean
}