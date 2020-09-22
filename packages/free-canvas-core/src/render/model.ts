import { ModelType,Model } from 'free-canvas-shared'

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
let maxId = -Infinity;

function nextId(){
    return (++maxId) + ''
}


export function updateAllId(data:Model){
    if(data == null) return
    data.id = nextId();
    data.children && data.children.forEach((child)=>{
        updateAllId(child);
    })
}

export function completeData(data:Model){
    if(data == null) return;
    const dId = parseInt(data.id);
    if(!isNaN(dId) && dId > maxId){
        maxId = dId;   
    }
    data.extra = data.extra || {isSelect:false}
    if(!data.extra.position){
        data.extra.position = {}
    }
    if(!data.props){
        data.props = {
            style:{value:{}}
        }
    }else if(!data.props.style){
        data.props.style = {value:{}}
    }
    data.children && data.children.forEach((child)=>{
        completeData(child)
    })
    return data;
}


export function createGroupModel(left:number,top:number,width:number,height:number,selected:boolean=true):Model{
    return {
        id:nextId(),
        name:'div',
        type:ModelType.isGroup,
        props:{
            style:{
                value:{}
            },
        },
        extra:{
            position:{
                left,
                top,
                width,
                height
            },
            isSelect:selected
        }
    }
}