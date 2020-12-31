//@ts-ignore
import {dataParser,Template,render} from '@ali/dinamic'
import { ModelAttrValue,ViewOptions } from 'free-canvas-shared'
import React from 'react'
import ReactDOM from 'react-dom'


export interface DxViewOpt extends ViewOptions{
    getData:()=>any
}

export function calExpression(expression:string,value:any):any{
    const result = dataParser(expression,{  //@data{}会返回schema_value
        data:value
    })
    if(result === value) return;
    return result
}

// const div = document.createElement('div');
// div.setAttribute('style','position:absolute;left:0;top:0,backgound:black');
// render(<Template data={{
//     data:[
//         {
//             label:'测试1'
//         },{
//             label:'测试2'
//         }
//     ],
//     luodan:'luodan2121'
// }}  tpl={{
//     bizCode:'swc',
//     template:[{
//         "children": [
//           {
//             "name": "TextView",
//             "attrs": {
//               "textSize": "16ap",
//               "width": "150ap",
//               "text": "@subdata{label}",
//               "textColor": "#111111",
//               "lineBreakMode": "end",
//               "isBold": "true",
//               "marginTop": "40ap",
//               "marginLeft": "20ap",
//               "height": "23ap"
//             }
//           }
//         ],
//         "name": "LinearLayout",
//         "attrs": {
//           "backgroundColor": "green",
//           "listData": "@data{data}",
//           "width": "243ap",
//           "marginTop": "30ap",
//           "cornerRadius": "12ap",
//           "marginLeft": "9ap",
//           "height": "300ap"
//         }
//       }]
// }}></Template>,div);
// document.body.appendChild(div)


// export function getDxValueFromModelAttr(item:ModelAttrValue,data:any,defaultValue:any=''){
export function getDxValueFromModelAttr(item:ModelAttrValue,defaultValue:any=''){
    if(item == null) return defaultValue;
    const {isExp,expression,value,disabled} = item
    if(disabled) return defaultValue;
    // let val = isExp ? calExpression(expression,data) : value;
    let val = isExp ? expression : value;
    return val || defaultValue
}