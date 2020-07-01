import {CanvasEvent} from '../core/event';
import {ObjectStyleDeclaration} from '../utils/type';
import {setStyle,px2Num} from '../utils/style';
import {completeOptions} from '../utils/index';
import {MovableOptions} from './type';

type OnMouseMoveCallback = (e:MouseEvent)=>void
const DEFAULT_OPTIONS = {

}
let tabIndex = 0;

export class Moveable{
    static onMouseMoveQueue:OnMouseMoveCallback[] = []
    private _options:MovableOptions;
    el:HTMLElement
    left:number = 0
    top:number = 0
    canMove:boolean
    startX:number
    startY:number
    style:ObjectStyleDeclaration
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
    getBoundingClientRect(){
        return this.el.getBoundingClientRect();
    }
    setStyle(el?:HTMLElement){
        const target = el || this.el;
        this.style.left = `${this.left}px`;
        this.style.top = `${this.top}px`;
        setStyle(target,this.style);
    }
    static onDocMouseMove(e:MouseEvent){
        Moveable.onMouseMoveQueue.forEach((callback)=>{
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
        Moveable.onMouseMoveQueue.push(this.onMouseMove.bind(this))
        this.addEvent(CanvasEvent.MOUSEUP,this.onMouseUp.bind(this));
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
        this.canMove = false;
    }
}

Moveable.addGloablEvent(CanvasEvent.MOUSEMOVE,Moveable.onDocMouseMove,document.body);