
import React from 'react';
import {IconProps} from './type'
import {CLASS_PREFIX} from '../util/contant'

const ICON_CLASS = `${CLASS_PREFIX}icon`

export function Icon(props:IconProps){
    const {type,style,className,...others} = props;
    return <i className={`${ICON_CLASS} ${ICON_CLASS}-${type} ${className || ''}`} style={style} {...others}>
    </i>
}