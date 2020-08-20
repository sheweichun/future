import React from 'react'
import {ThemeVar} from 'free-canvas-theme'
import {PanelProps,PanelState} from './type'

const {backgroundColor,width,color} = ThemeVar.PANEL
export {PanelProps,PanelState} from './type'
export class Panel extends React.Component<PanelProps,PanelState>{
    constructor(props:PanelProps){
        super(props);
    }
    render(){
        const {className} = this.props;
        return <div className={className} style={{
            backgroundColor:backgroundColor,
            width,
            color
        }}>
            panel
        </div>
    }
}