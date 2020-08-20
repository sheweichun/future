import FreeCanvas from '@pkg/free-canvas-core';
import {createView} from '@pkg/free-canvas-fusion-render';
import {initTheme} from '@pkg/free-canvas-theme'



// //@ts-ignore
// window.$$onCanvasReady = function(cb:(canvas:FreeCanvas)=>void){
    
//     cb(canvas)
// }
console.log('in freeCanvas');
initTheme();
const canvas = FreeCanvas('canvas',{
    createView,
    data:{
        type:0,
        extra:{},
        // isGroup:false,
        children:[
            {
                type:2,
                id:'110',
                name:'div',
                style:{
                    backgroundColor:'#ffffff'
                },
                extra:{
                    label:'我的第一块画布',
                    position:{
                        left:100,
                        top:100,
                        width:375,
                        height:812
                    }
                },
                children:[{
                    id:'111',
                    name:'div',
                    style:{
                        backgroundColor:'#ff000055'
                    },
                    extra:{
                        position:{
                            left:0,
                            top:0,
                            width:400,
                            height:300,
                        }
                    },
                    children:[
                        {
                            id:'1111',
                            name:'div',
                            style:{
                                backgroundColor:'#00ff0055'
                            },
                            extra:{
                                position:{
                                    left:10,
                                    top:10,
                                    width:200,
                                    height:200,
                                }
                            },
                            children:[
                                {
                                    id:'11111',
                                    name:'div',
                                    style:{
                                        backgroundColor:'#00ff3355'
                                    },
                                    extra:{
                                        position:{
                                            left:20,
                                            top:20,
                                            width:100,
                                            height:100,
                                        }
                                    },
                                }
                            ]
                        } ,{
                            id:'1112',
                            name:'div',
                            style:{
                                backgroundColor:'#ffff0055'
                            },
                            extra:{
                                position:{
                                    left:250,
                                    top:150,
                                    width:100,
                                    height:100,
                                }
                            }
                        } 
                    ]
                },{
                    id:'112',
                    name:'div',
                    style:{
                        backgroundColor:'#00000055'
                    },
                    extra:{
                        position:{
                            left:400,
                            top:300,
                            width:150,
                            height:150,
                        }
                    }
                },{
                    id:'113',
                    name:'div',
                    style:{
                        backgroundColor:'#00000055'
                    },
                    extra:{
                        position:{
                            left:600,
                            top:400,
                            width:150,
                            height:150,
                        }
                    }
                }]
            },{
                type:2,
                id:'120',
                name:'div',
                style:{
                    backgroundColor:'#ffffff'
                },
                extra:{
                    label:'我的第二块画布',
                    position:{
                        left:900,
                        top:100,
                        width:375,
                        height:812
                    }
                },
                children:[{
                    id:'121',
                    name:'div',
                    style:{
                        backgroundColor:'#ff000055'
                    },
                    extra:{
                        position:{
                            left:0,
                            top:0,
                            width:400,
                            height:300,
                        }
                    }
                }]
            }
        ]
    }
});
// @ts-ignore
const {$$onCanvasLoaded} = window.top;
if($$onCanvasLoaded){
    $$onCanvasLoaded(canvas);
}