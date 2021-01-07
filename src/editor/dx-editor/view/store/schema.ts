//@ts-ignore
import {dataParser} from '@ali/dinamic';
import {ArraySchema, ObjectSchema, rootSchema2JSONSchema, ValueSchema} from '@pkg/free-canvas-json-editor'
import {Model,ModelAttrValue} from '@pkg/free-canvas-shared'
import {schemaData,schemaValue,schemaValues,SchemaValue} from '../../data/schema'


// let schema_value = schemaValue;

export const schema = rootSchema2JSONSchema(schemaData,schemaValue,null);


// const schema_value = schema.toValue();


// export function getSchemaValue(){
//     return schema_value
// }

// export function updateSchemaValue(val:any){
//     schema_value = val
// }


function getNewNameIndex(prefix:string,values:Array<SchemaValue>){
    let maxIndex:number = -1;
    values && values.forEach((item)=>{
        const itemTitle = item.title;
        let val:number
        if(itemTitle === prefix){
            val = 0
        }else{
            val = parseInt(item.title.replace(new RegExp(`^${prefix}`),''));
        }
        if(!isNaN(val) && maxIndex < val){
            maxIndex = val
        }
    })
    maxIndex++;
    if(maxIndex){
        return `${prefix}${maxIndex}`
    }
    return prefix
}

export class Store{
    private static instance:Store
    static getInstance(){
        if(this.instance == null){
            this.instance = new Store()
        }
        return this.instance
    }
    private _schemaValues:Array<SchemaValue>
    private _index:number;
    private _schemaData:any
    private _data:ObjectSchema
    private constructor(){
        this._schemaValues = schemaValues ? schemaValues : [{title:'测试',value:{}}]
        this._index = 0;
        this._schemaData = schemaData
        const item = this._schemaValues[this._index]
        this._data = rootSchema2JSONSchema(schemaData,item.value,null)
        this.getValue = this.getValue.bind(this)
    }
    getIndex(){
        return this._index
    }
    // getSchemaData()
    // get
    getSchema(){
        return this._data
    }
    getValue(){
        const item = this._schemaValues[this._index];
        // if(item == null) return {}
        return item ? item.value : {}
    }
    enabelEdit(index:number){
        const item = this._schemaValues[index];
        if(item == null) return;
        item.isEditing = true
        this.changeIndex(index);
    }
    disabelEdit(index:number){
        const item = this._schemaValues[index];
        if(item == null) return;
        item.isEditing = false
        this.changeIndex(index);
    }
    setValue(val:any){
        const item = this._schemaValues[this._index];
        if(item == null) return
        item.value = val;
    }
    push(val:any,title:string="示例"){
        this._schemaValues.push({
            title:getNewNameIndex(title,this._schemaValues),
            value:val
        })
        this.changeIndex(this._schemaValues.length - 1)
    }
    remove(index:number){
        const {_index} = this;
        const len = this._schemaValues.length
        if(len === 1) return;
        const newLen = len - 1;
        let newIndex:number = _index
        if(index === _index){
            if(index >= newLen){
                newIndex = newLen - 1
            }
        }else if(index < _index){
            newIndex--;
        }
        this._schemaValues.splice(index,1);
        // console.log('newIndex :',newIndex);
        this.changeIndex(newIndex)
    }
    getAllValue(){
        return this._schemaValues
    }
    changeTitle(index:number,val:string){
        const item = this._schemaValues[index];
        if(item == null) return;
        item.title = val;
    }
    changeIndex(i:number){
        const {_schemaValues} = this
        // if(_index === i) return;
        this._index = i;
        const val = _schemaValues[i];
        if(val == null) return;
        // console.log('value :',val.value);
        this._data.setValue(val.value);
    }
}
// function calculateVariable(expression:string,value:any[]){

// }

// function findSchemaByName(name:string,schema:ValueSchema){
//     if(schema instanceof ObjectSchema){
//         const properties = (schema as ObjectSchema).getProperties();
//         const propKeys = Object.keys(properties);
//         for(let i = 0; i < propKeys.length; i++){
//             const name = propKeys[i];
            
//         }
//     }else if(schema instanceof ArraySchema){

//     }
// }

export function calculateExpression(model:Model[],value:ModelAttrValue):any{
    // if(!value.isExp) return value;
    // const {expression} = value;
    // const result = dataParser(expression,{  //@data{}会返回schema_value
    //     data:schema_value
    // })
    // if(result === schema_value) return value;
    // value.value = result
    return value
}