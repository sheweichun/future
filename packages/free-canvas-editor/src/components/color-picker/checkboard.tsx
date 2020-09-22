import React, { CSSProperties, isValidElement,ReactNode } from 'react'
import reactCSS from 'reactcss'


const checkboardCache:{[key:string]:string} = {}

export const render = (c1:string, c2:string, size:number, serverCanvas: HTMLCanvasElement) => {
//   const canvas = serverCanvas ? new OffscreenCanvas(size,size) : document.createElement('canvas')
  const canvas =  document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size * 2
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return null
  } // If no context can be found, return early.
  ctx.fillStyle = c1
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = c2
  ctx.fillRect(0, 0, size, size)
  ctx.translate(size, size)
  ctx.fillRect(0, 0, size, size)
  return canvas.toDataURL()
}

export const get = (c1:string, c2:string, size:number, serverCanvas:HTMLCanvasElement) => {
  const key = `${ c1 }-${ c2 }-${ size }${ serverCanvas ? '-server' : '' }`

  if (checkboardCache[key]) {
    return checkboardCache[key]
  }

  const checkboard = render(c1, c2, size, serverCanvas)
  checkboardCache[key] = checkboard
  return checkboard
}


export interface CheckboardProps{
    white?:string, 
    grey?:string, 
    size?:number, 
    renderers?:{canvas:any}, 
    borderRadius?:string, 
    boxShadow?:string, 
    children?:ReactNode
}

export function Checkboard(props:CheckboardProps){
  const { white, grey, size, renderers, borderRadius, boxShadow, children } = props;
  const styles = reactCSS({
    'default': {
      grid: {
        borderRadius,
        boxShadow,
        //@ts-ignore
        absolute: '0px 0px 0px 0px',
        background: `url(${ get(white, grey, size, renderers.canvas) }) center left`,
      },
    },
  })
  return isValidElement(children)?React.cloneElement(children, { ...children.props, style: {...children.props.style,...styles.grid}}):<div style={styles.grid}/>;
}

Checkboard.defaultProps = {
  size: 8,
  white: 'transparent',
  grey: 'rgba(0,0,0,.08)',
  renderers: {},
}

export default Checkboard
