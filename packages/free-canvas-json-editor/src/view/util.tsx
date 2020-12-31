
import { JSON_PROPERTY_TYPES } from 'free-canvas-shared';
import React from 'react'
import {ArraySchema, BooleanSchema, NumberSchema, ObjectSchema,StringSchema,ValueSchema,OnClickView} from '../schema'
import ArrayView from './array_view'
import StringView from './string_view'
import NumberView from './number_view'
import BooleanView from './boolean_view'
import ObjectView from './object_view'

export const ROOT_IDENTIFY = '@root@'
export type RenderViewOpt = {
    onlyChild?:boolean
    isRequired?:boolean
    onClickView?:OnClickView
    onCopy?:OnClickView
    onDelete?:OnClickView
}

export function renderView(val:ValueSchema,name:string,opt:RenderViewOpt={}){
    const {onlyChild,onClickView,...others} = opt
    switch(val._type){
        case JSON_PROPERTY_TYPES.string:
            return <StringView 
            key={name}
            name={name}
            value={val as StringSchema} 
            onClickView={onClickView}
            {...others}
            onlyChild={onlyChild} ></StringView>
        case JSON_PROPERTY_TYPES.number:
            return <NumberView 
            key={name}
            name={name}
            value={val as NumberSchema} 
            onClickView={onClickView}
            {...others}
            onlyChild={onlyChild}></NumberView>
        case JSON_PROPERTY_TYPES.boolean:
            return <BooleanView 
            key={name}
            name={name}
            value={val as BooleanSchema} 
            onClickView={onClickView}
            {...others}
            onlyChild={onlyChild}></BooleanView>
        case JSON_PROPERTY_TYPES.object:
            return <ObjectView 
            key={name}
            name={name}
            value={val as ObjectSchema} 
            onClickView={onClickView}
            {...others}
            onlyChild={onlyChild}></ObjectView>
        case JSON_PROPERTY_TYPES.array:
            return <ArrayView 
            key={name}
            name={name}
            value={val as ArraySchema} 
            onClickView={onClickView}
            {...others}
            onlyChild={onlyChild}></ArrayView>
    }
}

