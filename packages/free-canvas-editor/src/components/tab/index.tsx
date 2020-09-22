import React from 'react'
import {TabProps,TabState} from './type'
import {CLASS_PREFIX} from '../../util/contant'


export {TabProps,TabState,TabDataItem} from './type'

const TAB_CLZ = `${CLASS_PREFIX}tab`
const TAB_ITEM_CLZ = `${CLASS_PREFIX}tab-item`
const TAB_ACTIVE_ITEM_CLZ = `${CLASS_PREFIX}tab-active-item`


export function Tab(props:TabProps){
    const {index,data,onChange} = props;


    return <div className={TAB_CLZ}>
        <ul>
            {
                data.map((item,key)=>{
                    return <li key={key} onClick={onChange.bind(null,key)} className={`${TAB_ITEM_CLZ} ${key === index? TAB_ACTIVE_ITEM_CLZ:''}`}>{item.label}</li>
                })
            }
        </ul>
    </div>
}