import Canvas from './canvas'
import {CanvasOption} from './type';
import {Line,Point, Entity,IEvent} from '../entities/index';
import {RulerGroup,Content} from '../components/index';
import {isString} from '../utils/is';
import {completeOptions} from '../utils/index';
import {CanvasEvent,EventHandler} from './event';
import {Model} from '../render/index'


export interface CoreOptions  {
    canvas?:CanvasOption
    data:Model
    rulerBackgroundColor?:string
    wheelSpeedX:number
    wheelSpeedY:number
}

const DEFAULT_OPTIONS:CoreOptions = {
    wheelSpeedX:5,
    wheelSpeedY:8,
    data:null
}

function createCanvas(parent:DocumentFragment){
    const canvasEl = document.createElement('canvas');
    canvasEl.setAttribute('style','width:100%;height:100%;position:absolute;pointer-events:none')
    parent.appendChild(canvasEl);
    return canvasEl
}




export default class Core extends EventHandler{
    private _rootEl:HTMLCanvasElement
    private _canvas:Canvas
    private _options:CoreOptions
    private _rulerGroup:RulerGroup

    private _parentEl:HTMLElement;
    private _content:Content;
    private _mouseWheelList:IEvent[] = [];
    private _drawTimeId:number
    private _eventEl:HTMLElement;

    margin:number = 20
    constructor(el: string,options?:CoreOptions){
        super();
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        this.initEl(el)
        const {wheelSpeedX,wheelSpeedY,rulerBackgroundColor} = this._options;

        // const x = 219
        // var line = new Line(new Point(x,0),new Point(x,this._canvas.height),{lineStyle:null});
        // line.draw(this._canvas);

        this._rulerGroup = new RulerGroup(this._canvas,{
            length:this.margin,
            wheelSpeedX,
            wheelSpeedY,
            rulerBackgroundColor
        });
        this._mouseWheelList.push(this._rulerGroup);
        this.draw = this.draw.bind(this);
        this.listen()
        this.draw()
    }
    draw(){
        if(this._drawTimeId != null) return;
        this._drawTimeId = setTimeout(()=>{
            this._canvas.clear();
            this._rulerGroup.draw(this._canvas);
            this._drawTimeId = null;
        })
    }
    createEventElement(parent:DocumentFragment,children?:HTMLCollection){
        const {wheelSpeedX,wheelSpeedY,data} = this._options
        const div = document.createElement('div');
        div.setAttribute('style',`width:100%;height:100%;position:absolute;padding:${this.margin}px 0 0 ${this.margin}px`);
        const contentDiv = document.createElement('div');
        this._content = new Content(contentDiv,data,{
            wheelSpeedX,wheelSpeedY
        })
        this._mouseWheelList.push(this._content);
        const fragment = document.createDocumentFragment();
        if(children){
            for(let i = 0; i < children.length; i++){
                fragment.appendChild(children[i])
            }
        }
        fragment.appendChild(contentDiv);
        div.appendChild(fragment);
        parent.appendChild(div);
        this._eventEl = div;
        // this._eventHandler = new EventHandler(div);
    }
    initEl(el:string){
        this._parentEl = document.getElementById(el);
        const fragment = document.createDocumentFragment();
        this.createEventElement(fragment,this._parentEl.children)
        this._rootEl = createCanvas(fragment); //顺序不能错
        this._parentEl.appendChild(fragment);
        this._canvas = new Canvas(this._rootEl,this._options.canvas);
    }
    listen(){
        this._mouseWheelList.forEach((ett)=>{
            this.addEvent(this._eventEl,CanvasEvent.MOUSEWHEEL,(e)=>{
                ett.fireEvent(CanvasEvent.MOUSEWHEEL,e as MouseWheelEvent,this.draw);
                e.stopPropagation();
                e.preventDefault();
            })
        })
    }
}