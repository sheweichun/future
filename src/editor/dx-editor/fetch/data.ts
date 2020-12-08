import {MarketDataItem,MarketData,ModelPropComponentType,Model,IMutation} from '@pkg/free-canvas-shared' 



const bgAttr = {
    type:ModelPropComponentType.backgroundColor,
    get(model:Model){
        console.log('model :',model);
        let bg = '';
        if(model.props.dxSource && model.props.dxSource.value){
            bg = model.props.dxSource.value.attrs.backgroundColor
        }
        if(bg){
            if(typeof bg === 'string'){
                return {
                    value:bg,
                    disabled:false
                }
            }
            return bg
        }
        return {
            value:null,
            disabled:false
        }
    },
    update(mutation:IMutation,data:string){
        mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{backgroundColor:data});
    }
}




export const marketData:MarketData[] = [
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
                                    type:ModelPropComponentType.xywh
                                },bgAttr
                            ]
                        },
                        codeTemplate:{
                            name:'dx-template',
                            style:{},
                            props:{
                                dxSource:{
                                    value:{
                                        name:'FrameLayout',
                                        attrs:{

                                        }
                                    }
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
                                    type:ModelPropComponentType.text,
                                    title:'文本内容',
                                    get(model:Model){
                                        return model.props.dxSource.value.attrs.text
                                    },
                                    update(mutation:IMutation,data:any){
                                        mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{text:data});
                                    }
                                },
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
                                            text:'请输入文本',
                                            textSize:"14ap"
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
                                    type:ModelPropComponentType.text,
                                    title:'图片url',
                                    get(model:Model){
                                        return model.props.dxSource.value.attrs.imageUrl
                                    },
                                    update(mutation:IMutation,data:any){
                                        mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{imageUrl:data});
                                    }
                                },
                                {
                                    type:ModelPropComponentType.text,
                                    title:'宽高比',
                                    get(model:Model){
                                        return model.props.dxSource.value.attrs.aspectRatio
                                    },
                                    update(mutation:IMutation,data:any){
                                        mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{aspectRatio:data});
                                    }
                                },
                                {
                                    type:ModelPropComponentType.select,
                                    title:'图片缩放',
                                    props:{
                                        dataSource:[
                                            'fitCenter','fitXY','centerCrop'
                                        ]
                                    },
                                    get(model:Model){
                                        return model.props.dxSource.value.attrs.scaleType
                                    },
                                    update(mutation:IMutation,data:any){
                                        mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{scaleType:data});
                                    }
                                },
                                {
                                    type:ModelPropComponentType.text,
                                    title:'深色模式图片url',
                                    get(model:Model){
                                        return model.props.dxSource.value.attrs.darkModeImageUrl
                                    },
                                    update(mutation:IMutation,data:any){
                                        mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{darkModeImageUrl:data});
                                    }
                                }
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
                                            imageUrl:'https://img.alicdn.com/tfs/TB192rWjsKfxu4jSZPfXXb3dXXa-1600-912.png'
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
        if(codeTemplate.name === 'FrameLayout'){
            item.protoId = codeTemplate.name
        }else{
            item.protoId = codeTemplate.props.dxSource.value.name
        }
        result.push(item)
      }
    })
    return result
  }

export const marketItemList = flattern(marketData,[])


// export default [
//     {
//         id:'114',
//         name:'Button',
//         style:{
//         },
//         props:{
//             type:{
//                 value:'primary'
//             },
//             children:{
//                 value:'Click Me!'
//             }
//         },
//         proto:{
//             attrs:[
//                 {
//                     type:ModelPropComponentType.select,
//                     title:'按钮类型',
//                     sortIndex:50,
//                     props:{
//                         dataSource:[ 'primary' , 'secondary' , 'normal' ]
//                     },
//                     get(model:Model){
//                         if(model.props.type && model.props.type.value){
//                             return model.props.type.value
//                         }
//                         return ''
//                     },
//                     update(mutation:IMutation,data:any){
//                         mutation.updateModelProps('type',{value:data});
//                     }
//                 }
//             ]
//         },
//         extra:{
//             import:{
//                 from :'@alife/next',
//                 version:'1.0.0',
//                 type:ModelFromType.INDEFAULT
//             },
//             position:{
//                 // width:200,
//                 // height:70
//             }
//         }
//     },{
//         id:'115',
//         name:'Progress',
//         style:{
//         },
//         props:{
//             percent:{
//                 value:50
//             }
//         },
//         extra:{
//             import:{
//                 from :'@alife/next',
//                 version:'1.0.0',
//                 type:ModelFromType.INDEFAULT
//             },
//             position:{
//                 width:150
//             }
//         }
//     },{
//         id:'116',
//         name:'Card',
//         style:{
//         },
//         props:{
//             subTitle:{
//                 value:'Subtitle'
//             },
//             title:{
//                 value:'Title'
//             },
//             extra:{
//                 value:'Link'
//             }
//         },
//         extra:{
//             import:{
//                 from :'@alife/next',
//                 version:'1.0.0',
//                 type:ModelFromType.INDEFAULT
//             },
//             position:{
//                 width:300
//             }
//         }
//     }
// ]