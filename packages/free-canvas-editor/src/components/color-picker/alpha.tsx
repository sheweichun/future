import React, {CSSProperties, PureComponent } from 'react'
import reactCSS from 'reactcss'
import {HSLData,RGBData,ColorSource} from './type'
import {Checkboard} from './Checkboard'

export function calculateChange(e:MouseEvent, hsl:HSLData, direction:string, initialA:number, container:HTMLElement):HSLData{
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const x = e.pageX
    const y = e.pageY
    const left = x - (container.getBoundingClientRect().left + window.pageXOffset)
    const top = y - (container.getBoundingClientRect().top + window.pageYOffset)
  
    if (direction === 'vertical') {
      let a
      if (top < 0) {
        a = 0
      } else if (top > containerHeight) {
        a = 1
      } else {
        a = Math.round((top * 100) / containerHeight) / 100
      }
  
      if (hsl.a !== a) {
        return {
          h: hsl.h,
          s: hsl.s,
          l: hsl.l,
          a,
          source: ColorSource.rgb,
        }
      }
    } else {
      let a
      if (left < 0) {
        a = 0
      } else if (left > containerWidth) {
        a = 1
      } else {
        a = Math.round((left * 100) / containerWidth) / 100
      }
  
      if (initialA !== a) {
        return {
          h: hsl.h,
          s: hsl.s,
          l: hsl.l,
          a,
          source: ColorSource.rgb,
        }
      }
    }
    return null
  }
  
export interface AlphaProps{
    hsl?:HSLData
    rgb?:RGBData
    direction?:string,
    style?:any,
    a?:number
    renderers?:{canvas:any},
    radius?:string,
    shadow?:string,
    onChange?:(change:HSLData,e:MouseEvent)=>void
    pointer?:PureComponent<AlphaProps,any>
}

export interface AlphaState{

}


export class Alpha extends PureComponent<AlphaProps,AlphaState> {
    container:HTMLElement
  componentWillUnmount() {
    this.unbindEventListeners()
  }

  handleChange = (e:any) => {
    const change = calculateChange(e, this.props.hsl, this.props.direction, this.props.a, this.container)
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

  unbindEventListeners = () => {
    window.removeEventListener('mousemove', this.handleChange)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    const rgb = this.props.rgb
    const styles = reactCSS({
      'default': {
        alpha: {
            //@ts-ignore
          absolute: '0px 0px 0px 0px',
          borderRadius: this.props.radius,
        },
        checkboard: {
            //@ts-ignore
          absolute: '0px 0px 0px 0px',
          overflow: 'hidden',
          borderRadius: this.props.radius,
        },
        gradient: {
            //@ts-ignore
          absolute: '0px 0px 0px 0px',
          background: `linear-gradient(to right, rgba(${ rgb.r },${ rgb.g },${ rgb.b }, 0) 0%,
           rgba(${ rgb.r },${ rgb.g },${ rgb.b }, 1) 100%)`,
          boxShadow: this.props.shadow,
          borderRadius: this.props.radius,
        },
        container: {
          position: 'relative',
          height: '100%',
          margin: '0 3px',
        },
        pointer: {
          position: 'absolute',
          left: `${ rgb.a * 100 }%`,
        },
        slider: {
          width: '4px',
          borderRadius: '1px',
          height: '8px',
          boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
          background: '#fff',
          marginTop: '1px',
          transform: 'translateX(-2px)',
        },
      },
      'vertical': {
          //@ts-ignore
        gradient: {
          background: `linear-gradient(to bottom, rgba(${ rgb.r },${ rgb.g },${ rgb.b }, 0) 0%,
           rgba(${ rgb.r },${ rgb.g },${ rgb.b }, 1) 100%)`,
        },
        
        pointer: {
            //@ts-ignore
          left: 0,
          top: `${ rgb.a * 100 }%`,
        },
      },
      'overwrite': {
          //@ts-ignore
        ...this.props.style,
      },
    }, {
      vertical: this.props.direction === 'vertical',
      overwrite: true,
    })
    const PointerComponent= this.props.pointer;
    return (
      <div style={ styles.alpha }>
        <div style={ styles.checkboard }>
          <Checkboard renderers={ this.props.renderers } />
        </div>
        <div style={ styles.gradient } />
        <div
          style={ styles.container as CSSProperties }
          ref={ container => this.container = container }
          onMouseDown={ this.handleMouseDown }
          onTouchMove={ this.handleChange }
          onTouchStart={ this.handleChange }
        >
          <div style={ styles.pointer as CSSProperties }>
            { PointerComponent ? (
                //@ts-ignore
              <PointerComponent { ...this.props } />
            ) : (
              <div style={ styles.slider } />
            ) }
          </div>
        </div>
      </div>
    )
  }
}

export default Alpha
