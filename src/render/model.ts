import {ObjectStyleDeclaration} from '../utils/type'

// export class Model{
//     static EmptyModel = new Model(null,null,null)
//     constructor(public tag:string,public attribute:ViewAttribute,public children:Model[]){

//     }
    
// }

export interface ModelPropSchema{
    name:string
    value:string,
    expression:any
}

export interface UniversalObject{
    [name:string]:any
}

export interface Model {
    id?:string
    name?:string
    isRoot?:boolean
    style?:ObjectStyleDeclaration
    propSchemas?:ModelPropSchema[]
    children?:Model[]
    extra:{
        position?:{
            left?:number,
            top?:number
        },
        isSelect:boolean
    }
}