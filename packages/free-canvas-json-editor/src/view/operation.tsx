import React from 'react'
import {Input,Radio, Switch} from '@alife/next'
import {JSON_PROPERTY_TYPES} from 'free-canvas-shared'
import {ArraySchema, ObjectSchema, OnClickView, ValueSchema} from '../schema'
import {PREFIX} from './constant'

const {Group:RadioGroup} = Radio
export type OperationProps = {
    data:ValueSchema
    onChangeHover:OnClickView
    name:string
}

export type OperationState = {
    value:string
}


const OPERATION_CLASS = `${PREFIX}operation`



const ITEM_GAP = '12px'



//由于值更新是异步的 受控输入组件会导致中文无法输入
// function renderString(name:string,value:string,onChange:(val:string)=>void){
//     return <div style={{display:'flex',marginBottom:ITEM_GAP}}>
//         <div style={{width:'100px',display:'flex',justifyContent:'flex-end',alignItems:'center',paddingRight:'8px'}}>
//             {name}
//         </div>
//         <div style={{flex:1}}>
//             <Input defaultValue={value} onChange={onChange}></Input>
//         </div>
//     </div>
// }

type StringViewProps = {
    name:string,value:string,onChange:(val:string)=>void
}

type StringViewState = {
    value:string
    stateValue:string
}

class StringView extends React.Component<StringViewProps,StringViewState>{
    constructor(props:StringViewProps){
        super(props);
    }
    static getDerivedStateFromProps(nextProps:StringViewProps, state:StringViewState) {
        const propValue = nextProps.value
        if(state == null){
            return {
                value:propValue,
                stateValue:propValue
            }
        }
        const {value,stateValue} = state;
        if(value === propValue){
            return {
                value:stateValue,
                stateValue
            }
        }
        return {
            value:propValue,
            stateValue:propValue
        }
    }
    onChange=(val:string)=>{
        const {onChange} = this.props;
        onChange && onChange(val)
        this.setState({
            stateValue:val
        })
    }
    render(){
        const {name} = this.props
        const {value} = this.state
        return <div style={{display:'flex',marginBottom:ITEM_GAP}}>
            <div style={{width:'100px',display:'flex',justifyContent:'flex-end',alignItems:'center',paddingRight:'8px'}}>
                {name}
            </div>
            <div style={{flex:1}}>
                <Input value={value} onChange={this.onChange}></Input>
            </div>
        </div>
    }
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


function renderSwitch(name:string,value:boolean,onChange:(val:boolean)=>void){
    return <div style={{display:'flex',marginBottom:ITEM_GAP}}>
        <div style={{width:'100px',display:'flex',justifyContent:'flex-end',alignItems:'center',paddingRight:'8px'}}>
            {name}
        </div>
        <div style={{flex:1}}>
            <Switch checked={value} onChange={onChange}/>
        </div>
    </div>
}


const NORMAL_DATASOURCE = [
    {
        label:'字符串',
        value:JSON_PROPERTY_TYPES.string
    },{
        label:'数值',
        value:JSON_PROPERTY_TYPES.number
    },{
        label:'布尔值',
        value:JSON_PROPERTY_TYPES.boolean
    }
]

const TYPE_DATASOURCE = [
    ...NORMAL_DATASOURCE,{
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
        this.state ={
            value:'test'
        }
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
    onChangeRequired=(val:boolean)=>{
        const {name,data} = this.props;
        data.changeRequired(name,val);
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
    renderRequired(onChange:(val:boolean)=>void){
        const {name,data} = this.props;
        const {parent} = data
        let required:boolean
        if(parent instanceof ObjectSchema || parent instanceof ArraySchema){
            const tParent = parent as ObjectSchema | ArraySchema
            required = tParent.isRequired(name)
        }
        return renderSwitch('必填',required,onChange);
    }
    renderContent(){
        const {name,data} = this.props;
        const {parent} = data
        return <div style={{
                    width:'100%',
                    height:'100%'
                }
            }>
            <StringView name="字段英文名" value={name} onChange={this.onChangeName}></StringView>
            <StringView name="字段中文名" value={data.getTitle()} onChange={this.onChangeTitle}></StringView>
            <StringView name="字段描述" value={data.getDescription()} onChange={this.onChangeDescription}></StringView>
            {/* {renderString('字段英文名',name,this.onChangeName)}
            {renderString('字段中文名',data.getTitle(),this.onChangeTitle)}
            {renderString('字段描述',data.getDescription(),this.onChangeDescription)} */}
            {renderRadio('字段类型',data._type,parent._type === JSON_PROPERTY_TYPES.array ? NORMAL_DATASOURCE : TYPE_DATASOURCE,this.onChangeType)}
            {this.renderRequired(this.onChangeRequired)}
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