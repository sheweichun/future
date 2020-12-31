
import React,{useState} from 'react'
import {Balloon} from '@alife/next'
import {HEADER_CLASS} from './constant'
import {ROOT_IDENTIFY} from './util'
import Icon from './icon'
import { ValueSchema,OnClickView, BaseComponent } from '../schema'

export type ItemProps = {
    // title?:string
    // desc?:string
    noIcon?:boolean
    onlyValue?:boolean
    name?:string
    isRequired?:boolean
    data:ValueSchema
    onlyChild?:boolean
    action?:JSX.Element
    children?:JSX.Element
    view:BaseComponent<any,any>
    getRoot:(el:HTMLElement)=>void
    onClick?:OnClickView
    getRootEl?:()=>HTMLElement
    onCopy?:OnClickView
    onDelete?:OnClickView
}


function isOverLap(left:number,top:number,right:number,bottom:number,
    left1:number,top1:number,right1:number,bottom1:number){
    return (right  > left1 &&
        right1  > left &&
        bottom > top1 &&
        bottom1 > top
    )
}

export default function(props:ItemProps){
    const {data,name,children,onlyChild,onClick,getRoot,action,onCopy,onDelete,view,onlyValue,getRootEl,isRequired,noIcon} = props
    const [rootEl,setRootEl] = useState<HTMLElement>()
    const title = data.getTitle()
    const desc = data.getDescription()
    const {focused} = data;
    const isRoot = name === ROOT_IDENTIFY
    if(!name || onlyChild){
        return <div style={{width:'100%'}}>
            {children}
        </div>
    }
    function onItemClick(e:React.MouseEvent){
        e.stopPropagation()
        onClick && onClick(data,name,view)
    }

    function onDeleteClick(e:React.MouseEvent){
        e.stopPropagation()
        onDelete && onDelete(data,name,view)
    }

    function onCopyClick(e:React.MouseEvent){
        e.stopPropagation()
        onCopy && onCopy(data,name,view)
    } 
    
    function initRef(el:HTMLElement){
        if(el && !rootEl){
            getRoot(el);
            setRootEl(el);
            if(data && data.focused){
                const rootEl = getRootEl();
                if(rootEl == null) return;
                const rootElRect = rootEl.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                if(!isOverLap(
                    rootElRect.left,rootElRect.top,rootElRect.right,rootElRect.bottom,
                    elRect.left,elRect.top,elRect.right,elRect.bottom)){
                    setTimeout(()=>{
                        el.scrollIntoView()
                    })
                }
            }
        }
    }

    return <div 
        ref={initRef}
        style={{
        width:'100%',
        background:focused ? 'var(--HIGHLIGHT_BACKGROUND)' : 'var(--BACKGROUND_1)'}} onClick={onItemClick}>
        <div className={HEADER_CLASS}> 
            {isRequired ? <span style={{color:'red',marginRight:'4px',position: 'relative',top: '2px'}}>*</span>:''}
                <span>{title}{isRoot ? '' : `(${name})`}</span>
            {desc && <Balloon.Tooltip trigger={<i className="fc-editor-icon fc-editor-icon-wenhao" style={{cursor:'pointer',marginLeft:'2px'}}></i>}>
                {desc}
            </Balloon.Tooltip>}
            {!onlyValue && <div style={{flex:1}}>
                <div style={{float:'right',paddingRight:'6px'}}>
                    {action}
                    {!noIcon && <Icon style={{marginLeft:'6px',cursor:'pointer'}} type="copy" onClick={onCopyClick}></Icon>}
                    {!noIcon && <Icon style={{marginLeft:'6px',cursor:'pointer'}} type="delete" onClick={onDeleteClick}></Icon>}
                </div>
            </div>}
        </div>
        <div style={{padding:'4px 0'}}>
            {children}
        </div>
    </div>
}



