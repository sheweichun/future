import React, {PureComponent } from 'react'
import {Utils} from 'free-canvas-shared'
import Color from './color'
import {ColorData} from './color-model'
import {HSLData} from './type'

export interface ColorPickerProps{
    color:HSLData
    onChange?:(data:ColorData,e:MouseEvent)=>void
    onChangeComplete?:(data:ColorData,e:MouseEvent)=>void
    onSwatchHover?:(data:ColorData,e:MouseEvent)=>void
}

export interface ColorPickerState{
    oldHue?:number,
    propColor:HSLData
}

type HandlerFn = (data:ColorData,e:MouseEvent)=>void
type DebounceFn = (fn:HandlerFn,data:ColorData,e:MouseEvent)=>void


export function ColorWrap(Picker:any):any{
  class ColorPicker extends PureComponent<ColorPickerProps,ColorPickerState> {
    debounce:DebounceFn
    static defaultProps:ColorPickerProps = {
        color:{
            h: 250,
            s: 0.50,
            l: 0.20,
            a: 1,
        }
    }
    constructor(props:ColorPickerProps){
      super(props)

      this.state = {
        ...Color.toState(props.color, 0),
        propColor:props.color
      }

      this.debounce = Utils.debounce((fn:HandlerFn, data:ColorData, event:MouseEvent) => {
        fn(data, event)
      }, 100)
    }

    static getDerivedStateFromProps(nextProps:ColorPickerProps, state:ColorPickerState) {
      const {color} = nextProps
      if(color !== state.propColor){
        return {
          ...Color.toState(color, state.oldHue),
          propColor:color
        }
      }
    }

    handleChange = (data:ColorData, event:MouseEvent) => {
      const isValidColor = Color.simpleCheckForValidColor(data)
      if (isValidColor) {
        const colors = Color.toState(data, data.h || this.state.oldHue)
        this.setState(colors)
        this.props.onChangeComplete && this.debounce(this.props.onChangeComplete, colors, event)
        this.props.onChange && this.props.onChange(colors, event)
      }
    }

    handleSwatchHover = (data:ColorData, event:MouseEvent) => {
      const isValidColor = Color.simpleCheckForValidColor(data)
      if (isValidColor) {
        const colors = Color.toState(data, data.h || this.state.oldHue)
        this.props.onSwatchHover && this.props.onSwatchHover(colors, event)
      }
    }

    render() {
      const optionalEvents = {}
      if (this.props.onSwatchHover) {
        //@ts-ignore
        optionalEvents.onSwatchHover = this.handleSwatchHover
      }

      return (
        <Picker
          { ...this.props }
          { ...this.state }
          onChange={ this.handleChange }
          { ...optionalEvents }
        />
      )
    }
  }
  return ColorPicker
}

export default ColorWrap
