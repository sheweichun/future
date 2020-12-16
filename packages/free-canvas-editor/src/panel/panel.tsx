import React from 'react'
import {ThemeVar} from 'free-canvas-theme'
import {IPlugin,ICommander,IMutation,Model,IPluginOptions} from 'free-canvas-shared'
import {PanelProps,PanelState,ModelIdMap} from './type'
import {Tab, TabDataItem} from '../components/index'
import {Attribute} from './attribute/index'
import {CLASS_PREFIX} from '../util/contant'


const {backgroundColor,width,color} = ThemeVar.PANEL
export {PanelProps,PanelState} from './type'

const PANEL_CLASS = `${CLASS_PREFIX}panel`
function props2State(props:PanelProps,prevState:PanelState):PanelState{
    const {componentData} = props;
    let modelIdMap:ModelIdMap
    if(componentData == null){
        modelIdMap = {}
    }else{
        modelIdMap = componentData.reduce((ret,md)=>{
            //@ts-ignore
            ret[md.protoId] = md;
            return ret;
        },{})
    }
    return Object.assign({},prevState,{modelIdMap})
}

export class Panel extends React.Component<PanelProps,PanelState> implements IPlugin{
    private _mutation:IMutation
    constructor(props:PanelProps){
        super(props);
        this.state = props2State(props,{
            activeTab:0,
            tabData:[
                {
                    label:'属性'
                },{
                    label:'原型'
                }
            ],
            modelData:[],
            modelIdMap:{}
        })
        this.onTabChange = this.onTabChange.bind(this)
    }
    static getDerivedStateFromProps(nextProps:PanelProps,prevState:PanelState){
        return props2State(nextProps,prevState)
    }
    install(commander:ICommander,mutation:IMutation,options:IPluginOptions){
        this._mutation = mutation;
    }
    update(data:Model,selectModels:Model[]):void{
        this.setState({
            modelData:selectModels
        })
    }
    destroy(){

    }
    onTabChange(index:number){
        this.setState({
            activeTab:index
        })
    }
    renderTabContent(tabIndex:number,data:TabDataItem){
        const {modelData,modelIdMap} = this.state;
        const {renderVarInput} = this.props;
        if(tabIndex === 0){
            return <Attribute renderVarInput={renderVarInput}  modelIdMap={modelIdMap} tabData={data} modelData={modelData} mutation={this._mutation}></Attribute>
        }
    }
    render(){
        const {className} = this.props;
        const {activeTab,tabData} = this.state;
        return <div className={`${PANEL_CLASS} ${className || ''}`} style={{
            backgroundColor:backgroundColor,
            width,
            color
        }}>
            <Tab index={activeTab} data={tabData} onChange={this.onTabChange} />
            {this.renderTabContent(activeTab,tabData[activeTab])}
        </div>
    }
}