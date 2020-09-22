import React from 'react'
import {Overlay,Checkbox,Input} from '@alife/next'
import {Model} from 'free-canvas-shared'
import {ColorPicker} from '../../../../components/color-picker/index'
import {CLASS_PREFIX} from '../../../../util/contant'

export interface MeasureProps{
    modelData:Model[]
    selectModel:Model
}

export interface MeasureState{
    showColorPicker:boolean

}

const COLOR_CLZ = `${CLASS_PREFIX}color`
const COLOR_TRIGGER_CLZ = `${CLASS_PREFIX}color-trigger`
const COLOR_RECT_CLZ = `${CLASS_PREFIX}color-rect`
const COLOR_LABEL_CLZ = `${CLASS_PREFIX}color-label`
const COLOR_ALPHA_CLZ = `${CLASS_PREFIX}color-alpha`


export class Color extends React.Component<MeasureProps,MeasureState>{
    private _changed:boolean = false;
    private _triggerColorPickerEl:HTMLElement
    constructor(props:MeasureProps){
        super(props)
        this.state = {
            showColorPicker:false
        }
    }
    hideColorPicker=()=>{
        this.setState({
            showColorPicker:false
        })
    }
    toggleColorPicker=()=>{
        const {showColorPicker} = this.state;
        this.setState({
            showColorPicker:!showColorPicker
        })
    }
    initTriggerColorPickerEl=(el:HTMLElement)=>{
        this._triggerColorPickerEl = el;
    }
    getTriggerColorPickerEl=()=>{
        return this._triggerColorPickerEl
    }
    render(){
        const {modelData} = this.props;
        const {showColorPicker} = this.state;
        return <div className={COLOR_CLZ}>
            <Checkbox style={{marginRight:'8px'}}></Checkbox>
            <div className={COLOR_TRIGGER_CLZ} >
                <div className={COLOR_RECT_CLZ} style={{background:'red'}} onClick={this.toggleColorPicker} ref={this.initTriggerColorPickerEl}>
                </div>
                <div className={COLOR_LABEL_CLZ}>
                    <Input size="small" value="#FF0000"></Input>
                </div>
                <div className={COLOR_ALPHA_CLZ}>
                    <Input size="small" value="100%"></Input>
                </div>
            </div>
            <Overlay visible={showColorPicker} 
                animation={false}
                safeNode={this.getTriggerColorPickerEl}
                target={this.getTriggerColorPickerEl}
                onRequestClose={this.hideColorPicker}
                >
                <ColorPicker></ColorPicker>
            </Overlay>
        </div>
    }
}