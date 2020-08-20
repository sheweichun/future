import React from 'react'
import {ThemeVar} from 'free-canvas-theme'
import {IPlugin,ICommander, IMutation,modelIsArtboard,Model,IPluginOptions} from 'free-canvas-shared' 
import {TreeProps,TreeState} from './type'
import {CLASS_PREFIX} from '../util/contant' 

const {height,padding,color} = ThemeVar.TREE

const TreeItemClz = `${CLASS_PREFIX}tree-item`
const TreeItemContentClz = `${CLASS_PREFIX}tree-item-content`
const TreeItemActiveClz = `${CLASS_PREFIX}tree-item-active`
const TreeItemSelectedClz = `${CLASS_PREFIX}tree-item-selected`
const TreeItemWrapClz = `${CLASS_PREFIX}tree-item-wrap`
const TreeItemArtboardClz = `${CLASS_PREFIX}tree-item-artboard`
export {TreeProps,TreeState} from './type'

export class Tree extends React.Component<TreeProps,TreeState> implements IPlugin{
    private _commander:ICommander
    private _mutation:IMutation
    private _hoverMap:{[key:string]:boolean} = {}
    constructor(props:TreeProps){
        super(props);
        this.state = {
            data:[],
            hoverMap:{}
        }
    }
    install(commander:ICommander,mutation:IMutation,options:IPluginOptions){
        this._commander = commander;
        this._mutation = mutation;
    }
    update(data:Model,selectModels:Model[]):void{
        this.setState({
            data:data.children
        })
    }
    destroy(){ 
        // const {_canvasEl} = this
        // _canvasEl.removeEventListener(CanvasEvent.DRAGENTER,this.onCanvasDragEnter);
        // _canvasEl.removeEventListener(CanvasEvent.DRAGLEAVE,this.onCanvasDragLeave);
    }
    onMouseEnter(data:Model){
        const {hoverMap} = this.state;
        hoverMap[data.id] = true
        this.setState({hoverMap})
    }
    onMouseLeave(data:Model){
        const {hoverMap} = this.state;
        hoverMap[data.id] = false
        this.setState({hoverMap})
    }
    onSelected(data:Model,e:MouseEvent){
        if(modelIsArtboard(data.type)) return;
        const {x,y,shiftKey} = e;
        const {_mutation} = this;
        _mutation.onModelSelected(_mutation.getViewModelBaseModel(data.id),{
            needKeep:shiftKey,
            x,
            y,
            noTrigger:true
        })
    }
    renderItem(models:Model[],depth=1){
        if(models == null) return
        const {hoverMap} = this.state;
        return models.map((item)=>{
            const itemId = item.id;
            const isArtboard = modelIsArtboard(item.type)
            const selected = item.extra.isSelect
            const itemStyle = isArtboard ? {} : {height}
            return <ul className={TreeItemClz} key={item.id}> 
                <li style={itemStyle} className={`${hoverMap[itemId] ? TreeItemActiveClz : ''} ${selected ? TreeItemSelectedClz : ''}`}>
                    <div className={isArtboard ? TreeItemArtboardClz : TreeItemWrapClz}>
                        <div className={TreeItemContentClz} style={{paddingLeft : `${12 * depth}px`}}
                        onMouseEnter={this.onMouseEnter.bind(this,item)}
                        onMouseLeave={this.onMouseLeave.bind(this,item)}
                        onClick={this.onSelected.bind(this,item)}
                        >
                            {item.extra.label ? item.extra.label : `${item.name}-${item.id}`} 
                        </div>
                    </div>
                    {this.renderItem(item.children,depth + 1)}
                </li>
            </ul>
        })
    }
    render(){
        const {className,style} = this.props;
        const {data} = this.state;
        return <div className={`${CLASS_PREFIX}tree ${className || ''}`} style={style}>
            {this.renderItem(data)}
        </div>
    }
}