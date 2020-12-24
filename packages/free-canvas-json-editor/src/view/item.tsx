
import React,{useState} from 'react'
import {Balloon} from '@alife/next'
import {HEADER_CLASS} from './constant'
import Icon from './icon'
import { ValueSchema,OnClickView, BaseComponent } from '../schema'

export type ItemProps = {
    // title?:string
    // desc?:string
    onlyValue?:boolean
    name?:string
    data:ValueSchema
    onlyChild?:boolean
    action?:JSX.Element
    children?:JSX.Element
    view:BaseComponent<any,any>
    getRoot:(el:HTMLElement)=>void
    onClick?:OnClickView
    onCopy?:OnClickView
    onDelete?:OnClickView
}


export default function(props:ItemProps){
    const {data,name,children,onlyChild,onClick,getRoot,action,onCopy,onDelete,view,onlyValue} = props
    const [rootEl,setRootEl] = useState<HTMLElement>()
    const title = data.getTitle()
    const desc = data.getDescription()
    const {focused} = data;
    if(!title || onlyChild){
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
                console.log('scrollIntoView :!!!');
                el.scrollIntoView()
            }
        }
    }

    // useEffect(()=>{
    //     setTimeout(()=>{
    //         rootEl && data.focused && rootEl.scrollIntoView();
    //     })
    // },[data && data.focused])

    return <div 
        ref={initRef}
        style={{
        width:'100%',
        background:focused ? 'var(--HIGHLIGHT_BACKGROUND)' : 'var(--BACKGROUND_1)'}} onClick={onItemClick}>
        <div className={HEADER_CLASS}>  
            <span>{title}({name})</span>
            {desc && <Balloon.Tooltip trigger={<i className="fc-editor-icon fc-editor-icon-wenhao" style={{cursor:'pointer',marginLeft:'2px'}}></i>}>
                {desc}
            </Balloon.Tooltip>}
            {!onlyValue && <div style={{flex:1}}>
                <div style={{float:'right',paddingRight:'6px'}}>
                    {action}
                    <Icon style={{marginLeft:'6px',cursor:'pointer'}} type="copy" onClick={onCopyClick}></Icon>
                    <Icon style={{marginLeft:'6px',cursor:'pointer'}} type="delete" onClick={onDeleteClick}></Icon>
                </div>
            </div>}
        </div>
        <div style={{padding:'4px 0'}}>
            {children}
        </div>
    </div>
}



