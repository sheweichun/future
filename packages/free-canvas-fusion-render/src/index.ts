
import {Model,View,ViewOptions} from 'free-canvas-shared'
import * as Next from '@alife/next'
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