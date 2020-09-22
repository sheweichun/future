import React, { CSSProperties } from 'react'
import reactCSS from 'reactcss'

import { Swatch } from './swatch'

export function SketchPresetColors({ colors, onClick = () => {}, onSwatchHover }:any){
  const styles = reactCSS({
    'default': {
      colors: {
        margin: '0 -10px',
        padding: '10px 0 0 10px',
        borderTop: '1px solid #eee',
        display: 'flex',
        flexWrap: 'wrap',
        position: 'relative',
      },
      swatchWrap: {
        width: '16px',
        height: '16px',
        margin: '0 10px 10px 0',
      },
      swatch: {
        borderRadius: '3px',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
      },
    },
    'no-presets': {
        //@ts-ignore
      colors: {
        display: 'none',
      },
    },
  }, {
    'no-presets': !colors || !colors.length,
  })

  const handleClick = (hex:any, e:any) => {
    onClick({
      hex,
      source: 'hex',
    }, e)
  }

  return (
    <div style={ styles.colors as CSSProperties } className="flexbox-fix">
      { colors.map((colorObjOrString:any) => {
        const c = typeof colorObjOrString === 'string'
          ? { color: colorObjOrString }
          : colorObjOrString
        const key = `${c.color}${c.title || ''}`
        return (
          <div key={ key } style={ styles.swatchWrap }>
            <Swatch
              { ...c }
              style={ styles.swatch }
              onClick={ handleClick }
              onHover={ onSwatchHover }
              focusStyle={{
                boxShadow: `inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ${ c.color }`,
              }}
            />
          </div>
        )
      }) }
    </div>
  )
}



export default SketchPresetColors
