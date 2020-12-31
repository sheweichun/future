//@ts-ignore
import {dataParser} from '@ali/dinamic';
import {ArraySchema, ObjectSchema, rootSchema2JSONSchema, ValueSchema} from '@pkg/free-canvas-json-editor'
import {Model,ModelAttrValue} from '@pkg/free-canvas-shared'
import {schemaData,schemaValue} from '../../data/schema'


let schema_value = schemaValue;

export const schema = rootSchema2JSONSchema(schemaData,schemaValue,null);


// const schema_value = schema.toValue();


export function getSchemaValue(){
    return schema_value
}

export function updateSchemaValue(val:any){
    schema_value = val
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