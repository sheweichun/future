import {Model,MarketDataItem,IMutation,ModelPropSchema,RenderVarInput} from 'free-canvas-shared'
import {TabDataItem} from '../components/tab/type'

export interface PanelProps{
    className?:string
    componentData:MarketDataItem[] 
    renderVarInput?:RenderVarInput
} 

export interface PanelState{
    activeTab:number,
    tabData:TabDataItem[],
    modelData:Model[],
    modelIdMap:ModelIdMap
}



export interface ModelIdMap{
    [key:string]:Model
}