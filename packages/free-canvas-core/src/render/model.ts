import { ModelType } from 'free-canvas-shared'

export {ModelPropSchema,ModelPropSchemas,Model} from 'free-canvas-shared'

// export class Model{
//     static EmptyModel = new Model(null,null,null)
//     constructor(public tag:string,public attribute:ViewAttribute,public children:Model[]){

//     }
    
// }

// export interface ModelPropSchema{
//     // name:string
//     value:string,
//     expression:any
// }

// export interface ModelPropSchemas{
//     [key:string]:ModelPropSchema
// }

export interface UniversalObject{
    [name:string]:any
}

// export interface Model {
//     id?:string
//     name?:string
//     isRoot?:boolean
//     isGroup?:boolean
//     style?:ObjectStyleDeclaration
//     propSchemas?:ModelPropSchemas
//     children?:Model[]
//     extra:{
//         position?:{
//             left?:number,
//             top?:number
//         },
//         isSelect?:boolean
//     }
// }


export function createGroupModel(left:number,top:number,width:number,height:number){
    return {
        name:'div',
        type:ModelType.isGroup,
        style:{
        },
        extra:{
            position:{
                left,
                top,
                width,
                height
            }
        }
    }
}