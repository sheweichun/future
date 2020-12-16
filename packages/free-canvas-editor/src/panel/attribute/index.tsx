import React from 'react'
// import {Overlay} from '@alife/next'
import {IMutation, Model,ModelPropComponentType,ModelPropSchema,RenderVarInput} from 'free-canvas-shared'
import {TabDataItem} from '../../components/tab/type'
import {EdiItem} from '../../components/index'
import {CLASS_PREFIX} from '../../util/contant'
import {Measure,Color,SelectAttr,TextAttr,SwitchAttr} from './components/index'
import {extractSchemaList} from './schemaMap'
import {ModelIdMap} from '../type'
export interface AttrbuteProps{
    tabData:TabDataItem
    mutation:IMutation
    modelData:Model[]
    renderVarInput?:RenderVarInput
    modelIdMap:ModelIdMap
}

export interface AttrbuteState{
    selectModel:Model,
    propsSchemas:ModelPropSchema[]
}


const ATTRIBUTE_CLZ = `${CLASS_PREFIX}attribute`


function props2State(props:AttrbuteProps,defaultValue?:any):AttrbuteState{
    const {modelData,modelIdMap} = props;
    // console.log('modelData len :',modelData.length);
    if(modelData.length >= 1){
        return {
            selectModel:modelData[0],
            propsSchemas:extractSchemaList(modelData,modelIdMap)
        }
    }
    return defaultValue
}

export class Attribute extends React.Component<AttrbuteProps,AttrbuteState>{
    constructor(props:AttrbuteProps){
        super(props)
        this.state = props2State(props,{})
    }
    static getDerivedStateFromProps(nextProps:AttrbuteProps,prevState:AttrbuteState){
        return props2State(nextProps)
    }
    renderByPropSchema(propSchema:ModelPropSchema,index:number){
        const {modelData,mutation,renderVarInput} = this.props;
        const {selectModel} = this.state;
        const {type} = propSchema;
        if(type === ModelPropComponentType.xywh){
            return <Measure renderVarInput={renderVarInput} modelData={modelData} selectModel={selectModel} schema={propSchema} mutation={mutation}></Measure>
        }else if(type === ModelPropComponentType.backgroundColor){
            return <Color renderVarInput={renderVarInput}  modelData={modelData} selectModel={selectModel} schema={propSchema} mutation={mutation}></Color>
        }else if(type === ModelPropComponentType.select){
            return <SelectAttr renderVarInput={renderVarInput} modelData={modelData} selectModel={selectModel} schema={propSchema} mutation={mutation}></SelectAttr>
        }else if(type === ModelPropComponentType.text){
            return <TextAttr renderVarInput={renderVarInput} modelData={modelData} selectModel={selectModel} schema={propSchema} mutation={mutation}></TextAttr>
        }else if(type === ModelPropComponentType.switch){
            return <SwitchAttr renderVarInput={renderVarInput} modelData={modelData} selectModel={selectModel} schema={propSchema} mutation={mutation}></SwitchAttr>
        }
        return 'nothing'
    }
    render(){
        const {modelData} = this.props;
        const {propsSchemas} = this.state;
        const hasSelected = modelData && modelData.length > 0
        return <div className={ATTRIBUTE_CLZ}>
            {
                (hasSelected && propsSchemas) && propsSchemas.map((propSchema:ModelPropSchema,key:number)=>{
                    // const data = propSchema.get()
                    // return <EdiItem key={key} title={propSchema.title} >
                    //     {
                    //         this.renderByPropSchema(propSchema)
                    //     }
                    // </EdiItem>
                    return this.renderByPropSchema(propSchema,key)
                    
                })
            }

        </div>
    }
}