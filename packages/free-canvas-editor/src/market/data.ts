import {ModelFromType} from 'free-canvas-shared' 
export default [
    {
        id:'114',
        name:'Button',
        style:{
        },
        propSchemas:{
            type:{
                value:'primary'
            },
            children:{
                value:'Click Me!'
            }
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
        id:'114',
        name:'Progress',
        style:{
        },
        propSchemas:{
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
        propSchemas:{
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