// import {JSON_PROPERTY_TYPE,
//     JSON_PROPERTY_TYPES, 
//     JSON_OBJECT_SCHEMA,
//     JSON_PROPERTY_VALUE_TYPE,
//     JSON_PROPERTY_KEY,
//     JSON_ARRAY_SCHEMA,
//     JSON_ARRAY_ITEMS_SCHEMA,
//     JSON_NUMBER_SCHEMA,
//     JSON_BOOLEAN_SCHEMA} from 'free-canvas-shared'


// // function createValueSchema(type:JSON_PROPERTY_TYPES,title:string,description:string):Partial<JSON_PROPERTY_VALUE_TYPE>{
// //     return {
// //         description,
// //         title,
// //         type
// //     }
// // }

// class ValueSchema{ 
//     constructor(protected _type:JSON_PROPERTY_TYPES ,protected _title:string,protected _description:string){

//     }
//     setValue(val:any,key?:string){}
//     getTitle(){
//         return this._title
//     }
//     getDescription(){
//         return this._description
//     }
//     toSchema(){
//         const {_type,_description,_title} = this
//         return {
//             type:_type,
//             description:_description,
//             title:_title
//         }
//     }
// }

// export class StringSchema extends ValueSchema{
//     private _value:string
//     constructor(title:string,description:string,private _format?:string){
//         super(JSON_PROPERTY_TYPES.string,title,description)
//     }
//     setValue(val:any){
//         if(val == null){
//             this._value = val
//         }else{
//             this._value = val + '';
//         }
//     }
// }

// export class NumberSchema extends ValueSchema{
//     private _value:number
//     constructor(title:string,description:string,private _format?:string){
//         super(JSON_PROPERTY_TYPES.string,title,description)
//     }
//     setValue(val:any){
//         if(val == null){ 
//             this._value = null
//         }
//         const numVal = Number(val);
//         if(isNaN(val)) return
//         this._value = numVal
//     }
// }

// export class BooleanSchema extends ValueSchema{
//     private _value:boolean
//     constructor(title:string,description:string,private _format?:string){
//         super(JSON_PROPERTY_TYPES.string,title,description)
//     }
//     setValue(val:any){
//         if("false" === val){
//             this._value = false
//         }else if("true" === val){
//             this._value = true
//         }else{
//             this._value = Boolean(val);
//         }
//     }
// }


// export class ObjectSchema extends ValueSchema{
//     private _properties:{
//         [key:string]:ValueSchema
//     } = {}
//     private _requiredMap: {[key:string]:boolean} = {}
//     private _value:{[key:string]:any} = {}
//     constructor(title:string,description:string){
//         super(JSON_PROPERTY_TYPES.string,title,description)
//     }
//     addProperty(keyName:string,value:ValueSchema,required:boolean=false){
//         this._properties[keyName] = value;
//         required && (this._requiredMap[keyName] = required);
//     }
//     removeProperty(keyName:JSON_PROPERTY_KEY){
//         this._properties[keyName] = null;
//         delete this._properties[keyName]
//         delete this._requiredMap[keyName];
//     }
//     toSchema(){
//         const baseVal = super.toSchema();
//         const {_properties,_requiredMap} = this;
//         return {
//             ...baseVal,
//             properties:Object.keys(_properties).reduce((ret,keyName:string)=>{
//                 //@ts-ignore
//                 ret[keyName] = _properties[keyName].toSchema()
//                 return ret;
//             },{}),
//             required:Object.keys(_requiredMap)
//         }
//     }
// }


// export class ArraySchema extends ValueSchema{
//     private _maxItems:number = 1
//     private _minItems:number = 1
//     private _objectSchema:{[key: string]: {
//         value:JSON_PROPERTY_VALUE_TYPE,
//         format:string
//     }} = {}
//     private _items:Array<{[key:string]:ValueSchema}> = []
//     constructor(title:string,description:string){
//         super(JSON_PROPERTY_TYPES.string,title,description)
//     }
//     addItemProperty(keyName:string,value:JSON_PROPERTY_VALUE_TYPE,format?:string){
//         this._objectSchema[keyName] = {
//             value,
//             format
//         };
//     }
//     removeItemProperty(keyName:string){
//         delete this._objectSchema[keyName];
//     }
//     addItem(){
//         this._items.push(Object.keys(this._objectSchema).reduce((ret,keyName:string)=>{
//             const {value,format} = this._objectSchema[keyName];
//             switch(value.type){
//                 case JSON_PROPERTY_TYPES.string:
//                     return new StringSchema(value.title,value.description,format)
//                 case JSON_PROPERTY_TYPES.number:
//                     return new NumberSchema(value.title,value.description,format)
//                 case JSON_PROPERTY_TYPES.boolean:
//                     return new BooleanSchema(value.title,value.description,format)
//                 case JSON_PROPERTY_TYPES.object:
//                     return new ObjectSchema(value.title,value.description)
//                 case JSON_PROPERTY_TYPES.array:
//                     return new ArraySchema(value.title,value.description)
//             }
//             return ret;
//         },{}))
//     }
//     toSchema(){
//         const baseVal = super.toSchema();
//         const {_minItems,_maxItems,_objectSchema} = this;
//         return {
//             ...baseVal,
//             minItems:_minItems,
//             maxItems:_maxItems,
//             items:Object.keys(_objectSchema).reduce((ret,name:string)=>{
//                 //@ts-ignore
//                 ret[name] = _objectSchema[name].value
//                 return ret;
//             },{})
//         }
//     }
// }



