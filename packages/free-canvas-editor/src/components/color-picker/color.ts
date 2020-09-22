import tinycolor from 'tinycolor2'
import {ColorData,ColorDataAttr} from './color-model';


export const simpleCheckForValidColor = (data:ColorData) => {
  const keysToCheck:ColorDataAttr[] = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v']
  let checked = 0
  let passed = 0
  keysToCheck.forEach((letter:ColorDataAttr)=>{
    const value = data[letter]
    if (value) {
      checked += 1
      if (!isNaN(value as number)) {
        passed += 1
      }
      if (letter === 's' || letter === 'l') {
        const percentPatt = /^\d+%$/
        if (percentPatt.test(value + '')) {
          passed += 1
        }
      }
    }
  })
  return (checked === passed) ? data : false
}

export const toState = (data:ColorData, oldHue?:number) => {
  const color = data.hex ? tinycolor(data.hex) : tinycolor(data)
  const hsl = color.toHsl()
  const hsv = color.toHsv()
  const rgb = color.toRgb()
  const hex = color.toHex()
  if (hsl.s === 0) {
    hsl.h = oldHue || 0
    hsv.h = oldHue || 0
  }
  const transparent = hex === '000000' && rgb.a === 0

  return {
    hsl,
    hex: transparent ? 'transparent' : `#${ hex }`,
    rgb,
    hsv,
    oldHue: data.h || oldHue || hsl.h,
    source: data.source,
  }
}

export const isValidHex = (hex:string) => {
  if (hex === 'transparent') {
    return true
  }
  // disable hex4 and hex8
  const lh = (String(hex).charAt(0) === '#') ? 1 : 0
  return hex.length !== (4 + lh) && hex.length < (7 + lh) && tinycolor(hex).isValid()
}

export const getContrastingColor = (data:ColorData) => {
  if (!data) {
    return '#fff'
  }
  const col = toState(data)
  if (col.hex === 'transparent') {
    return 'rgba(0,0,0,0.4)'
  }
  const yiq = ((col.rgb.r * 299) + (col.rgb.g * 587) + (col.rgb.b * 114)) / 1000
  return (yiq >= 128) ? '#000' : '#fff'
}

export const red = {
  hsl: { a: 1, h: 0, l: 0.5, s: 1 },
  hex: '#ff0000',
  rgb: { r: 255, g: 0, b: 0, a: 1 },
  hsv: { h: 0, s: 1, v: 1, a: 1 },
}

export const isvalidColorString = (string:string, type:string) => {
  const stringWithoutDegree = string.replace('°', '')
  //@ts-ignore
  return tinycolor(`${ type } (${ stringWithoutDegree })`)._ok
}

export default exports
