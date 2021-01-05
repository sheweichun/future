import { ModelType,Model } from 'free-canvas-shared'

export {ModelPropSchema,Model} from 'free-canvas-shared'

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


let maxId = 0;

function nextId(){
    return (++maxId) + ''
}


export function updateAllId(data:Model){
    if(data == null) return
    let newData = Object.assign({},data);
    newData.proto = {}
    // newData.protoId = data.protoId
    // newData.pid = data.id;
    newData.id = nextId();
    if(data.children){
        newData.children = data.children.map((child)=>{
            return updateAllId(child);
        })  
    }
    return newData
}

export function completeData(data:Model){
    if(data == null) return;
    const dId = parseInt(data.id);
    if(!isNaN(dId) && dId > maxId){
        maxId = dId;   
    }
    data.extra = data.extra || {isSelect:false}
    if(!data.proto){
        data.proto = {}
    }
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