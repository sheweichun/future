import React from 'react'
import {Overlay,Checkbox,Input} from '@alife/next'
import {Model,ModelPropSchema,IMutation,Utils,AttrPropType} from 'free-canvas-shared'
import {ColorPicker,toState,ColorData,isValidHex} from '../../../../components/color-picker/index'
import {EdiItem} from '../../../../components/edi-item/index'
import {BaseComponent} from '../base'
import {CLASS_PREFIX} from '../../../../util/contant'

const {data2BackgroundColor} = Utils
export interface ColorProps extends AttrPropType{
    // modelData:Model[]
    // selectModel:Model,
    // schema:ModelPropSchema
    // mutation:IMutation
}

export interface ColorState{
    showColorPicker?:boolean
    // backgrounColor?:string
    data?:any
    hex?:string
    value:string
    disabled?:boolean
    isExp?:boolean
    expression?:string
    alpha?:string
}




const COLOR_CLZ = `${CLASS_PREFIX}color`
const COLOR_TRIGGER_CLZ = `${CLASS_PREFIX}color-trigger`
const COLOR_RECT_CLZ = `${CLASS_PREFIX}color-rect`
const COLOR_LABEL_CLZ = `${CLASS_PREFIX}color-label`
const COLOR_ALPHA_CLZ = `${CLASS_PREFIX}color-alpha`




function props2State(props:ColorProps,state?:ColorState){
    const {modelData,schema} = props;
    let item = schema.get(modelData[0])
    // console.log('item :',item);
    for(let i = 0 ; i < modelData.length; i++){
        const md = modelData[i];
        const curItem = schema.get(md);
        if(item.value != null && (item.value !== curItem.value || item.disabled !== curItem.disabled)){
            item.value = null
            break;
        }
    }
    if(state == null || (item.value !== state.hex || 
        item.disabled !== state.disabled || 
        item.isExp !== state.isExp ||
        item.expression !== state.expression)){
        let data,hex,alpha;
        if(!item.value){
            //@ts-ignore
            data = toState('#000000FF');
            hex = null
            alpha = null
        }else {
            data = toState(item.value);
            hex = getHexFromData(data)
            alpha = getAlphaFromData(data)
        }
        // console.log('data :',data);
        return Object.assign({},state || {},{
            data:data,
            // backgrounColor:data.hex,
            expression:item.expression,
            isExp:item.isExp,
            value:item.value,
            hex,
            alpha,
            disabled:item.disabled
        })
    }
    if(state.hex == null){
        //@ts-ignore
        const data = toState('#000000FF');
        return Object.assign({},state || {},{
            data:data,
            value:item.value,
            // backgrounColor:data.hex,
            expression:item.expression,
            isExp:item.isExp,
            hex:getHexFromData(data),
            alpha:getAlphaFromData(data),
            disabled:item.disabled
        })
    }
    return state
}

function getHexFromData(data:any){
    let renderHex;
    if(data.hex === 'transparent'){
        renderHex = '000000'
    }else{
        renderHex = data.hex.replace('#','')
    }
    return renderHex
}

function getAlphaFromData(data:any){
    return Math.round(data.rgb.a * 100) + ''
}

export class Color extends React.Component<ColorProps,ColorState>{
    private _triggerColorPickerEl:HTMLElement
    private _hex:string
    private _alpha:string
    constructor(props:ColorProps){
        super(props)
        this.state = {
            value:null,
            showColorPicker:false
        }
        this.onChangeColor = this.onChangeColor.bind(this)
        this.onChangeAlpha = this.onChangeAlpha.bind(this)
        this.onChangeHex = this.onChangeHex.bind(this)
        this.onBlurAlpha = this.onBlurAlpha.bind(this)
        this.onBlurHex = this.onBlurHex.bind(this)
    }
    static getDerivedStateFromProps(nextProps:ColorProps,prevState:ColorState){
        return props2State(nextProps,prevState)
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
    onChangeColor(data:ColorData,e?:MouseEvent){
        const {schema,mutation} = this.props;
        const {disabled,expression,isExp} = this.state
        const backgroundColor = data2BackgroundColor(data);
        schema.update(mutation,{
            value:backgroundColor,
            disabled,
            expression,
            isExp
        });
    }
    onChangeHex(hex:string){
        this.changeHex(hex);
    }
    onBlurHex(){
        if(this._hex == null){
            this._hex = getHexFromData(this.state.data);
        };
        const {hex} = this.state;
        if(this._hex !== hex){
            this.setState({
                hex:this._hex
            });
        }
        this._hex = null
    }
    changeHex(hex:string){
        hex = hex.replace(/\s/g,'');
        if(hex == '' || hex == 'transparent'){
            hex = '000000'
        }
        if(hex.length !== 6 || !isValidHex(hex)){
            this.setState({hex})
            return
        }
        this._hex = hex;
        const {data} = this.state;
        data.hex = `#${hex}`;
        this.onChangeColor(data);
    }
    changeAlpha(val:string){
        val = val.replace(/\s/g,'');
        const alpha = parseInt(val);
        if(isNaN(alpha) || alpha < 0 || alpha > 100){
            this.setState({alpha:val})
            return;
        }
        this._alpha = alpha + '';
        const {data} = this.state;
        data.rgb.a = alpha / 100;
        this.onChangeColor(data);
    }
    onBlurAlpha(){
        if(this._alpha == null) {
            this._alpha = getAlphaFromData(this.state.data);
        }
        const {alpha} = this.state;
        if(this._alpha !== alpha){
            this.setState({
                alpha:this._alpha
            });
        }
        this._alpha = null
    }
    onChangeAlpha(val:string){
        this.changeAlpha(val);
    }
    toggleBackgroundColor=(checked:boolean)=>{
        const {schema,mutation} = this.props;
        const {data,isExp,expression,value} = this.state;
        // const backgroundColor = data2BackgroundColor(data);
        // const backgroundColor = hex ? data2BackgroundColor(data) : '';
        if(checked){
            schema.update(mutation,{
                value:value,
                isExp,
                expression,
                disabled:false
            });
        }else{
            schema.update(mutation,{
                value:value,
                disabled:true,
                isExp,
                expression
            });
        }
    }
    onChangeExp=(checked:boolean)=>{
        const {schema,mutation} = this.props;
        const {expression,disabled,value} = this.state
        // const backgroundColor = data2BackgroundColor(data);
        // const backgroundColor = hex ? data2BackgroundColor(data) : '';
        schema.update(mutation,{
            isExp:checked,
            expression,
            value:value,
            disabled
        })
    }
    render(){
        const {schema,renderVarInput,modelData,mutation} = this.props;
        const {showColorPicker,data,hex,alpha,disabled,isExp} = this.state;
        return <EdiItem title={schema.title} supportVar={!!renderVarInput} checked={isExp} onChange={this.onChangeExp}>
            { isExp ? <div className={COLOR_CLZ}>
                {renderVarInput(modelData,schema,mutation)}
            </div> : <div className={COLOR_CLZ}>
                <Checkbox style={{marginRight:'8px'}} checked={!disabled} onChange={this.toggleBackgroundColor}></Checkbox>
                <div className={COLOR_TRIGGER_CLZ} >
                    <div className={COLOR_RECT_CLZ} style={{background:`#${hex}`}} onClick={this.toggleColorPicker} ref={this.initTriggerColorPickerEl}>
                    </div>
                    <div className={COLOR_LABEL_CLZ}>
                        <Input addonBefore="#" size="small" value={hex}
                        onBlur={this.onBlurHex}
                        onChange={this.onChangeHex}
                        ></Input>
                    </div>
                    <div className={COLOR_ALPHA_CLZ}>
                        <Input size="small" value={alpha} 
                        onBlur={this.onBlurAlpha}
                        onChange={this.onChangeAlpha} addonAfter="%"></Input>
                    </div>
                </div>
                <Overlay visible={showColorPicker} 
                    animation={false}
                    safeNode={this.getTriggerColorPickerEl}
                    target={this.getTriggerColorPickerEl}
                    onRequestClose={this.hideColorPicker}
                    >
                    <ColorPicker color={data && data.hsl} onChange={this.onChangeColor}></ColorPicker>
                </Overlay>
            </div>}
        </EdiItem> 
    }
}