import React from 'react'
import {Overlay} from '@alife/next'
import {Model} from 'free-canvas-shared'
import {TabDataItem} from '../../components/tab/type'
import {EdiItem} from '../../components/index'
import {CLASS_PREFIX} from '../../util/contant'
import {Measure} from './components/index'
import {Color} from './components/color/index'
export interface AttrbuteProps{
    tabData:TabDataItem
    modelData:Model[]
}

export interface AttrbuteState{
    selectModel:Model
}


const ATTRIBUTE_CLZ = `${CLASS_PREFIX}attribute`


function props2State(props:AttrbuteProps,defaultValue?:any):AttrbuteState{
    const {modelData} = props;
    if(modelData.length === 1){
        return {
            selectModel:modelData[0]
        }
    }
    return defaultValue
}

export class Attribute extends React.Component<AttrbuteProps,AttrbuteState>{
    constructor(props:AttrbuteProps){
        super(props)
        this.state = props2State(props,{})
    }
    static getDerivedStateFromProps(nextProps:AttrbuteProps,prevState:AttrbuteState){
        return props2State(nextProps)
    }
    render(){
        const {modelData} = this.props;
        const {selectModel} = this.state;
        const hasSelected = modelData && modelData.length > 0
        return <div className={ATTRIBUTE_CLZ}>
            <EdiItem>
                {hasSelected && <Measure modelData={modelData} selectModel={selectModel}></Measure>}
            </EdiItem>
            <EdiItem>
                2
            </EdiItem>
            <EdiItem title="背景色">
                {<Color modelData={modelData} selectModel={selectModel}></Color>}
            </EdiItem>

        </div>
    }
}