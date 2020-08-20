import React,{useRef,useLayoutEffect, ComponentType}  from 'react';
import {Market,MarketProps} from '../market/index'
import {Header,HeadProps} from '../header/index'
import {Panel,PanelProps} from '../panel/index'
import {Aside} from '../aside/index'
import {Tree,TreeProps} from '../tree/index'
import {IPlugin} from 'free-canvas-shared'
import {ThemeVar} from 'free-canvas-theme'
import {CLASS_PREFIX,ROOT_CLASS} from '../util/contant'


type a = Market extends ComponentType<MarketProps> ? string : number

export interface EditorComponents{
    header?:typeof Header
    panel?:typeof Panel
    aside?:typeof Aside
    // market?:typeof Market
    market?:typeof Market
    tree?:typeof Tree
}


interface HocProps {
    runTask(plugin:IPlugin):void
}

interface EditorProps extends HocProps{
    components:EditorComponents
}

interface EditorState{  

}



// function Hoc<T,V extends React.ComponentType<T> & IPlugin>(Component:V){
//     return class HocComponent<U extends T  & {runTask(plugin:IPlugin):void}> extends React.Component<U>{
//         private _ins:V 
//         initRef(instance:V){
//             if(this._ins == null && instance){
//                 this._ins = instance;
//                 const {runTask} = this.props;
//                 runTask(instance);
//             }
            
//         }
//         render(){
//             const {props} = this
//             // return <Component></Component>
//             return <Component ref={this.initRef} {...props}></Component>
//         }
//     }
// }

type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;
function Hoc<T,V extends IPlugin>(Component:React.ComponentType<T>) {
    // type V = React.ComponentType<T> & IPlugin;
    type U =  T & {runTask(plugin:IPlugin):void};
    return class HocComponent extends React.Component<U>{
        public ins:V
        constructor(props:U){
            super(props);
            this.initRef = this.initRef.bind(this)
        }
        initRef(instance:V){
            if(this.ins == null && instance){
                this.ins = instance;
                const {runTask} = this.props;
                runTask(instance);
            }
            
        }
        render(){
            const {runTask,...others} = this.props
            const newProps:T = others as T
            return <Component ref={this.initRef} {...newProps}></Component>
        }
    }
}
function createMask(){
    const div = document.createElement('div');
    div.setAttribute("style","position:absolute;width:100%;height:100%;left:0;top:0;z-index:999");
    return div;
    // this._canvasMask = div;
}
function createPreviewEle(){
    const div = document.createElement('div')
    div.innerHTML = 'hello'
    div.style.opacity = '0'
    div.style.position = 'absolute'
    div.style.left = '-99999px'
    div.style.top = '-99999px'
    document.body.appendChild(div)
    return div;
}

const previewEl = createPreviewEle();

export function Editor(props:EditorProps){
    const {runTask,components} = props;
    const HeaderComponent = components.header || Header
    const PanelComponent = components.panel || Panel;
    const MarketComponent = Hoc<MarketProps,Market>(components.market || Market);
    const TreeComponent = Hoc<TreeProps,Tree>(components.tree || Tree);
    const AsideComponent = components.aside || Aside;
    const maskEl = createMask();
    const iframeRef = useRef();
    const canvasContainerRef = useRef();

    const marketRef = useRef<InstanceType<typeof MarketComponent>>()

    function onDragEnter(){
        const marketCom = marketRef.current;
        marketCom.ins.onCanvasDragEnter();
    }
    function onDragLeave(){
        const marketCom = marketRef.current
        marketCom.ins.onCanvasDragLeave();
    }
    useLayoutEffect(()=>{
        const marketCom = marketRef.current;
        marketCom.ins.initCanvas(canvasContainerRef.current);
    },[]);
    return <div className={`${ROOT_CLASS}`}>
        <HeaderComponent></HeaderComponent>
        <div className={`${CLASS_PREFIX}content`}>
            <AsideComponent>
                <MarketComponent ref={marketRef}  previewEl={previewEl} maskEl={maskEl} runTask={runTask}/>
                <TreeComponent style={{height:'500px'}} runTask={runTask}></TreeComponent>
            </AsideComponent>
            <div className={`${CLASS_PREFIX}canvas`} ref={canvasContainerRef} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
                <iframe ref={iframeRef} src="./canvas.html"></iframe>
            </div>
            <PanelComponent >
                panel
            </PanelComponent>
        </div>
    </div>
}

