import React from 'react'
import {AttrPropType,AttrStateType} from 'free-canvas-shared'







export function getRenderValue(props:AttrPropType){
    const {modelData,schema} = props;
    let value = schema.get(modelData[0]);
    for(let i = 0 ; i < modelData.length; i++){
        const md = modelData[i];
        const curVal = schema.get(md);
        if(value != null && curVal != null && 
            value.value !== curVal.value && 
            value.isExp !== curVal.isExp &&
            value.enable !== curVal.enable &&
            value.expression !== curVal.expression){
            value = null
            break;
        }
    }
    return value
}

export function getDerivedStateFromProps<T extends AttrPropType,V extends AttrStateType>(nextProps:T,prevState:V){
    return Object.assign({},prevState,{
        value:getRenderValue(nextProps)
    })
}

export class BaseComponent<T extends AttrPropType,V extends AttrStateType> extends React.Component<T,V>{
    constructor(props:T){
        super(props)
    }
    protected _onChangeExp=(checked:boolean)=>{
        const {schema,mutation} = this.props;
        const {expression,disabled,value} = this.state.value
        schema.update(mutation,{
            isExp:checked,
            expression,
            value,
            disabled
        })
    }
}


// function HocBaseComponent<T extends AttrPropType,V>(Component:React.ComponentType<T>) {
//     // type V = React.ComponentType<T> & IPlugin;
//     // type U =  T & {runTask(plugin:IPlugin):void};
//     class HocComponent extends React.Component<T>{
//         public ins:V
//         constructor(props:T){
//             super(props);
//         }
//         render(){
//             const {runTask,...others} = this.props
//             const newProps:T = others as T
//             return <Component ref={this.initRef} {...newProps}></Component>
//         }
//     }
//     return HocComponent;
// }