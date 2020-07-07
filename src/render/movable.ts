import {CanvasEvent} from '../core/event';
import {ObjectStyleDeclaration} from '../utils/type';
import {setStyle,px2Num} from '../utils/style';
import {completeOptions} from '../utils/index';
import {MovableOptions,OnPositionChange,IView} from './type';
import {View, FragmentView} from './view';
import {Model} from './model';
import {COMMANDERS} from './type'

type OnMouseMoveCallback = (e:MouseEvent)=>void
const DEFAULT_OPTIONS = {

}
let tabIndex = 0;

export class Movable{
    static onMouseMoveQueue:OnMouseMoveCallback[] = []
    static onMouseUpQueue:OnMouseMoveCallback[] = []
    static onBlurQueue:OnMouseMoveCallback[] = []
    private _options:MovableOptions;
    private view:IView<Model>
    el:HTMLElement
    canMove:boolean = false
    changed:boolean = false
    left:number
    top:number
    startX:number
    startY:number
    style:ObjectStyleDeclaration
    private _onPostionChange:OnPositionChange
    constructor(private _data:Model,options:MovableOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        const {mountNode,isRoot} = this._options;
        if(isRoot){
            this.view = new FragmentView(_data,mountNode)
        }else{
            this.view = new View(_data,this._options);
        }
        this.parsePosition();
        const div = document.createElement('div');
        // div.tabIndex = tabIndex++;
        this.style = {
            position:'absolute',
            outline:'none',
            borderWidth:'1px',
            borderStyle:'solid',
            borderColor:'transparent'
        }
        this.setStyle(div);
        div.appendChild(this.view.getRoot());
        if(isRoot){
            mountNode.appendChild((this.view as FragmentView).getFragmentAndChange());
        }
        this.el = div;
        this.listen();
        
    }
    // onPostionChange(onPositionChange:OnPositionChange){
    //     this._onPostionChange = onPositionChange
    // }
    getBoundingClientRect(){
        return this.el.getBoundingClientRect();
    }
    parsePosition(){
        const {position} = this._data.extra
        this.left = position.left || 0;
        this.top = position.top || 0;
    }
    appendChild(movable:Movable){
        if(movable == null) return;
        this.view.getRoot().appendChild(movable.el);
    }
    removeChild(movable:Movable){
        if(movable == null) return;
        this.view.destroy();
        this.view.getRoot().removeChild(movable.el);
    }
    static onDocMouseMove(e:MouseEvent){
        Movable.onMouseMoveQueue.forEach((callback)=>{
            callback(e);
        })
    } 
    static onDocUpMove(e:MouseEvent){
        Movable.onMouseUpQueue.forEach((callback)=>{
            callback(e);
        })
    } 
    static onDocClick(e:MouseEvent){
        Movable.onBlurQueue.forEach((callback)=>{
            callback(e);
        })
    }
    static addGloablEvent(name:string,callback:(e:MouseEvent)=>void,fireEl:HTMLElement){
        fireEl.addEventListener(name,callback);
    }
    addEvent(name:string,callback:(e:MouseEvent)=>void,fireEl?:HTMLElement){
        const el = fireEl || this.el;
        el.addEventListener(name,callback);
    }
    removeEvent(name:string,callback:(e:MouseEvent)=>void,fireEl?:HTMLElement){
        const el = fireEl || this.el;
        el.removeEventListener(name,callback);
    }
    onFocus(e:MouseEvent){      
        const {extra} = this._data;
        const {excute} = this._options
        excute(COMMANDERS.SELECTED,e.shiftKey);
    }
    // onBlur(e:MouseEvent){
    //     console.log('blur');
    //     const {extra} = this._data;
    //     if(!extra || !extra.isSelect) return;
    //     const {excute} = this._options
    //     excute(COMMANDERS.VIEWBLUR);
    // }
    listen(){
        this.onMouseDown = this.onMouseDown.bind(this);
        // this.onFoucs = this.onFoucs.bind(this);
        // this.onBlur = this.onBlur.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.addEvent(CanvasEvent.MOUSEDOWN,this.onMouseDown);
        // this.addEvent(CanvasEvent.CLICK,this.onFoucs);
        // this.addEvent(CanvasEvent.BLUR,this.onBlur);
        // Movable.onBlurQueue.push(this.onBlur);
        Movable.onMouseMoveQueue.push(this.onMouseMove)
        Movable.onMouseUpQueue.push(this.onMouseUp)
        // this.addEvent(CanvasEvent.MOUSEUP,this.onMouseUp.bind(this));
    }
    update(newModel:Model){
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
        this._data = newModel;
        this.parsePosition();
        this.setStyle();
    }
    setStyle(el?:HTMLElement){
        const {isSelect} = this._data.extra
        const target = el || this.el;
        if(isSelect){
            this.style.borderColor = 'blue';
        }else{
            this.style.borderColor = 'transparent';
        }
        this.style.left = `${this.left}px`;
        this.style.top = `${this.top}px`;
        setStyle(target,this.style);
    }
    onMouseDown(e:MouseEvent){
        this.canMove = true
        this.changed = false
        const {x,y} = e;
        this.startX = x;
        this.startY = y;
        this.onFocus(e);
        e.stopPropagation()
    }
    onMouseMove(e:MouseEvent){
        if(!this.canMove) return;
        this.changed = true;
        const {x,y} = e;
        this.left += x - this.startX;
        this.top += y - this.startY;
        this.startX = x;
        this.startY = y;
        this.setStyle();
        
    }
    onMouseUp(e:MouseEvent){
        if(this.canMove === false) return;
        this.canMove = false;
        if(this.changed){
            const {excute} = this._options
            excute(COMMANDERS.POSITIONCHANGE,{left:this.left,top:this.top})
            this.changed = false;
        }
        
    }
}

Movable.addGloablEvent(CanvasEvent.MOUSEMOVE,Movable.onDocMouseMove,document.body);
Movable.addGloablEvent(CanvasEvent.MOUSEUP,Movable.onDocUpMove,document.body);
Movable.addGloablEvent(CanvasEvent.CLICK,Movable.onDocClick,document.body)