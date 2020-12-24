
import React from 'react'
import {EDI_PREFIX} from './constant'



type IconProps = {
    type:string
    style?:React.CSSProperties
    onClick?:(e?:React.MouseEvent)=>void
}


export default function(props:IconProps){
    const { type, style, onClick } = props;
    return <i style={style} className={`${EDI_PREFIX}icon ${EDI_PREFIX}icon-${type}`} onClick={onClick}></i>
}