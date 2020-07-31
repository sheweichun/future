import {IPlugin} from 'free-canvas-shared'
import Canvas from './canvas'
import {CanvasOption} from './type';
import {Line,Point, Entity,IEvent,LineMark,Rect} from '../entities/index';
import {RulerGroup,Content} from '../components/index';
import {completeOptions} from '../utils/index';
import {createStyle} from '../utils/style'
import {CanvasEvent,EventHandler} from '../events/event';
// import {MoveEventData} from '../events/type';
import {CONTAINER} from '../utils/constant';
import allStyle from './style'
import {Model} from '../render/index'
import { MakerData,MarkEntityType } from './operation/type';
import {OperationPos} from './operation/pos'


export interface CoreOptions  {
    canvas?:CanvasOption
    data:Model
    rulerBackgroundColor?:string
    wheelSpeedX?:number
    wheelSpeedY?:number
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

let styleCreated = false;




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

    private _makers:Entity[] = []
    private _selectRect:Rect

    // private _rect:OperationPos
    private _rect:DOMRect
    margin:number = 20
    constructor(el: string,options?:CoreOptions){
        super();
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        this.updateMakers = this.updateMakers.bind(this)
        this.updateRectSelect = this.updateRectSelect.bind(this);
        this.initEl(el)
        this.createStyle();
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
        // this.getRect = this.getRect.bind(this)
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
            this._makers.forEach((maker)=>{
                maker.draw(this._canvas);
            })
            this._selectRect && this._selectRect.draw(this._canvas);
        })
    }
    installPlugin(plugin:IPlugin){
        this._content.installPlugin(plugin);
    }
    uninstallPlugin(plugin:IPlugin){
        this._content.uninstallPlugin(plugin);
    }
    createEventElement(parent:DocumentFragment,children?:HTMLCollection){
        const {wheelSpeedX,wheelSpeedY,data} = this._options
        const div = document.createElement('div');
        div.className = CONTAINER
        div.setAttribute('style',`padding:${this.margin}px 0 0 ${this.margin}px`);
        const contentDiv = document.createElement('div');
        this._content = new Content(contentDiv,data,{
            wheelSpeedX,
            wheelSpeedY,
            margin:this.margin,
            updateMakers:this.updateMakers,
            updateRectSelect:this.updateRectSelect
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
    updateRectSelect(pos:OperationPos){
        if(pos == null){
            this._selectRect = null
        }else{
            // const pos = calculateRectData(selectData);
            if(this._selectRect == null){
                this._selectRect = new Rect(pos.left,pos.top,pos.width,pos.height,{
                    background:'#00000011'
                });
            }else {
                this._selectRect.update(pos.left,pos.top,pos.width,pos.height);
            }
            this._content.triggerSelectList(pos)
        }
        this.draw();
    }
    updateMakers(markerData?:MakerData[]){
        if(markerData == null){
            this._makers = []
        }else{
            const {left,top} = this._content.getRect()
            this._makers = markerData.map((item)=>{
                const {type,data} = item;
                if(type === MarkEntityType.LineMarker){
                    const {startX,
                        startY,
                        endX,
                        endY,
                        val} = data;
                    return new LineMark(
                        new Point(startX + left,startY + top),
                        new Point(endX + left,endY + top),
                        {
                            val:val+''
                        }
                    )
                }else if(type === MarkEntityType.Line){
                    const {x1,y1,x2,y2,lineStyle} = data;
                    return new Line(
                        new Point(x1 + left,y1 + top),
                        new Point(x2 + left,y2 + top),
                        {
                            lineStyle
                        }
                    )
                }
            })
        }
        this.draw()
    }
    // getRect(){
    //     // debugger;
    //     return this._rect;
    // }
    initEl(el:string){
        this._parentEl = document.getElementById(el);
        const fragment = document.createDocumentFragment();
        this.createEventElement(fragment,this._parentEl.children)
        this._rootEl = createCanvas(fragment); //顺序不能错
        this._parentEl.appendChild(fragment);
        this._content.listen();
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
    createStyle(){
        if(styleCreated) return;
        createStyle(allStyle)
        styleCreated = true;
    }
}