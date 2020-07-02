const FreeCanvas = require('../lib/index').default


FreeCanvas('canvas',{
    data:{
        isRoot:true,
        children:[{
            id:'111',
            name:'div',
            style:{
                width:'300px',
                height:'300px',
                backgroundColor:'red'
            },
            extra:{
                position:{
                    left:200,
                    top:10
                }
            },
            children:[
                {
                    id:'1111',
                    name:'div',
                    style:{
                        width:'200px',
                        height:'200px',
                        backgroundColor:'blue'
                    },
                    extra:{
                        position:{
                            left:10,
                            top:10
                        }
                    },
                } ,{
                    id:'1112',
                    name:'div',
                    style:{
                        left:'150',
                        top:'150',
                        width:'100px',
                        height:'100px',
                        backgroundColor:'yellow'
                    },
                    extra:{
                        position:{
                            left:150,
                            top:150
                        }
                    }
                } 
            ]
        },{
            id:'112',
            name:'div',
            style:{
                width:'150px',
                height:'150px',
                backgroundColor:'black'
            },
            extra:{
                position:{
                    left:400,
                    top:300
                }
            }
        }]
    }
});