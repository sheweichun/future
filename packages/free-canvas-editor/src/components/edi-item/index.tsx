import React from 'react'
import {EditItemProps,EditItemState} from './type'
import {CLASS_PREFIX} from '../../util/contant'


export {EditItemProps,EditItemState} from './type'

const EDI_ITEM_CLZ = `${CLASS_PREFIX}editItem`
const EDI_ITEM_HEAD_CLZ = `${CLASS_PREFIX}editItem-head`
const EDI_ITEM_CONTENT_CLZ = `${CLASS_PREFIX}editItem-content`
const EDI_ITEM_TITLE_CLZ = `${CLASS_PREFIX}editItem-title`


export function EdiItem(props:EditItemProps){
    const {className,children,title} = props;


    return <div className={`${EDI_ITEM_CLZ} ${className || ''}`}>
        {title && <div className={`${EDI_ITEM_HEAD_CLZ}`}>
            <div className={EDI_ITEM_TITLE_CLZ}>
                {title}
            </div>
        </div>}
        <div className={EDI_ITEM_CONTENT_CLZ}>
            {children}
        </div>
    </div>
}