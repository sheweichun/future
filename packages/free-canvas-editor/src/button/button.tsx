import React from 'react'
import {ThemeVar} from 'free-canvas-theme'
import {ButtonProps,ButtonState} from './type'
import {CLASS_PREFIX} from '../util/contant'
const {padding} = ThemeVar.BUTTON


export class Button extends React.Component<ButtonProps,ButtonState>{
    constructor(props:ButtonProps){
        super(props);
    }
    render(){
        const {className,children} = this.props;
        return <div className={`${CLASS_PREFIX}button ${className || ''}`} style={{
            padding
        }}>
            {children}
        </div>
    }
}