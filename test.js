

var a  = [{
    name:'1',
    key:'7'
},{
    name:'2',
    key:'6'
},{
    name:'3',
    key:'5'
},{
    name:'4',
    key:'4'
},{
    name:'5',
    key:'3'
},{
    name:'6',
    key:'2'
},{
    name:'7',
    key:'1'
}]

console.log(a.sort(function(a,b){
    return a.key - b.key
}))