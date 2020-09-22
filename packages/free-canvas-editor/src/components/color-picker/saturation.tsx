import React, { Component, PureComponent } from 'react'
import reactCSS from 'reactcss'
// import throttle from 'lodash/throttle'
import {Utils} from 'free-canvas-shared'
import { ColorSource, HSLData } from './type'


export function calculateChange(e:MouseEvent, hsl:HSLData, container:HTMLElement):HSLData {
    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect()
    const x = e.pageX
    const y = e.pageY
    let left = x - (container.getBoundingClientRect().left + window.pageXOffset)
    let top = y - (container.getBoundingClientRect().top + window.pageYOffset)
  
    if (left < 0) {
      left = 0
    } else if (left > containerWidth) {
      left = containerWidth
    }
  
    if (top < 0) {
      top = 0
    } else if (top > containerHeight) {
      top = containerHeight
    }
  
    const saturation = left / containerWidth
    const bright = 1 - (top / containerHeight)
  
    return {
      h: hsl.h,
      s: saturation,
      v: bright,
      a: hsl.a,
      source: ColorSource.hsv,
    }
  }

export interface SaturationProps{
    direction?:string,
    hsl?:HSLData,
    hsv?:HSLData,
    style?:any
    radius?:string
    shadow?:string
    onChange?:(change:HSLData,e:MouseEvent)=>void
    pointer?:PureComponent<SaturationProps,any>
}

export interface SaturationState{

}
type HandlerFn = (data:HSLData,e:MouseEvent)=>void
type ThrottleFn = (fn:HandlerFn,data:HSLData,e:MouseEvent)=>void

export class Saturation extends PureComponent<SaturationProps,SaturationState> {
    throttle:ThrottleFn
    container:HTMLElement
  constructor(props:SaturationProps) {
    super(props)

    this.throttle = Utils.throttle((fn, data, e) => {
      fn(data, e)
    }, 50)
  }

  componentWillUnmount() {
      //@ts-ignore
    this.throttle.cancel()
    this.unbindEventListeners()
  }

  handleChange = (e:any) => {
    typeof this.props.onChange === 'function' && this.throttle(
      this.props.onChange,
      calculateChange(e, this.props.hsl, this.container),
      e,
    )
  }

  handleMouseDown = (e:any) => {
    this.handleChange(e)
    window.addEventListener('mousemove', this.handleChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = () => {
    this.unbindEventListeners()
  }

  unbindEventListeners() {
    window.removeEventListener('mousemove', this.handleChange)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    const { color, white, black, pointer, circle } = this.props.style || {}
    const styles = reactCSS({
      'default': {
        color: {
          absolute: '0px 0px 0px 0px',
          background: `hsl(${ this.props.hsl.h },100%, 50%)`,
          borderRadius: this.props.radius,
        },
        white: {
          absolute: '0px 0px 0px 0px',
          borderRadius: this.props.radius,
        },
        black: {
          absolute: '0px 0px 0px 0px',
          boxShadow: this.props.shadow,
          borderRadius: this.props.radius,
        },
        pointer: {
          position: 'absolute',
          top: `${ -(this.props.hsv.v * 100) + 100 }%`,
          left: `${ this.props.hsv.s * 100 }%`,
          cursor: 'default',
        },
        circle: {
          width: '4px',
          height: '4px',
          boxShadow: `0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),
            0 0 1px 2px rgba(0,0,0,.4)`,
          borderRadius: '50%',
          cursor: 'hand',
          transform: 'translate(-2px, -2px)',
        },
      },
      'custom': {
        color,
        white,
        black,
        pointer,
        circle,
      },
    }, { 'custom': !!this.props.style })

    return (
      <div
        style={ styles.color }
        ref={ container => this.container = container }
        onMouseDown={ this.handleMouseDown }
        onTouchMove={ this.handleChange }
        onTouchStart={ this.handleChange }
      >
        <style>{`
          .saturation-white {
            background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));
            background: linear-gradient(to right, #fff, rgba(255,255,255,0));
          }
          .saturation-black {
            background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));
            background: linear-gradient(to top, #000, rgba(0,0,0,0));
          }
        `}</style>
        <div style={ styles.white } className="saturation-white">
          <div style={ styles.black } className="saturation-black" />
          <div style={ styles.pointer }>
            { this.props.pointer ? (
                //@ts-ignore
              <this.props.pointer { ...this.props } />
            ) : (
              <div style={ styles.circle } />
            ) }
          </div>
        </div>
      </div>
    )
  }
}

export default Saturation
