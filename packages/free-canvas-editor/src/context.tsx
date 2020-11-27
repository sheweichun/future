import React from 'react'
import {ModelPropSchemaMap} from 'free-canvas-shared'
// export  const GlobalContextValue = {
// }
// export const GlobalContext = React.createContext(GlobalContextValue) 
export interface GlobalModel{
    propSchemaMap:ModelPropSchemaMap
}

export function createGlobalContext(model:GlobalModel){
    return {
        GlobalContext:React.createContext(model),
        GlobalContextValue:model
    }
}