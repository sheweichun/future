import {Model,ModelPropSchema,IMutation} from '@pkg/free-canvas-shared'
import React from 'react'
import {Select} from '@alife/next'

export function renderVarInput(data:Model[],schema:ModelPropSchema,mut:IMutation){
    return <Select style={{width:'100%'}} showSearch>

    </Select>
}