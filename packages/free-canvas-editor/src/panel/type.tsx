import {Model} from 'free-canvas-shared'
import {TabDataItem} from '../components/tab/type'

export interface PanelProps{
    className?:string
}

export interface PanelState{
    activeTab:number,
    tabData:TabDataItem[],
    modelData:Model[]
}
