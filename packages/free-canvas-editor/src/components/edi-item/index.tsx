import React from 'react'
import {Checkbox} from '@alife/next'
import {EditItemProps,EditItemState} from './type'
import {CLASS_PREFIX} from '../../util/contant'


export {EditItemProps,EditItemState} from './type'

const EDI_ITEM_CLZ = `${CLASS_PREFIX}editItem`
const EDI_ITEM_HEAD_CLZ = `${CLASS_PREFIX}editItem-head`
const EDI_ITEM_CONTENT_CLZ = `${CLASS_PREFIX}editItem-content`
const EDI_ITEM_TITLE_CLZ = `${CLASS_PREFIX}editItem-title`


export function EdiItem(props:EditItemProps){
    const {className,children,title,checked,onChange,supportVar,onlyExp} = props;

    function onCheckChange(val:boolean){
        onChange && onChange(val)
    }
    return <div className={`${EDI_ITEM_CLZ} ${className || ''}`}>
        {title && <div className={`${EDI_ITEM_HEAD_CLZ}`}>
            <div className={EDI_ITEM_TITLE_CLZ}>
                {title}
            </div>
            {supportVar && <div>
                <Checkbox disabled={onlyExp} checked={onlyExp || checked} onChange={onCheckChange}></Checkbox>
                <span>使用变量</span>
            </div>}
        </div>}
        <div className={EDI_ITEM_CONTENT_CLZ}>
            {children}
        </div>
    </div>
}