import {OPERATION_SIZE_CLASSNAME,styleSizeSize} from '../../utils/constant'
import { CanvasEvent } from '../../events/event'
import {HanlerItemOption,OperationSizeOptions,HANDLER_ITEM_DIRECTION} from '../type';
import {throttle} from '../../utils'
import {OperationPos} from './pos'

// const HANDLERITEM_STYLE_MAP = {

// }
const HALF_STYLE_SIZE_SIZE = styleSizeSize / 2


function calcuateLockScalXY(originX:number,originY:number,x:number,y:number,pos:OperationPos,direction:HANDLER_ITEM_DIRECTION){
    const scale = pos._width / pos._height;
    const diffx = x - originX,diffy = y - originY;
    let curScale:number;
    if(diffy === 0){
        curScale = Infinity //需要重新计算diffy
    }else{
        curScale = Math.abs(diffx / diffy);
    }
    let baseFlag:number;
    if(direction === HANDLER_ITEM_DIRECTION.RIGHT_TOP || direction === HANDLER_ITEM_DIRECTION.LEFT_BOTTOM){
        baseFlag =  -1 
    }else{
        baseFlag = 1
    }
    const ret = {x:0,y:0};
    if(curScale < scale){
        ret.x = Math.floor(Math.abs(diffy) * scale) * (diffy < 0 ? -1 : 1) * baseFlag
        ret.y = diffy;
    }else{
        ret.x = diffx
        ret.y = Math.floor(Math.abs(diffx) / scale) * (diffx < 0 ? -1 : 1) * baseFlag
    }
    return ret;
}

abstract class HanlerItem{
    protected _el:HTMLElement
    private _startX:number
    private _startY:number
    private _originX:number
    private _originY:number
    private _canMove:boolean = false
    private _hasChanged:boolean = false
    private _isShow:boolean
    protected _needLockScale:boolean = false
    // private _x:number
    // private _y:number
    constructor(private _direction:HANDLER_ITEM_DIRECTION,protected _pos:OperationPos,private _options:HanlerItemOption){
        this._el = document.createElement('div')
        this._el.className = OPERATION_SIZE_CLASSNAME
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = throttle(this.onMouseMove.bind(this),12);
        this.onMouseUp = this.onMouseUp.bind(this);
        this._isShow = true;
        this.setStyle();
        this.listen();
    }
    show(){
        if(this._isShow) return
        this._isShow = true;
        this._el.style.display = 'block'
    }
    hide(){
        if(!this._isShow) return
        this._isShow = false;
        this._el.style.display = 'none'
    }
    onMouseDown(e:MouseEvent){
        this._canMove = true;
        this._hasChanged = false;
        const {x,y} = e;
        // this._startX = x
        // this._startY = y
        this._originX = x;
        this._originY = y;
        e.stopPropagation();
    }
    onMouseMove(e:MouseEvent){
        if(!this._canMove) return
        this._hasChanged = true;
        const {x,y} = e;
        const {onMove} = this._options
        let changeData = {
            x:x - this._originX,
            y:y - this._originY
        }
        if(this._needLockScale && e.shiftKey){
            changeData = calcuateLockScalXY(this._originX,this._originY,x,y,this._pos,this._direction);
        }
        onMove && onMove(changeData.x,changeData.y,this._direction);
        // onMove && onMove(x - this._startX,y - this._startY,this._direction);
        // this._startX = x;
        // this._startY = y;
        e.stopPropagation();
    }
    onMouseUp(e:MouseEvent){
        this._canMove = false;
        if(!this._hasChanged) return;
        this._hasChanged = false;
        const {onChange} = this._options
        onChange && onChange(this._startX - this._originX,this._startY - this._originY,this._direction);
        e.stopPropagation();
    }
    listen(){
        this._el.addEventListener(CanvasEvent.MOUSEDOWN,this.onMouseDown)
        document.body.addEventListener(CanvasEvent.MOUSEMOVE,this.onMouseMove)
        document.body.addEventListener(CanvasEvent.MOUSEUP,this.onMouseUp)
    }
    destroy(){
        this._el.removeEventListener(CanvasEvent.MOUSEDOWN,this.onMouseDown)
        document.body.removeEventListener(CanvasEvent.MOUSEMOVE,this.onMouseMove)
        document.body.removeEventListener(CanvasEvent.MOUSEUP,this.onMouseUp)
    }
    appendTo(el:Node){
        el.appendChild(this._el);
        return this;
    }
    update(pos:OperationPos){
        this._pos = pos;
        this.setStyle();
    }
    abstract setStyle():void
}

class LeftHandlerItem extends HanlerItem{
    constructor(_pos:OperationPos,_options:HanlerItemOption){
        super(HANDLER_ITEM_DIRECTION.LEFT,_pos,_options);
        this.setStyle();
    }
    setStyle(){
        const {height} = this._pos;
        this._el.setAttribute('style',`
            cursor: ew-resize;
            left:-${HALF_STYLE_SIZE_SIZE}px;
            top:${(height - styleSizeSize - 2) / 2}px
        `)
    }
}



class TopHandlerItem extends HanlerItem{
    constructor(_pos:OperationPos,_options:HanlerItemOption){
        super(HANDLER_ITEM_DIRECTION.TOP,_pos,_options);
    }
    setStyle(){
        const {width} = this._pos;
        this._el.setAttribute('style',`
            cursor: ns-resize;
            top:-${HALF_STYLE_SIZE_SIZE}px;
            left:${(width - styleSizeSize - 2) / 2}px
        `)
    }
}

class RightHandlerItem extends HanlerItem{
    constructor(_pos:OperationPos,_options:HanlerItemOption){
        super(HANDLER_ITEM_DIRECTION.RIGHT,_pos,_options);
    }
    setStyle(){
        const {width,height} = this._pos;
        this._el.setAttribute('style',`
            cursor: ew-resize;
            right:${-HALF_STYLE_SIZE_SIZE}px;
            top:${(height - styleSizeSize - 2) / 2}px
        `)
    }
}

class BottomHandlerItem extends HanlerItem{
    constructor(_pos:OperationPos,_options:HanlerItemOption){
        super(HANDLER_ITEM_DIRECTION.BOTTOM,_pos,_options);
    }
    setStyle(){
        const {width,height} = this._pos;
        this._el.setAttribute('style',`
            cursor: ns-resize;
            bottom:${-HALF_STYLE_SIZE_SIZE}px;
            left:${(width - styleSizeSize - 2) / 2}px
        `)
    }
}


class LeftTopHandlerItem extends HanlerItem{
    constructor(_pos:OperationPos,_options:HanlerItemOption){
        super(HANDLER_ITEM_DIRECTION.LEFT_TOP,_pos,_options);
        this._needLockScale = true;
    }
    setStyle(){
        // const {width} = this._pos;
        this._el.setAttribute('style',`
            cursor: nwse-resize;
            top:-${HALF_STYLE_SIZE_SIZE}px;
            left:-${HALF_STYLE_SIZE_SIZE}px;
        `)
    }
}
class RightTopHandlerItem extends HanlerItem{
    constructor(_pos:OperationPos,_options:HanlerItemOption){
        super(HANDLER_ITEM_DIRECTION.RIGHT_TOP,_pos,_options);
        this._needLockScale = true;
    }
    setStyle(){
        // const {width} = this._pos;
        this._el.setAttribute('style',`
            cursor: nesw-resize;
            top:-${HALF_STYLE_SIZE_SIZE}px;
            right:${-HALF_STYLE_SIZE_SIZE}px;
        `)
    }
}

class RightBottomHandlerItem extends HanlerItem{
    constructor(_pos:OperationPos,_options:HanlerItemOption){
        super(HANDLER_ITEM_DIRECTION.RIGHT_BOTTOM,_pos,_options);
        this._needLockScale = true;
    }
    setStyle(){
        // const {width} = this._pos;
        this._el.setAttribute('style',`
            cursor: nwse-resize;
            bottom:${-HALF_STYLE_SIZE_SIZE}px;
            right:${-HALF_STYLE_SIZE_SIZE}px;
        `)
    }
}

class LeftBottomHandlerItem extends HanlerItem{
    constructor(_pos:OperationPos,_options:HanlerItemOption){
        super(HANDLER_ITEM_DIRECTION.LEFT_BOTTOM,_pos,_options);
        this._needLockScale = true;
    }
    setStyle(){
        // const {width} = this._pos;
        this._el.setAttribute('style',`
            cursor: nesw-resize;
            bottom:${-HALF_STYLE_SIZE_SIZE}px;
            left:-${HALF_STYLE_SIZE_SIZE}px;
        `)
    }
}

//  bottom:${height - HALF_STYLE_SIZE_SIZE}px;

export class Size{
    private _handlerList:HanlerItem[];
   
    constructor(private _parentEl:HTMLElement, _pos:OperationPos,private _options:OperationSizeOptions){
        const fragment = document.createDocumentFragment();
        this._handlerList = [
            new LeftHandlerItem(_pos,_options).appendTo(fragment),
            new TopHandlerItem(_pos,_options).appendTo(fragment),
            new RightHandlerItem(_pos,_options).appendTo(fragment),
            new BottomHandlerItem(_pos,_options).appendTo(fragment),
            new LeftTopHandlerItem(_pos,_options).appendTo(fragment),
            new LeftBottomHandlerItem(_pos,_options).appendTo(fragment),
            new RightBottomHandlerItem(_pos,_options).appendTo(fragment),
            new RightTopHandlerItem(_pos,_options).appendTo(fragment),
        ]
        _parentEl.appendChild(fragment)
    }
    hide(){
        // console.log('hide');
        this._handlerList.forEach((item)=>{
            item.hide();
        })
    }
    show(){
        this._handlerList.forEach((item)=>{
            item.show();
        })
    }
    update(pos:OperationPos){
        this._handlerList.forEach((item)=>{
            item.update(pos)
        })
    }
    setStyle(pos:OperationPos){
        this._handlerList.forEach((item)=>item.update(pos))
    }
    destroy(){
        this._handlerList.forEach((item)=>item.destroy())
        this._parentEl.innerHTML = '';
    }
}