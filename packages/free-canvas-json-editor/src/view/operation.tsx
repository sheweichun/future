import React from 'react'
import {Input,Radio} from '@alife/next'
import {JSON_PROPERTY_TYPES} from 'free-canvas-shared'
import {OnClickView, ValueSchema} from '../schema'
import {PREFIX} from './constant'

const {Group:RadioGroup} = Radio
export type OperationProps = {
    data:ValueSchema
    onChangeHover:OnClickView
    name:string
}

export type OperationState = {

}


const OPERATION_CLASS = `${PREFIX}operation`



const ITEM_GAP = '12px'

function renderString(name:string,value:string,onChange:(val:string)=>void){
    return <div style={{display:'flex',marginBottom:ITEM_GAP}}>
        <div style={{width:'100px',display:'flex',justifyContent:'flex-end',alignItems:'center',paddingRight:'8px'}}>
            {name}
        </div>
        <div style={{flex:1}}>
            <Input value={value} onChange={onChange}></Input>
        </div>
    </div>
}


function renderRadio(name:string,value:string,dataSource:{value:string,label:string}[],onChange:(val:string)=>void){
    return <div style={{display:'flex',marginBottom:ITEM_GAP}}>
        <div style={{width:'100px',display:'flex',justifyContent:'flex-end',alignItems:'center',paddingRight:'8px'}}>
            {name}
        </div>
        <div style={{flex:1}}>
            <RadioGroup dataSource={dataSource} value={value} onChange={onChange}/>
        </div>
    </div>
}


const TYPE_DATASOURCE = [
    {
        label:'字符串',
        value:JSON_PROPERTY_TYPES.string
    },{
        label:'数值',
        value:JSON_PROPERTY_TYPES.number
    },{
        label:'布尔值',
        value:JSON_PROPERTY_TYPES.boolean
    },{
        label:'对象',
        value:JSON_PROPERTY_TYPES.object
    },{
        label:'数组',
        value:JSON_PROPERTY_TYPES.array
    }
]

export default class Operation extends React.Component<OperationProps,OperationState>{
    constructor(props:OperationProps){
        super(props)
    }
    onChangeName=(val:string)=>{
        const {name,data,onChangeHover} = this.props;
        data.changeName(name,val);
        onChangeHover(data,val,null)
    }
    onChangeType=(type:string)=>{
        const {name,data,onChangeHover} = this.props;
        const newSchema = data.changeType(name,type as JSON_PROPERTY_TYPES);
        if(newSchema == null) return
        onChangeHover(newSchema,name,null)
    }
    onChangeDescription=(desc:string)=>{
        const {data} = this.props;
        data.changeDescription(desc)
    }
    onChangeFormat=(format:string)=>{
        const {data} = this.props;
        data.changeFormat(format)
    }
    onChangeTitle=(title:string)=>{
        const {data} = this.props;
        data.changeTitle(title)
    }
    renderContent(){
        const {name,data} = this.props;
        console.log('name :',name);
        return <div style={{
                    width:'100%',
                    height:'100%'
                    // gridTemplateColumns:'100px  auto',
                    // gridAutoRows:'auto',
                    // display:'grid'
                }
            }>
            {renderString('字段英文名',name,this.onChangeName)}
            {renderString('字段中文名',data.getTitle(),this.onChangeTitle)}
            {renderString('字段描述',data.getDescription(),this.onChangeDescription)}
            {renderRadio('字段类型',data._type,TYPE_DATASOURCE,this.onChangeType)}
        </div>
    }
    render(){
        const {data} = this.props
        return <div className={OPERATION_CLASS}>
            <div style={{
                fontSize:'14px',
                background:'var(--BACKGROUND_0)',
                marginBottom:'12px',
                padding:'8px 12px'}}>数据schema</div>
            {data && this.renderContent()}
        </div>
    }
}