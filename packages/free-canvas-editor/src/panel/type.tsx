import {Model,MarketDataItem} from 'free-canvas-shared'
import {TabDataItem} from '../components/tab/type'

export interface PanelProps{
    className?:string
    componentData:MarketDataItem[]
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