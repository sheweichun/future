
import { ComponentMarketStore } from '@pkg/free-canvas-dx/node_modules/free-canvas-shared/lib'
import {createComponentProtos} from './data'
import {calculateExpression} from '../view/store/index'


function getJSON(url: string, data?: { [key: string]: any }) {
    if (data) {
        const suffix = Object.keys(data).map((name) => { return `${name}=${encodeURIComponent(JSON.stringify(data[name]))}` }).join('&')
        url += `?${suffix}`
    }
    return fetch(url).then(function (response) {
        return response.json()
    })
}

function postJSON(url: string, data: { [key: string]: any }) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}
const domainURL = 'https://template.alibaba-inc.com'

function templateGetJSON(path: string, data?: { [key: string]: any }) {
    return getJSON(`${domainURL}${path}`, data)
}

function templatePostJSON(path: string, data?: { [key: string]: any }) {
    return postJSON(`${domainURL}${path}`, data)
}



// const MOCK_DATA = {
//     source:`
//     <FrameLayout cornerRadius="" backgroundColor="" marginLeft="0" marginTop="0" width="243ap" height="300ap">
//         <FrameLayout cornerRadius="" marginLeft="9ap" marginTop="30ap" width="245ap" height="305ap" listData="@data{data}">
//         <ImageView imageUrl="https://img.alicdn.com/tfs/TB14XguhbY1gK0jSZTEXXXDQVXa-540-1110.png" marginLeft="0" marginTop="0" width="97ap" height="153ap">
        
//     </ImageView>
//     <TextView textSize="16ap" lineBreakMode="end" text="你大爷12" textColor="#111111" isBold="" marginLeft="80.65843621399176ap" marginTop="40.66666666666666ap" width="151.23456790123456ap" height="23.383333333333326ap">
        
//     </TextView>
//     </FrameLayout>
//     </FrameLayout>
//     `,
//     name:'luodan_test'
// }

const MOCK_DATA = {
    source:`
    <FrameLayout cornerRadius="" backgroundColor="" marginLeft="0" marginTop="0" width="813ap" height="491ap">
    <FrameLayout cornerRadius="" marginLeft="9ap" marginTop="30ap" width="245ap" height="305ap" listData="@data{data}">
        <ImageView imageUrl="https://img.alicdn.com/tfs/TB14XguhbY1gK0jSZTEXXXDQVXa-540-1110.png" marginLeft="0" marginTop="0" width="97ap" height="63ap"></ImageView>
        <TextView textSize="16ap" lineBreakMode="end" text="你大爷12" textColor="#111111" isBold="" marginLeft="80ap" marginTop="40ap" width="151ap" height="23ap"></TextView>
        <FrameLayout marginLeft="136ap" marginTop="0" width="100ap" height="100ap" listData="@data{data}">
            <TextView text="请输入文本" textSize="14ap" marginLeft="17ap" marginTop="25ap" width="100ap" height="24ap"></TextView>
        </FrameLayout>
    </FrameLayout>
</FrameLayout>
    `,
    name:'luodan_test'
}

export function getTemplateById(id: string) {
    // return templateGetJSON('/api/template/current',{
    //     templateId:id
    // })
    return new Promise((resolve) => {
        const data = { "rtnCode": 0, "message": "OK", "data": { "templateId": 10117, "name": "luodan_test", "title": "test", "appName": "test", "bizType": "test2", "source": "<FrameLayout\n    width=\"243ap\"\n    height=\"300ap\"\n    cornerRadius=\"12ap\"\n>\n    <FrameLayout\n  listData=\"@data{data}\"       width=\"243ap\"\n        height=\"300ap\"\n        marginLeft=\"9ap\"\n        marginTop=\"30ap\"\n           cornerRadius=\"12ap\"\n    >\n        <ImageView\n            height=\"400ap\"\n            width=\"300ap\"\n            marginLeft=\"0\"\n            marginTop=\"0\"\n            imageUrl=\"https://img.alicdn.com/tfs/TB14XguhbY1gK0jSZTEXXXDQVXa-540-1110.png\"\n        >\n        </ImageView>\n        <TextView\n            width=\"150ap\"\n            height=\"23ap\"\n            textSize=\"16ap\"\n            marginTop=\"40ap\"\n            marginLeft=\"80ap\"\n            lineBreakMode=\"end\"\n            text=\"你大爷12\"\n            textColor=\"#111111\"\n            isBold=\"\"\n        />\n    </FrameLayout>\n</FrameLayout>\n", "mock": "[\n  {\n  }\n]", "fileTypeSourceListJson": "[{\"fileName\":\"main\",\"fileSource\":\"<FrameLayout\\n    width=\\\"243ap\\\"\\n    height=\\\"300ap\\\"\\n    backgroundColor=\\\"#ffffff\\\"\\n    cornerRadius=\\\"12ap\\\"\\n>\\n    <FrameLayout\\n        width=\\\"243ap\\\"\\n        height=\\\"300ap\\\"\\n        marginLeft=\\\"9ap\\\"\\n        marginTop=\\\"30ap\\\"\\n        backgroundColor=\\\"#ffffff\\\"\\n        cornerRadius=\\\"12ap\\\"\\n    >\\n        <ImageView\\n            height=\\\"400ap\\\"\\n            width=\\\"300ap\\\"\\n            marginLeft=\\\"0\\\"\\n            marginTop=\\\"0\\\"\\n            imageUrl=\\\"https://gw.alicdn.com/tfs/TB1tK9cF7Y2gK0jSZFgXXc5OFXa-750-1334.png\\\"\\n        >\\n        </ImageView>\\n        <TextView\\n            width=\\\"150ap\\\"\\n            height=\\\"23ap\\\"\\n            textSize=\\\"16ap\\\"\\n            marginTop=\\\"40ap\\\"\\n            marginLeft=\\\"80ap\\\"\\n            lineBreakMode=\\\"end\\\"\\n            text=\\\"你大爷12\\\"\\n            textColor=\\\"#111111\\\"\\n            isBold=\\\"true\\\"\\n        />\\n    </FrameLayout>\\n</FrameLayout>\\n\",\"fileType\":\"xml\"},{\"fileName\":\"mock\",\"fileSource\":\"[\\n  {\\n  }\\n]\",\"fileType\":\"json\"},{\"fileName\":\"templateConfig\",\"fileSource\":\"{\\n  \\\"props\\\": {\\n  },\\n  \\\"dependencies\\\": []\\n}\",\"fileType\":\"json\"}]", "opsName": "洛丹", "opsId": 120224, "templateOwnerId": 0, "templateOwnerName": "洛丹", "status": 1, "devVersion": 1, "publishVersion": 0, "version": 1, "templateUpdateTime": 1606720572, "detailUpdateTime": 1606720572, "cdnIOS": "https://dinamicx.alibabausercontent.com/pub/luodan_test/1606200069952/luodan_test.zip", "cdnAndroid": "https://dinamicx.alibabausercontent.com/pub/luodan_test/1606200069952/luodan_test.zip", "cdnH5": "https://dinamicx.alibabausercontent.com/pub/luodan_test/1606200069952/luodan_test_h5.js", "retLink": "", "compilerVersion": "3.5.0", "sdkVersion": "", "hotCount": 0, "createTime": 0, "dateTime": 0, "authGroupIds": "141", "thumbNails": "","isOpenDebug": 0,   "commitMsg": "", "templateType": 0, "onlyH5Compile": false, "compileFrom": "other", "auth": true } }
        if(data.rtnCode === 0){
            // return resolve(data.data)
            return resolve(MOCK_DATA)  
        }
        
    })
}

export function getComponentData():Promise<ComponentMarketStore>{
    return new Promise((resolve)=>{
        const {marketData,marketItemList} = createComponentProtos({
            calculateExpression
        });
        return resolve({
            data:marketData,
            list:marketItemList
        })
    })
}