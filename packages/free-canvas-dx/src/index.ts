

import {Model,ViewOptions,ImutBase,IRenderEngine,IRenderEngineOpt} from 'free-canvas-shared'
import {DxView} from './dx_view' 
import {NormalView} from './view'
import {getDxValueFromModelAttr,calExpression} from './util'
export {calExpression} from './util'


// export interface CreateViewOpt extends ViewOptions{
//     // getData:()=>any
// }


export class DXRenderEngine implements IRenderEngine{
    constructor(private _options:IRenderEngineOpt){

    }
    getData(){
        return this._options.getData();
    }
    createView=(data:Model,options:ViewOptions)=>{
        const {name} = data;
        const newOpt = Object.assign({},options,{
            getData:this._options.getData
        })
        //@ts-ignore
        if(name === 'dx-template'){
            return new DxView(data,newOpt)
        }
        return new NormalView(data,newOpt);
    }
    showTagName(data:Model){
        return showTagName(data)
    }
    getListData(model:ImutBase,value:any):Array<any>{
        const listDataExp = model.getIn(['props','listData','expression'],null)
        if(listDataExp){
            return calExpression(listDataExp,value)
        }
        return null
    }
}



// export function createViewGenerator(getData:()=>any){
//     return function createView(data:Model,options:CreateViewOpt){
//         const {name} = data;
//         const newOpt = Object.assign({},options,{
//             getData
//         })
//         //@ts-ignore
//         if(name === 'dx-template'){
//             return new DxView(data,newOpt)
//         }
//         return new NormalView(data,newOpt);
//     }
// }

export function showTagName(data:Model){
    const {name,props} = data
    if(name === 'div'){
        return 'FrameLayout'
    }else if(name === 'dx-template'){
        return props.dxSource.value.name
    }
    return name;
}

// export function getModelPropSchemaMap():ModelPropSchemaMap{
//     return {
        
//     }
// }