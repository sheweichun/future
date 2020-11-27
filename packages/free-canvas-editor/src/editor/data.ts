import {ModelFromType,ModelPropComponentType,Model,IMutation} from 'free-canvas-shared' 
export default [
    {
        id:'114',
        name:'Button',
        style:{
        },
        props:{
            type:{
                value:'primary'
            },
            children:{
                value:'Click Me!'
            }
        },
        proto:{
            attrs:[
                {
                    type:ModelPropComponentType.select,
                    title:'按钮类型',
                    sortIndex:50,
                    props:{
                        dataSource:[ 'primary' , 'secondary' , 'normal' ]
                    },
                    get(model:Model){
                        if(model.props.type && model.props.type.value){
                            return model.props.type.value
                        }
                        return ''
                    },
                    update(mutation:IMutation,data:any){
                        mutation.updateModelProps('type',{value:data});
                    }
                }
            ]
        },
        extra:{
            import:{
                from :'@alife/next',
                version:'1.0.0',
                type:ModelFromType.INDEFAULT
            },
            position:{
                // width:200,
                // height:70
            }
        }
    },{
        id:'115',
        name:'Progress',
        style:{
        },
        props:{
            percent:{
                value:50
            }
        },
        extra:{
            import:{
                from :'@alife/next',
                version:'1.0.0',
                type:ModelFromType.INDEFAULT
            },
            position:{
                width:150
            }
        }
    },{
        id:'116',
        name:'Card',
        style:{
        },
        props:{
            subTitle:{
                value:'Subtitle'
            },
            title:{
                value:'Title'
            },
            extra:{
                value:'Link'
            }
        },
        extra:{
            import:{
                from :'@alife/next',
                version:'1.0.0',
                type:ModelFromType.INDEFAULT
            },
            position:{
                width:300
            }
        }
    }
]