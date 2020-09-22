import React from 'react'
import {ThemeVar} from 'free-canvas-theme'
import {IPlugin,ICommander,IMutation,Model,IPluginOptions} from 'free-canvas-shared'
import {PanelProps,PanelState} from './type'
import {Tab, TabDataItem} from '../components/index'
import {Attribute} from './attribute/index'


const {backgroundColor,width,color} = ThemeVar.PANEL
export {PanelProps,PanelState} from './type'
export class Panel extends React.Component<PanelProps,PanelState> implements IPlugin{
    private _mutation:IMutation
    constructor(props:PanelProps){
        super(props);
        this.state = {
            activeTab:0,
            tabData:[
                {
                    label:'属性'
                },{
                    label:'原型'
                }
            ],
            modelData:[]
        }
        this.onTabChange = this.onTabChange.bind(this)
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
        const {modelData} = this.state;
        if(tabIndex === 0){
            return <Attribute tabData={data} modelData={modelData}></Attribute>
        }
    }
    render(){
        const {className} = this.props;
        const {activeTab,tabData} = this.state;
        return <div className={className} style={{
            backgroundColor:backgroundColor,
            width,
            color
        }}>
            <Tab index={activeTab} data={tabData} onChange={this.onTabChange} />
            {this.renderTabContent(activeTab,tabData[activeTab])}
        </div>
    }
}