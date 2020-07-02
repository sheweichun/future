import {CanvasEvent} from '../core/event';
import {ObjectStyleDeclaration} from '../utils/type';
import {setStyle,px2Num} from '../utils/style';
import {completeOptions} from '../utils/index';
import {MovableOptions,OnPositionChange} from './type';

type OnMouseMoveCallback = (e:MouseEvent)=>void
const DEFAULT_OPTIONS = {

}
let tabIndex = 0;

export class Movable{
    static onMouseMoveQueue:OnMouseMoveCallback[] = []
    static onMouseUpQueue:OnMouseMoveCallback[] = []
    private _options:MovableOptions;
    el:HTMLElement
    left:number = 0
    top:number = 0
    canMove:boolean = false
    startX:number
    startY:number
    style:ObjectStyleDeclaration
    private _onPostionChange:OnPositionChange
    constructor(child:HTMLElement,options:MovableOptions){
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        const {left,top} = this._options;
        this.left = px2Num(left,0)
        this.top = px2Num(top,0)
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
    setStyle(el?:HTMLElement){
        const target = el || this.el;
        this.style.left = `${this.left}px`;
        this.style.top = `${this.top}px`;
        setStyle(target,this.style);
    }
    updatePosition(left:number,top:number){
        this.left = left;
        this.top = top;
        this.canMove = false;
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