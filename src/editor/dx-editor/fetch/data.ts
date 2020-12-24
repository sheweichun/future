import {MarketDataItem,MarketData,ModelPropComponentType,Model,IMutation, ModelType} from '@pkg/free-canvas-shared' 

type AttrScheme = {
    type:ModelPropComponentType,
    key:string,
    title?:string,
    props?:{
        [key:string]:any
    }
    get?:(data:Model)=>any
    update?:(mutation:IMutation,data:string)=>void
}


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
        update:update ? update : function(mutation:IMutation,data:string){
            // mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{[key]:data});
            mutation.updateModelStyle({
                [key]:data
            })
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
        update: update ? update : function(mutation:IMutation,data:any){
            mutation.updateModelPropsByKeyPath(['dxSource','value','attrs'],{[key]:data});
        }
    }
}

// function createDxStyleAttrSchema(data:AttrScheme){
//     const {type,key,title,get,update} = data
//     return {
//         type,
//         key,
//         title,
//         get:get ? get : function(model:Model){
//             return model.props.style.value[key]
//         },
//         update: update ? update : function(mutation:IMutation,data:any){
//             mutation.updateModelStyle({
//                 [key]:data
//             });
//         }
//     }
// }






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
                                })

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
                                }
                            },
                            extra:{
                                position:{
                                    width:100,
                                    height:100
                                }
                            }
                        }
                        // codeTemplate:{
                        //     name:'dx-template',
                        //     style:{},
                        //     props:{
                        //         dxSource:{
                        //             value:{
                        //                 name:'FrameLayout',
                        //                 attrs:{

                        //                 }
                        //             }
                        //         }
                        //     },
                        //     extra:{
                        //         position:{
                        //             width:100,
                        //             height:100
                        //         }
                        //     }
                        // }
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

export const marketItemList = flattern(marketData,[])




// ,{
//     name:'倒计时',
//     preview:'https://img.alicdn.com/tfs/TB1P1wbeWL7gK0jSZFBXXXZZpXa-45-45.svg',
//     proto:{
//         attrs:[
//             {
//                 type:ModelPropComponentType.xywh,
//             },
//             createStyleAttrSchema('timerTextColor','倒计时字体颜色'),
//             createStyleAttrSchema('timerBackgroundColor','倒计时数字的背景色')
//         ]
//     },
//     codeTemplate:{
//         name:'dx-template',
//         style:{},
//         props:{
//             dxSource:{
//                 value:{
//                     name:'CountDownView',
//                     attrs:{

//                     }
//                 }
//             }
//         },
//         extra:{
//             position:{
//                 width:60,
//                 height:60
//             }
//         }
//     }
// }

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