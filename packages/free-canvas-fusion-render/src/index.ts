

import * as Next from '@alife/next'
import {Model,View,ViewOptions,ModelPropSchemaMap} from 'free-canvas-shared'
import {FusionView} from './view'


export function createView(data:Model,options:ViewOptions){
    const {name} = data;
    //@ts-ignore
    const RenderComponent = Next[name]
    if(RenderComponent){
        return new FusionView(data,options)
    }
    return new View(data,options);
}

export function getModelPropSchemaMap():ModelPropSchemaMap{
    return {
        
    }
}