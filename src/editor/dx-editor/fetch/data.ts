import {MarketDataItem,MarketData,ModelPropComponentType,Model,IMutation, ModelType,ModelAttrValue} from '@pkg/free-canvas-shared' 

type AttrScheme = {
    type:ModelPropComponentType,
    key:string,
    title?:string,
    defaultValue?:Partial<ModelAttrValue>
    props?:{
        [key:string]:any
    }
    get?:(data:Model)=>any
    update?:(mutation:IMutation,modelData:Model[],data:string)=>void
}
export type CreateComponetProtoOpts={
    calculateExpression:(model:Model[],value:ModelAttrValue)=>any
}

export function createComponentProtos(opt:CreateComponetProtoOpts){
    const {calculateExpression} = opt
    function createStyleAttrSchema(data:AttrScheme){
        const {type,key,title,get,update,...others} = data
        return {
            type,
            key,
            title,
            ...others,
            get:get ? get: function(model:Model){
                const val = model.props.style.value[key]
                return val ? val : {
                    value:'',
                    disabled:false
                }
            },
            update:update ? update : function(mutation:IMutation,modelData:Model[],data:any){
                mutation.updateModelStyle({
                    [key]:calculateExpression(modelData,data)
                })
            }
        }
    }
    
    function createNormalAttrSchema(data:AttrScheme){
        const {type,key,title,get,update,defaultValue,...others} = data
        return {
            type,
            key,
            title,
            ...others,
            get:get ? get: function(model:Model){
                const val = model.props[key]
                return val ? val : {
                    value:'',
                    disabled:false,
                    ...(defaultValue || {})
                }
            },
            update:update ? update : function(mutation:IMutation,modelData:Model[],data:any){
                // mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{[key]:data})
                mutation.updateModelProps(key,calculateExpression(modelData,data));
                // mutation.updateModelStyle({
                //     [key]:data
                // })
            }
        }
    }
    
    function createDxAttrSchema(data:AttrScheme){
        const {type,key,title,get,update,...others} = data
        return {
            type,
            key,
            title,
            ...others,
            get:get ? get : function(model:Model){
                return model.props.dxSource.value.attrs[key] || {value:''}
            },
            update: update ? update : function(mutation:IMutation,modelData:Model[],data:any){
                mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{[key]:calculateExpression(modelData,data)});
            }
        }
    }
    
    
    
    
    
    
    const marketData:MarketData[] = [
        {
            name:'基础组件',
            children:[
                {
                    name:'视图容器',
                    children:[
                        {
                            name:'布局容器',
                            preview:'https://img.alicdn.com/tfs/TB1MIcie7T2gK0jSZPcXXcKkpXa-45-45.svg',
                            proto:{
                                attrs:[
                                    {
                                        type:ModelPropComponentType.xywh,
                                    },
                                    createStyleAttrSchema({
                                        type:ModelPropComponentType.backgroundColor,
                                        title:'背景色',
                                        key:'backgroundColor'
                                    }),
                                    createStyleAttrSchema({
                                        type:ModelPropComponentType.text,
                                        title:'圆角',
                                        key:'borderRadius',
                                    }),
                                    createNormalAttrSchema({
                                        type:ModelPropComponentType.text,
                                        title:'列表数据',
                                        key:'listData',
                                        defaultValue:{
                                            isExp:true,
                                            onlyExp:true,
                                            expression:'',
                                        }
                                    }),
    
                                ]
                            },
                            codeTemplate:{
                                name:'div',
                                type:ModelType.isFrame,
                                props:{
                                    style:{
                                        value:{
                                            backgroundColor:{
                                                value:'#ffffff'
                                            }
                                        }
                                    },
                                    listData:{
                                        isExp:true,
                                        onlyExp:true,
                                        expression:'',
                                        value:''
                                    }
                                },
                                extra:{
                                    position:{
                                        width:100,
                                        height:100
                                    }
                                }
                            }
                        }
                    ]
                },{
                    name:'基础内容',
                    children:[
                        {
                            name:'文本',
                            preview:'https://img.alicdn.com/tfs/TB1Tqwhe4v1gK0jSZFFXXb0sXXa-45-45.svg',
                            proto:{
                                attrs:[
                                    {
                                        type:ModelPropComponentType.xywh,
                                    },
                                    // createStyleAttrSchema('textColor','字体颜色'),
                                    createDxAttrSchema({
                                        type:ModelPropComponentType.backgroundColor,
                                        title:'字体颜色',
                                        key:'textColor'
                                    }),
                                    createDxAttrSchema({
                                        type:ModelPropComponentType.text,
                                        title:'文本内容',
                                        key:'text',
                                    }),
                                    createDxAttrSchema({
                                        type:ModelPropComponentType.switch,
                                        title:'是否粗体',
                                        key:'isBold',
                                    })
                                ]
                            },
                            codeTemplate:{
                                name:'dx-template',
                                style:{},
                                props:{
                                    dxSource:{
                                        value:{
                                            name:'TextView',
                                            attrs:{
                                                text:{
                                                    value:'请输入文本',
                                                },
                                                textSize:{
                                                    value:"14ap"
                                                }
                                            }
                                        }
                                    }
                                },
                                extra:{
                                    position:{
                                        width:100,
                                        height:24
                                    }
                                }
                            }
                        },{
                            name:'图片',
                            preview:'https://img.alicdn.com/tfs/TB1eDsge7L0gK0jSZFxXXXWHVXa-45-45.svg',
                            proto:{
                                attrs:[
                                    {
                                        type:ModelPropComponentType.xywh,
                                    },
                                    createDxAttrSchema({
                                        type:ModelPropComponentType.text,
                                        title:'图片url',
                                        key:'imageUrl',
                                    }),
                                    createDxAttrSchema({
                                        type:ModelPropComponentType.text,
                                        title:'宽高比',
                                        key:'aspectRatio',
                                    }),
                                    createDxAttrSchema({
                                        type:ModelPropComponentType.select,
                                        props:{
                                            dataSource:[ 'fitCenter' , 'fixXY' , 'centerScrop' ]
                                        },
                                        title:'图片缩放',
                                        key:'scaleType',
                                    }),
                                    createDxAttrSchema({
                                        type:ModelPropComponentType.text,
                                        title:'深色模式图片url',
                                        key:'darkModeImageUrl', 
                                    })
                                ]
                            },
                            codeTemplate:{
                                name:'dx-template',
                                style:{},
                                props:{
                                    dxSource:{
                                        value:{
                                            name:'ImageView',
                                            attrs:{
                                                imageUrl:{
                                                    value:'https://img.alicdn.com/tfs/TB192rWjsKfxu4jSZPfXXb3dXXa-1600-912.png'
                                                }
                                            }
                                        }
                                    }
                                },
                                extra:{
                                    position:{
                                        width:60,
                                        height:60
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        },{
            name:'业务组件',
            children:[
    
            ]
        }
    ]
    
    let comId = 1;
    function flattern(data:MarketData[],result:MarketDataItem[]){
        data.forEach((item:any)=>{
          if(item.children){
            //@ts-ignore
            flattern(item.children,result)
          }else{
            const {codeTemplate} = item;
            if(codeTemplate.name === 'div'){
                item.protoId = codeTemplate.name
            }else{
                item.protoId = codeTemplate.props.dxSource.value.name
            }
            result.push(item)
          }
        })
        return result
      }
    
    const marketItemList = flattern(marketData,[])
    return {
        marketData,
        marketItemList
    }
}



