import {COMMANDERS,Utils,IView,modelIsRoot, ModelType, modelIsArtboard} from 'free-canvas-shared';
import {CanvasEvent} from '../events/event';
import {ObjectStyleDeclaration} from '../utils/type';
import {setStyle} from '../utils/style';
import {completeOptions} from '../utils/index';
import {MovableOptions,OnPositionChange,IMovable} from './type';
import {FragmentView,createView} from './view';
import {Model} from './model';
import {OperationPos} from '../core/operation/pos'
import {MOVABLE_CLASSNAME,MOVABLE_HANDLER_CLASSNAME,styleSizeHoverColor,styleSizeColor} from '../utils/constant'

type OnMouseMoveCallback = (e:MouseEvent)=>void
const DEFAULT_OPTIONS = {

}
// const CLASSNAME = `${STYLE_PREFIX}movable`
// const style = `
//     .${CLASSNAME}{
//         position:absolute;
//         outline:none
//     }
//     .${CLASSNAME}:hover{
//         outline:#3D7FFF solid 1px;
//     }
// `


// let tabIndex = 0;

export class Movable implements IMovable{
    // static onMouseMoveQueue:OnMouseMoveCallback[] = []
    // static onMouseUpQueue:OnMouseMoveCallback[] = []
    // static onBlurQueue:OnMouseMoveCallback[] = []
    protected _options:MovableOptions;
    protected view:IView<Model>
    el:HTMLElement
    elRect:OperationPos
    canMove:boolean = false
    changed:boolean = false
    left:number
    top:number
    width:number
    height:number
    startX:number
    startY:number
    outline:string
    style:ObjectStyleDeclaration
    idSpan:HTMLElement
    protected _onPostionChange:OnPositionChange
    constructor(protected _data:Model,options:MovableOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        const {mountNode,modelType} = this._options;
        if(modelIsRoot(modelType)){
            this.view = new FragmentView(this.fixData(_data),mountNode)
        }else{
            const createViewFn = this._options.createView || createView
            this.view = createViewFn(this.fixData(_data),this._options);
            // this.view = new View(this.fixData(_data),this._options);
        }
        this.view.render();
        this.parsePosition();
        const div = document.createElement('div');
        div.id = Utils.encode2ShortId(options.id);
        div.className = MOVABLE_CLASSNAME
        
        this.style = {
            position:'absolute'
        }
        this.el = div;
        this.createIdSpan();
        // div.appendChild(this.view.getRoot());
        // if(isRoot){
        //     mountNode.appendChild((this.view as FragmentView).getFragmentAndChange());
        //     const {didMount} = this._options;
        //     didMount && didMount();
        // }
        
    }
    createIdSpan(){
        const span = document.createElement('div')
        span.setAttribute('style','position:absolute;top:0;left:0;color:white')
        span.innerHTML = `id:${this._data.id}`
        this.el.appendChild(span);
        this.idSpan = span;
    }
    updateIdSpan(){
        this.idSpan.innerHTML = `id:${this._data.id}`
    }
    setModelType(type:ModelType){
        this._options.modelType = type;
    }
    // setIsGroup(isGroup:boolean){
    //     this._options.isGroup = isGroup
    // }
    fixData(data:Model){
        const {position} = data.extra
        const {style} = data;
        style.width = position.width == null  ? 'auto': `${position.width}px`
        style.height = position.height == null ? 'auto': `${position.height}px`
        return data;
    }
    render(){
        this.setStyle(this.el);
    }
    mount(){
        const {modelType,mountNode} = this._options;
        this.render();
        if(modelIsRoot(modelType)){
            mountNode.appendChild((this.view as FragmentView).getFragmentAndChange());
            // const {didMount} = this._options;
            // didMount && didMount();
        }else{
            this.el.appendChild(this.view.getRoot());
        }
        this.listen();
    }
    updatePosAndSize(pos:{left:number,top:number,width:number,height:number}){ //当更新的时候需要还原到父容器下的相对坐标
        const {left,top,width,height} = pos;
        this.left = left;
        this.top = top
        this.view.updateStyle(width,height);
        this.setStyle();
    }
    // onPostionChange(onPositionChange:OnPositionChange){
    //     this._onPostionChange = onPositionChange
    // }
    onDidMount(){
        this.updateRect();
    }
    onDidUpdate(){
        this.updateRect();
    }
    updateRect(){
        const rect = this.el.getBoundingClientRect()
        this.elRect = new OperationPos(rect.left,rect.top,rect.width,rect.height);
    }
    getBoundingClientRect(){
        return this.elRect;
    }
    parsePosition(){
        const {position} = this._data.extra
        this.left = position.left || 0;
        this.top = position.top || 0;
        this.width = position.width || 0;
        this.height = position.height || 0;
    }
    appendChild(movable:Movable){
        if(movable == null) return;
        this.view.getRoot().appendChild(movable.el);
    }
    // removeChild(movable:Movable){ //todo add removeFrom
    //     if(movable == null) return;
    //     movable.view.destroy();
    //     this.view.getRoot().removeChild(movable.el);
    // }
    removeFrom(parent:Movable){
        if(parent == null) return;
        this.view.destroy();
        this.destroy();
        parent.view.getRoot().removeChild(this.el);
    }
    
    // static onDocMouseMove(e:MouseEvent){
    //     Movable.onMouseMoveQueue.forEach((callback)=>{
    //         callback(e);
    //     })
    // } 
    // static onDocUpMove(e:MouseEvent){
    //     Movable.onMouseUpQueue.forEach((callback)=>{
    //         callback(e);
    //     })
    // } 
    // static onDocClick(e:MouseEvent){
    //     Movable.onBlurQueue.forEach((callback)=>{
    //         callback(e);
    //     })
    // }
    static addGloablEvent(name:string,callback:(e:MouseEvent)=>void,fireEl:HTMLElement){
        fireEl.addEventListener(name,callback);
    }
    // static removeGloablEvent(name:string,callback:(e:MouseEvent)=>void,fireEl:HTMLElement){
    //     fireEl.addEventListener(name,callback);
    // }
    addEvent(name:string,callback:(e:MouseEvent)=>void,fireEl?:HTMLElement){
        const el = fireEl || this.el;
        el.addEventListener(name,callback);
    }
    removeEvent(name:string,callback:(e:MouseEvent)=>void,fireEl?:HTMLElement){
        const el = fireEl || this.el;
        el.removeEventListener(name,callback);
    }
    
    // onBlur(e:MouseEvent){
    //     console.log('blur');
    //     const {extra} = this._data;
    //     if(!extra || !extra.isSelect) return;
    //     const {excute} = this._options
    //     excute(COMMANDERS.VIEWBLUR);
    // }
    destroy(){
        // const {modelType} = this._options
        // if(!modelIsArtboard(modelType)){
            this.removeEvent(CanvasEvent.MOUSEDOWN,this.onMouseDown);
            this.removeEvent(CanvasEvent.MOUSEENTER,this.onMouseEnter);
            this.removeEvent(CanvasEvent.MOUSELEAVE,this.onMouseLeave);
        // }
    }
    listen(){
        // const {modelType} = this._options
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        // this.onDbClick = this.onDbClick.bind(this);
        
        // this.addEvent(CanvasEvent.DBCLICK,this.onDbClick);
        // if(!modelIsArtboard(modelType)){
            this.addEvent(CanvasEvent.MOUSEDOWN,this.onMouseDown);
            this.addEvent(CanvasEvent.MOUSEENTER,this.onMouseEnter);
            this.addEvent(CanvasEvent.MOUSELEAVE,this.onMouseLeave);
        // }
    }
    // onMouseEnter(e:MouseEvent){
    //     this.outline = '#3D7FFF solid 1px'
    //     this.setStyle();
    //     e.stopPropagation();
    // }
    // onMouseLeave(e:MouseEvent){
    //     this.outline = 'none'
    //     this.setStyle();
    //     e.stopPropagation();
    // }
    update(_newModel:Model){
        // if(this.changed){
        //     // this.canMove = false;
        // }
        // const {extra} = this._data;
        // if(extra.isSelect && !newModel.extra.isSelect){
        //     this.removeEvent(CanvasEvent.BLUR,this.onBlur); //回退情况 ,防止二次触发onBlur
        //     this.el.blur();
        //     this.addEvent(CanvasEvent.BLUR,this.onBlur);
        // }else if(!extra.isSelect && newModel.extra.isSelect){
        //     this.removeEvent(CanvasEvent.FOUCS,this.onFoucs);
        //     this.el.focus();
        //     this.addEvent(CanvasEvent.FOUCS,this.onFoucs);
        // }
        const newModel = this.fixData(_newModel);
        const {extra} = newModel;
        if(!extra.isSelect){
            this.canMove = false
        }
        this._data = newModel;
        this.parsePosition();
        this.setStyle();
        this.updateIdSpan();
        this.view.update(newModel);
    }
    setStyle(el?:HTMLElement){
        const {isSelect} = this._data.extra
        
        const target = el || this.el;

        // const parentVm = this._options.vm.getParent();
        // if(parentVm && !parentVm.isRoot){
        //     const pos = parentVm.getModel().getIn(['extra','position'],null)
        //     this.style.left = `${this.left * 100 / pos.get('width')}%`;
        //     this.style.top = `${this.top * 100 / pos.get('height')}%`;
        //     // this.style.left = `${this.left}px`;
        //     // this.style.top = `${this.top}px`;
        // }else{
        //     this.style.left = `${this.left}px`;
        //     this.style.top = `${this.top}px`;
        // }

        this.style.left = `${this.left}px`;
        this.style.top = `${this.top}px`;

        setStyle(target,this.style);
        if(isSelect){
            target.style.outline = `1px solid ${styleSizeColor}`
        }else{
            target.style.outline = `none`
        }
    }
    move(diffx:number,diffy:number){
        this.left += diffx;
        this.top += diffy;
        this.setStyle()
    }
    // onDbClick(e:MouseEvent){
    //     console.log('target :',e.currentTarget,e.target);
    // }
    
    focus(x:number,y:number,shiftKey:boolean = false){
        this.canMove = true;
        this.onFocus({
            x,
            y,
            shiftKey
        })
    }
    onFocus(e:{x:number,y:number,shiftKey:boolean}){      
        // const {extra} = this._data;
        const {excute} = this._options
        const {x,y} = e;
        excute(COMMANDERS.SELECTED,{
            needKeep:e.shiftKey,
            x,
            y
        });
    }
    onMouseEnter(e:MouseEvent){
        const {isChild} = this._options
        if(isChild && !e.shiftKey) return;
        this.el.style.outline = `${styleSizeHoverColor} solid 1px`;
    }
    onMouseLeave(e:MouseEvent){
        const {isSelect} = this._data.extra
        if(isSelect) return;
        this.el.style.outline = 'none';
    }
    onMouseDown(e:MouseEvent){
        const {isChild} = this._options
        if(isChild && !e.shiftKey) return;
        this.canMove = true
        // this.changed = false
        // const {x,y} = e;
        // this.startX = x;
        // this.startY = y;
        this.onFocus(e);
        e.stopPropagation()
    }
    // onMouseMove(e:MouseEvent){
    //     if(!this.canMove) return;
    //     this.changed = true;
    //     const {x,y} = e;
    //     this.left += x - this.startX;
    //     this.top += y - this.startY;
    //     this.startX = x;
    //     this.startY = y;
    //     this.setStyle();
        
    // }
    // onMouseUp(e:MouseEvent){
    //     if(this.canMove === false) return;
    //     this.canMove = false;
    //     if(this.changed){
    //         const {excute} = this._options
    //         excute(COMMANDERS.POSITIONCHANGE,{left:this.left,top:this.top})
    //         this.changed = false;
    //     }
        
    // }
}


export class ArtBoardMovable extends Movable{
    private _eventEl:HTMLElement
    constructor(_data:Model,options:MovableOptions){
        super(_data,options);
        this.initEventEl();
    }
    initEventEl(){
        const {_data} = this;
        const el = document.createElement('div');
        el.className = MOVABLE_HANDLER_CLASSNAME
        el.innerHTML = `${_data && _data.extra ? _data.extra.label : ''}`
        this.el.appendChild(el);
        this._eventEl = el;
    }
    destroy(){
        const {_eventEl} = this
        this.removeEvent(CanvasEvent.MOUSEDOWN,this.onMouseDown,_eventEl);
        // this.removeEvent(CanvasEvent.MOUSEMOVE,this.onMouseMove,_eventEl);
        this.removeEvent(CanvasEvent.MOUSEUP,this.onMouseUp,_eventEl);
        this.removeEvent(CanvasEvent.MOUSELEAVE,this.onMouseUp,_eventEl);
        this.removeEvent(CanvasEvent.MOUSEENTER,this.onMouseEnter,_eventEl);
    }
    listen(){
        const {_eventEl} = this
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        // this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.addEvent(CanvasEvent.MOUSEENTER,this.onMouseEnter,_eventEl);
        this.addEvent(CanvasEvent.MOUSEDOWN,this.onMouseDown,_eventEl);
        // this.addEvent(CanvasEvent.MOUSEMOVE,this.onMouseMove,_eventEl);
        this.addEvent(CanvasEvent.MOUSEUP,this.onMouseUp,_eventEl);
        this.addEvent(CanvasEvent.MOUSELEAVE,this.onMouseUp,_eventEl);
    }
    onMouseEnter(e:MouseEvent){
        this.el.style.outline = `${styleSizeHoverColor} solid 1px`;
    }
    // onMouseMove(e:MouseEvent){
        // if(!this.canMove) return;
        // this.changed = true;
        // const {x,y} = e;
        // this.left += x - this.startX
        // this.top += y - this.startY
        // this.startX = x;
        // this.startY = y;
        // this.setStyle();
    // }
    onMouseLeave(e:MouseEvent){
        this.el.style.outline = 'none';
        if(!this.canMove || !this.changed) return;
        this.canMove = false;
        this.changed = false;
    }
    onMouseUp(e:MouseEvent){
        this.onMouseLeave(e);
        // const {excute} = this._options
        // // const {x,y} = e;
        // excute(COMMANDERS.UNSELECTED,{
        // });
    }
    onMouseDown(e:MouseEvent){
        this.canMove = true
        this.changed = false
        // const {x,y} = e;
        // this.startX = x;
        // this.startY = y;
        this.onFocus(e);
        e.stopPropagation()
    }
}
// Movable.addGloablEvent(CanvasEvent.MOUSEMOVE,Movable.onDocMouseMove,document.body);
// Movable.addGloablEvent(CanvasEvent.MOUSEUP,Movable.onDocUpMove,document.body);
// Movable.addGloablEvent(CanvasEvent.CLICK,Movable.onDocClick,document.body)
// Movable.addGloablEvent(CanvasEvent.MOUSEENTER,function(){
//     console.log('body mouseenter');
// },document.body)