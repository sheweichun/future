import React,{MouseEvent} from 'react'

export interface IconProps{
    type:string,
    className?:string,
    onClick?:(event: MouseEvent) => void
    // onClick?:
    style?:React.CSSProperties
}