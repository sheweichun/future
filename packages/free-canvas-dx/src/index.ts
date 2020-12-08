


import {Model,View,ViewOptions,ModelPropSchemaMap} from 'free-canvas-shared'
import {DxView} from './view'


export function createView(data:Model,options:ViewOptions){
    const {name} = data;
    //@ts-ignore
    if(name === 'dx-template'){
        return new DxView(data,options)
    }
    return new View(data,options);
}

export function showTagName(data:Model){
    const {name,props} = data
    if(name === 'div'){
        return 'FrameLayout'
    }else if(name === 'dx-template'){
        return props.dxSource.value.name
    }
    return name;
}

export function getModelPropSchemaMap():ModelPropSchemaMap{
    return {
        
    }
}