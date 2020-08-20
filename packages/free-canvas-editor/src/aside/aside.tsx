import React from 'react'
import {ThemeVar} from 'free-canvas-theme'
import {AsideState,AsideProps} from './type'
import {CLASS_PREFIX} from '../util/contant'
const {ASIDE} = ThemeVar

export class Aside extends React.Component<AsideProps,AsideState>{
    constructor(props:AsideProps){
        super(props);
    }
    render(){
        const {className,children} = this.props;
        return <aside className={`${CLASS_PREFIX}aside ${className || ''}`} style={{
            width:ASIDE.width,
            backgroundColor:ASIDE.backgroundColor,
            color:ASIDE.color}}>
            {children}
        </aside>
    }
}