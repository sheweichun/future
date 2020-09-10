import {IPlugin, IView,Model, modelIsArtboard} from 'free-canvas-shared'
import {ThemeVar,themeConst} from 'free-canvas-theme'
import Canvas from './canvas'
import {CanvasOption,CoreOptions} from './type';
import {Line,Point, Entity,IEvent,LineMark,Rect} from '../entities/index';
import {RulerGroup} from '../components/index';
import {Content} from './content'
import {completeOptions,debounce,controlDelta} from '../utils/index';
import {createStyle} from '../utils/style'
import {CanvasEvent,EventHandler} from '../events/event';
import {transformDsl} from '../render/index'
import {GuideManager} from './guide/index'
// import {MoveEventData} from '../events/type';
import {CONTAINER,REFRESH_BUTTON_CLASSNAME} from '../utils/constant';
import allStyle from './style'
import { MakerData,MarkEntityType } from './operation/type';
import {OperationPos,calculateIncludeRect} from './operation/pos'
import { RectMark } from '../entities/rectMark';
import {initGlobalContextMenu} from '../components/contextMenu'

const {CONTENT} = ThemeVar 
// export interface CoreOptions  {
//     canvas?:CanvasOption
//     data:Model
//     createView?:(data:Model)=>IView<Model>
//     rulerBackgroundColor?:string
//     wheelSpeedX?:number
//     wheelSpeedY?:number
// }

const DEFAULT_OPTIONS:CoreOptions = {
    wheelSpeedX:5,
    wheelSpeedY:8,
    data:null
}

function calcualteTransition(data:Model):{left:number,top:number,width:number,height:number}{
    if(data == null || data.children == null) return {left:0,top:0,width:0,height:0}
    const boards:OperationPos[] = []
    data.children.map((item)=>{
        if(modelIsArtboard(item.type)){
            if(item.extra && item.extra.position){
                const {left,top,width,height} = item.extra.position
                boards.push(new OperationPos(left,top,width,height))
            }
        }
    })
    return calculateIncludeRect(boards)
}

function createCanvas(parent:DocumentFragment){
    const canvasEl = document.createElement('canvas');
    canvasEl.setAttribute('style','width:100%;height:100%;position:absolute;pointer-events:none;left:0;top:0')
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
    private _translateX:number = 0
    private _translateY:number = 0

    private _refreshEl:HTMLElement

    private _data:Model

    private _guideManage:GuideManager
    // private _rect:OperationPos
    private _rect:DOMRect
    margin:number = 20
    constructor(el: string,options?:CoreOptions){
        super();
        this._options = completeOptions(options,DEFAULT_OPTIONS);
        const {data,type} = this._options.data;
        this._data = transformDsl(data,type);
        const {rulerBackgroundColor} = this._options;
        this.updateMakers = this.updateMakers.bind(this)
        this.updateRectSelect = this.updateRectSelect.bind(this);
        this.initEl(el)
        this.createStyle();
        this._rulerGroup = new RulerGroup(this._canvas,{
            length:this.margin,
            baseX:this._translateX,
            baseY:this._translateY,
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
        const {_data} = this
        const div = document.createElement('div');
        div.className = CONTAINER
        div.setAttribute('style',`padding:${this.margin}px 0 0 ${this.margin}px;background-color:${CONTENT.backgroundColor}`);
        // const contentDiv = document.createElement('div');
        initGlobalContextMenu(div);
        this._content = new Content(div,_data,this._guideManage,{
            createView:this._options.createView,
            x:this._translateX,
            y:this._translateY,
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
        fragment.appendChild(this._content.getRoot());
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
                            val:Math.floor(val)+''
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
                }else if(type === MarkEntityType.RectMark){
                    const {left,top,right,bottom,val,isVertical} = data;
                    return new RectMark(left,top,right - left,bottom - top,val,{
                        isVertical
                    })
                }
            })
        }
        this.draw()
    }
    // getRect(){
    //     // debugger;
    //     return this._rect;
    // }
    getInitTranslate(data:Model){
        const {margin} = this;
        // const {data} = this._options
        const pos = calcualteTransition(data);
        const rect = this._parentEl.getBoundingClientRect();
        // this._translateX = Math.floor((rect.width - margin - pos.width) / 2 - pos.left);
        // this._translateY = Math.floor((rect.height - margin - pos.height) / 2 - pos.top);
        const ret = {
            x:Math.floor((rect.width - margin - pos.width) / 2 - pos.left),
            y:Math.floor((rect.height - margin - pos.height) / 2 - pos.top)
        }
        if(ret.y < 0){ ret.y = 0}
        if(ret.x < 0){ ret.x = 0}
        return ret;
    }
    initEl(el:string){
        const {margin} = this
        // const {data} = this._options
        // const pos = calcualteTransition(data);
        this._parentEl = document.getElementById(el);
        // const rect = this._parentEl.getBoundingClientRect();

        // this._translateX = Math.floor((rect.width - margin - pos.width) / 2 - pos.left);
        // this._translateY = Math.floor((rect.height - margin - pos.height) / 2 - pos.top);
        const {x,y} = this.getInitTranslate(this._data);
        this._translateX = x
        this._translateY = y
        const fragment = document.createDocumentFragment();
        const refreshEl = document.createElement('div');
        refreshEl.className = REFRESH_BUTTON_CLASSNAME;
        refreshEl.setAttribute('style',`width:${margin}px;height:${margin}px;color:var(--${themeConst.TEXT_COLOR_VAR});background-color:var(--${themeConst.BACKGROUND_1_VAR})`)
        refreshEl.innerHTML = '&#xe63c;'
        this._refreshEl = refreshEl;
        this._guideManage = new GuideManager(this._parentEl,{
            margin,
            getOffsetx:(val:number)=>{
                return val - this._translateX - this.margin
            },
            getOffsety:(val:number)=>{
                return val - this._translateY - this.margin
            }
        })
        this.createEventElement(fragment,this._parentEl.children)
        this._rootEl = createCanvas(fragment); //顺序不能错
        fragment.appendChild(refreshEl);
        this._parentEl.appendChild(fragment);
        this._canvas = new Canvas(this._rootEl,this._options.canvas);
        this._guideManage.mount();
        this._content.listen();
    }
    listen(){
        // this._mouseWheelList.forEach((ett)=>{ //滚动事件
        //     this.addEvent(this._eventEl,CanvasEvent.MOUSEWHEEL,(e)=>{
        //         ett.fireEvent(CanvasEvent.MOUSEWHEEL,e as MouseWheelEvent,this.draw);
        //         e.stopPropagation();
        //         e.preventDefault();
        //     })
        // })
        const {wheelSpeedX,wheelSpeedY} = this._options
        this.addEvent(this._eventEl,CanvasEvent.MOUSEWHEEL,(e)=>{
            const {deltaX,deltaY} = e as WheelEvent;
            const newDeltaX = controlDelta(deltaX,wheelSpeedX)
            const newDeltaY = controlDelta(deltaY,wheelSpeedY)
            this._translateX += newDeltaX;
            this._translateY += newDeltaY;
            this._mouseWheelList.forEach((ett)=>{ 
                ett.fireEvent(CanvasEvent.MOUSEWHEEL,{
                    deltaX:newDeltaX,
                    deltaY:newDeltaY
                } as MouseWheelEvent,this.draw);
                e.stopPropagation();
                e.preventDefault();
            });
        })
        //@ts-ignore
        this.addEvent(window,CanvasEvent.RESIZE,debounce(()=>{
            const {_canvas} = this;
            _canvas.resize();
            this._rulerGroup.changeSize(_canvas.width,_canvas.height);
            this.draw()
        },100))
        this.addEvent(this._refreshEl,CanvasEvent.CLICK,()=>{
            const {x,y} = this.getInitTranslate(this._content.getCurrentData());
            // this._mouseWheelList.forEach((ett)=>{ 
            //     ett.fireEvent(CanvasEvent.MOUSEWHEEL,{
            //         deltaX:x - this._translateX,
            //         deltaY:y - this._translateY
            //     } as MouseWheelEvent,this.draw);
            // });
            this._content.changeTranslation(x,y);
            this._rulerGroup.setNewBaseValue(x,y);
            this.draw();
            this._translateX = x;
            this._translateY = y;
        })
    }
    destroy(){

    }
    createStyle(){
        if(styleCreated) return;
        createStyle(allStyle)
        styleCreated = true;
    }
}