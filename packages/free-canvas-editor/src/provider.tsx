import React from 'react'
import {ModelPropSchemaMap} from 'free-canvas-shared'




export const GlobalContext = React.createContext({}) 
export interface GlobalModel{
    propSchemaMap:ModelPropSchemaMap
}



export interface ProviderProps{
    
}

export interface ProviderState{
    globalContext:GlobalModel
}

export class Provider extends React.Component<ProviderProps,ProviderState>{
    constructor(props:ProviderProps){
        super(props);
        this.state = {
            globalContext:{
                propSchemaMap:{}
            }
        }
    }
    render(){
        const {globalContext} = this.state;
        return <GlobalContext.Provider value={globalContext}>
            {this.props.children}
        </GlobalContext.Provider>
    }
}