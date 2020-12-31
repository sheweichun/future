import {ReactNode} from 'react'


export interface EditItemProps{
    className?:string
    title?:string
    checked?:boolean
    onlyExp?:boolean
    children?:ReactNode
    supportVar?:boolean
    onChange?:(checked:boolean)=>void
}

export interface EditItemState{

}