import React from 'react';
import {ThemeVar} from 'free-canvas-theme'
import {Button} from '../button/index'
import {CLASS_PREFIX} from '../util/contant'
import {HeadProps,HeadState} from './type'


export {HeadProps,HeadState} from './type'
const {HEAD,ASIDE,PANEL} = ThemeVar
const {backgroundColor,height} = HEAD

const HEADER_CLZ = `${CLASS_PREFIX}header`
const HEADER_LEFT_CLZ = `${CLASS_PREFIX}header-left`
const HEADER_MIDDLE_CLZ = `${CLASS_PREFIX}header-middle`
const HEADER_RIGHT_CLZ = `${CLASS_PREFIX}header-right`

const HEADER_MIDDLEL_CLZ = `${CLASS_PREFIX}header-middlel`
const HEADER_MIDDLEM_CLZ = `${CLASS_PREFIX}header-middlem`
const HEADER_MIDDLER_CLZ = `${CLASS_PREFIX}header-middler`

export class Header extends React.Component<HeadProps,HeadState>{
    constructor(props:HeadProps){
        super(props);
    }
    render(){
        const {className} = this.props;
        return <header className={`${HEADER_CLZ} ${className || ''}`} style={{
            backgroundColor:backgroundColor,
            height:height}}>
            <div className={HEADER_LEFT_CLZ} style={{width:ASIDE.width}}>
                left
            </div>
            <div className={HEADER_MIDDLE_CLZ}>
                <div className={HEADER_MIDDLEL_CLZ}>
                    <Button>test</Button>
                </div>
                <div className={HEADER_MIDDLEM_CLZ}>
                    center
                </div>
                <div className={HEADER_MIDDLER_CLZ}>
                    right
                </div>
            </div>
            <div className={HEADER_RIGHT_CLZ} style={{width:PANEL.width}}>
                right
            </div>
        </header>
    }
}

