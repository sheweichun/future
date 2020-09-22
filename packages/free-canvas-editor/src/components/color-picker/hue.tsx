import React, { Component, CSSProperties, PureComponent } from 'react'
import reactCSS from 'reactcss'
import {HSLData,ColorSource} from './type'


export function calculateChange(e:MouseEvent, direction:string, hsl:HSLData, container:HTMLElement):HSLData{
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const x = e.pageX
    const y = e.pageY
    const left = x - (container.getBoundingClientRect().left + window.pageXOffset)
    const top = y - (container.getBoundingClientRect().top + window.pageYOffset)
  
    if (direction === 'vertical') {
      let h
      if (top < 0) {
        h = 359
      } else if (top > containerHeight) {
        h = 0
      } else {
        const percent = -((top * 100) / containerHeight) + 100
        h = ((360 * percent) / 100)
      }
  
      if (hsl.h !== h) {
        return {
          h,
          s: hsl.s,
          l: hsl.l,
          a: hsl.a,
          source: ColorSource.hsl,
        }
      }
    } else {
      let h
      if (left < 0) {
        h = 0
      } else if (left > containerWidth) {
        h = 359
      } else {
        const percent = (left * 100) / containerWidth
        h = ((360 * percent) / 100)
      }
  
      if (hsl.h !== h) {
        return {
          h,
          s: hsl.s,
          l: hsl.l,
          a: hsl.a,
          source: ColorSource.hsl,
        }
      }
    }
    return null
}

export interface HueProps{
    direction?:string,
    hsl?:HSLData,
    radius?:string
    shadow?:string
    style?:any
    onChange?:(change:HSLData,e:MouseEvent)=>void
    pointer?:PureComponent<HueProps,any>
}

export interface HueState{

}
  

export class Hue extends PureComponent<HueProps,HueState> {
    container:HTMLElement
  componentWillUnmount() {
    this.unbindEventListeners()
  }

  handleChange = (e:any) => {
    const change = calculateChange(e, this.props.direction, this.props.hsl, this.container)
    change && typeof this.props.onChange === 'function' && this.props.onChange(change, e)
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
    const { direction = 'horizontal' } = this.props

    const styles = reactCSS({
      'default': {
        hue: {
          //@ts-ignore
          absolute: '0px 0px 0px 0px',
          borderRadius: this.props.radius,
          boxShadow: this.props.shadow,
        },
        container: {
          padding: '0 2px',
          position: 'relative',
          height: '100%',
          borderRadius: this.props.radius,
        },
        pointer: {
          position: 'absolute',
          left: `${ (this.props.hsl.h * 100) / 360 }%`
        },
        slider: {
          marginTop: '1px',
          width: '4px',
          borderRadius: '1px',
          height: '8px',
          boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
          background: '#fff',
          transform: 'translateX(-2px)',
        },
      },
      'vertical': {
        pointer: {
          left: '0px',
          //@ts-ignore
          top: `${ -((this.props.hsl.h * 100) / 360) + 100 }%`,
        },
      },
    }, { vertical: direction === 'vertical' })

    return (
      <div style={ styles.hue }>
        <div
          className={ `hue-${ direction }` }
          style={ styles.container as CSSProperties }
          ref={ container => this.container = container }
          onMouseDown={ this.handleMouseDown }
          onTouchMove={ this.handleChange }
          onTouchStart={ this.handleChange }
        >
          <style>{ `
            .hue-horizontal {
              background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0
                33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
              background: -webkit-linear-gradient(to right, #f00 0%, #ff0
                17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            }

            .hue-vertical {
              background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%,
                #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
              background: -webkit-linear-gradient(to top, #f00 0%, #ff0 17%,
                #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            }
          ` }</style>
          <div style={ styles.pointer as CSSProperties }>
            { this.props.pointer ? (
                //@ts-ignore
              <this.props.pointer { ...this.props } />
            ) : (
              <div style={ styles.slider } />
            ) }
          </div>
        </div>
      </div>
    )
  }
}

export default Hue
