import React from 'react'
import reactCSS from 'reactcss'

import Checkboard from './Checkboard'

const ENTER = 13


export function handleFocus(Component:any, Span:any = 'span'){
  return class Focus extends React.Component {
    state = { focus: false }
    handleFocus = () => this.setState({ focus: true })
    handleBlur = () => this.setState({ focus: false })

    render() {
      return (
        <Span onFocus={ this.handleFocus } onBlur={ this.handleBlur }>
          <Component { ...this.props } { ...this.state } />
        </Span>
      )
    }
  }
}


export function Swatch({ color, style, onClick = () => {}, onHover, title = color,
  children, focus, focusStyle = {} }:any){
  const transparent = color === 'transparent'
  const styles = reactCSS({
    default: {
      swatch: {
        background: color,
        height: '100%',
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        outline: 'none',
        ...style,
        ...(focus ? focusStyle : {}),
      },
    },
  })

  const handleClick = (e:any) => onClick(color, e)
  const handleKeyDown = (e:any) => e.keyCode === ENTER && onClick(color, e)
  const handleHover = (e:any) => onHover(color, e)

  const optionalEvents:{onMouseOver?:any} = {}
  if (onHover) {
    optionalEvents.onMouseOver = handleHover
  }

  return (
    <div
      style={ styles.swatch }
      onClick={ handleClick }
      title={ title }
      tabIndex={ 0 }
      onKeyDown={ handleKeyDown }
      { ...optionalEvents }
    >
      { children }
      { transparent && (
        <Checkboard
          borderRadius={ styles.swatch.borderRadius }
          boxShadow="inset 0 0 0 1px rgba(0,0,0,0.1)"
        />
      ) }
    </div>
  )
}

export default handleFocus(Swatch)
