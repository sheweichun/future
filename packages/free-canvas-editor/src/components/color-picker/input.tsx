import React, { Component, CSSProperties, PureComponent } from 'react'
import reactCSS from 'reactcss'

const DEFAULT_ARROW_OFFSET = 1

const UP_KEY_CODE = 38
const DOWN_KEY_CODE = 40
const VALID_KEY_CODES = [
  UP_KEY_CODE,
  DOWN_KEY_CODE
]
const isValidKeyCode = (keyCode:number) => VALID_KEY_CODES.indexOf(keyCode) > -1
const getNumberValue = (value:any) => Number(String(value).replace(/%/g, ''))

let idCounter = 1

export interface EditableInputProps{
    value?:any
    label?:string
    arrowOffset?:number
    dragLabel?:boolean
    hideLabel?:boolean
    dragMax?:number
    style?:any
    placeholder?:string
    onChange?:(data:any,e:any)=>void
}

export interface EditableInputState{
    value:any
    blurValue:string
}

export class EditableInput extends PureComponent<EditableInputProps,EditableInputState> {
    inputId:string
    input:HTMLElement
  constructor(props:EditableInputProps) {
    super(props)

    this.state = {
      value: String(props.value).toUpperCase(),
      blurValue: String(props.value).toUpperCase(),
    }

    this.inputId = `rc-editable-input-${idCounter++}`
  }

  componentDidUpdate(prevProps:EditableInputProps, prevState:EditableInputProps) {
    if (
      this.props.value !== this.state.value &&
      (prevProps.value !== this.props.value || prevState.value !== this.state.value)
    ) {
      if (this.input === document.activeElement) {
        this.setState({ blurValue: String(this.props.value).toUpperCase() })
      } else {
        this.setState({ value: String(this.props.value).toUpperCase(), blurValue: !this.state.blurValue && String(this.props.value).toUpperCase() })
      }
    }
  }

  componentWillUnmount() {
    this.unbindEventListeners()
  }

  getValueObjectWithLabel(value:any) {
    return {
      [this.props.label]: value
    }
  }

  handleBlur = () => {
    if (this.state.blurValue) {
      this.setState({ value: this.state.blurValue, blurValue: null })
    }
  }

  handleChange = (e:any) => {
    this.setUpdatedValue(e.target.value, e)
  }

  getArrowOffset() {
    return this.props.arrowOffset || DEFAULT_ARROW_OFFSET
  }

  handleKeyDown = (e:any) => {
    // In case `e.target.value` is a percentage remove the `%` character
    // and update accordingly with a percentage
    // https://github.com/casesandberg/react-color/issues/383
    const value = getNumberValue(e.target.value)
    if (!isNaN(value) && isValidKeyCode(e.keyCode)) {
      const offset = this.getArrowOffset()
      const updatedValue = e.keyCode === UP_KEY_CODE ? value + offset : value - offset

      this.setUpdatedValue(updatedValue + '', e)
    }
  }

  setUpdatedValue(value:string, e:any) {
    const onChangeValue = this.props.label ? this.getValueObjectWithLabel(value) : value
    this.props.onChange && this.props.onChange(onChangeValue, e)

    this.setState({ value })
  }

  handleDrag = (e:any) => {
    if (this.props.dragLabel) {
      const newValue = Math.round(this.props.value + e.movementX)
      if (newValue >= 0 && newValue <= this.props.dragMax) {
        this.props.onChange && this.props.onChange(this.getValueObjectWithLabel(newValue), e)
      }
    }
  }

  handleMouseDown = (e:any) => {
    if (this.props.dragLabel) {
      e.preventDefault()
      this.handleDrag(e)
      window.addEventListener('mousemove', this.handleDrag)
      window.addEventListener('mouseup', this.handleMouseUp)
    }
  }

  handleMouseUp = () => {
    this.unbindEventListeners()
  }

  unbindEventListeners = () => {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    const styles:any = reactCSS({
      'default': {
        wrap: {
          position: 'relative',
        },
      },
      'user-override': {
        wrap: this.props.style && this.props.style.wrap ? this.props.style.wrap : {},
        //@ts-ignore
        input: this.props.style && this.props.style.input ? this.props.style.input : {},
        label: this.props.style && this.props.style.label ? this.props.style.label : {},
      },
      'dragLabel-true': {
        //@ts-ignore
        label: {
          cursor: 'ew-resize',
        },
      },
    }, {
      'user-override': true,
    }, this.props)

    return (
      <div style={ styles.wrap as CSSProperties }>
        <input
          id={ this.inputId }
          style={ styles.input as CSSProperties}
          ref={ input => this.input = input }
          value={ this.state.value }
          onKeyDown={ this.handleKeyDown }
          onChange={ this.handleChange }
          onBlur={ this.handleBlur }
          placeholder={ this.props.placeholder }
          spellCheck="false"
        />
        { this.props.label && !this.props.hideLabel ? (
          <label
            htmlFor={ this.inputId }
            style={ styles.label as CSSProperties }
            onMouseDown={ this.handleMouseDown }
          >
            { this.props.label }
          </label>
        ) : null }
      </div>
    )
  }
}

export default EditableInput
