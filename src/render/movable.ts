import {CanvasEvent} from '../core/event';
import {ObjectStyleDeclaration} from '../utils/type';
import {setStyle,px2Num} from '../utils/style';
import {completeOptions} from '../utils/index';
import {MovableOptions,OnPositionChange} from './type';
import {Model} from './model';

type OnMouseMoveCallback = (e:MouseEvent)=>void
const DEFAULT_OPTIONS = {

}
let tabIndex = 0;

export class Movable{
    static onMouseMoveQueue:OnMouseMoveCallback[] = []
    static onMouseUpQueue:OnMouseMoveCallback[] = []
    private _options:MovableOptions;
    el:HTMLElement
    canMove:boolean = false
    left:number
    top:number
    startX:number
    startY:number
    style:ObjectStyleDeclaration
    private _onPostionChange:OnPositionChange
    constructor(child:HTMLElement,private _data:Model,options:MovableOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        this.parsePosition();
        const div = document.createElement('div');
        div.tabIndex = tabIndex++;
        this.style = {
            position:'absolute',
            outline:'none',
            borderWidth:'1px',
            borderStyle:'solid',
            borderColor:'transparent'
        }
        this.setStyle(div);
        div.appendChild(child);
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
    update(newModel:Model){
        console.log('newModel :',newModel.extra.position);
        this.canMove = false;
        this._data = newModel;
        this.parsePosition();
        this.setStyle();
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
    static addGloablEvent(name:string,callback:(e:MouseEvent)=>void,fireEl:HTMLElement){
        fireEl.addEventListener(name,callback);
    }
    addEvent(name:string,callback:(e:MouseEvent)=>void,fireEl?:HTMLElement){
        const el = fireEl || this.el;
        el.addEventListener(name,callback);
    }
    onFoucs(e:MouseEvent){
       this.style.borderColor = 'blue';
       this.setStyle();
    }
    onBlur(e:MouseEvent){
        this.style.borderColor = 'transparent';
        this.setStyle();
    }
    listen(){
        this.addEvent(CanvasEvent.MOUSEDOWN,this.onMouseDown.bind(this));
        this.addEvent(CanvasEvent.FOUCS,this.onFoucs.bind(this));
        this.addEvent(CanvasEvent.BLUR,this.onBlur.bind(this));
        Movable.onMouseMoveQueue.push(this.onMouseMove.bind(this))
        Movable.onMouseUpQueue.push(this.onMouseUp.bind(this))
        // this.addEvent(CanvasEvent.MOUSEUP,this.onMouseUp.bind(this));
    }
    onMouseDown(e:MouseEvent){
        this.canMove = true
        const {x,y} = e;
        this.startX = x;
        this.startY = y;
        e.stopPropagation()
    }
    onMouseMove(e:MouseEvent){
        if(!this.canMove) return;
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
        const {onPostionChange} = this._options
        onPostionChange && onPostionChange(this.left,this.top);
    }
}

Movable.addGloablEvent(CanvasEvent.MOUSEMOVE,Movable.onDocMouseMove,document.body);
Movable.addGloablEvent(CanvasEvent.MOUSEUP,Movable.onDocUpMove,document.body);