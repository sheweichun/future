import {ModelFromType} from 'free-canvas-shared' 
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