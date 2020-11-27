
import {ModelPropSchema,ModelPropComponentType,Model,IMutation, IPos} from 'free-canvas-shared'
import {ModelIdMap} from '../type'



const ALL_SCHEMA:{[key in ModelPropComponentType]?:ModelPropSchema} ={
    [ModelPropComponentType.xywh]:{
        type:ModelPropComponentType.xywh,
        sortIndex:10,
        get(model:Model){
            return model.extra.position
        },
        update(mutation:IMutation,data:IPos){
            mutation.updateModelPosition(data);
        }
    },
    [ModelPropComponentType.backgroundColor]:{
        type:ModelPropComponentType.backgroundColor,
        title:'背景色',
        sortIndex:20,
        get(model:Model){
            if(model.props.style && model.props.style.value){
                const bg = model.props.style.value.backgroundColor
                if(bg){
                    if(typeof bg === 'string'){
                        return {
                            value:bg,
                            disabled:false
                        }
                    }
                    return bg
                }
            }
            return {
                value:null,
                disabled:false
            }
        },
        update(mutation:IMutation,data:string){
            mutation.updateModelStyle({
                backgroundColor:data
            });
        }
    },[ModelPropComponentType.text]:{
        type:ModelPropComponentType.text,
        title:'文本',
        sortIndex:30,
        get(model:Model){
            if(model.props.style && model.props.style.value){
                const modelStyle = model.props.style.value
                return {
                    color:modelStyle.color,
                    fontSize:modelStyle.fontSize,
                    fontFamily:modelStyle.fontFamily,
                    fontWeight:modelStyle.fontWeight,
                    fontStyle:modelStyle.fontStyle
                }
            }
            return {}
        },
        update(mutation:IMutation,data:any){
            mutation.updateModelStyle(data);
        }
    }
}



export const SchemaMap:{[key:string]:ModelPropSchema[]} = {
    div:[
        ALL_SCHEMA[ModelPropComponentType.xywh],
        ALL_SCHEMA[ModelPropComponentType.backgroundColor],
        ALL_SCHEMA[ModelPropComponentType.text]
    ],
    span:[
        ALL_SCHEMA[ModelPropComponentType.xywh],
        ALL_SCHEMA[ModelPropComponentType.text]
    ],
    img:[
        ALL_SCHEMA[ModelPropComponentType.xywh]
    ],
    // Button:[
    //     {
    //         type:ModelPropComponentType.select,
    //         title:'按钮类型',
    //         sortIndex:50,
    //         props:{
    //             dataSource:[ 'primary' , 'secondary' , 'normal' ]
    //         },
    //         get(model:Model){
    //             if(model.props.type && model.props.type.value){
    //                 return model.props.type.value
    //             }
    //             return ''
    //         },
    //         update(mutation:IMutation,data:any){
    //             mutation.updateModelProps('type',{value:data});
    //         }
    //     }
    // ]
}

export function extractSchemaList(models:Model[],idMap:ModelIdMap):ModelPropSchema[]{
    if(models == null || models.length === 0) return []
    const modelLen = models.length;
    if(modelLen === 1){
        const curModel = models[0];
        if(curModel.pid != null){
            const protoModel = idMap[curModel.pid];
            if(protoModel && protoModel.proto && protoModel.proto.attrs){
                return protoModel.proto.attrs
            }
        }
        return SchemaMap[curModel.name] || []
    }
    const result:{[key in ModelPropComponentType]?:{
        schema:ModelPropSchema
        count:number
    }} = {}
    models.forEach((md)=>{
        let schemas:ModelPropSchema[] = SchemaMap[md.name]
        if(md.pid != null){
            const protoModel = idMap[md.pid];
            if(protoModel && protoModel.proto && protoModel.proto.attrs){
                schemas = protoModel.proto.attrs
            }
        }
        if(schemas){
            schemas.forEach((schema)=>{
                let item = result[schema.type];
                if(item == null){
                    item = {schema,count:0}
                    result[schema.type] = item
                }
                item.count++
            })
        }
    })
    let schemaList:ModelPropSchema[] = [];
    Object.keys(result).forEach((type:string)=>{ //保障多个model共有的属性才展示出来
        //@ts-ignore
        const {schma,count} = result[type];
        if(count === modelLen){
            schemaList.push(schma)
        }
    })
    return schemaList.sort((a:ModelPropSchema,b:ModelPropSchema)=>{
        return a.sortIndex - b.sortIndex
    })
}

