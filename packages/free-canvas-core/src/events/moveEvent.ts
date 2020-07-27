


import {CanvasEvent,EventHandler} from './event';
import {MoveEventOptions,MoveEventData} from './type';
import {completeOptions} from '../utils/index';


const DEFAULT_OPTIONS = {

}

export class MoveEvent extends EventHandler{
    private _canMove:boolean = false
    private _changed:boolean = false
    private _data:MoveEventData
    private _options:MoveEventOptions
    constructor(private _el:HTMLElement,_opt:MoveEventOptions){
        super();
        this._options = completeOptions(_opt,DEFAULT_OPTIONS);
    }
    listen(){
        this.addEvent(this._el,CanvasEvent.MOUSEDOWN,this.onMouseDown.bind(this))
        this.addEvent(this._el,CanvasEvent.MOUSEMOVE,this.onMouseMove.bind(this))
        this.addEvent(this._el,CanvasEvent.MOUSEUP,this.onMouseUp.bind(this))
    }
    onMouseDown(e:MouseEvent){
        const {x,y} = e;
        this._canMove = true
        this._changed = false
        this._data = {
            x,
            y,
            diffx:0,
            diffy:0,
            originX:x,
            originY:y
        }
        const {onStart} = this._options
        onStart && onStart(this._data)
    }
    onMouseMove(e:MouseEvent){
        if(!this._canMove || this._data == null) return;
        this._changed = true;
        const {_data} = this;
        const {x,y} = e;
        _data.diffx = x - _data.x;
        _data.diffy = y - _data.y;
        _data.x = x
        _data.y = y;
        const {onMove} = this._options
        onMove && onMove(this._data)
    }
    onMouseUp(e:MouseEvent){
        if(!this._canMove || !this._changed){
            this._canMove = false;
            this._changed = false;
            return;
        };
        this._canMove = false;
        this._changed = false;
        const {onStop} = this._options
        onStop && onStop(Object.assign({},this._data))
        this._data = null;
    }
}