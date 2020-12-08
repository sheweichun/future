import React,{ComponentType}  from 'react';
import {Market,MarketProps} from '../market/index'
import {Header,HeadProps} from '../header/index'
import {Panel,PanelProps} from '../panel/index'
import {Aside} from '../aside/index'
import {Tree,TreeProps} from '../tree/index'
import {IHeadView, IPlugin,ShowTagName,ComponentMarketStore} from 'free-canvas-shared'



type a = Market extends ComponentType<MarketProps> ? string : number

export interface EditorComponents{
    header?:typeof Header
    panel?:typeof Panel
    aside?:typeof Aside
    // market?:typeof Market
    market?:typeof Market
    tree?:typeof Tree
}


export interface HocProps {
    runTask(plugin:IPlugin):void
}



export interface EditorProps extends HocProps{
    components:EditorComponents
    head?:IHeadView
    showTagName?:ShowTagName
    getComponentData:()=>Promise<ComponentMarketStore>
}

export interface EditorState{  

}


export type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;

