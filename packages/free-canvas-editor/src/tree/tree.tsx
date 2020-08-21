import React from 'react'
import {ThemeVar} from 'free-canvas-theme'
import {IPlugin,ICommander, IMutation,modelIsArtboard,Model,IPluginOptions, modelIsGroup} from 'free-canvas-shared' 
import {TreeProps,TreeState,FlagMap} from './type'
import {Icon} from '../icon'
import {CLASS_PREFIX} from '../util/contant' 

const {height} = ThemeVar.TREE

const TreeItemClz = `${CLASS_PREFIX}tree-item`
const TreeItemContentClz = `${CLASS_PREFIX}tree-item-content`
const TreeItemContentArrowClz = `${CLASS_PREFIX}tree-item-content-arrow`
const TreeItemActiveClz = `${CLASS_PREFIX}tree-item-active`
const TreeItemSelectedClz = `${CLASS_PREFIX}tree-item-selected`
const TreeItemWrapClz = `${CLASS_PREFIX}tree-item-wrap`
const TreeItemArtboardClz = `${CLASS_PREFIX}tree-item-artboard`
export {TreeProps,TreeState} from './type'

export class Tree extends React.Component<TreeProps,TreeState> implements IPlugin{
    private _commander:ICommander
    private _mutation:IMutation
    constructor(props:TreeProps){
        super(props);
        this.state = {
            data:[],
            hoverMap:{},
            expandMap:{}
        }
    }
    install(commander:ICommander,mutation:IMutation,options:IPluginOptions){
        this._commander = commander;
        this._mutation = mutation;
    }
    update(data:Model,selectModels:Model[]):void{
        const {expandMap} = this.state;
        const dataChildren = data.children;
        this.updateExpandMap(dataChildren,expandMap)
        this.setState({
            data:dataChildren
        })
    }
    updateExpandMap(data:Model[],expandMap:FlagMap){
        if(data == null) return false;
        let hasSelected = false;
        data.forEach((child:Model)=>{
            const hasSelectedChild = this.updateExpandMap(child.children,expandMap)
            if(hasSelectedChild){
                expandMap[child.id] = true;
                hasSelected = true;
            }else if(child.extra.isSelect){
                hasSelected = true;
            }
        })
        return hasSelected;
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
    onClickArrow(data:Model,e:MouseEvent){
        const {expandMap} = this.state
        expandMap[data.id] = !expandMap[data.id]
        this.setState({
            expandMap
        })
        e.stopPropagation();
    }
    renderItem(models:Model[],depth=1){
        if(models == null) return
        const {hoverMap,expandMap} = this.state;
        return models.map((item)=>{
            const itemId = item.id;
            const isArtboard = modelIsArtboard(item.type)
            const isGroup = modelIsGroup(item.type)
            const selected = item.extra.isSelect
            const hasChildren = item.children && item.children.length > 0;
            const expand = expandMap[item.id];
            const needRenderChild = (isArtboard || expand || selected)
            const itemStyle = needRenderChild ? {} : {height}
            return <ul className={TreeItemClz} key={item.id}> 
                <li style={itemStyle} className={`${hoverMap[itemId] ? TreeItemActiveClz : ''} ${selected ? TreeItemSelectedClz : ''}`}>
                    <div className={isArtboard ? TreeItemArtboardClz : TreeItemWrapClz}>
                        <div className={`${TreeItemContentClz}`} style={{paddingLeft : `${12 * depth}px`}}
                        onMouseEnter={this.onMouseEnter.bind(this,item)}
                        onMouseLeave={this.onMouseLeave.bind(this,item)}
                        onClick={this.onSelected.bind(this,item)}
                        >   
                            {hasChildren && <Icon className={`${TreeItemContentArrowClz} ${expand ? 'expand' : ''}`} type="arrow" onClick={this.onClickArrow.bind(this,item)}></Icon>} 
                            {isGroup && <Icon type="folder" style={{paddingRight:'4px'}}></Icon>}
                            {item.extra.label ? item.extra.label : `${item.name}-${item.id}`} 
                        </div>
                    </div>
                    {needRenderChild && this.renderItem(item.children,depth + 1)}
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