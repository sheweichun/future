// import React from 'react';
// import ReactDOM from 'react-dom';
// import {GlobalContextValue,GlobalContext} from './context'
// import {Editor} from './editor'
import {init} from './startup';
import {JSONSchemaView} from '@pkg/free-canvas-json-editor'
import '@pkg/free-canvas-editor/dist/editor.css'
import '@pkg/free-canvas-json-editor/dist/editor.css'
import {DxEditorHook,HeadView,getComponentData,renderVarInput} from './dx-editor'
import React from 'react'
import ReactDOM from 'react-dom'
import {initTheme} from '@pkg/free-canvas-theme'
initTheme()
// const canvasEl = document.querySelector('.canvas-content') as HTMLElement;
// const iframe = (canvasEl.querySelector('iframe') as HTMLIFrameElement)
// const market = new Market(document.querySelector('.aside'),{
//     canvasEl,
//     getCanvasElement:function(id:string){
//         return iframe.contentDocument.getElementById(id)
//     }
// })


// init([new DxEditorHook()],{
//     head:new HeadView(),
//     getComponentData,
//     renderVarInput
// }); 

const schemaData = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "avatarList": {
        "type": "array",
        "title": "头像",
        "items": {
          "avatar": {
            "description": "{\"required\":\"true\"}",
            "title": "头像图片",
            "type": "string"
          },
          "name": {
            "description": "{\"required\":\"true\"}",
            "title": "商品图片",
            "type": "string"
          },
          "size": {
            "description": "{\"required\":\"true\"}",
            "title": "尺寸",
            "type": "number"
          }
        },
        "minItems": 1,
        "maxItems": 2
      },
      "mainDesc": {
        "description": "{}",
        "title": "主要描述",
        "type": "string"
      },
      "isMan": {
        "description": "{}",
        "title": "性别",
        "type": "boolean"
      }, 
      "test":{
        "description": "{}",
        "title": "人员信息",
        "type": "object",
        "properties":{
            "name":{
              "description": "{}",
              "title": "名字",
              "type": "string"
            },
            "age":{
              "description": "{}",
              "title": "年龄",
              "type": "number"
            },
            "school":{
              "description": "{}",
              "title": "学校",
              "type": "object",
              "properties":{
                "name":{
                  "description": "{}",
                  "title": "学校名字",
                  "type": "string"
                },
                "size":{
                  "description": "{}",
                  "title": "学校规模",
                  "type": "string"
                }
              }
            }
        }
      },
      "subDescList": {
        "type": "array",
        "title": "来源字段",
        "items": {
          "content": {
            "description": "{\"required\":\"true\"}",
            "title": "来源",
            "type": "string"
          },
          "info": {
            "description": "{\"required\":\"true\"}",
            "title": "详情",
            "type": "object",
            "properties":{
              "url": {
                "description": "{\"required\":\"true\"}",
                "title": "图片地址",
                "type": "string"
              },
              "link": {
                "description": "{\"required\":\"true\"}",
                "title": "跳转地址",
                "type": "string"
              }
            }
          }
        },
        "minItems": 1,
        "maxItems": 3
      },
      "sourceUrl": {
        "description": "{}",
        "title": "来源跳转地址",
        "type": "string"
      }
    },
    "definitions": {},
    "required": ['mainDesc']
  }

const div = document.createElement('div');
div.setAttribute('style','position:absolute;left:0;width:100%;height:100%;top:0')
//@ts-ignore
ReactDOM.render(<JSONSchemaView data={schemaData} value={{
  mainDesc:'你大爷',
  avatarList:[
    {avatar:'aaa',size:1000},
    {avatar:'bbb'},
    {avatar:'ccc'}
  ],
  isMan:true,
  subDescList:[
    {content:'111'},
    {content:'222'},
    {content:'333'}
  ],
  test:{
    name:'洛丹',
    age:12,
    school:{
      name:'四川大学',
      size:'大'
    }
  }
}}></JSONSchemaView>,div)

document.body.appendChild(div) 

// const mountNode = document.querySelector('.root')
//     ReactDOM.render(
//         <GlobalContext.Provider value={GlobalContextValue}>
//             <Editor
//             runTask={runTask}
//             ></Editor>
//         </GlobalContext.Provider>
//     ,mountNode)
