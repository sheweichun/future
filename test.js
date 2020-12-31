

// const schemData = require('./src/canvas/schema');
// const {transformImgCookDsl} = require('./packages/free-canvas-core/lib/render/transform/index')







// // (function(coms){
// //     function parse(data,result){
// //       data.forEach((item)=>{
// //         if(item.list){
// //           parse(item.list,result)
// //         }else{
// //           result.push(item)
// //         }
// //       })
// //       return result
// //     }
// //     var allItems = parse(coms,[])
// //     var frag = document.createDocumentFragment();
// //     allItems.forEach((item)=>{
// //       var div = document.createElement('div');
// //       div.innerHTML = `
// //         <span>${item.name}</span>
// //         <img src="${item.preview}"/>
// //       `
// //       frag.appendChild(div)
// //     })
// //     document.body.innerHTML = ''
// //     document.body.appendChild(frag)
// //   })(coms)

// console.log(JSON.stringify(transformImgCookDsl(schemData),null,'  '))
// // const map = {}
// // function traseData(data){
// //     map[data.type] = true;
// //     if(data.children){
// //         data.children.forEach((child)=>{
// //             traseData(child)
// //         })
// //     }
// // }
// // traseData(schemData)
// // console.log('type :',Object.keys(map));
