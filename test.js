

const schemData = require('./src/canvas/schema');
const {transformImgCookDsl} = require('./packages/free-canvas-core/lib/render/transform/index')


console.log(JSON.stringify(transformImgCookDsl(schemData),null,'  '))
// const map = {}
// function traseData(data){
//     map[data.type] = true;
//     if(data.children){
//         data.children.forEach((child)=>{
//             traseData(child)
//         })
//     }
// }
// traseData(schemData)
// console.log('type :',Object.keys(map));