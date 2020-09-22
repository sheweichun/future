import React,{CSSProperties} from 'react'
import reactCSS,{Classes} from 'reactcss'

import ColorWrap from './color-wrap'
import Saturation from './saturation'
import Hue from './hue'
import Alpha from './alpha'
import Checkboard from './checkboard'
import SketchFields from './field'
import SketchPresetColors from './preset-colors'

interface SketchStylePropAttr{
    picker?:Partial<CSSProperties>,
    saturation?:Partial<CSSProperties>,
    Saturation?:Partial<CSSProperties>,
    controls?:Partial<CSSProperties>,
    sliders?:Partial<CSSProperties>,
    color?:Partial<CSSProperties>,
    activeColor?:Partial<CSSProperties>,
    hue?:Partial<CSSProperties>,
    Hue?:Partial<CSSProperties>,
    alpha?:Partial<CSSProperties>,
    Alpha?:Partial<CSSProperties>
}

// interface SketchStyleProp{
//     default?:SketchStylePropAttr,
//     disableAlpha?:SketchStylePropAttr
// }

type SketchStyleProp = Classes<SketchStylePropAttr>

export interface SketchProps { 
    width?:string, 
    rgb?:any, 
    hex?:any, 
    hsv?:any, 
    hsl?:any, 
    onChange?:any, 
    onSwatchHover?:any,
    disableAlpha?:SketchStylePropAttr, 
    presetColors?:any, 
    renderers?:any, 
    styles?:Partial<SketchStyleProp>, 
    className?:string
}




export function Sketch(props:SketchProps){
  const { width, rgb, hex, hsv, hsl, onChange, onSwatchHover,
    disableAlpha, presetColors, renderers, styles: passedStyles = {}, className = '' } = props;
    const originStyles = Object.assign({
        default: {
          picker: {
            width,
            padding: '10px 10px 0',
            boxSizing: 'initial',
            background: '#fff',
            borderRadius: '4px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)',
          },
          saturation: {
            width: '100%',
            paddingBottom: '75%',
            position: 'relative',
            overflow: 'hidden',
          },
          Saturation: {
            radius: '3px',
            shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
          },
          controls: {
            display: 'flex',
          },
          sliders: {
            padding: '4px 0',
            flex: '1',
          },
          color: {
            width: '24px',
            height: '24px',
            position: 'relative',
            marginTop: '4px',
            marginLeft: '4px',
            borderRadius: '3px',
          },
          activeColor: {
            absolute: '0px 0px 0px 0px',
            borderRadius: '2px',
            background: `rgba(${ rgb.r },${ rgb.g },${ rgb.b },${ rgb.a })`,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
          },
          hue: {
            position: 'relative',
            height: '10px',
            overflow: 'hidden',
          },
          Hue: {
            radius: '2px',
            shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
          },
    
          alpha: {
            position: 'relative',
            height: '10px',
            marginTop: '4px',
            overflow: 'hidden',
          },
          Alpha: {
            radius: '2px',
            shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)',
          },
          ...passedStyles,
        },
        disableAlpha: {
          color: {
            height: '10px',
          },
          hue: {
            height: '10px',
          },
          alpha: {
            display: 'none',
          },
        },
      }, passedStyles)
  const styles = reactCSS(Object.assign(originStyles, passedStyles), { disableAlpha })

  return (
    <div style={ styles.picker } className={ `sketch-picker ${ className }` }>
      <div style={ styles.saturation }>
        <Saturation
          style={ styles.Saturation }
          hsl={ hsl }
          hsv={ hsv }
          onChange={ onChange }
        />
      </div>
      <div style={ styles.controls } className="flexbox-fix">
        <div style={ styles.sliders }>
          <div style={ styles.hue }>
            <Hue
              style={ styles.Hue as CSSProperties }
              hsl={ hsl }
              onChange={ onChange }
            />
          </div>
          <div style={ styles.alpha }>
            <Alpha
              style={ styles.Alpha as CSSProperties }
              rgb={ rgb }
              hsl={ hsl }
              renderers={ renderers }
              onChange={ onChange }
            />
          </div>
        </div>
        <div style={ styles.color }>
          <Checkboard />
          <div style={ styles.activeColor } />
        </div>
      </div>

      <SketchFields
        rgb={ rgb }
        hsl={ hsl }
        hex={ hex }
        onChange={ onChange }
        disableAlpha={ disableAlpha as boolean }
      />
      <SketchPresetColors
        colors={ presetColors }
        onClick={ onChange }
        onSwatchHover={ onSwatchHover }
      />
    </div>
  )
}


Sketch.defaultProps = {
  disableAlpha: false,
  width: 230,
  styles: {},
  presetColors: ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505',
    '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000',
    '#4A4A4A', '#9B9B9B', '#FFFFFF'],
}

export default ColorWrap(Sketch)
