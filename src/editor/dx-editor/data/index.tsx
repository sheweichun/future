import {Model,ModelPropSchema,IMutation,ModelAttrValue} from '@pkg/free-canvas-shared'
import React from 'react'
import {Select} from '@alife/next'




function onChange(data:Model[],schema:ModelPropSchema,mut:IMutation,state:ModelAttrValue,value:any){
    const {update} = schema
    update(mut,Object.assign({},state,{
        expression:value,
        value
    }))
}



export function renderVarInput(data:Model[],schema:ModelPropSchema,mut:IMutation,state:ModelAttrValue){
    const selectOnChange = onChange.bind(null,data,schema,mut,state)
    return <Select.AutoComplete style={{width:'100%'}} value={state.expression} onChange={selectOnChange}>

    </Select.AutoComplete>
}