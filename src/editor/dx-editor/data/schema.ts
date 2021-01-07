
// import {JSON_ROOT_SCHEMA} from '@pkg/free-canvas-shared'
export const emptySchemaData:any = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {},
  "definitions": {}
}


export const emptyValue = {}


export const schemaData:any = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
      "bg": {
        "type": "string",
        "description": "背景色",
        "title": "背景色"
      },
      "content": {
        "type": "string",
        "description": "内容文本",
        "title": "内容文本"
      },
      "data" : {
        "type": "array",
        "description":"数据",
        "items":{
          "label":{
            "type": "string",
            "description": "文本",
            "title": "内容文本"
          },
          "url":{
            "type": "string",
            "description": "文本",
            "title": "图片地址"
          }
        }
      },
      "shop": {
        "type": "object",
        "description": "店铺信息",
        "title": "店铺信息",
        "properties": {
          "name": {
            "type": "string",
            "description": "店铺名",
            "title": "店铺名"
          },
          "logo": {
            "type": "string",
            "description": "店铺logo",
            "title": "店铺logo"
          }
        },
        "required": [
          "name",
          "logo"
        ]
      }
  },
  "definitions": {},
  "required": [
    "bg",
    "content",
    "shop"
  ]
}

export const schemaValue = {
  "bg": "https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png",
  "content": "你大爷大活动卡号",
  "shop": {
    "name": "测试店铺1",
    "logo": "大姐大框架"
  },
  data:[
    {
      label:'测试1',
      url:'https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png'
    },{
      label:'测试2',
      url:'https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png'
    }
  ]
}

export type SchemaValue = {
  title:string,
  isEditing?:boolean,
  value:any
}

export const schemaValues:Array<SchemaValue> = [{
  title:'数据1',
  value:{
    "bg": "https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png",
    "content": "你大爷大活动卡号",
    "shop": {
      "name": "测试店铺1",
      "logo": "大姐大框架"
    },
    data:[
      {
        label:'测试1',
        url:'https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png'
      },{
        label:'测试2',
        url:'https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png'
      },{
        label:'测试3',
        url:'https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png'
      }
    ]
  }
},{
  title:'数据2',
  value:{
    "bg": "https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png",
    "content": "xxxxxxx",
    "shop": {
      "name": "测试店铺aaaa",
      "logo": "大姐大框架bbbb"
    },
    data:[
      {
        label:'测试vvvvv',
        url:'https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png'
      },{
        label:'测试zzzzz',
        url:'https://img.alicdn.com/tfs/TB1IkFjD1H2gK0jSZJnXXaT1FXa-900-500.png'
      }
    ]
  }
},{
  title:'数据3',
  value:{}
}]

export const schemaData1:any = {
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


export const schemaValue1 = {
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
}