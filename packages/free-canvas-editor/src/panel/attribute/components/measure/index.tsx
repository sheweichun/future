import React from 'react'
import {Input} from '@alife/next'
import {Model} from 'free-canvas-shared'
import {CLASS_PREFIX} from '../../../../util/contant'

export interface MeasureProps{
    modelData:Model[]
    selectModel:Model
}

export interface MeasureState{
    
}

const MEASURE_CLZ = `${CLASS_PREFIX}measure`


export class Measure extends React.Component<MeasureProps,MeasureState>{
    private _changed:boolean = false;
    constructor(props:MeasureProps){
        super(props)
        this.state = {

        }
    }
    renderEmpty(){
        return ''
    }
    render(){
        const {selectModel} = this.props;
        const placeholder = selectModel ? '' : '多个值'
        let x:number,y:number,width:number,height:number;
        if(selectModel && selectModel.extra){
            const pos = selectModel.extra.position
            x = pos.left;
            y = pos.top;
            width = pos.width;
            height = pos.height
        }
        return <div className={MEASURE_CLZ}>
            <Input addonTextBefore="X" htmlType="number" placeholder={placeholder} value={x}></Input>
            <Input addonTextBefore="Y" htmlType="number" placeholder={placeholder} value={y}></Input>
            <Input addonTextBefore="W" htmlType="number" placeholder={placeholder} value={width}></Input>
            <Input addonTextBefore="H" htmlType="number" placeholder={placeholder} value={height}></Input>
        </div>
    }
}